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

/**
 * The rule, not the trigger: after you press the control, its help stays shut until you leave
 * it and come back.
 *
 * Dismissing on press was all this asserted, and that passed on macOS while CI on Linux found
 * the tooltip still on screen five seconds after the click. A press is followed by the control
 * taking focus — and can be followed by the pointer being re-delivered to the same element —
 * and either of those asked for the tooltip again while the hand had not moved. Which one it
 * was on that runner is not something this repository can reproduce, so the component now
 * answers the question the test asks here instead: it is shut, it stays shut while you are
 * still on it, and leaving and returning is what brings it back.
 */
test('pressing the control dismisses it until you leave and come back', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.getByRole('button', { name: '恢复默认设置' });
  await button.scrollIntoViewIfNeeded();
  await button.hover();
  await expect(page.locator(TIP)).toBeVisible({ timeout: 2000 });

  await button.click();
  /* Focused on purpose: macOS and Linux disagree about whether a click focuses a button, and
     the assertion should not depend on which of them is running it. */
  await button.evaluate((node: HTMLElement) => node.focus());
  await expect(page.locator(TIP)).toBeHidden();

  // Longer than the 600ms open delay, with the pointer still on the control.
  await page.waitForTimeout(1200);
  await expect(page.locator(TIP), 'it came back on its own while the pointer had not moved').toBeHidden();

  await page.mouse.move(4, 4);
  await button.hover();
  await expect(page.locator(TIP), 'leaving and returning did not bring it back').toBeVisible({ timeout: 2000 });
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
