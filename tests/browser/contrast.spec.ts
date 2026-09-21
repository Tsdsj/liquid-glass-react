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

/**
 * A system colour is a fill. Using one as ink is a separate decision, and it has to be measured.
 *
 * `--lg-accent` and `--lg-red` are built to sit under white text. Painted *as* text on a light
 * surface they measured 3.03:1 and 3.14:1 — and Increase Contrast, which exists for exactly
 * this, only reached 3.94 and 4.01. The stylesheet already had the answer written down for one
 * control (`variant="tinted"`, see `--lg-ink-toward` in tokens.css); the audit found it had
 * been applied there and nowhere else.
 *
 * Both appearances, because the mix runs in opposite directions: toward black on a light page,
 * toward white on a dark one.
 */
for (const scheme of ['light', 'dark'] as const) {
  test(`a system colour used as ink is legible — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/text');
    await page.waitForTimeout(500);

    /* Where each tone actually renders on this page: the eyebrow above the title is the
       accent, and the type page prints the destructive tone in its own example. */
    for (const [tone, selector] of [
      ['accent', '.page-eyebrow'],
      ['destructive', '#text-tone .lg-text[data-tone="destructive"]'],
    ] as const) {
      const node = page.locator(selector).first();
      await expect(node).toBeVisible();
      const measured = await node.evaluate(element => {
        /* `color-mix` computes to `color(srgb …)` in the 0–1 range, so the channels have to be
           scaled before they mean anything to a luminance formula written for bytes. */
        const read = (value: string) => {
          const numbers = (value.match(/[\d.]+/g) ?? []).map(Number);
          return /^color\(srgb/.test(value)
            ? [numbers[0] * 255, numbers[1] * 255, numbers[2] * 255]
            : numbers.slice(0, 3);
        };
        let backdrop: number[] = [255, 255, 255];
        for (let parent: Element | null = element; parent; parent = parent.parentElement) {
          const colour = getComputedStyle(parent).backgroundColor;
          const parts = (colour.match(/[\d.]+/g) ?? []).map(Number);
          if (parts.length >= 3 && (parts[3] ?? 1) === 1) { backdrop = parts.slice(0, 3); break; }
        }
        return { ink: read(getComputedStyle(element).color), backdrop };
      });
      const got = ratio(luminance(measured.ink), luminance(measured.backdrop));
      expect(got, `tone="${tone}" measured ${got.toFixed(2)}:1 in ${scheme}`).toBeGreaterThanOrEqual(4.5);
    }
  });
}

/**
 * The code samples are the part of this site people read most closely, and the syntax colours
 * were the system palette itself: a string measured 1.95:1 on the light block, an attribute
 * 1.90, a comment 2.37. Every class the tokenizer can emit, in both appearances.
 */
for (const scheme of ['light', 'dark'] as const) {
  test(`every syntax colour is readable — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/list');
    await page.waitForTimeout(400);
    await page.locator('.demo-code-toggle').first().click();
    await page.waitForTimeout(200);

    const readings = await page.evaluate(() => {
      const block = document.querySelector('.demo-card-code pre')!;
      let backdrop = [255, 255, 255];
      for (let parent: Element | null = block; parent; parent = parent.parentElement) {
        const parts = (getComputedStyle(parent).backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
        if (parts.length >= 3 && (parts[3] ?? 1) === 1) { backdrop = parts.slice(0, 3); break; }
      }
      const out: { kind: string; ink: number[] }[] = [];
      const seen = new Set<string>();
      for (const span of block.querySelectorAll<HTMLElement>('span[class^="code-"]')) {
        if (seen.has(span.className)) continue;
        seen.add(span.className);
        const parts = (getComputedStyle(span).color.match(/[\d.]+/g) ?? []).map(Number);
        out.push({ kind: span.className, ink: parts.slice(0, 3) });
      }
      /* The block's own colour counts too: plain text is most of what is in it. */
      const plain = (getComputedStyle(block).color.match(/[\d.]+/g) ?? []).map(Number);
      out.push({ kind: 'plain', ink: plain.slice(0, 3) });
      return { backdrop, out };
    });

    expect(readings.out.length, 'no syntax colours were on screen to measure').toBeGreaterThan(2);
    for (const reading of readings.out) {
      const got = ratio(luminance(reading.ink), luminance(readings.backdrop));
      expect(got, `${reading.kind} measured ${got.toFixed(2)}:1 in ${scheme}`).toBeGreaterThanOrEqual(4.5);
    }
  });
}
