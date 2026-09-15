import { test, expect } from '@playwright/test';

/**
 * Contrast measured from composited pixels rather than from two colour values.
 *
 * Glass has no colour of its own — what the text sits on is whatever the photograph behind it
 * composited to. Feeding the token values into a calculator answers a question nobody asked. So
 * the glyphs are hidden, the bar is screenshotted, and the surface underneath is read back.
 *
 * `scripts/measure-contrast.mjs` runs the same measurement in WebKit and Firefox too, and prints
 * the numbers for a person to read; this keeps the floor from moving.
 */

/** Relative luminance of an 8-bit sRGB triple, per WCAG. */
function luminance([r, g, b]: number[]) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= .03928 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  };
  return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
}
const ratio = (a: number, b: number) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + .05) / (lo + .05); };

test('text on glass over the media scene holds AA against the real surface', async ({ page }) => {
  await page.goto('/#/');
  await page.waitForTimeout(900);

  const bar = page.locator('.media-viewer .lg-toolbar-group').first();
  await expect(bar).toBeVisible();
  const ink = (await bar.locator('button').first().evaluate(node => getComputedStyle(node).color))
    .match(/[\d.]+/g)!.slice(0, 3).map(Number);

  await page.evaluate(() => document.querySelectorAll('.media-viewer .lg-toolbar-group .lg-content')
    .forEach(node => { (node as HTMLElement).style.visibility = 'hidden'; }));
  await page.waitForTimeout(250);
  const png = (await bar.screenshot()).toString('base64');
  await page.evaluate(() => document.querySelectorAll('.media-viewer .lg-toolbar-group .lg-content')
    .forEach(node => { (node as HTMLElement).style.visibility = ''; }));

  const band = await page.evaluate(async data => {
    // Decoded from bytes: the preview server's CSP has no `connect-src data:`.
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    const m = 10;
    const { data: px } = ctx.getImageData(m, m, Math.max(1, bitmap.width - m * 2), Math.max(1, bitmap.height - m * 2));
    const lum: number[] = [];
    for (let i = 0; i < px.length; i += 4) lum.push(.2126 * px[i] + .7152 * px[i + 1] + .0722 * px[i + 2]);
    lum.sort((a, b) => a - b);
    return { darkest: lum[(lum.length * .05) | 0], lightest: lum[(lum.length * .95) | 0] };
  }, png);

  const grey = (value: number) => ratio(luminance(ink), luminance([value, value, value]));
  // Worst patch, not the average: a bright corner of the photo is where legibility actually goes.
  const worst = Math.min(grey(band.darkest), grey(band.lightest));
  expect(worst, `worst composited contrast was ${worst.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
});
