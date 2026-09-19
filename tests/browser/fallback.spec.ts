import { test, expect } from '@playwright/test';

/**
 * Safari and Firefox have no SVG-backdrop lensing, so the glass degrades to a frosted material.
 * "The code path is right" was never the question — what matters is whether what is left still
 * reads as a material, and whether anything about the layout, the text or the keyboard quietly
 * depended on the refraction. These run in WebKit and Firefox only; Chrome has its own suite.
 */

const PAGES = ['/#/', '/#/components/button', '/#/components/sheet', '/#/components/toolbar'];

test('the fallback is a material, not a flat panel or a hole', async ({ page, browserName }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(600);

  const surface = page.locator('.lg-tabbar-group').first();
  await expect(surface).toBeVisible();

  const material = await surface.evaluate(node => {
    const backdrop = node.querySelector(':scope > .lg-decoration > .lg-backdrop')!;
    const tint = node.querySelector(':scope > .lg-decoration > .lg-tint')!;
    const rim = node.querySelector(':scope > .lg-decoration > .lg-rim')!;
    const style = (element: Element) => getComputedStyle(element);
    return {
      renderer: node.getAttribute('data-renderer'),
      backdrop: style(backdrop).backdropFilter || style(backdrop).getPropertyValue('-webkit-backdrop-filter'),
      tint: style(tint).backgroundColor,
      rimWidth: style(rim).borderTopWidth,
      shadow: style(node).boxShadow,
    };
  });

  // Without lensing it must still blur, still tint, and still carry its hairline and lift.
  expect(material.renderer).toBe('css');
  expect(material.backdrop, 'no blur left — the surface would be a flat panel').toMatch(/blur/);
  expect(material.tint).not.toBe('rgba(0, 0, 0, 0)');
  expect(parseFloat(material.rimWidth)).toBeGreaterThan(0);
  expect(material.shadow).not.toBe('none');

  /**
   * Measured, not assumed: every engine accepts `backdrop-filter: url(#id)` at parse time, so the
   * syntax probe cannot be read as "this engine will render it". That is why the blur is a CSS
   * function in the chain rather than living inside the SVG filter — an engine that quietly drops
   * the `url()` still frosts the surface.
   */
  const syntaxAccepted = await page.evaluate(() => CSS.supports('backdrop-filter', 'url("#glass-probe")')
    || CSS.supports('-webkit-backdrop-filter', 'url("#glass-probe")'));
  expect(syntaxAccepted, `${browserName} rejects the syntax, so the note above needs revisiting`).toBe(true);
});

test('forcing the lensing path still leaves a frosted surface here', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(600);
  // Whatever the engine does with the SVG filter, the declaration must lead with a real blur.
  const declaration = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.setProperty('backdrop-filter', 'blur(7px) url("#nope") saturate(1.15)');
    return probe.style.getPropertyValue('backdrop-filter') || probe.style.getPropertyValue('-webkit-backdrop-filter');
  });
  expect(declaration, 'the engine threw out a chain that mixes blur() with url()').toContain('blur');
});

for (const path of PAGES) {
  test(`${path} lays out and reads without the refraction path`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(String(error)));

    await page.goto(path);
    await page.waitForTimeout(700);

    expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
    // Nothing collapsed: every glass surface still has a box.
    const collapsed = await page.evaluate(() => [...document.querySelectorAll('.lg-root')]
      .filter(node => node.getClientRects().length > 0)
      .filter(node => { const b = node.getBoundingClientRect(); return b.width < 2 || b.height < 2; }).length);
    expect(collapsed).toBe(0);
    // Text on glass is still painted, not knocked out with the filter.
    const label = page.locator('.lg-tab-link[aria-current="page"]').first();
    if (await label.count()) {
      const colour = await label.evaluate(node => getComputedStyle(node).color);
      expect(colour).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
}

test('the keyboard path does not depend on the renderer', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(600);
  const group = page.locator('#segmented-basic');
  await group.getByRole('radio', { name: '周', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('radio', { name: '月', exact: true })).toBeChecked();
});

/**
 * The overlays animate in with `@starting-style` and `transition-behavior: allow-discrete`.
 * Firefox got both in 129, so `docs/roadmap-0.3.md` asked what happens in an older one.
 *
 * That question cannot be answered here — Playwright installs Firefox 155, and there is no
 * way to get 128 out of it — so this asserts the part that matters either way: a browser with
 * no entry animation must still get a working overlay rather than a broken one. If the support
 * check below ever reports false, this engine is exercising the degraded path for real and the
 * note above needs rewriting.
 */
test('a sheet opens, is usable and closes, with or without the entry animation', async ({ page, browserName }) => {
  await page.goto('/#/components/sheet');
  await page.waitForTimeout(600);

  const supported = await page.evaluate(() => {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync('@starting-style { .probe { opacity: 0 } }');
      return sheet.cssRules.length > 0 && CSS.supports('transition-behavior', 'allow-discrete');
    } catch { return false; }
  });
  test.info().annotations.push({ type: 'starting-style', description: `${browserName}: ${supported}` });

  await page.getByRole('button', { name: '打开面板' }).click();
  const sheet = page.getByRole('dialog', { name: '分享这一刻' });
  await expect(sheet).toBeVisible();

  // Open means on screen with a real box, not merely present: a discrete transition that never
  // runs is the failure mode, and it leaves an element that exists and cannot be seen.
  const box = await sheet.boundingBox();
  expect(box!.height, 'the sheet has no height').toBeGreaterThan(100);
  expect(box!.y, 'the sheet is off the bottom of the screen').toBeLessThan(await page.evaluate(() => innerHeight));

  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
});

test('user preferences still win when the material is already degraded', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(600);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  const transition = await page.locator('.lg-tabbar-group .lg-tab-link').first()
    .evaluate(node => getComputedStyle(node).transitionProperty);
  expect(transition).toBe('none');
});
