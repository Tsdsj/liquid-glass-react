import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * Motion you can interrupt.
 *
 * Reported from a real browser: clicking quickly between the options of a draggable control
 * skips the animation and snaps to the target. It is not one component — every control built on
 * the selection lens does it, and so does the switch.
 *
 * The cause is one line of gesture plumbing. `pointerdown` immediately stamped
 * `data-pulling="true"` on whatever the gesture carries, and the stylesheet answers that
 * attribute by dropping `transform` from the transition list — which **cancels the transition
 * that is running**, resolving the element to its destination in that frame. The same frame's
 * offset calculation then measured the pointer against the lens's resting centre and wrote the
 * whole distance out as a shift, so a press on an option the lens was not on also teleported it
 * under the finger before the click had even happened.
 *
 * HIG, motion: "Let people cancel motion. As much as possible, don't make people wait for an
 * animation to complete before they can do anything." Cancelling means the motion **changes
 * course from where it is**. Cutting it to the end and starting again is the opposite — it is
 * the animation being skipped, which is what was reported.
 *
 * Two kinds of measurement here, deliberately. The transition-level ones are exact and do not
 * depend on catching a particular frame; the frame-by-frame one is the reader's own complaint,
 * stated in pixels. A step-by-step assertion would walk straight past a defect one frame wide.
 */

const centre = (box: { x: number; y: number; width: number; height: number }) =>
  [box.x + box.width / 2, box.y + box.height / 2] as const;

/**
 * How far into its transform transition each element is, in milliseconds.
 *
 * Empty means nothing is animating: either it finished, or something cancelled it. A cancelled
 * transition is removed from `getAnimations()`, which is exactly the event being ruled out.
 */
const gliding = (locator: Locator) => locator.evaluate(node => node.getAnimations()
  .filter(animation => (animation as CSSTransition).transitionProperty === 'transform')
  .map(animation => Math.round(Number(animation.currentTime ?? 0))));

/** Records one element's rendered translate along an axis, one sample per frame. */
async function startTrace(page: Page, selector: string, axis: 'x' | 'y', frames = 70) {
  await page.evaluate(({ selector, axis, frames }) => {
    const node = document.querySelector<HTMLElement>(selector)!;
    const store = window as unknown as { __trace: number[] };
    store.__trace = [];
    const tick = () => {
      const matrix = new DOMMatrix(getComputedStyle(node).transform);
      store.__trace.push(Math.round((axis === 'x' ? matrix.m41 : matrix.m42) * 10) / 10);
      if (store.__trace.length < frames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { selector, axis, frames });
}

const readTrace = (page: Page): Promise<number[]> =>
  page.evaluate(() => (window as unknown as { __trace: number[] }).__trace);

/** The largest distance the element covered between two consecutive frames. */
function biggestStep(frames: number[]) {
  let worst = 0, at = 0;
  for (let i = 1; i < frames.length; i++) {
    const step = Math.abs(frames[i] - frames[i - 1]);
    if (step > worst) { worst = step; at = i; }
  }
  return { worst, at };
}

/* =========================================================================================
 * 1. A press is not a grab.
 *
 * Pressing an option the lens is not on is a click. The lens belongs to the current selection
 * and stays there until the click resolves — it does not come to meet the finger.
 * ======================================================================================= */

const CONTROLS = [
  {
    name: '分段控件', url: '/#/components/segmented-control', axis: 'x' as const,
    scrollTo: undefined as string | undefined,
    lens: '#segmented-basic .lg-selection-lens',
    other: '#segmented-basic .lg-segment:not(:has(input:checked))',
  },
  {
    /* The expanded form of the tab bar, on its own page: the site keeps the bar in its capsule
       form and puts the areas in the band, so this is where the sidebar form lives now. It is
       partway down a long page, hence `scrollTo`. */
    name: '侧边栏', url: '/#/components/tab-bar', axis: 'y' as const,
    scrollTo: '#tabbar-sidebar-demo',
    lens: '#tabbar-sidebar-demo .lg-selection-lens',
    other: '#tabbar-sidebar-demo .lg-tab-link:not([aria-current="page"])',
  },
];

for (const control of CONTROLS) {
  test(`pressing an option it is not on leaves the ${control.name} lens where it is`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(control.url);
    if (control.scrollTo) await page.locator(control.scrollTo).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    const box = (await page.locator(control.other).first().boundingBox())!;
    await startTrace(page, control.lens, control.axis, 12);
    await page.mouse.move(...centre(box));
    await page.mouse.down();
    await page.waitForTimeout(200);
    await page.mouse.up();

    const frames = await readTrace(page);
    const moved = Math.max(...frames.map(value => Math.abs(value - frames[0])));
    /* Not "it never moves" — releasing selects, and the glide that follows is the whole point.
       This covers the press itself, before there is any selection to answer to. */
    expect(moved, `the lens moved ${moved.toFixed(1)}px while the finger was merely down: ${frames.join(' ')}`)
      .toBeLessThan(2);
  });
}

/**
 * And a drag that began off the capsule stays off it.
 *
 * The threshold alone is not enough here. Once the pointer moves, the drag is recognised and —
 * without a rule about *what* was grabbed — the capsule is carried away from the slot it belongs
 * to while the selection it is supposed to be indicating is somewhere else entirely. It springs
 * back on release, so it looks like the control briefly lost track of itself.
 */
test('a drag that did not start on the capsule moves the selection, not the capsule', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(900);
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  // 周 is selected and its slot is 45; 日's is 0.
  const day = (await track.getByText('日', { exact: true }).boundingBox())!;

  await page.mouse.move(...centre(day));
  await page.mouse.down();
  // Past the threshold, but not out of the segment that was pressed.
  await page.mouse.move(day.x + day.width / 2 + 7, day.y + day.height / 2, { steps: 2 });
  await page.waitForTimeout(500);
  const at = await lens.evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m41);
  await page.mouse.up();

  await expect(page.locator('#segmented-basic').getByRole('radio', { name: '日', exact: true })).toBeChecked();
  expect(at, `the capsule is at ${at.toFixed(1)}, and 日 — which is what is selected — is at 0`)
    .toBeLessThan(6);
});

/* =========================================================================================
 * 2. A press does not cut short the glide that is already running.
 * ======================================================================================= */

for (const control of CONTROLS) {
  test(`pressing does not cancel the ${control.name} glide`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(control.url);
    if (control.scrollTo) await page.locator(control.scrollTo).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    const lens = page.locator(control.lens);
    const other = (await page.locator(control.other).first().boundingBox())!;
    const another = (await page.locator(control.other).last().boundingBox())!;

    // Start a glide, then press elsewhere while it is still running.
    await page.mouse.click(...centre(other));
    await page.waitForTimeout(90);
    const before = await gliding(lens);
    expect(before, 'nothing was gliding, so this measured nothing').toHaveLength(1);

    await page.mouse.move(...centre(another));
    await page.mouse.down();
    await page.waitForTimeout(80);
    const during = await gliding(lens);
    await page.mouse.up();

    expect(during, `the press cancelled the transition outright (it was ${before[0]}ms in)`).toHaveLength(1);
    expect(during[0], 'the transition restarted from zero instead of carrying on')
      .toBeGreaterThan(before[0]);
  });
}

test('pressing does not cancel the switch thumb mid-travel', async ({ page }) => {
  await page.goto('/#/components/switch');
  await page.waitForTimeout(900);
  const control = page.locator('#switch-basic .lg-switch').first();
  const thumb = control.locator('.lg-switch-thumb');
  const box = (await control.locator('.lg-switch-track').boundingBox())!;

  await control.click();
  await page.waitForTimeout(90);
  const before = await gliding(thumb);
  expect(before, 'the thumb was not travelling').toHaveLength(1);

  // Down only, and at the end it is already heading for: a release would toggle it back.
  await page.mouse.move(box.x + 4, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(80);
  const during = await gliding(thumb);
  await page.mouse.up();

  expect(during, 'the press cancelled the thumb transition').toHaveLength(1);
  expect(during[0]).toBeGreaterThan(before[0]);
});

/* =========================================================================================
 * 3. The reported case, in pixels: clicking quickly from one option to another.
 * ======================================================================================= */

test('a second click mid-glide changes course instead of restarting from the destination', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(900);
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = '#segmented-basic .lg-selection-lens';
  // Slots are 日 0, 周 45, 月 90, and 周 starts selected — the ends are the longest journey.
  const month = (await track.getByText('月', { exact: true }).boundingBox())!;
  const day = (await track.getByText('日', { exact: true }).boundingBox())!;

  // One uninterrupted glide across the same distance, so the allowance below is this control's
  // own top speed rather than a number picked out of the air.
  await page.mouse.click(...centre(month));
  await page.waitForTimeout(900);
  await startTrace(page, lens, 'x');
  await page.mouse.click(...centre(day));
  await page.waitForTimeout(1200);
  const clean = biggestStep(await readTrace(page));
  expect(clean.worst, 'the lens did not glide at all, so there is nothing to interrupt').toBeGreaterThan(1);

  // The same journey, turned round three frames in.
  await page.mouse.click(...centre(month));
  await page.waitForTimeout(900);
  await startTrace(page, lens, 'x', 90);
  await page.mouse.click(...centre(day));
  await page.waitForTimeout(60);
  await page.mouse.click(...centre(month));
  await page.waitForTimeout(1400);

  const frames = await readTrace(page);
  // It really did turn round: the recording holds both directions.
  const forward = frames.some((value, i) => i > 0 && value - frames[i - 1] > .5);
  const back = frames.some((value, i) => i > 0 && value - frames[i - 1] < -.5);
  expect(forward && back, `the lens never reversed, so this measured nothing: ${frames.join(' ')}`).toBe(true);

  const { worst, at } = biggestStep(frames);
  expect(worst, `a ${worst.toFixed(1)}px step at frame ${at}, against ${clean.worst.toFixed(1)}px for one uninterrupted glide: ${frames.join(' ')}`)
    .toBeLessThan(clean.worst + 2);
});

/* =========================================================================================
 * 4. And the carry itself still works, which is the thing all of the above must not cost.
 * ======================================================================================= */

test('pressing the selected segment still carries the lens with the pointer', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(900);
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  const week = (await track.getByText('周', { exact: true }).boundingBox())!;

  await page.mouse.move(...centre(week));
  await page.mouse.down();
  await page.mouse.move(week.x + week.width / 2 + 30, week.y + week.height / 2, { steps: 6 });
  await page.waitForTimeout(80);
  await expect(lens).toHaveAttribute('data-pulling', 'true');
  const carried = await lens.evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m41);
  await page.mouse.up();
  // 45 is 周's slot; the threshold the press has to clear first is worth a couple of pixels.
  expect(carried, `the lens only reached ${carried.toFixed(1)} for 30px of travel`).toBeGreaterThan(45 + 20);
});
