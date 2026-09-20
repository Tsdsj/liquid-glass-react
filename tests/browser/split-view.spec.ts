import { test, expect } from '@playwright/test';

/**
 * Three columns are easy. What makes them a split view is the divider you can move without a
 * pointer, the one title for the whole view, and the fact that on a phone it becomes a stack
 * rather than three columns squeezed to nothing.
 */

const PAGE = '/#/components/split-view';
const SPLIT = '#split-demo .lg-split';

test('the columns sit side by side at a regular width', async ({ page }) => {
  await page.goto(PAGE);
  const split = page.locator(SPLIT);
  await split.scrollIntoViewIfNeeded();
  const columns = await split.locator('.lg-split-column').evaluateAll(nodes =>
    nodes.map(node => ({ column: node.getAttribute('data-column'), left: Math.round(node.getBoundingClientRect().left) })));
  expect(columns.map(entry => entry.column)).toEqual(['sidebar', 'content']);
  expect(columns[1].left).toBeGreaterThan(columns[0].left);
});

test('the divider is always visible and is a real separator', async ({ page }) => {
  await page.goto(PAGE);
  const divider = page.locator(`${SPLIT} .lg-split-divider`);
  await divider.scrollIntoViewIfNeeded();
  await expect(divider).toBeVisible();
  await expect(divider).toHaveAttribute('role', 'separator');
  await expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  await expect(divider).toHaveAttribute('aria-label', '调整侧栏宽度');

  const line = await divider.evaluate(node => ({
    width: node.getBoundingClientRect().width,
    colour: getComputedStyle(node).backgroundColor,
  }));
  // A hairline, and one that is actually painted.
  expect(line.width).toBeLessThan(3);
  expect(line.colour).not.toBe('rgba(0, 0, 0, 0)');
});

test('dragging the divider resizes the sidebar', async ({ page }) => {
  await page.goto(PAGE);
  const split = page.locator(SPLIT);
  await split.scrollIntoViewIfNeeded();
  const sidebar = split.locator('.lg-split-column[data-column="sidebar"]');
  const before = (await sidebar.boundingBox())!.width;

  const divider = (await split.locator('.lg-split-divider').boundingBox())!;
  await page.mouse.move(divider.x + divider.width / 2, divider.y + divider.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(divider.x + (60 * i) / 6, divider.y + divider.height / 2);
  await page.mouse.up();

  const after = (await sidebar.boundingBox())!.width;
  expect(after - before, `the sidebar went from ${Math.round(before)} to ${Math.round(after)}`).toBeGreaterThan(40);
});

/**
 * The half that is usually missing. A column width that can only be set by dragging is a
 * column width a keyboard user cannot set at all.
 */
test('the keyboard resizes it too, and cannot push it out of range', async ({ page }) => {
  await page.goto(PAGE);
  const split = page.locator(SPLIT);
  await split.scrollIntoViewIfNeeded();
  const divider = split.locator('.lg-split-divider');
  const sidebar = split.locator('.lg-split-column[data-column="sidebar"]');

  await divider.focus();
  const before = (await sidebar.boundingBox())!.width;
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect((await sidebar.boundingBox())!.width).toBeGreaterThan(before);

  // Shift is the bigger step, and the ends are clamped rather than unbounded.
  await page.keyboard.press('End');
  const widest = (await sidebar.boundingBox())!.width;
  await page.keyboard.press('ArrowRight');
  expect((await sidebar.boundingBox())!.width, 'End was not the end').toBe(widest);
  await expect(divider).toHaveAttribute('aria-valuenow', String(Math.round(widest)));

  await page.keyboard.press('Home');
  const narrowest = (await sidebar.boundingBox())!.width;
  expect(narrowest).toBeLessThan(widest);
  await page.keyboard.press('ArrowLeft');
  expect((await sidebar.boundingBox())!.width, 'Home was not the start').toBe(narrowest);
});

/**
 * What is announced is what is drawn.
 *
 * The range is declared in pixels, and a view can be narrower than its own maximum. Announcing
 * 400 while the column renders at 304 tells a screen-reader user a width nobody has; the range
 * has to be bounded by the room there actually is. Measured in a deliberately narrow view.
 */
test('the reported width is the width on screen, even in a view too narrow for the maximum', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto(PAGE);
  const split = page.locator(SPLIT);
  await split.scrollIntoViewIfNeeded();
  // Squeeze the view below sidebar-max + content-minimum.
  await split.evaluate(node => { (node as HTMLElement).style.width = '420px'; });
  await page.waitForTimeout(200);

  const divider = split.locator('.lg-split-divider');
  const sidebar = split.locator('.lg-split-column[data-column="sidebar"]');
  await divider.focus();
  await page.keyboard.press('End');
  await page.waitForTimeout(150);

  const drawn = Math.round((await sidebar.boundingBox())!.width);
  await expect(divider).toHaveAttribute('aria-valuenow', String(drawn));
  const max = Number(await divider.getAttribute('aria-valuemax'));
  expect(max, `a 420px view still claims a ${max}px maximum`).toBeLessThan(400);
  // And the content column still exists, rather than being squeezed out of the view.
  const content = (await split.locator('.lg-split-column[data-column="content"]').boundingBox())!;
  expect(content.width).toBeGreaterThan(100);
});

test('the inspector is the trailing column and is not glass', async ({ page }) => {
  await page.goto(PAGE);
  const split = page.locator('#split-inspector-demo .lg-split');
  await split.scrollIntoViewIfNeeded();
  const columns = await split.locator('.lg-split-column').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute('data-column')));
  expect(columns).toEqual(['sidebar', 'content', 'inspector']);

  // Content layer: no glass surface anywhere in it, because it is part of the window.
  const inspector = split.locator('.lg-inspector');
  await expect(inspector).toBeVisible();
  expect(await inspector.evaluate(node => node.classList.contains('lg-root'))).toBe(false);
  expect(await inspector.evaluate(node => node.querySelectorAll(':scope > .lg-decoration').length)).toBe(0);
});

/* --------------------------------------------------------------------------------------- */

test.describe('at a compact width', () => {
  test.use({ viewport: { width: 420, height: 900 } });

  /**
   * Columns cannot sit side by side here, so it becomes a stack — the way NavigationSplitView
   * degrades on iPhone. The sidebar is the root screen and the selection is pushed on top,
   * which means Back leads to the list: the relationship the columns were expressing.
   */
  test('it collapses into a stack rather than squeezing the columns', async ({ page }) => {
    await page.goto(PAGE);
    const split = page.locator(SPLIT);
    await split.scrollIntoViewIfNeeded();

    expect(await split.locator('.lg-split-column').count(), 'still laying out columns on a phone').toBe(0);
    await expect(split.locator('.lg-stack-screen')).toBeVisible();
    // And the back button leads to the sidebar, named by the view's one title.
    await expect(split.locator('.lg-stack-back-title')).toHaveText('邮件');
  });

  test('the one title belongs to the view, not to a column', async ({ page }) => {
    await page.goto(PAGE);
    const split = page.locator(SPLIT);
    await split.scrollIntoViewIfNeeded();
    await split.locator('.lg-stack-back').click();
    // Back at the root, the title is the view's.
    await expect(split.locator('.lg-largetitle :is(h1,h2,h3,h4,h5,h6)')).toHaveText('邮件');
  });
});
