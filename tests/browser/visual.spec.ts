import { test, expect } from '@playwright/test';

const ROUTES = ['overview', 'components', 'components/button', 'components/list', 'foundations/materials', 'labs/materials'];

for (const width of [390, 768, 1024, 1440]) {
  test(`layout holds at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ROUTES) {
      await page.goto(`/#/${route}`);
      await expect(page.locator('h1')).toBeVisible();
      // Nothing may push the document wider than the viewport at any breakpoint.
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      // The rail of sibling pages appears at 900; the areas are one element at every width.
      await expect(page.getByRole('navigation', { name: '主导航' }))
        .toHaveAttribute('data-layout', 'tabbar');
      const rail = page.locator('.app-rail');
      if (width >= 900 && route.startsWith('components/')) await expect(rail).toBeVisible();
      else if (width < 900) await expect(rail).toBeHidden();
      // Evidence capture, NOT an automatically approved visual baseline.
      await info.attach(`${route.replace(/\//g, '-')}-${width}`, {
        body: await page.screenshot({ fullPage: true }), contentType: 'image/png',
      });
    }
  });
}

test('the whole site reads in dark appearance too', async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/#/components/button');
  await expect(page.locator('html')).toHaveAttribute('data-app-theme', 'dark');
  await info.attach('button-dark', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});
