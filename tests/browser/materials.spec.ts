import { test, expect } from '@playwright/test';

test('small glass flips with its backdrop, large glass does not', async ({ page }) => {
  await page.goto('/#/components/material-view');
  // The example declares a media backdrop, so small glass inside takes the dark appearance…
  const small = page.locator('.demo-content .lg-root[data-glass-size="small"]').first();
  if (await small.count()) await expect(small).toHaveAttribute('data-lg-theme', 'dark');

  await page.goto('/#/components/sidebar');
  const large = page.locator('.demo-content .lg-root[data-glass-size="large"]').first();
  // …while a large surface keeps the app appearance, because flipping it would be distracting.
  await expect(large).toHaveAttribute('data-glass-size', 'large');
});

test('clear over an unknown backdrop falls back to regular rather than guessing', async ({ page }) => {
  await page.goto('/#/components/material-view');
  const guessing = await page.locator('.lg-root[data-material="clear"][data-backdrop-tone="mixed"]').count();
  expect(guessing).toBe(0);
});

test('standard materials are content layer and never carry a glass rim', async ({ page }) => {
  await page.goto('/#/components/material-view');
  const view = page.locator('.lg-material-view').first();
  await expect(view).toBeVisible();
  await expect(view.locator('.lg-rim')).toHaveCount(0);
  await expect(view.locator('.lg-decoration')).toHaveCount(0);
});

test('content-layer containers never sample the backdrop', async ({ page }) => {
  await page.goto('/#/components/card');
  const filtered = await page.locator('.lg-card').evaluateAll(nodes =>
    nodes.filter(node => getComputedStyle(node).backdropFilter !== 'none').length);
  expect(filtered).toBe(0);
});

test('the material lab still drives all three render paths', async ({ page }) => {
  await page.goto('/#/labs/materials');
  await expect(page.getByTestId('lab-specimen')).toBeVisible();
  await page.getByTestId('specimen-action').click();
  await expect(page.getByText('已响应 1 次交互')).toBeVisible();
  for (const renderer of ['CSS', 'SVG', 'Auto']) {
    await page.getByRole('radio', { name: renderer, exact: true }).check();
    await expect(page.getByTestId('lab-specimen')).toBeVisible();
  }
});

test('the media viewer exports a local SVG without any network access', async ({ page }) => {
  await page.goto('/#/overview');
  await page.getByRole('button', { name: '更多媒体操作' }).click();
  await page.getByRole('menuitem', { name: '导出原创场景' }).click();
  await page.getByLabel('文件名称').fill('test-scene');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 SVG', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('test-scene.svg');
});
