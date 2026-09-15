/**
 * Answers the question a contrast calculator cannot: once the glass has been composited over a
 * real photograph, what contrast does the text on it actually have?
 *
 * The text colour is opaque and known exactly. The unknown is the surface — so that half is
 * measured from real pixels: hide the glyphs, screenshot the bar, hand the PNG back to the page,
 * decode it there and take the median luminance of what the glass composited to. Run in three
 * engines, because each one blurs and blends slightly differently.
 *
 * A measurement tool, not a test: the output is evidence for a person to read.
 *   pnpm exec node scripts/measure-contrast.mjs [url]
 */
import { chromium, webkit, firefox } from '@playwright/test';

const base = process.argv[2] ?? process.env.MEASURE_URL ?? 'http://127.0.0.1:4173';

/** Relative luminance of an 8-bit sRGB triple, per WCAG. */
const luminance = ([r, g, b]) => {
  const channel = v => { const s = v / 255; return s <= .03928 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; };
  return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
};
const ratio = (a, b) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + .05) / (lo + .05); };
const parseColor = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);

/** Decode a screenshot inside the page and report the luminance of its interior. */
async function surface(page, locator, inset = 10) {
  const png = (await locator.screenshot()).toString('base64');
  return page.evaluate(async ([data, m]) => {
    // Decoded from bytes, not fetched: the preview server's CSP has no `connect-src data:`.
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    const w = Math.max(1, bitmap.width - m * 2), h = Math.max(1, bitmap.height - m * 2);
    const { data: px } = ctx.getImageData(m, m, w, h);
    const lum = [];
    for (let i = 0; i < px.length; i += 4) lum.push(.2126 * px[i] + .7152 * px[i + 1] + .0722 * px[i + 2]);
    lum.sort((a, b) => a - b);
    // Median rather than mean: the rim highlight is a bright minority and would skew the average.
    return { median: lum[lum.length >> 1], darkest: lum[(lum.length * .05) | 0], lightest: lum[(lum.length * .95) | 0] };
  }, [png, inset]);
}

const results = [];
for (const [name, type, opts] of [['Chrome', chromium, { channel: 'chrome' }], ['WebKit', webkit, {}], ['Firefox', firefox, {}]]) {
  let browser;
  try { browser = await type.launch(opts); } catch (error) { results.push({ name, error: String(error).split('\n')[0] }); continue; }
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/#/`);
  await page.waitForTimeout(1200);

  // Glass controls floating over the illustrated scene: the hardest legibility case on the site,
  // and the one the review kept carrying as unmeasured.
  const bar = page.locator('.media-viewer .lg-toolbar-group').first();
  if (!await bar.count()) { results.push({ name, error: 'no glass over media here' }); await browser.close(); continue; }

  const ink = parseColor(await bar.locator('button').first().evaluate(node => getComputedStyle(node).color));
  await page.evaluate(() => document.querySelectorAll('.media-viewer .lg-toolbar-group .lg-content')
    .forEach(node => { node.style.visibility = 'hidden'; }));
  await page.waitForTimeout(250);
  const behind = await surface(page, bar);
  await page.evaluate(() => document.querySelectorAll('.media-viewer .lg-toolbar-group .lg-content')
    .forEach(node => { node.style.visibility = ''; }));

  const grey = value => ratio(luminance(ink), luminance([value, value, value]));
  results.push({
    name,
    median: grey(behind.median),
    // Worst case across the surface, so a bright or dark patch of the photo is not averaged away.
    worst: Math.min(grey(behind.darkest), grey(behind.lightest)),
    tone: Math.round(behind.median),
    // Not a capability check: every engine accepts the syntax, so this cannot decide anything.
    syntaxAccepted: await page.evaluate(() => CSS.supports('backdrop-filter', 'url("#probe")')
      || CSS.supports('-webkit-backdrop-filter', 'url("#probe")')),
  });
  await browser.close();
}

console.log('\nText on glass over the media scene, from composited pixels (AA needs 4.5:1)\n');
console.log('engine    surface tone   contrast (median)   contrast (worst patch)   url() syntax accepted');
for (const r of results) {
  if (r.error) { console.log(`${r.name.padEnd(9)} ${r.error}`); continue; }
  const mark = r.worst >= 4.5 ? 'pass' : 'FAILS';
  console.log(`${r.name.padEnd(9)} ${String(r.tone).padEnd(14)} ${`${r.median.toFixed(2)}:1`.padEnd(19)} ${`${r.worst.toFixed(2)}:1 ${mark}`.padEnd(24)} ${r.syntaxAccepted}`);
}
console.log('\nThe last column is a trap, not a result: CSS.supports accepts `backdrop-filter: url(#id)`');
console.log('in all three engines, so it cannot be used to decide whether the SVG path will render.\n');
