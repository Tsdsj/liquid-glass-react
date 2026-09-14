import { test, expect } from '@playwright/test';

test('the preview server serves a restrictive CSP without script unsafe-eval', async ({ page }) => {
  const violations: string[] = [];
  await page.addInitScript(() => {
    (window as unknown as { csp: string[] }).csp = [];
    document.addEventListener('securitypolicyviolation', event => (window as unknown as { csp: string[] }).csp.push(event.violatedDirective));
  });
  const response = await page.goto('/#/components/popover');
  const csp = response?.headers()['content-security-policy'] || '';
  expect(csp).toContain("script-src 'self'");
  expect(csp).not.toContain("'unsafe-eval'");
  // Displacement textures are data: URLs, so the SVG path needs no eval and no remote fetch.
  await page.getByRole('button', { name: '打开面板' }).click();
  await expect(page.getByRole('dialog', { name: '查看设置' })).toBeVisible();
  violations.push(...await page.evaluate(() => (window as unknown as { csp: string[] }).csp));
  expect(violations).toEqual([]);
});

test('the site requests nothing from outside its own origin', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    const url = request.url();
    if (!url.startsWith('http://127.0.0.1') && !url.startsWith('http://localhost') && !url.startsWith('data:') && !url.startsWith('blob:')) external.push(url);
  });
  await page.goto('/#/overview');
  await page.goto('/#/components/button');
  expect(external).toEqual([]);
});
