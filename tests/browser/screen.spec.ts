import { test, expect } from '@playwright/test';

/**
 * `Screen` is where three layout rules live instead of being re-derived per application:
 * content runs under the bars, the safe-area insets go on the bars rather than on the content,
 * and there is exactly one scroll edge effect per view.
 *
 * The documentation site is the first caller, and it is also the evidence the container was
 * needed: the review of the compact outline found that the site had no `ScrollEdge` anywhere,
 * so its toolbar floated over whatever scrolled past it with nothing between them.
 */

test('the site has a scroll edge, and exactly one', async ({ page }) => {
  await page.goto('/#/components/button');
  const edges = page.locator('.lg-scroll-edge');
  expect(await edges.count(), 'more than one dissolve over the same boundary').toBe(1);
});

test('it is inert until the content actually passes under the bar', async ({ page }) => {
  await page.goto('/#/components/button');
  const edge = page.locator('.lg-scroll-edge');
  await expect(edge).toHaveAttribute('data-active', 'false');

  // Over the content: a wheel at (0,0) lands on the sidebar, which scrolls itself.
  await page.mouse.move(900, 500);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  await expect(edge, 'the page scrolled and the edge never woke up').toHaveAttribute('data-active', 'true');

  await page.mouse.wheel(0, -900);
  await page.waitForTimeout(300);
  await expect(edge).toHaveAttribute('data-active', 'false');
});

test('the bar is pinned and the content is not hidden behind it', async ({ page }) => {
  await page.goto('/#/components/button');
  const bar = page.locator('.lg-screen-bar[data-edge="top"]');
  const before = (await bar.boundingBox())!;
  await page.mouse.move(900, 500);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(300);
  const after = (await bar.boundingBox())!;
  expect(Math.abs(after.y - before.y), 'the bar scrolled away with the content').toBeLessThan(2);

  // The content starts below the bar rather than underneath it at rest.
  await page.mouse.wheel(0, -1200);
  await page.waitForTimeout(300);
  const heading = (await page.locator('#main h1').first().boundingBox())!;
  expect(heading.y).toBeGreaterThanOrEqual(before.y + before.height - 1);
});

/**
 * The reservation is the measured bar height, not a number written down once: a bar is as tall
 * as its contents, and its contents grow with the text size. A hard-coded value is wrong for
 * everyone who is not using the default.
 */
test('the reserved height is measured, and follows the text size', async ({ page }) => {
  await page.goto('/#/components/button');
  const read = () => page.locator('.lg-screen').evaluate(node =>
    parseFloat(getComputedStyle(node).getPropertyValue('--lg-screen-top')));
  const measured = () => page.locator('.lg-screen-bar[data-edge="top"]').evaluate(node => node.getBoundingClientRect().height);

  const normal = await read();
  expect(normal).toBeGreaterThan(40);
  expect(Math.abs(normal - await measured())).toBeLessThan(2);

  await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; });
  await page.waitForTimeout(400);
  const large = await read();
  expect(Math.abs(large - await measured()), 'the reservation stopped tracking the bar').toBeLessThan(2);
});

test('nothing overflows sideways at either size class', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/components/button');
    await page.waitForTimeout(200);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflows, `horizontal overflow at ${width}px`).toBe(false);
  }
});

test('the compact outline sticks below the bar, not under it', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/#/components/button');
  const outline = page.locator('.outline-compact');
  await expect(outline).toBeVisible();

  await page.mouse.move(600, 500);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(300);
  const bar = (await page.locator('.lg-screen-bar[data-edge="top"]').boundingBox())!;
  const box = (await outline.boundingBox())!;
  expect(box.y, 'the outline slid under the app bar').toBeGreaterThanOrEqual(bar.y + bar.height - 2);
});
