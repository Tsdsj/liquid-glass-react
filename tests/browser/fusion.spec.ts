import { test, expect } from '@playwright/test';

const sized = (blobs: { width: string }[]) => blobs.filter(b => parseFloat(b.width) > .5).length;
/** Runs in the page: the blob rects the fusion layer wrote this frame. */
const read = (root: Element) => Array.from(root.querySelectorAll('.lg-fusion-blob')).map(b => ({
  width: (b as HTMLElement).style.width,
  height: (b as HTMLElement).style.height,
  transform: (b as HTMLElement).style.transform,
}));

test('shared surfaces expose a decorative, non-interactive fusion layer', async ({ page }) => {
  await page.goto('/#/components/toolbar');
  const layer = page.locator('.demo-content .lg-toolbar-group .lg-fusion').first();
  await expect(layer).toHaveAttribute('aria-hidden', 'true');
  await expect(layer.locator('.lg-fusion-blob')).toHaveCount(3);
  expect(await layer.evaluate(x => getComputedStyle(x).pointerEvents)).toBe('none');
  expect(await layer.locator('.lg-fusion-goo').evaluate(x => getComputedStyle(x).filter)).toMatch(/^url\("#lg-fusion-/);
  // Idle: the goo pass is fully transparent, so no filter output is painted.
  expect(await layer.locator('.lg-fusion-goo').evaluate(x => getComputedStyle(x).opacity)).toBe('0');
});

test('pulling a shared button toward its neighbour fuses the two pills', async ({ page }, info) => {
  await page.goto('/#/components/toolbar');
  const group = page.locator('.demo-content .lg-toolbar-group').first();
  const first = group.getByRole('button', { name: '网格' });
  await first.scrollIntoViewIfNeeded();
  await first.hover();
  const box = (await first.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(box.x + box.width / 2 + i * 5, box.y + box.height / 2);
  await expect(group).toHaveAttribute('data-fusion', 'true');
  const blobs = await group.evaluate(read);
  expect(sized(blobs)).toBe(2);
  // The blobs overlap, which is what the goo filter turns into a single bridged shape.
  const bounds = blobs.filter(b => parseFloat(b.width) > .5).map(b => {
    const x = parseFloat(b.transform.replace(/.*translate\(([-\d.]+)px.*/, '$1'));
    return { left: x, right: x + parseFloat(b.width) };
  });
  expect(Math.min(bounds[0].right, bounds[1].right)).toBeGreaterThan(Math.max(bounds[0].left, bounds[1].left));
  // No doubled highlight: the pressed button hands its pill over to the fusion layer.
  expect(await first.evaluate(x => getComputedStyle(x).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  await info.attach('fusion-mid-drag', {
    body: await page.screenshot({ clip: { x: box.x - 40, y: box.y - 30, width: box.width + 220, height: box.height + 60 } }),
    contentType: 'image/png',
  });
  await page.screenshot({ path: 'reports/screenshots/fusion-mid-drag.png', clip: { x: box.x - 40, y: box.y - 30, width: box.width + 220, height: box.height + 60 } });
  await page.mouse.up();
  await expect(group).not.toHaveAttribute('data-fusion', 'true');
});

test('the segmented lens flows into the next slot and keeps radio semantics', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('.demo-content .lg-segmented-track');
  await track.scrollIntoViewIfNeeded();
  const week = (await track.getByText('周', { exact: true }).boundingBox())!;
  const month = (await track.getByText('月', { exact: true }).boundingBox())!;
  await page.mouse.move(week.x + week.width / 2, week.y + week.height / 2);
  await page.mouse.down();
  await page.mouse.move(month.x + month.width / 2, month.y + month.height / 2, { steps: 6 });
  await expect(track).toHaveAttribute('data-fusion', 'true');
  // The old slot leaves a collapsing droplet behind the moving lens.
  expect(sized(await track.evaluate(read))).toBeGreaterThanOrEqual(2);
  await page.mouse.up();
  await expect(page.getByRole('radio', { name: '月', exact: true })).toBeChecked();
  await expect(track.locator('.lg-selection-lens')).toHaveCount(1);
});

test('reduced motion removes the fusion layer entirely', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/components/toolbar');
  await expect(page.locator('.lg-fusion')).toHaveCount(0);
  const first = page.locator('.demo-content .lg-toolbar-group').first().getByRole('button', { name: '网格' });
  await first.scrollIntoViewIfNeeded();
  await first.hover();
  const box = (await first.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  // The plain pressed highlight still works when fusion is off.
  expect(await first.evaluate(x => getComputedStyle(x).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await page.mouse.up();
});
