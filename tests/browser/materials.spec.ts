import { test, expect, type Locator } from '@playwright/test';

test('small glass flips with its backdrop, large glass does not', async ({ page }) => {
  await page.goto('/#/components/sidebar');
  const large = page.locator('.demo-content .lg-root[data-glass-size="large"]').first();
  await expect(large).toBeVisible();
  // A surface this size keeps the app appearance; flipping it as content scrolls under would
  // make it unreadable.
  await expect(large).toHaveAttribute('data-glass-size', 'large');
});

/**
 * `clear` means clear at every size, and it did not.
 *
 * Large glass is thicker than a button — sidebars, sheets, menus — and one rule said so by
 * pushing its dim layer to 86% in light and 90% in dark. It said so for *every* large surface,
 * `clear` included, on a selector aimed at the tint element itself, so it beat the rule that
 * gives clear-over-light-media the 35% the documentation promises. The effect: asking a big
 * surface for `clear` got you regular with extra steps — the same shape as the `controlSize`
 * bug, an inner declaration quietly outranking the caller's intent.
 */
const dim = (locator: Locator) =>
  locator.locator('.lg-tint').first().evaluate(node => {
    const parts = getComputedStyle(node).backgroundColor.match(/[\d.]+/g) ?? [];
    return parts.length === 4 ? Number(parts[3]) : 1;
  });

test('a large clear surface over media is still clear', async ({ page }) => {
  await page.goto('/#/overview');
  const panel = page.locator('.media-viewer .lg-panel');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute('data-glass-size', 'large');
  await expect(panel).toHaveAttribute('data-material', 'clear');
  const alpha = await dim(panel);
  expect(alpha, `the dim layer is ${alpha}, which is a wall rather than a window`).toBeLessThan(.45);
});

test('and a large regular surface is still thick', async ({ page }) => {
  await page.goto('/#/components/sidebar');
  const sidebar = page.locator('.demo-content .lg-root[data-glass-size="large"][data-material="regular"]').first();
  await sidebar.scrollIntoViewIfNeeded();
  const alpha = await dim(sidebar);
  expect(alpha, `the dim layer is ${alpha}; a sidebar is not a window`).toBeGreaterThan(.8);
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

test('the media viewer exports a local SVG without any network access', async ({ page }) => {
  await page.goto('/#/overview');
  await page.getByRole('button', { name: '更多媒体操作' }).click();
  await page.getByRole('menuitem', { name: '导出原创场景' }).click();
  await page.getByLabel('文件名称').fill('test-scene');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 SVG', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('test-scene.svg');
});
