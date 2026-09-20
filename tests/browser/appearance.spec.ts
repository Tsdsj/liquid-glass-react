import { asPlatform } from './hit-floor.js';
import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * The appearance pass: what the two themes owe the reader.
 *
 * Four of these come from looking at the thing on a real screen and finding it wrong — the
 * pointer glow floodlighting a dark panel, a light appearance made of full-brightness white,
 * a disclosure that had a chevron animation and no height animation, and a segmented control
 * whose selected capsule was white on white. None of them is a matter of taste once it is
 * stated as a number, so they are stated as numbers here.
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
const rgb = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number);

/**
 * Screenshot an element and read individual pixels back, by the same route `contrast.spec.ts`
 * uses: decoded in the page, because the preview server's CSP has no `connect-src data:`.
 * Points are fractions of the element's own box, so the device pixel ratio does not matter.
 */
async function samplePixels(page: Page, target: Locator, points: Array<[number, number]>) {
  const png = (await target.screenshot()).toString('base64');
  return page.evaluate(async ({ data, at }) => {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    return at.map(([fx, fy]) => {
      const x = Math.min(bitmap.width - 1, Math.max(0, Math.round(fx * bitmap.width)));
      const y = Math.min(bitmap.height - 1, Math.max(0, Math.round(fy * bitmap.height)));
      const { data: px } = ctx.getImageData(x, y, 1, 1);
      return [px[0], px[1], px[2]];
    });
  }, { data: png, at: points });
}

/* =========================================================================================
 * 1. The pointer glow is white light, and what white light does depends on what it lands on.
 * ======================================================================================= */

test('the pointer glow is far dimmer in the dark appearance than in the light one', async ({ page }) => {
  const peak = async (scheme: 'light' | 'dark') => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/button');
    await page.waitForSelector('#main');
    return page.locator('.lg-root').first().evaluate(node =>
      Number(getComputedStyle(node).getPropertyValue('--lg-shine-alpha')));
  };
  const light = await peak('light');
  const dark = await peak('dark');
  expect(light, 'the light appearance lost its sheen').toBeGreaterThan(.15);
  expect(dark, `dark peaks at ${dark}, light at ${light}`).toBeLessThan(light / 2);
  expect(dark, 'the glow was turned off rather than turned down').toBeGreaterThan(0);
});

test('the press flash follows the same rule', async ({ page }) => {
  const flash = async (scheme: 'light' | 'dark') => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/button');
    await page.waitForSelector('#main');
    return page.locator('.lg-root').first().evaluate(node =>
      Number(getComputedStyle(node).getPropertyValue('--lg-flash-alpha')));
  };
  expect(await flash('dark')).toBeLessThan(await flash('light') / 2);
});

/* =========================================================================================
 * 2. The light appearance is not built out of full-brightness white.
 * ======================================================================================= */

test('no surface in the light appearance is pure white', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/#/components/list');
  await page.waitForSelector('#main');

  const surfaces = await page.evaluate(() => {
    const read = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return ['--lg-bg', '--lg-bg-tertiary', '--lg-bg-grouped-2'].map(name => [name, read(name)] as const);
  });
  for (const [name, value] of surfaces) {
    const [r, g, b] = rgb(value);
    expect(Math.min(r, g, b), `${name} is ${value}`).toBeLessThan(255);
    // Still the lightest thing in the system, though: this is softening, not greying out.
    expect(Math.min(r, g, b), `${name} is ${value}`).toBeGreaterThan(244);
  }
});

/**
 * Both metric tables, because the desktop one is where this gets harder.
 *
 * 4.5:1 is the same number at any size — WCAG only relaxes it for text at 18pt, or 14pt bold,
 * and nothing here is either. But the desktop table puts secondary labels at 11px where the
 * touch table had 13, and a grey that was already sitting on the floor is a grey a reader has
 * to work harder for. Running the same measurement under both is how a change of default
 * metrics fails to quietly become a change of legibility.
 */
for (const platform of ['touch', 'desktop'] as const) {
test(`secondary text clears AA against the surface it is actually painted on (${platform})`, async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/#/components/list');
  await page.waitForSelector('#main');
  await asPlatform(page, platform);

  /* The composited colour, not the token: `--lg-label-secondary` is a translucent grey and what
     it ends up as depends entirely on the panel under it. */
  const measured = await page.evaluate(() => {
    const row = document.querySelector<HTMLElement>('.lg-list-row .lg-row-secondary')
      ?? document.querySelector<HTMLElement>('.lg-list-header')!;
    const style = getComputedStyle(row);
    const behind = getComputedStyle(document.querySelector<HTMLElement>('.lg-list-group') ?? document.body).backgroundColor;
    return { ink: style.color, behind };
  });

  const ink = rgb(measured.ink);
  const behind = rgb(measured.behind);
  /* Alpha composite the ink over the panel. A translucent label's contrast is a property of
     the pair, and reading only the token is how "it passes" and "you cannot read it" coexist. */
  const alpha = Number(measured.ink.match(/[\d.]+/g)?.[3] ?? 1);
  const flat = ink.map((channel, index) => channel * alpha + behind[index] * (1 - alpha));
  const contrast = ratio(luminance(flat), luminance(behind));
  expect(contrast, `secondary text measured ${contrast.toFixed(2)}:1 on ${platform}`).toBeGreaterThanOrEqual(4.5);
  await asPlatform(page, null);
});
}

/* =========================================================================================
 * 3. The disclosure had a chevron animation and no height animation.
 * ======================================================================================= */

/**
 * The component measured its content and published `--lg-disclosure-height`, and no rule ever
 * read it: the chevron turned and the body appeared in one frame. Measured by sampling the
 * element's own height while the transition is running.
 */
test('opening a disclosure animates its height rather than snapping', async ({ page }) => {
  await page.goto('/#/components/disclosure');
  const group = page.locator('#disclosure-basic-demo .lg-disclosure').first();
  await group.scrollIntoViewIfNeeded();

  const closed = (await group.boundingBox())!.height;
  await group.locator('summary').click();
  await page.waitForTimeout(60);
  const during = (await group.boundingBox())!.height;
  await page.waitForTimeout(700);
  const open = (await group.boundingBox())!.height;

  expect(open, 'it never opened at all').toBeGreaterThan(closed + 8);
  expect(during, `height went ${closed} → ${during} → ${open} with no frame in between`)
    .toBeLessThan(open - 4);
  expect(during, 'it started from somewhere other than closed').toBeGreaterThanOrEqual(closed - 1);
});

/* =========================================================================================
 * 4. The selected segment has to look selected.
 * ======================================================================================= */

/**
 * Measured from composited pixels, because the question is what a reader sees and in the light
 * appearance both the capsule and the track it slides on are near-white.
 *
 * The sample points are deliberately off the glyphs — a column through the middle of a segment
 * crosses the label and reports a 224-point step that is the character, not the capsule. 0.30
 * is empty track between the first and second labels; 0.42 is inside the capsule and left of
 * its own label.
 *
 * The number this is guarding: before the track became a well, the capsule's fill differed
 * from its surround by **5 parts in 255**, and adding a shadow bought three more. It is 20 now.
 * Twelve is the floor rather than twenty, so a retune of the material has somewhere to move.
 */
const CAPSULE_FLOOR = 12;

for (const scheme of ['light', 'dark'] as const) {
  test(`the selected segment stands out from the unselected ones (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/segmented-control');
    const control = page.locator('#segmented-basic .lg-segmented').first();
    await control.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const [unselected, selected] = await samplePixels(page, control, [[.30, .5], [.42, .5]]);
    // 8-bit luminance: "parts in 255", which is the unit the threshold is reasoned about in.
    const grey = ([r, g, b]: number[]) => .2126 * r + .7152 * g + .0722 * b;
    const difference = Math.abs(grey(selected) - grey(unselected));
    expect(difference,
      `capsule ${Math.round(grey(selected))} against a track of ${Math.round(grey(unselected))} — ${Math.round(difference)} parts in 255`)
      .toBeGreaterThanOrEqual(CAPSULE_FLOOR);
  });
}

test('the capsule is lifted, not merely tinted', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const lens = page.locator('#segmented-basic .lg-selection-lens').first();
  await lens.scrollIntoViewIfNeeded();
  const style = await lens.evaluate(node => {
    const computed = getComputedStyle(node);
    return { shadow: computed.boxShadow, border: computed.borderTopColor, background: computed.backgroundColor };
  });
  expect(style.shadow, 'no shadow, so no edge where the track is the same colour').not.toBe('none');
  expect(style.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(style.border).not.toBe('rgba(0, 0, 0, 0)');
});

/* =========================================================================================
 * 6. A label and the wash under it are the same hue, and that is the whole difficulty.
 *
 * The `tinted` variant paints the accent on a 16% wash of itself. System blue on white is
 * already 3.4:1; over its own wash it measured 2.75:1 in the light appearance and 2.55:1 in the
 * dark one — while the page describing it promised that development mode measures exactly this
 * and complains. Composited, because a translucent label over a translucent wash is three
 * colours deep and reading any one of them in isolation says nothing.
 * ======================================================================================= */

for (const scheme of ['light', 'dark'] as const) {
  test(`a tinted button's label clears AA against its own wash (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/button');
    await page.waitForSelector('#main');
    const button = page.locator('.lg-button[data-variant="tinted"]').first();
    await button.scrollIntoViewIfNeeded();

    const pair = await button.evaluate(node => {
      /* `color(srgb …)` is what Chrome returns for anything that came out of `color-mix()`,
         and its channels are 0–1. Read as bytes, every accent-derived colour becomes
         near-black — which passes this test against a light page for entirely the wrong
         reason. It did, on the first run. */
      const parse = (value: string) => {
        const parts = value.match(/[\d.]+/g)!.map(Number);
        const scale = value.startsWith('color(') ? 255 : 1;
        return [parts[0] * scale, parts[1] * scale, parts[2] * scale, parts.length > 3 ? parts[3] : 1];
      };
      const over = (a: number[], b: number[]) => [0, 1, 2].map(i => a[i] * a[3] + b[i] * (1 - a[3])).concat(1);
      let behind = [255, 255, 255, 1];
      const stack: number[][] = [];
      for (let el: Element | null = node; el; el = el.parentElement) {
        const colour = parse(getComputedStyle(el).backgroundColor);
        if (colour[3] > 0) { stack.push(colour); if (colour[3] === 1) break; }
      }
      for (let i = stack.length - 1; i >= 0; i--) behind = over(stack[i], behind);
      return { ink: over(parse(getComputedStyle(node).color), behind), behind };
    });

    const contrast = ratio(luminance(pair.ink), luminance(pair.behind));
    expect(contrast, `the label measures ${contrast.toFixed(2)}:1 on its wash`).toBeGreaterThanOrEqual(4.5);
  });
}

/* =========================================================================================
 * 5. The overview's first screen.
 * ======================================================================================= */

test('the demo fills the column it is in, and the switch sits on it rather than above it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#/overview');
  await page.waitForSelector('#main');
  await page.waitForTimeout(400);

  const widths = await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>('.refraction-demo')!;
    const viewer = document.querySelector<HTMLElement>('.media-viewer')!;
    return { demo: demo.getBoundingClientRect().width, viewer: viewer.getBoundingClientRect().width };
  });
  /* The viewer has an aspect ratio and a capped height; as a grid item it sized its width from
     that cap and stopped filling the column, which reads as a broken layout rather than a
     deliberate one. */
  expect(widths.viewer, `the viewer is ${Math.round(widths.viewer)} inside ${Math.round(widths.demo)}`)
    .toBeGreaterThan(widths.demo - 4);
});

test('the first screen says what this is, offers two ways in, and shows what it is made of', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#/overview');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.hero-actions .lg-button')).toHaveCount(2);
  // The facts are a description list, so they are read as pairs rather than as six loose words.
  const facts = page.locator('.overview-facts .overview-fact');
  expect(await facts.count()).toBeGreaterThanOrEqual(3);
  await expect(facts.first().locator('dt')).toHaveText(/\d+/);
});
