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
  await page.getByRole('button', { name: 'Glass', exact: true }).click();
  await expect(page.getByText('按下计数：1')).toBeVisible();
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

test('inputs are at least 16px so iOS Safari does not zoom on focus', async ({ page }) => {
  await page.goto('/#/components/text-field');
  const size = await page.getByLabel('工作区名称').evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});
