import { test, expect } from '@playwright/test';

/**
 * Three ways in, because there are three kinds of user, and a context menu that has only the
 * first one is a feature most people cannot reach.
 */

const PAGE = '/#/components/context-menu';
const REGION = '#context-demo .lg-context-region';
const MENU = '.lg-context-menu:popover-open';

test('right-click opens it at the pointer', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  const box = (await region.boundingBox())!;
  const at = { x: box.x + 40, y: box.y + 30 };

  await page.mouse.click(at.x, at.y, { button: 'right' });
  const menu = page.locator(MENU);
  await expect(menu).toBeVisible();

  /**
   * Anchored to the click, growing down and trailing from it — except that it flips rather
   * than overflowing, which is what happens when the click is near the bottom of the window.
   * So: the leading edge is at the click, one vertical edge is at the click, and the whole
   * panel is on screen.
   */
  const panel = (await menu.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(Math.abs(panel.x - at.x), `menu at ${Math.round(panel.x)}, click at ${Math.round(at.x)}`).toBeLessThan(12);
  const anchored = Math.abs(panel.y - at.y) < 12 || Math.abs(panel.y + panel.height - at.y) < 12;
  expect(anchored, `menu spans ${Math.round(panel.y)}–${Math.round(panel.y + panel.height)}, click at ${Math.round(at.y)}`).toBe(true);
  expect(panel.y).toBeGreaterThanOrEqual(0);
  expect(panel.y + panel.height).toBeLessThanOrEqual(viewport.height + 1);
});

test('the browser menu does not open on top of it', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  const prevented = await region.evaluate(node => {
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 });
    node.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(true);
});

/**
 * Shift+F10 and the Menu key. This is how the platform's own context menus are opened from a
 * keyboard, and without it the whole feature is pointer-only.
 */
test('the keyboard opens it, and Escape gives focus back', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  const button = region.getByRole('button', { name: /打开（主界面也有）/ });
  await button.focus();

  await page.keyboard.press('Shift+F10');
  const menu = page.locator(MENU);
  await expect(menu).toBeVisible();
  // Focus is on an item, so the first arrow key does something.
  await expect(menu.getByRole('menuitem').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(button, 'focus was not returned to where it came from').toBeFocused();
});

test('the keyboard model is the menu keyboard model', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  await region.getByRole('button').first().focus();
  await page.keyboard.press('Shift+F10');
  const menu = page.locator(MENU);
  await expect(menu).toBeVisible();

  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: '重命名' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: '删除' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(menu.getByRole('menuitem', { name: /打开/ })).toBeFocused();
});

test('choosing a command runs it and closes', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  const box = (await region.boundingBox())!;
  await page.mouse.click(box.x + 40, box.y + 30, { button: 'right' });
  await page.locator(MENU).getByRole('menuitem', { name: '拷贝' }).click();
  await expect(page.locator('#context-demo [role="status"]')).toHaveText('选了：拷贝');
  await expect(page.locator(MENU)).toBeHidden();
});

test('the destructive command is marked, not only coloured', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  const box = (await region.boundingBox())!;
  await page.mouse.click(box.x + 40, box.y + 30, { button: 'right' });
  await expect(page.locator(MENU).getByRole('menuitem', { name: '删除' })).toHaveAttribute('data-destructive', 'true');
});

/**
 * Everything in the menu has to be reachable another way. The library cannot enforce that, so
 * the demo demonstrates it and this checks the demo keeps doing so — a page that showed the
 * rule being broken would teach the wrong thing to everyone who copies from it.
 */
test('the demo offers its commands outside the menu too', async ({ page }) => {
  await page.goto(PAGE);
  const region = page.locator(REGION);
  await region.scrollIntoViewIfNeeded();
  await expect(region.getByRole('button', { name: /打开/ })).toBeVisible();
});

test.describe('on a touch device', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('a long press opens it; a quick tap does not', async ({ page }) => {
    await page.goto(PAGE);
    const region = page.locator(REGION);
    await region.scrollIntoViewIfNeeded();
    const box = (await region.boundingBox())!;
    const at = { x: box.x + box.width / 2, y: box.y + 20 };

    await page.touchscreen.tap(at.x, at.y);
    await page.waitForTimeout(700);
    expect(await page.locator(MENU).count(), 'a tap opened it').toBe(0);

    // Held, without moving.
    await page.evaluate(async point => {
      const target = document.elementFromPoint(point.x, point.y)!;
      const options = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1, clientX: point.x, clientY: point.y };
      target.dispatchEvent(new PointerEvent('pointerdown', options));
      await new Promise(resolve => setTimeout(resolve, 700));
      target.dispatchEvent(new PointerEvent('pointerup', options));
    }, at);
    await expect(page.locator(MENU)).toBeVisible();
  });

  test('a finger that moves was scrolling', async ({ page }) => {
    await page.goto(PAGE);
    const region = page.locator(REGION);
    await region.scrollIntoViewIfNeeded();
    const box = (await region.boundingBox())!;
    const at = { x: box.x + box.width / 2, y: box.y + 20 };

    await page.evaluate(async point => {
      const target = document.elementFromPoint(point.x, point.y)!;
      const base = { bubbles: true, pointerType: 'touch', isPrimary: true, pointerId: 1 };
      target.dispatchEvent(new PointerEvent('pointerdown', { ...base, clientX: point.x, clientY: point.y }));
      await new Promise(resolve => setTimeout(resolve, 120));
      // Past the slop: this is a scroll, not a press.
      window.dispatchEvent(new PointerEvent('pointermove', { ...base, clientX: point.x, clientY: point.y + 40 }));
      await new Promise(resolve => setTimeout(resolve, 700));
      window.dispatchEvent(new PointerEvent('pointerup', { ...base, clientX: point.x, clientY: point.y + 40 }));
    }, at);

    expect(await page.locator(MENU).count(), 'the menu opened during a scroll').toBe(0);
  });
});
