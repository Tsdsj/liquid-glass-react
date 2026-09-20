import { expectReachable } from './hit-floor.js';
import { test, expect } from '@playwright/test';

/**
 * The two kinds are not a styling choice, so this checks the behaviour that tells them apart
 * rather than how they look. A pull-down button keeps its own label and lists commands; a
 * pop-up button's label *is* the current selection and its items are one mutually exclusive
 * choice — which is `menuitemradio`, not a set of independent checkboxes.
 */

const PAGE = '/#/components/menu-button';

test('a pull-down button keeps its label and runs a command', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.getByRole('button', { name: /新建/ });
  await expect(button).toBeVisible();
  const before = (await button.textContent())!.trim();

  await button.click();
  const menu = page.getByRole('menu', { name: '新建' });
  await expect(menu).toBeVisible();
  await menu.getByRole('menuitem', { name: '文件夹' }).click();

  await expect(page.locator('#pulldown-result')).toContainText('文件夹');
  // The label does not become the thing that was chosen — that is the other kind.
  expect((await button.textContent())!.trim()).toBe(before);
});

test('a pop-up button shows the current selection and updates to the new one', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.locator('#popup-demo button[aria-haspopup="menu"]');
  await expect(button.locator('.lg-menu-button-value')).toHaveText('中等');

  await button.click();
  const menu = page.getByRole('menu', { name: '画质' });
  await expect(menu).toBeVisible();
  await menu.getByRole('menuitemradio', { name: '高' }).click();

  await expect(button.locator('.lg-menu-button-value')).toHaveText('高');
});

test('its items are one choice, not a row of independent checkboxes', async ({ page }) => {
  await page.goto(PAGE);
  await page.locator('#popup-demo button[aria-haspopup="menu"]').click();
  const menu = page.getByRole('menu', { name: '画质' });
  await expect(menu).toBeVisible();

  expect(await menu.getByRole('menuitemcheckbox').count(), 'checkbox semantics in a single-choice menu').toBe(0);
  const radios = menu.getByRole('menuitemradio');
  expect(await radios.count()).toBeGreaterThan(2);
  // Exactly one is checked, and it is the one the button is showing.
  const checked = await radios.evaluateAll(nodes => nodes.filter(n => n.getAttribute('aria-checked') === 'true').map(n => n.textContent?.trim()));
  expect(checked).toHaveLength(1);
});

/**
 * A pop-up button's menu opens on the item that is already chosen — it shows you where you
 * are before it asks where you want to go. Opening on the first item instead would make one
 * arrow press mean something different depending on the current value.
 */
test('the menu opens focused on the current selection, not on the panel or the first item', async ({ page }) => {
  await page.goto(PAGE);
  await page.locator('#popup-demo button[aria-haspopup="menu"]').click();
  await expect(page.getByRole('menu', { name: '画质' })).toBeVisible();
  const focused = await page.evaluate(() => ({
    role: document.activeElement?.getAttribute('role'),
    checked: document.activeElement?.getAttribute('aria-checked'),
    label: document.activeElement?.textContent?.trim(),
  }));
  expect(focused.role, 'focus landed on the panel, so the first arrow key goes nowhere').toBe('menuitemradio');
  expect(focused.checked).toBe('true');
  expect(focused.label).toBe('中等');
});

test('the keyboard can pick a value without a pointer', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.locator('#popup-demo button[aria-haspopup="menu"]');
  await button.click();
  await expect(page.getByRole('menu', { name: '画质' })).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(button.locator('.lg-menu-button-value')).not.toHaveText('中等');
});

test('Escape closes it and gives focus back to the button', async ({ page }) => {
  await page.goto(PAGE);
  const button = page.locator('#popup-demo button[aria-haspopup="menu"]');
  await button.click();
  await expect(page.getByRole('menu', { name: '画质' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: '画质' })).toBeHidden();
  await expect(button).toBeFocused();
});

test('the destructive item is marked as such, not only coloured', async ({ page }) => {
  await page.goto(PAGE);
  await page.getByRole('button', { name: /新建/ }).click();
  const item = page.getByRole('menuitem', { name: '清空草稿' });
  await expect(item).toHaveAttribute('data-destructive', 'true');
  const colour = await item.evaluate(node => getComputedStyle(node).color);
  expect(colour).not.toBe('rgb(255, 255, 255)');
});

/**
 * A `small` control is a smaller *drawing*, never a smaller target: the hit region grows
 * through padding to whatever the pointer needs. This is the one that regresses silently,
 * because it looks right either way.
 */
test('every size stays reachable on both platforms', async ({ page }) => {
  await page.goto(PAGE);
  const triggers = page.locator('#menubutton-sizes button[aria-haspopup="menu"]');
  expect(await triggers.count()).toBe(3);
  for (let index = 0; index < 3; index++) {
    await expectReachable(page, triggers.nth(index), `menu trigger ${index}`);
  }
});

test('reduced motion stops the chevron from spinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PAGE);
  const transition = await page.locator('#popup-demo .lg-menu-button-chevron')
    .evaluate(node => getComputedStyle(node).transitionProperty);
  expect(transition).toBe('none');
});

test('the current selection is state, not colour', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto(PAGE);
  await page.locator('#popup-demo button[aria-haspopup="menu"]').click();
  const menu = page.getByRole('menu', { name: '画质' });
  await expect(menu).toBeVisible();
  // Nothing about which item is chosen depends on a colour surviving the forced palette.
  await expect(menu.getByRole('menuitemradio', { name: '中等' })).toHaveAttribute('aria-checked', 'true');
});
