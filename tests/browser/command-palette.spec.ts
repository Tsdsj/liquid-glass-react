import { test, expect, type Page } from '@playwright/test';

/**
 * A palette is a combobox over a listbox with **virtual focus**, and most of these tests are
 * about that one sentence: real focus never leaves the field, so the next keystroke keeps
 * filtering while the arrow keys move a highlight that is named rather than focused.
 *
 * Nothing here assumes a platform. `mod` is Command on Apple hardware and Control everywhere
 * else, and Playwright's Chrome reports a Linux user agent — so the modifier is read off the
 * hint the page prints, the same way `shortcut.spec.ts` does it.
 */

/** The demo palette, which is the second one on the page: the first is the site's own ⌘K. */
const palette = (page: Page) => page.locator('.lg-palette', { has: page.locator('h2', { hasText: '命令' }) }).first();

async function openPalette(page: Page) {
  await page.goto('/#/components/command-palette');
  const demo = page.locator('#palette-basic');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '打开命令面板' }).click();
  const panel = palette(page);
  await expect(panel).toBeVisible();
  return panel;
}

const input = (panel: ReturnType<typeof palette>) => panel.locator('.lg-palette-input');
const highlighted = (panel: ReturnType<typeof palette>) => panel.locator('[role="option"][aria-selected="true"]');

test('focus stays in the field while the arrow keys move the highlight', async ({ page }) => {
  const panel = await openPalette(page);
  await expect(input(panel)).toBeFocused();
  await expect(highlighted(panel)).toHaveText(/新建文稿/);

  await page.keyboard.press('ArrowDown');
  await expect(highlighted(panel)).toHaveText(/打开…/);
  /* The whole point of virtual focus: this is what a hand-rolled listbox breaks, because
     moving real focus into the list means the next character never reaches the field. */
  await expect(input(panel), 'the arrow key took focus out of the field').toBeFocused();

  const active = await input(panel).getAttribute('aria-activedescendant');
  expect(active, 'the highlighted row is not named to a screen reader').toBeTruthy();
  await expect(panel.locator(`#${active}`)).toHaveAttribute('aria-selected', 'true');
});

test('typing filters, and the highlight lands on something that still exists', async ({ page }) => {
  const panel = await openPalette(page);
  /* Moved well down the list first: a highlight left where it was would now be pointing past
     the end of a shorter list, and `aria-activedescendant` would name a row nobody can see. */
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(panel)).toHaveText(/显示侧边栏/);

  await input(panel).fill('深色');
  await expect(panel.locator('[role="option"]')).toHaveCount(1);
  await expect(highlighted(panel)).toHaveText(/切换深色外观/);
  const named = await input(panel).getAttribute('aria-activedescendant');
  await expect(panel.locator(`#${named}`)).toHaveCount(1);

  // Matched on `keywords`, which are searched and never drawn.
  await input(panel).fill('dark');
  await expect(highlighted(panel)).toHaveText(/切换深色外观/);
});

test('Return runs the highlighted command and closes', async ({ page }) => {
  const panel = await openPalette(page);
  await input(panel).fill('导出');
  await expect(highlighted(panel)).toHaveText(/导出为 PDF/);
  await page.keyboard.press('Enter');
  await expect(panel).toBeHidden();
  await expect(page.locator('#palette-last')).toHaveText('导出为 PDF');
});

test('a disabled command is drawn, highlighted by nothing, and cannot be run', async ({ page }) => {
  const panel = await openPalette(page);
  const publish = panel.locator('[role="option"]', { hasText: '发布' });
  await expect(publish).toBeVisible();
  await expect(publish).toHaveAttribute('aria-disabled', 'true');

  /* Six commands, the last one disabled: walking down five times from the first has to land
     back on the first rather than on the one that does nothing. */
  for (let step = 0; step < 5; step++) await page.keyboard.press('ArrowDown');
  await expect(highlighted(panel)).toHaveText(/新建文稿/);

  // Forced past the actionability check, because that check is one of the assertions:
  // Playwright refuses to click an `aria-disabled` element, and a real pointer will not care.
  await publish.click({ force: true });
  await expect(panel).toBeVisible();
  await expect(page.locator('#palette-last')).toHaveText('还没执行命令');
  /* And the press did not cost the field its focus. A press that lands on a row is still a
     press inside the palette, and if it took focus with it the next character would go
     nowhere — which is the whole thing this control is for. */
  await expect(input(panel)).toBeFocused();
});

test('nothing matching says so, and says what would', async ({ page }) => {
  const panel = await openPalette(page);
  await input(panel).fill('qqqq');
  await expect(panel.locator('[role="option"]')).toHaveCount(0);
  // The provider's own words, not the library's English default.
  await expect(panel.locator('.lg-palette-empty')).toHaveText('没有匹配的命令');
});

test('Escape closes and gives focus back to whatever opened it', async ({ page }) => {
  const panel = await openPalette(page);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.locator('#palette-basic').getByRole('button', { name: '打开命令面板' })).toBeFocused();
});

test('what was typed does not survive the panel closing', async ({ page }) => {
  const panel = await openPalette(page);
  await input(panel).fill('导出');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await page.locator('#palette-basic').getByRole('button', { name: '打开命令面板' }).click();
  await expect(input(panel)).toHaveValue('');
});

/**
 * The shortcut opens it, and the same keys close it.
 *
 * Two bindings rather than a toggle, and the reason is the rule: an application shortcut must
 * not fire while a modal is up. The one that closes the palette is scoped inside the dialog,
 * which is what makes it the exception.
 */
test('the shortcut the page prints opens the palette, and closes it again', async ({ page }) => {
  const panel = await openPalette(page);
  /* Which physical modifier `mod` is depends on the machine, so it is read off the page rather
     than assumed: this is the same resolution the binding used, which is the point of the two
     coming from one parse. Guessing here is how `shortcut.spec.ts` was wrong the first time. */
  const spoken = await panel.locator('.lg-palette-option-shortcut').first().getAttribute('aria-label');
  expect(spoken, 'the palette prints no shortcut at all').toBeTruthy();
  const press = spoken!.startsWith('Command') ? 'Meta' : 'Control';
  expect(spoken!.startsWith('Command') || spoken!.startsWith('Control'), `it reads "${spoken}"`).toBe(true);

  // Scoped inside the dialog, which is the exception to "a modal takes the keyboard with it".
  await page.keyboard.press(`${press}+j`);
  await expect(panel).toBeHidden();
  // And the unscoped one, which is the application's and only fires with no modal up.
  await page.keyboard.press(`${press}+j`);
  await expect(panel).toBeVisible();
});

test('shortcut={null} binds nothing at all', async ({ page }) => {
  await page.goto('/#/components/command-palette');
  const demo = page.locator('#palette-filter-demo');
  await demo.scrollIntoViewIfNeeded();
  const panel = page.locator('.lg-palette', { has: page.locator('h2', { hasText: '段落命令' }) });
  /* Both, so this does not depend on which one `mod` resolves to here. One of them is the
     documentation site's own ⌘K, which opens the site's palette — that is the point: the
     default combination is live on this page and still does not open this one. */
  await page.keyboard.press('Meta+k');
  await page.keyboard.press('Control+k');
  await expect(panel).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('.lg-palette[open]')).toHaveCount(0);

  await demo.getByRole('button', { name: '自己过滤' }).click();
  await expect(panel).toBeVisible();
});

test('filter={false} draws the list it was handed, in the order it was handed it', async ({ page }) => {
  await page.goto('/#/components/command-palette');
  const demo = page.locator('#palette-filter-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '自己过滤' }).click();
  const panel = page.locator('.lg-palette', { has: page.locator('h2', { hasText: '段落命令' }) });
  await expect(panel.locator('[role="option"]')).toHaveCount(5);

  await panel.locator('.lg-palette-input').fill('对齐');
  /* Three matches, and only because the caller's own filter produced them: the library's
     default would have been asked about the same query and is not running here. */
  await expect(panel.locator('[role="option"]')).toHaveCount(3);
  await expect(panel.locator('[role="option"]').first()).toHaveText('对齐左边');
});

test('the field wears the focus ring, and it is the only one', async ({ page }) => {
  const panel = await openPalette(page);
  await expect(input(panel)).toBeFocused();
  const rings = await panel.evaluate(node => Array.from(node.querySelectorAll('*'))
    .filter(element => getComputedStyle(element).outlineStyle !== 'none')
    .map(element => element.className));
  expect(rings, `rings on ${rings.join(', ') || 'nothing'}`).toEqual(['lg-palette-field']);
});
