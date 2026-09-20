import { test, expect } from '@playwright/test';

/**
 * A system sheet is draggable by the whole panel, not only by the little handle at the top.
 * The rule the platform uses is about the scroll position rather than about which element was
 * touched: with the content scrolled to the top, pulling down moves the sheet; anywhere else,
 * the gesture belongs to the scroll view.
 *
 * Measured before the fix: dragging from the content area eight steps left
 * `--lg-sheet-offset` at exactly 50% — the panel did not move at all.
 */

/** The visible fraction, read the way the component writes it. */
async function offset(page: import('@playwright/test').Page) {
  return page.locator('.lg-sheet[open]').evaluate(node =>
    parseFloat(node.style.getPropertyValue('--lg-sheet-offset')));
}

async function openSheet(page: import('@playwright/test').Page, trigger = '打开面板') {
  await page.goto('/#/components/sheet');
  /* The touch metrics, because this is a touch gesture. A sheet that docks at heights and is
     dragged by its whole surface is the iPhone idiom; the desktop form is a card that falls
     from the top of the window and is not dragged at all. With the desktop metrics the rows in
     the long-list demo are short enough that the list no longer scrolls, and the test's own
     guard said so rather than quietly passing. */
  await page.evaluate(() => document.documentElement.setAttribute('data-lg-platform', 'touch'));
  await page.getByRole('button', { name: trigger }).first().click();
  const sheet = page.locator('.lg-sheet[open]');
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(400);
  return sheet;
}

/** A real pointer gesture: press, several moves so velocity is sampled, release. */
async function drag(page: import('@playwright/test').Page, from: { x: number; y: number }, dx: number, dy: number, steps = 8) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) await page.mouse.move(from.x + (dx * i) / steps, from.y + (dy * i) / steps);
  await page.mouse.up();
}

test('dragging the body of the sheet moves it, not just the grabber', async ({ page }) => {
  const sheet = await openSheet(page);
  expect(await offset(page)).toBeCloseTo(50, 0);

  const box = (await sheet.boundingBox())!;
  // Start well inside the content, below the title, nowhere near the handle.
  await drag(page, { x: box.x + box.width / 2, y: box.y + 140 }, 0, -220);
  await page.waitForTimeout(700);

  expect(await offset(page), 'the sheet never moved — only the grabber is draggable').toBeLessThan(40);
});

test('pulling down from the top of the content dismisses the sheet', async ({ page }) => {
  const sheet = await openSheet(page);
  const box = (await sheet.boundingBox())!;
  await drag(page, { x: box.x + box.width / 2, y: box.y + 140 }, 0, 400);
  await page.waitForTimeout(700);
  await expect(sheet).toBeHidden();
});

/**
 * The half of the rule that is easy to lose: once the content is scrolled, a downward drag is
 * the user scrolling back up, and a sheet that grabbed it would make its own content
 * unreachable.
 */
test('a scrolled sheet gives the gesture back to the scroll view', async ({ page }) => {
  const sheet = await openSheet(page, '打开长列表');
  const scroller = sheet.locator('.lg-sheet-scroll');

  const scrollable = await scroller.evaluate(node => node.scrollHeight - node.clientHeight);
  expect(scrollable, 'the long-list demo stopped being scrollable, so this proves nothing').toBeGreaterThan(60);

  await scroller.evaluate(node => { node.scrollTop = 50; });
  await page.waitForTimeout(100);

  const before = await offset(page);
  const box = (await sheet.boundingBox())!;
  await drag(page, { x: box.x + box.width / 2, y: box.y + 140 }, 0, 120);
  await page.waitForTimeout(700);

  await expect(sheet).toBeVisible();
  expect(Math.abs((await offset(page)) - before), 'the sheet moved while its content was scrolled').toBeLessThan(6);
});

test('a sideways drag is not a sheet gesture', async ({ page }) => {
  const sheet = await openSheet(page);
  const before = await offset(page);
  const box = (await sheet.boundingBox())!;
  await drag(page, { x: box.x + box.width / 2, y: box.y + 140 }, 200, 0);
  await page.waitForTimeout(500);
  expect(Math.abs((await offset(page)) - before)).toBeLessThan(6);
});

test('the grabber still works, and so does its keyboard path', async ({ page }) => {
  const sheet = await openSheet(page);
  await sheet.getByRole('slider').focus();
  await page.keyboard.press('ArrowUp');
  await expect(sheet).toHaveAttribute('data-full', 'true');
});

/**
 * Buttons inside the sheet must still be pressable. A body-wide drag handler that swallows
 * pointerdown would break every control in the panel, which is a worse bug than the one it fixes.
 */
test('controls inside the sheet still take a click', async ({ page }) => {
  const sheet = await openSheet(page);
  const done = sheet.getByRole('button', { name: '完成' });
  await expect(done).toBeVisible();
  await done.click();
  // "完成" closes this particular sheet — the point is that the click arrived at all.
  await expect(sheet).toBeHidden();
});
