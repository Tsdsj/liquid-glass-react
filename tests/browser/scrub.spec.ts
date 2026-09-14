import { test, expect } from '@playwright/test';

/**
 * The standard controls are drag targets, not just tap targets. A click-only
 * reimplementation is the most common tell that an interface is not Apple's, so
 * each of these asserts the drag itself — not merely that a click still works.
 */

test('pressing the selected segment and sliding moves the selection live', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const week = (await track.getByText('周', { exact: true }).boundingBox())!;
  const day = (await track.getByText('日', { exact: true }).boundingBox())!;

  await page.mouse.move(week.x + week.width / 2, week.y + week.height / 2);
  await page.mouse.down();
  await page.mouse.move(day.x + day.width / 2, day.y + day.height / 2, { steps: 6 });
  // Selection updates during the drag, not on release.
  await expect(page.locator('#segmented-basic').getByRole('radio', { name: '日', exact: true })).toBeChecked();
  const lens = track.locator('.lg-selection-lens');
  await expect(lens).toHaveAttribute('data-pulling', 'true');
  await page.mouse.up();
  await expect(lens).not.toHaveAttribute('data-pulling', 'true');
  await expect(page.locator('#segmented-basic').getByRole('radio', { name: '日', exact: true })).toBeChecked();
});

test('the segmented lens stretches along the drag axis', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  const week = (await track.getByText('周', { exact: true }).boundingBox())!;
  await page.mouse.move(week.x + week.width / 2, week.y + week.height / 2);
  await page.mouse.down();
  await page.mouse.move(week.x + week.width / 2 + 60, week.y + week.height / 2, { steps: 8 });
  const stretch = await lens.evaluate(node => parseFloat(node.style.getPropertyValue('--lg-stretch-x') || '1'));
  expect(stretch).toBeGreaterThan(1);
  await page.mouse.up();
});

test('a switch can be thrown and lands on the nearer side', async ({ page }) => {
  await page.goto('/#/components/switch');
  const toggle = page.getByRole('switch', { name: '低数据模式' });
  await expect(toggle).not.toBeChecked();
  const track = page.locator('#switch-basic .lg-switch').filter({ hasText: '低数据模式' }).locator('.lg-switch-track');
  const box = (await track.boundingBox())!;
  await page.mouse.move(box.x + 8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width + 28, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(toggle).toBeChecked();

  // Throwing it back the other way turns it off again — direction decides, not a toggle.
  await page.mouse.move(box.x + box.width - 8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - 28, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(toggle).not.toBeChecked();
});

test('a switch still flips on a plain click', async ({ page }) => {
  await page.goto('/#/components/switch');
  const toggle = page.getByRole('switch', { name: '低数据模式' });
  await toggle.click();
  await expect(toggle).toBeChecked();
});

test('the slider thumb tracks the pointer 1:1', async ({ page }) => {
  await page.goto('/#/components/slider');
  const slider = page.getByRole('slider', { name: '音量' });
  const rail = page.locator('#slider-basic .lg-slider-rail').first();
  const box = (await rail.boundingBox())!;
  const before = Number(await slider.inputValue());
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  const after = Number(await slider.inputValue());
  expect(after).toBeGreaterThan(before);
  expect(after).toBeGreaterThan(70);
});

test('reduced motion keeps selection working but removes the drag choreography', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const month = (await track.getByText('月', { exact: true }).boundingBox())!;
  await page.mouse.move(month.x + month.width / 2, month.y + month.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await expect(page.locator('#segmented-basic').getByRole('radio', { name: '月', exact: true })).toBeChecked();
  await expect(track.locator('.lg-selection-lens')).not.toHaveAttribute('data-pulling', 'true');
});
