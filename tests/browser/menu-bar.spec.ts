import { test, expect, type Page } from '@playwright/test';

/**
 * A menu bar is not a row of menu buttons, and every test here is about the difference.
 *
 * Once one menu is open the bar takes over: the pointer walks the open menu along the titles,
 * and so do the arrow keys — one press per menu, with nothing in between. A row of independent
 * buttons can do "click to open" and nothing else on this list.
 */

const BASIC = '#menubar-basic';

async function openBar(page: Page) {
  await page.goto('/#/components/menu-bar');
  const bar = page.locator(`${BASIC} .lg-menubar`);
  await bar.scrollIntoViewIfNeeded();
  await expect(bar).toBeVisible();
  return bar;
}

const title = (page: Page, key: string) => page.locator(`${BASIC} .lg-menubar-title[data-menu-key="${key}"]`);

/** Which menus are showing. The answer should never have two entries in it. */
const openMenus = (page: Page) => page.locator(`${BASIC} .lg-menu`).evaluateAll(nodes =>
  nodes.filter(node => node.matches(':popover-open')).map(node => node.getAttribute('aria-label')));

test('hovering the next title walks the open menu along the bar', async ({ page }) => {
  await openBar(page);
  await title(page, 'file').click();
  expect(await openMenus(page)).toEqual(['文件']);

  await title(page, 'edit').hover();
  /**
   * The closing panel reports itself a moment after the opening one does, and taken at face
   * value that closes the menu that just opened. An empty array here is that bug: the bar
   * flashed one menu and settled on none.
   */
  await expect.poll(() => openMenus(page)).toEqual(['编辑']);
  await expect(title(page, 'file')).toHaveAttribute('aria-expanded', 'false');
  await expect(title(page, 'edit')).toHaveAttribute('aria-expanded', 'true');
});

test('hovering does nothing at all while no menu is open', async ({ page }) => {
  await openBar(page);
  await title(page, 'edit').hover();
  await page.waitForTimeout(150);
  expect(await openMenus(page)).toEqual([]);
});

/**
 * A finger dragging across the bar is not hovering.
 *
 * Dispatched rather than performed, and the limitation is the same one the repeat guard has:
 * this proves the handler reads `pointerType`, not that a real finger produces that value.
 * A touch device does deliver `pointerType: "touch"` here, and the alternative was leaving a
 * branch with nothing behind it at all.
 */
test('a finger dragged across the titles does not open four menus on the way past', async ({ page }) => {
  await openBar(page);
  await title(page, 'file').click();
  await expect.poll(() => openMenus(page)).toEqual(['文件']);

  await title(page, 'edit').evaluate(node => {
    const box = node.getBoundingClientRect();
    node.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerType: 'touch',
      clientX: box.left + box.width / 2, clientY: box.top + box.height / 2,
    }));
  });
  await page.waitForTimeout(150);
  expect(await openMenus(page)).toEqual(['文件']);
});

/**
 * Opened with the mouse, then walked with the keyboard — and the two orders matter.
 *
 * Clicking a title leaves the cursor parked on it. Hiding one panel and showing another makes
 * the browser re-run its boundary logic and deliver a pointer event at that unchanged position,
 * which read as a hover yanks the menu straight back under the mouse: press Right, watch it go
 * right and bounce back to where the cursor is sitting. Nothing is left open by the end of it.
 *
 * The menu is checked open before the key is pressed, and that line is load-bearing rather
 * than tidy: pressing Right in the same breath as the click gets the key in ahead of the
 * browser's boundary event, and the test then passes against the broken version. It did.
 */
test('an arrow key moves the open menu rather than closing it', async ({ page }) => {
  await openBar(page);
  await title(page, 'file').click();
  await expect.poll(() => openMenus(page)).toEqual(['文件']);

  await page.keyboard.press('ArrowRight');
  await expect.poll(() => openMenus(page)).toEqual(['编辑']);
  // The next key is pressed at the open menu, which is where focus went when it opened.
  await expect(page.locator(`${BASIC} .lg-menu[aria-label="编辑"] .lg-menu-item`).first()).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => openMenus(page)).toEqual(['文件']);
});

test('the arrow keys only move focus while nothing is open', async ({ page }) => {
  await openBar(page);
  await title(page, 'file').focus();
  await page.keyboard.press('ArrowRight');
  await expect(title(page, 'edit')).toBeFocused();
  expect(await openMenus(page)).toEqual([]);

  await page.keyboard.press('ArrowDown');
  await expect.poll(() => openMenus(page)).toEqual(['编辑']);
});

test('the whole bar is one tab stop', async ({ page }) => {
  await openBar(page);
  const stops = await page.locator(`${BASIC} .lg-menubar-title`)
    .evaluateAll(nodes => nodes.map(node => (node as HTMLElement).tabIndex));
  expect(stops.filter(index => index === 0)).toHaveLength(1);
  expect(stops.filter(index => index === -1)).toHaveLength(stops.length - 1);

  await title(page, 'file').focus();
  await page.keyboard.press('Tab');
  const inside = await page.evaluate(selector =>
    !!document.activeElement?.closest(selector), `${BASIC} .lg-menubar`);
  expect(inside, 'Tab walked into the bar instead of across it').toBe(false);
});

test('Escape closes the menu and hands focus back to its title', async ({ page }) => {
  await openBar(page);
  await title(page, 'view').click();
  await expect.poll(() => openMenus(page)).toEqual(['显示']);
  await page.keyboard.press('Escape');
  await expect.poll(() => openMenus(page)).toEqual([]);
  await expect(title(page, 'view')).toBeFocused();
});

test('a press outside closes the menu, and the bar stops following the pointer', async ({ page }) => {
  await openBar(page);
  await title(page, 'file').click();
  await expect.poll(() => openMenus(page)).toEqual(['文件']);

  await page.locator('h1').click();
  await expect.poll(() => openMenus(page)).toEqual([]);
  /* And the bar knows it: moving onto another title now does nothing, because hovering only
     switches menus while one is open. A bar that had missed the light dismiss would open this. */
  await title(page, 'edit').hover();
  await page.waitForTimeout(150);
  expect(await openMenus(page)).toEqual([]);
});

test('a disabled menu keeps its place and is skipped on the way past', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const demo = page.locator('#menubar-disabled-demo');
  await demo.scrollIntoViewIfNeeded();
  const format = demo.locator('.lg-menubar-title[data-menu-key="format"]');
  // Still drawn: a menu bar that changes shape is a menu bar nobody can learn.
  await expect(format).toBeVisible();
  await expect(format).toBeDisabled();

  await demo.locator('.lg-menubar-title[data-menu-key="edit"]').focus();
  await page.keyboard.press('ArrowRight');
  // One enabled menu, so the only place to wrap to is back onto itself.
  await expect(demo.locator('.lg-menubar-title[data-menu-key="edit"]')).toBeFocused();
});

test('a command that does not apply is greyed, not missing', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const demo = page.locator('#menubar-disabled-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.locator('.lg-menubar-title[data-menu-key="edit"]').click();
  const copy = demo.locator('.lg-menu-item', { hasText: '拷贝' });
  await expect(copy).toBeVisible();
  await expect(copy).toBeDisabled();

  await page.keyboard.press('Escape');
  await demo.getByRole('button', { name: '选中一段文字' }).click();
  await demo.locator('.lg-menubar-title[data-menu-key="edit"]').click();
  await expect(demo.locator('.lg-menu-item', { hasText: '拷贝' })).toBeEnabled();
});

/**
 * Option swaps an item for its alternate, in place.
 *
 * Pressed for real rather than dispatched: `keydown` and `keyup` both carry `altKey`, and what
 * is being checked is that the menu reads it from both edges. A synthetic pair would prove the
 * handler exists and nothing about whether the browser reaches it.
 */
test('holding Option swaps a command for its alternate, and releasing puts it back', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const demo = page.locator('#menubar-alternate-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.locator('.lg-menubar-title').click();
  const first = demo.locator('.lg-menu-item').first();
  await expect(first).toContainText('关闭');
  await expect(first).not.toContainText('全部关闭');

  await page.keyboard.down('Alt');
  await expect(first).toContainText('全部关闭');
  await page.keyboard.up('Alt');
  await expect(first).not.toContainText('全部关闭');
  await expect(first).toContainText('关闭');
});

/**
 * A key held while the window goes away never delivers its `keyup`.
 *
 * Dispatched, and the limit is worth naming: a real window blur cannot be produced from inside
 * the page, so this proves the menu listens for one rather than that the browser sends it when
 * you ⌘-Tab away. Without it the menu keeps showing alternates after you come back, and the
 * next click runs the command you are not looking at.
 */
test('losing the window puts the alternates back', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const demo = page.locator('#menubar-alternate-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.locator('.lg-menubar-title').click();
  const first = demo.locator('.lg-menu-item').first();
  await page.keyboard.down('Alt');
  await expect(first).toContainText('全部关闭');

  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(first).toContainText('关闭');
  await expect(first).not.toContainText('全部关闭');
  await page.keyboard.up('Alt');
});

test('the alternate is the command that runs while Option is down', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const demo = page.locator('#menubar-alternate-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.locator('.lg-menubar-title').click();
  await page.keyboard.down('Alt');
  await demo.locator('.lg-menu-item').first().click();
  await page.keyboard.up('Alt');
  await expect(page.locator('#menubar-alternate-last')).toHaveText('全部关闭');
});

/**
 * A checkmark means two different things, and the roles are how a screen reader is told which.
 *
 * `selection` is per menu rather than per bar because one menu bar routinely has both: an
 * appearance menu is one choice out of three, and a row of view switches is three independent
 * ones. A menu of radios announced as checkboxes says that picking another will leave the
 * first one on, which is not what happens.
 */
test('a menu can be one choice out of a list while the one beside it is three switches', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const demo = page.locator('#menubar-selection-demo');
  await demo.scrollIntoViewIfNeeded();

  await demo.locator('.lg-menubar-title[data-menu-key="look"]').click();
  await expect(page.getByRole('menuitemradio')).toHaveCount(3);
  await expect(page.getByRole('menuitemradio', { name: '跟随系统' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('menuitemradio', { name: '深色' }).click();
  await expect(demo.getByRole('status')).toContainText('外观：dark');

  await demo.locator('.lg-menubar-title[data-menu-key="show"]').click();
  await expect(page.getByRole('menuitemcheckbox')).toHaveCount(3);
  await page.getByRole('menuitemcheckbox', { name: '网格' }).click();
  // Independent: ticking one leaves the one that was already on.
  await expect(demo.getByRole('status')).toContainText('ruler');
  await expect(demo.getByRole('status')).toContainText('grid');
});
