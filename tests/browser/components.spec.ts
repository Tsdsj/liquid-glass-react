import { test, expect } from '@playwright/test';

test('buttons carry real semantics for disabled, loading and press state', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.getByRole('button', { name: '玻璃', exact: true }).click();
  await expect(page.getByText('按了 1 次')).toBeVisible();
  await expect(page.getByRole('button', { name: '不可用' })).toBeDisabled();
  const loading = page.getByRole('button', { name: '处理中' });
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await expect(loading).toBeDisabled();
  // Icon-only controls must still have an accessible name.
  await expect(page.getByRole('button', { name: '收藏', exact: true })).toBeVisible();
});

/**
 * One preferred action per view — and a demo stage is a view. Counted per stage rather than
 * per page: the page holds a dozen independent examples, and the first version of this summed
 * them, so it read "1" only while the page happened to have a single prominent button
 * anywhere on it. Adding a second example that legitimately had one broke it.
 */
test('only one action per view is prominent', async ({ page }) => {
  await page.goto('/#/components/button');
  const counts = await page.locator('.demo-stage').evaluateAll(stages =>
    stages.map(stage => stage.querySelectorAll('[data-variant="glassProminent"]').length));
  expect(counts.length).toBeGreaterThan(1);
  expect(Math.max(...counts), `stages hold ${counts.join(', ')} prominent buttons`).toBe(1);
});

test('segmented control is a native radio group', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const basic = page.locator('#segmented-basic');
  await basic.getByRole('radio', { name: '日', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(basic.getByRole('radio', { name: '周', exact: true })).toBeChecked();
  await expect(page.locator('#segmented-disabled').getByRole('radio', { name: '年', exact: true })).toBeDisabled();
});

test('slider and switch keep their native keyboard behaviour', async ({ page }) => {
  await page.goto('/#/components/slider');
  const slider = page.getByRole('slider', { name: '音量' });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuetext', '63 百分比');

  await page.goto('/#/components/switch');
  const toggle = page.getByRole('switch', { name: '低数据模式' });
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toBeChecked();
});

test('the slider knob is quiet at rest and becomes glass only while held', async ({ page }) => {
  await page.goto('/#/components/slider');
  const decoration = page.locator('#slider-basic .lg-slider-lens > .lg-decoration').first();
  await expect(decoration).toHaveCSS('opacity', '0');
  const knob = page.locator('#slider-basic .lg-slider-lens').first();
  // Into view first: the app bar floats over the top of the page, and a press that lands on
  // the bar instead of the knob measures the bar.
  await knob.scrollIntoViewIfNeeded();
  const box = (await knob.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(decoration).toHaveCSS('opacity', '1');
  await page.mouse.up();
  await expect(decoration).toHaveCSS('opacity', '0');
});

test('a toolbar is one tab stop with arrow-key traversal across its groups', async ({ page }) => {
  await page.goto('/#/components/toolbar');
  const toolbar = page.getByRole('toolbar', { name: '编辑工具栏' });
  const buttons = toolbar.locator('button');
  await buttons.first().focus();
  await page.keyboard.press('End');
  await expect(buttons.last()).toBeFocused();
  await page.keyboard.press('Home');
  await expect(buttons.first()).toBeFocused();
  // Symbols and text never share one background.
  await expect(toolbar.locator('.lg-toolbar-group')).toHaveCount(2);
});

test('in-page tabs swap panels and expose tab semantics', async ({ page }) => {
  await page.goto('/#/components/tabs');
  await page.getByRole('tab', { name: '设计', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '实现', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toHaveCount(1);
});

test('popover closes on Escape and on an outside click, returning focus', async ({ page }) => {
  await page.goto('/#/components/popover');
  const trigger = page.getByRole('button', { name: '打开面板' });
  await trigger.click();
  const panel = page.getByRole('dialog', { name: '查看设置' });
  await expect(panel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('h1').click();
  await expect(panel).toBeHidden();
});

test('menu arrows skip disabled items and typeahead finds a label', async ({ page }) => {
  await page.goto('/#/components/menu');
  const trigger = page.getByRole('button', { name: '打开菜单' });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: '打开', exact: true })).toBeFocused();
  await expect(page.getByRole('menuitem', { name: '暂不可用' })).toBeDisabled();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemcheckbox', { name: '置顶' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '删除' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#menu-basic [role="status"]')).toHaveText('删除');
  await expect(trigger).toBeFocused();
});

test('dialog traps focus, restores it on Escape and unlocks the page scroll', async ({ page }) => {
  await page.goto('/#/components/dialog');
  const trigger = page.getByRole('button', { name: '打开对话框' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '创建一个工作区' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('list rows are real links or buttons, never clickable divs', async ({ page }) => {
  await page.goto('/#/components/list');
  const rows = page.locator('.lg-list-row[data-interactive="true"] .lg-row-hit');
  expect(await rows.count()).toBeGreaterThan(0);
  const tags = await rows.evaluateAll(nodes => nodes.map(node => node.tagName));
  expect(tags.every(tag => tag === 'A' || tag === 'BUTTON')).toBe(true);
});

test('the scroll edge effect appears only once content passes under the bar', async ({ page }) => {
  await page.goto('/#/components/scroll-edge');
  // The demo's own edge, not the one `Screen` gives the whole page — both are correct, and
  // "one per scroll view" is the rule, so a page with an inner scroller legitimately has two.
  const top = page.locator('.demo-scroll-fixture .lg-scroll-edge[data-edge="top"]');
  await expect(top).toHaveAttribute('data-active', 'false');
  await page.locator('.demo-scroll-body').evaluate(node => { node.scrollTop = 150; });
  await expect(top).toHaveAttribute('data-active', 'true');
});
