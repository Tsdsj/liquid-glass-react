import { test, expect } from '@playwright/test';

/**
 * `docs/known-limitations.md` recorded that development Strict Mode had never been run, and
 * the 0.0.2 roadmap listed the consequence as a suspicion rather than a defect: Strict Mode
 * mounts, unmounts and remounts every effect, so an animation loop whose cleanup does not
 * cancel it would end up running twice, forever, with only one copy reachable to stop.
 *
 * The documentation site renders inside `<StrictMode>` and the dev server serves React's
 * development build, so this project is where that actually happens — the production bundle
 * does not double-invoke anything.
 *
 * The assertion is not "how many loops are there", which is unanswerable from outside. It is
 * that an idle page schedules no frames: a leaked loop keeps calling rAF forever, and one that
 * is properly cancelled leaves the page quiet. That catches a duplicate whatever the count.
 */

/** Frames scheduled over a window of wall-clock time, counted from inside the page. */
async function framesDuring(page: import('@playwright/test').Page, ms: number) {
  await page.evaluate(() => {
    const scope = window as unknown as { __raf: number; __orig?: typeof requestAnimationFrame };
    scope.__raf = 0;
    if (!scope.__orig) {
      scope.__orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = callback => { scope.__raf++; return scope.__orig!(callback); };
    }
  });
  await page.waitForTimeout(ms);
  return page.evaluate(() => (window as unknown as { __raf: number }).__raf);
}

test('the drag loop stops when the finger lifts, not one copy of it', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  await expect(track).toBeVisible();
  const box = (await track.boundingBox())!;

  // Hold and move, so the loop is definitely running.
  await page.mouse.move(box.x + 30, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(box.x + 30 + i * 12, box.y + box.height / 2);
  const held = await framesDuring(page, 400);
  expect(held, 'no frames while dragging — the loop is not running at all').toBeGreaterThan(5);

  await page.mouse.up();
  // The stretch relaxes on a spring after release; give it time to settle before measuring.
  await page.waitForTimeout(1200);

  const idle = await framesDuring(page, 600);
  expect(idle, `an idle page scheduled ${idle} frames; a loop outlived its cleanup`).toBeLessThanOrEqual(2);
});

test('leaving the page takes its loops with it', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  await expect(track).toBeVisible();
  const box = (await track.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 4; i++) await page.mouse.move(box.x + 30 + i * 12, box.y + box.height / 2);
  await page.mouse.up();

  await page.goto('/#/components/button');
  await expect(page.locator('#main')).toBeVisible();
  await page.waitForTimeout(1200);

  const idle = await framesDuring(page, 600);
  expect(idle, `${idle} frames scheduled after navigating away`).toBeLessThanOrEqual(2);
});
