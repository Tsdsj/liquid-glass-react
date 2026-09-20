import { test, expect } from '@playwright/test';

/**
 * The back button is the whole component, and it is the part that is usually wrong.
 *
 * "Back" names the direction, which the user already knows — they pressed the thing that goes
 * back. What they do not know is the destination, so the button carries the previous screen's
 * title. The spoken name has to carry both, because a title on its own does not say which way
 * it goes.
 *
 * The other half is focus. A keyboard user presses a row, the screen changes, and if focus
 * stays put their next Tab continues from wherever that row used to be — on a screen that no
 * longer exists.
 */

const PAGE = '/#/components/navigation-stack';
const STACK = '#stack-demo';

test('the root has a large title and no way back', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();
  await expect(stack.locator('.lg-largetitle :is(h1,h2,h3,h4,h5,h6)')).toHaveText('设置');
  expect(await stack.locator('.lg-stack-back').count(), 'the bottom of the stack offers a way out of it').toBe(0);
});

test('pushing names the destination, not the direction', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();
  await stack.getByRole('button', { name: '通用' }).click();

  const back = stack.locator('.lg-stack-back');
  await expect(back).toBeVisible();
  // Visible: where you are going. Spoken: that, plus which way.
  await expect(back.locator('.lg-stack-back-title')).toHaveText('设置');
  await expect(back).toHaveAttribute('aria-label', '返回 设置');

  // And the screen you pushed into starts compact — the back button already names the origin.
  expect(await stack.locator('.lg-largetitle').count()).toBe(0);
  await expect(stack.locator('.lg-navbar-title')).toHaveText('通用');
});

test('the back button follows the stack down and back up', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();

  await stack.getByRole('button', { name: '通用' }).click();
  await stack.getByRole('button', { name: '软件更新' }).click();
  await expect(stack.locator('.lg-stack-back-title')).toHaveText('通用');
  await expect(stack.getByText('当前深度：3')).toBeVisible();

  await stack.locator('.lg-stack-back').click();
  await expect(stack.locator('.lg-stack-back-title')).toHaveText('设置');
  await stack.locator('.lg-stack-back').click();
  expect(await stack.locator('.lg-stack-back').count()).toBe(0);
  await expect(stack.locator('.lg-largetitle :is(h1,h2,h3,h4,h5,h6)')).toHaveText('设置');
});

test('popToRoot goes all the way in one step', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();
  await stack.getByRole('button', { name: '通用' }).click();
  await stack.getByRole('button', { name: '储存空间' }).click();
  await stack.getByRole('button', { name: '回到最上层' }).click();
  await expect(stack.locator('.lg-largetitle :is(h1,h2,h3,h4,h5,h6)')).toHaveText('设置');
});

test('focus moves to the new screen, not left on a row that no longer exists', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();
  await stack.getByRole('button', { name: '辅助功能' }).click();

  const landed = await page.evaluate(() => {
    const active = document.activeElement;
    return { tag: active?.tagName, inStack: !!active?.closest('#stack-demo'), cls: active?.className };
  });
  expect(landed.tag).toBe('MAIN');
  expect(landed.inStack).toBe(true);
  expect(landed.cls).toContain('lg-stack-screen');
});

test('each screen brings its own trailing controls', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator('#stack-trailing').locator('.lg-stack');
  await stack.scrollIntoViewIfNeeded();
  await expect(stack.locator('.lg-navbar-trailing')).toHaveText('编辑');
  await stack.getByRole('button', { name: '发票' }).click();
  await expect(stack.locator('.lg-navbar-trailing')).toHaveText('回复');
});

test('the chevron form keeps the readable name for anyone who cannot see it', async ({ page }) => {
  await page.goto(PAGE);
  const stack = page.locator('#stack-chevron').locator('.lg-stack');
  await stack.scrollIntoViewIfNeeded();
  await stack.getByRole('button', { name: '进入下一页' }).click();
  const back = stack.locator('.lg-stack-back');
  expect(await back.locator('.lg-stack-back-title').count(), 'the title is drawn after all').toBe(0);
  await expect(back).toHaveAttribute('aria-label', '返回 一个名字非常非常长的页面');
});

test('reduced motion drops the slide but keeps the change legible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PAGE);
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();
  await stack.getByRole('button', { name: '通用' }).click();
  const screen = stack.locator('.lg-stack-screen');
  await expect(screen).toHaveAttribute('data-direction', 'none');
  // A fade is still an animation; what goes is the direction.
  const name = await screen.evaluate(node => getComputedStyle(node).animationName);
  expect(name).toBe('lg-stack-fade');
});

test('the back chevron points the other way in RTL', async ({ page }) => {
  await page.goto(PAGE);
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
  const stack = page.locator(STACK);
  await stack.scrollIntoViewIfNeeded();
  await stack.getByRole('button', { name: '通用' }).click();
  const transform = await stack.locator('.lg-stack-back-chevron').evaluate(node => getComputedStyle(node).transform);
  // The library's chevron already points forward; LTR mirrors it, RTL leaves it alone.
  expect(transform).toBe('none');
});
