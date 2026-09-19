import { test, expect } from '@playwright/test';

/**
 * An `aria-label` tells a screen reader what an icon-only button does and tells a sighted
 * mouse user nothing. A tooltip is the other half of that — and it is only worth having if it
 * keeps three promises, which is what these check.
 */

const PAGE = '/#/components/tooltip';
const TIP = '.lg-tooltip:popover-open';

test('it waits before appearing, then says what the control does', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.getByRole('button', { name: '恢复默认设置' });
  await button.scrollIntoViewIfNeeded();
  await button.hover();

  // Not immediately: a pointer crossing a toolbar must not set off a row of them.
  await page.waitForTimeout(250);
  expect(await page.locator(TIP).count(), 'appeared before the delay was up').toBe(0);

  await expect(page.locator(TIP)).toBeVisible({ timeout: 2000 });
  await expect(page.locator(TIP)).toHaveText('恢复默认设置');
});

test('it is help, not the name — the control keeps its own', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.getByRole('button', { name: '新建工作区' });
  await button.scrollIntoViewIfNeeded();

  // Named before anything is hovered, and the tooltip is not what names it.
  await expect(button).toHaveAttribute('aria-label', '新建工作区');
  expect(await button.getAttribute('aria-labelledby')).toBeNull();

  await button.hover();
  await expect(page.locator(TIP)).toBeVisible({ timeout: 2000 });
  const described = await button.getAttribute('aria-describedby');
  expect(described, 'not attached as a description').toBeTruthy();
  await expect(page.locator(`#${described}`)).toHaveAttribute('role', 'tooltip');
});

test('focus shows it at once, and Escape takes it away', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.getByRole('button', { name: '搜索', exact: true });
  await button.scrollIntoViewIfNeeded();
  await button.focus();
  // No delay on focus: a keyboard user asked for this control deliberately.
  await expect(page.locator(TIP)).toBeVisible({ timeout: 500 });

  await page.keyboard.press('Escape');
  await expect(page.locator(TIP)).toBeHidden();
  // And Escape took nothing else with it.
  await expect(button).toBeFocused();
});

test('pressing the control dismisses it', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.getByRole('button', { name: '恢复默认设置' });
  await button.scrollIntoViewIfNeeded();
  await button.hover();
  await expect(page.locator(TIP)).toBeVisible({ timeout: 2000 });
  await button.click();
  await expect(page.locator(TIP)).toBeHidden();
});

test('only one is ever open', async ({ page }) => {
  await page.goto(PAGE);
  const demo = page.locator('#tooltip-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '恢复默认设置' }).hover();
  await expect(page.locator(TIP)).toBeVisible({ timeout: 2000 });
  await demo.getByRole('button', { name: '新建工作区' }).hover();
  await expect(page.locator(TIP)).toBeVisible({ timeout: 2000 });
  expect(await page.locator(TIP).count()).toBe(1);
  await expect(page.locator(TIP)).toHaveText('添加一个新的工作区');
});

/**
 * The one that matters most, because it is the one every tooltip implementation gets wrong.
 * There is no hover on a touch screen, so a tooltip there can only be something that appears
 * on tap and swallows the tap meant for the button. The component renders nothing at all:
 * not a wrapper, not an attribute.
 */
test.describe('on a touch device', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('it does not exist', async ({ page }) => {
    await page.goto(PAGE);
    const button = page.getByRole('button', { name: '新建工作区' });
    await button.scrollIntoViewIfNeeded();
    await button.tap();
    await page.waitForTimeout(800);
    expect(await page.locator('.lg-tooltip').count(), 'a tooltip on a touch screen').toBe(0);
    // And the tap reached the button, rather than being spent opening something.
    await expect(button).toBeVisible();
  });
});
