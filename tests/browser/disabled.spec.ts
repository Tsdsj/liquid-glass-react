import { test, expect } from '@playwright/test';

/**
 * A disabled control has to actually be unusable, not merely say so. `ListRow` kept rendering
 * a real `<a href>` when `disabled` was set and added `aria-disabled` on top, which changes
 * what a screen reader announces and nothing else: Enter still navigated, a click still
 * navigated, and Tab still stopped on it. `aria-disabled` is an announcement, never an
 * implementation.
 */

const LIST = '/#/components/list';
const ROW = '#list-disabled-demo .lg-list-row[data-disabled="true"]';

test('a disabled navigating row is not a link', async ({ page }) => {
  await page.goto(LIST);
  const row = page.locator(ROW).filter({ hasText: '订阅设置' });
  await expect(row).toBeVisible();
  // The hit region must not be an anchor with an href — that is the thing browsers navigate.
  expect(await row.locator('a[href]').count(), 'still a live link').toBe(0);
  await expect(row.locator('.lg-row-hit')).toHaveAttribute('aria-disabled', 'true');
});

test('clicking it does not navigate', async ({ page }) => {
  await page.goto(LIST);
  const row = page.locator(ROW).filter({ hasText: '订阅设置' });
  await row.scrollIntoViewIfNeeded();
  const before = page.url();
  await row.locator('.lg-row-hit').click({ force: true });
  await page.waitForTimeout(200);
  expect(page.url(), 'the row navigated anyway').toBe(before);
});

test('the keyboard cannot reach it or fire it', async ({ page }) => {
  await page.goto(LIST);
  const row = page.locator(ROW).filter({ hasText: '订阅设置' });
  await row.scrollIntoViewIfNeeded();

  // Not in the tab order: focusing it from script must not leave focus on the hit region.
  const focusable = await row.locator('.lg-row-hit').evaluate(node => {
    (node as HTMLElement).focus();
    return document.activeElement === node;
  });
  expect(focusable, 'a disabled row is still a tab stop').toBe(false);

  const before = page.url();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  expect(page.url()).toBe(before);
});

test('an enabled navigating row still works, so this is not a blanket disable', async ({ page }) => {
  await page.goto('/#/components/list');
  const link = page.locator('#list-disabled-demo .lg-list-row:not([data-disabled]) a[href], .lg-list-row:not([data-disabled]) button.lg-row-hit').first();
  await expect(link).toBeVisible();
  await expect(link).toBeEnabled();
});
