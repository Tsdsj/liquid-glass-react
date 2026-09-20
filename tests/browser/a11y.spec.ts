import { asPlatform } from './hit-floor.js';
import { test, expect } from '@playwright/test';

/* Chromium cannot emulate prefers-reduced-transparency, so this drives the same policy
   through the site's own preference switch, which is what a user without the OS setting
   would use anyway. */
test('reduced transparency drops every backdrop filter and the SVG path', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.getByRole('button', { name: '打开显示偏好' }).click();
  await page.getByRole('switch', { name: '减少透明度' }).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-renderer="svg"]')).toHaveCount(0);
  const clear = await page.locator('.lg-backdrop').evaluateAll(nodes =>
    nodes.every(node => getComputedStyle(node).backdropFilter === 'none'));
  expect(clear).toBe(true);
  // The control still works; only the material changed.
  await page.getByRole('button', { name: '玻璃', exact: true }).click();
  await expect(page.getByText('按了 1 次')).toBeVisible();
});

test('increase contrast turns the material black and white with a border', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/#/components/button');
  const rim = page.locator('.lg-button .lg-rim').first();
  const style = await rim.evaluate(node => {
    const computed = getComputedStyle(node);
    return { image: computed.backgroundImage, border: computed.borderTopColor, mask: computed.maskImage };
  });
  // The travelling conic highlight gives way to a plain contrasting edge.
  expect(style.image).toBe('none');
  expect(style.mask).toBe('none');
  expect(style.border).not.toBe('rgba(0, 0, 0, 0)');
});

test('forced colors and OS reduced motion override the effects', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/#/components/button');
  await expect(page.locator('[data-renderer="svg"]')).toHaveCount(0);
  await expect(page.locator('.lg-root').first()).toHaveAttribute('data-reduced-motion', 'true');
});

/* =========================================================================================
 * An application's own preferences screen has to reach the stylesheet, not just the material.
 *
 * `GlassProvider`'s `contrast` and `motion` are public API, and until this round they went into
 * a React context and stopped there: the glass honoured them, because the material asks the
 * policy in JavaScript, and everything decided in CSS — the palette, a page transition, the tab
 * bar — kept the media query as its only source. Measured with the site's own switches, which
 * is the same path any application wiring its settings to these props takes.
 * ======================================================================================= */

const openPreferences = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: '打开显示偏好' }).click();
};

test('the increase-contrast switch swaps the palette, not just three label alphas', async ({ page }) => {
  await page.goto('/#/components/badge');
  const blue = () => page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--lg-blue').trim());

  const before = await blue();
  await openPreferences(page);
  await page.getByRole('switch', { name: '增强对比度' }).check();
  await page.keyboard.press('Escape');
  const after = await blue();

  /* The HIG lets a default sit under 4.5:1 *provided* Increase Contrast rescues it. The
     opt-in path used to leave every system colour exactly where it was, which turns a
     considered choice — white on the notification red — into a failure with no way out. */
  expect(after, `--lg-blue is ${after} either way`).not.toBe(before);
  await expect(page.locator('html')).toHaveAttribute('data-lg-contrast', 'more');
});

test('the reduced-motion switch reaches the animations that live only in CSS', async ({ page }) => {
  await page.goto('/#/components/button');
  await openPreferences(page);
  await page.getByRole('switch', { name: '减少动效' }).check();
  await page.keyboard.press('Escape');

  await expect(page.locator('html')).toHaveAttribute('data-lg-motion', 'reduced');
  // The page transition is the site's own rule, outside any `.lg-root`, and it kept running.
  const entering = await page.locator('.page-enter').first()
    .evaluate(node => getComputedStyle(node).animationName);
  expect(entering, 'the page transition still plays').toBe('none');
});

test('the layout reflows at the largest accessibility text size', async ({ page }) => {
  await page.goto('/#/components/list');
  await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; });
  // Nothing may overflow horizontally, and body text really does scale.
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const size = await page.locator('.lg-row-label').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  expect(size).toBeGreaterThan(40);
});

test('no interface text is set below the 11px readable floor', async ({ page }) => {
  await page.goto('/#/components/typography');
  const smallest = await page.evaluate(() => {
    const sizes = Array.from(document.querySelectorAll<HTMLElement>('.app-content *'))
      .filter(node => node.textContent?.trim() && node.children.length === 0)
      .map(node => parseFloat(getComputedStyle(node).fontSize))
      .filter(Number.isFinite);
    return Math.min(...sizes);
  });
  expect(smallest).toBeGreaterThanOrEqual(11);
});

test('right-to-left mirrors the layout and the directional chevron', async ({ page }) => {
  await page.goto('/#/components/list');
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const transform = await page.locator('.lg-row-chevron').first().evaluate(node => getComputedStyle(node).transform);
  // scaleX(-1) is matrix(-1, 0, 0, 1, 0, 0)
  expect(transform).toContain('-1');
});

test('every icon-only control has an accessible name', async ({ page }) => {
  await page.goto('/#/components/toolbar');
  const unnamed = await page.locator('button.lg-icon-button').evaluateAll(nodes =>
    nodes.filter(node => !node.getAttribute('aria-label') && !node.textContent?.trim()).length);
  expect(unnamed).toBe(0);
});

test('focus is always visible and never removed without a replacement', async ({ page }) => {
  await page.goto('/#/components/text-field');
  const input = page.getByLabel('工作区名称');
  await input.focus();
  // The ring fades in over 90ms, so this polls rather than sampling one frame.
  await expect(page.locator('.lg-field-box').first()).not.toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
});

test('an invalid field is marked for assistive technology, not only in red', async ({ page }) => {
  await page.goto('/#/components/text-field');
  const email = page.getByLabel('电子邮件');
  await email.fill('not-an-email');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  const describedBy = await email.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy!.split(' ')[0]}`)).toContainText('@');
});

/**
 * On a touchscreen, which is where the rule comes from.
 *
 * iOS Safari zooms the page when a field with text under 16px takes focus, and the zoom does
 * not come back on its own. That is a fact about touchscreen Safari, not a typographic
 * preference, so the floor is lifted for a fine pointer rather than kept everywhere: at the
 * macOS metrics a 16px line does not fit inside a 22px control, and keeping it made `small`
 * and `regular` fields render at the same height.
 */
test('inputs are at least 16px on a touchscreen so iOS Safari does not zoom on focus', async ({ page }) => {
  await page.goto('/#/components/text-field');
  await asPlatform(page, 'touch');
  const size = await page.getByLabel('工作区名称').evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
  await asPlatform(page, null);
});

/**
 * Found by `pnpm test:matrix`, which is why it is here: the sweep reports, and what it finds
 * becomes a test that runs on every commit.
 *
 * Every page title on this site ends in an export name, and a camel-cased Latin word inside
 * Chinese text gives the line breaker nowhere to break. At AX5 the longest of them —
 * `GlassSegmentedControl` — was wider than its column, and an unbreakable line widens the page
 * instead of wrapping: 57px of sideways scroll, on a page a user cannot scroll back from.
 */
test('the longest component name still wraps at the largest text size', async ({ page }) => {
  for (const direction of ['ltr', 'rtl'] as const) {
    await page.goto('/#/components/segmented-control');
    await page.evaluate(dir => {
      document.documentElement.dir = dir;
      document.documentElement.dataset.lgTextSize = 'ax5';
    }, direction);
    await page.waitForTimeout(250);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${direction} at AX5 scrolls ${overflow}px sideways`).toBeLessThanOrEqual(1);
  }
});
