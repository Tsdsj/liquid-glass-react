import { test, expect } from '@playwright/test';

/**
 * The size class is the input every layout container will read, so it has to mean one thing.
 * Before this there was no shared definition at all: the action sheet carried its own
 * `(min-width: 768px)`, `--lg-margin` never changed from its compact value however wide the
 * window, and each new container would have invented a third answer.
 *
 * The breakpoint is 768 because that is where the HIG's compact environment ends. These
 * measure either side of it rather than trusting the number written down in two places.
 */

const COMPACT = { width: 420, height: 860 };
const REGULAR = { width: 1000, height: 860 };

test('the layout margin follows the size class', async ({ page }) => {
  const margin = async () => page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--lg-margin').trim());

  await page.setViewportSize(COMPACT);
  await page.goto('/#/components/button');
  expect(await margin()).toBe('16px');

  await page.setViewportSize(REGULAR);
  await page.waitForTimeout(150);
  expect(await margin(), 'the margin stayed compact on a regular-width window').toBe('20px');
});

test('the breakpoint is one number, not one per component', async ({ page }) => {
  await page.goto('/#/components/action-sheet');

  // 767 is compact: the action sheet anchors to the bottom of the screen, as it does on a phone.
  await page.setViewportSize({ width: 767, height: 860 });
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: '更多操作' }).first().click();
  // Named, because the page now shows three action sheets and only one of them is this one.
  const sheet = page.locator('.lg-action-sheet[popover][aria-label="照片操作"]');
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveAttribute('data-anchor', 'bottom');
  await page.keyboard.press('Escape');

  // 768 is regular: it stays attached to the control that opened it.
  await page.setViewportSize({ width: 768, height: 860 });
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: '更多操作' }).first().click();
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveAttribute('data-anchor', 'source');
});
