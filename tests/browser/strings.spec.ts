import { test, expect } from '@playwright/test';

/**
 * The labels a component supplies for itself — the dialog's close button, the stepper's two
 * arrows, the search field's clear button — were hard-coded English while the site around them
 * is Chinese. They are also the labels only a screen-reader user ever hears, so the mismatch
 * never showed up in a screenshot. This asserts the words a user would actually be read.
 */

test('the dialog close button speaks the application language', async ({ page }) => {
  await page.goto('/#/components/dialog');
  await page.getByRole('button', { name: '打开对话框' }).first().click();
  const dialog = page.getByRole('dialog').first();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: '关闭' })).toBeVisible();
  expect(await dialog.getByRole('button', { name: 'Close' }).count()).toBe(0);
});

test('the stepper arrows do too', async ({ page }) => {
  await page.goto('/#/components/stepper');
  await expect(page.getByRole('button', { name: '减少' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '增加' }).first()).toBeVisible();
  expect(await page.getByRole('button', { name: 'Decrease' }).count()).toBe(0);
});

test('the search field clear button does too', async ({ page }) => {
  await page.goto('/#/components/search-field');
  // The page's own demo, not the shell's ⌘K field, which lives hidden in a popover.
  const demo = page.locator('#search-basic');
  await demo.locator('.lg-search-input').fill('地图');
  await expect(demo.getByRole('button', { name: '清除搜索内容' })).toBeVisible();
  expect(await page.getByRole('button', { name: 'Clear search' }).count()).toBe(0);
});

test('the sheet drag handle names the sheet it resizes', async ({ page }) => {
  await page.goto('/#/components/sheet');
  await page.getByRole('button', { name: '打开面板' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('slider', { name: /的高度$/ })).toBeVisible();
});

/* Precedence — default, provider, prop — is asserted in `tests/ssr.test.mjs`, where the three
   cases can be rendered side by side against the built package instead of inferred from a page
   that only ever has one of them. */
