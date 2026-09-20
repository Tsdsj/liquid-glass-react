import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * Things that go away are supposed to be seen going away.
 *
 * "Materialize, not fade" is usually read as a rule about arriving, and the library had taken
 * it that way: a toast sprang in and then stopped existing between two frames, a banner had no
 * entrance at all and no exit either, the outgoing tab panel was simply `hidden`. An interface
 * where things appear with care and vanish without it teaches the reader that disappearing is
 * an error state.
 *
 * Measured the same way as `interruptible.spec.ts`, and for the same reason: `getAnimations()`
 * answers "is anything actually running" without depending on catching a particular frame, and
 * it does not care whether the motion came from a transition, a keyframe animation or
 * `element.animate()`. Where the point is that the reader can *see* a difference, there is a
 * measurement in pixels next to it.
 *
 * Each of these came out of `motion-inventory.spec.ts` (`pnpm test:motion`), which reports and
 * does not assert. These are the guards; the sweep is free to move without breaking them.
 */

/** Everything running on this element or inside it, named. */
const running = (locator: Locator) => locator.evaluate(node => node.getAnimations({ subtree: true })
  .map(animation => {
    const css = animation as CSSTransition & CSSAnimation;
    return css.transitionProperty ? `transition:${css.transitionProperty}` : `animation:${css.animationName ?? '?'}`;
  }));

/**
 * Reduce Motion, as the operating system reports it.
 *
 * Not the `data-lg-motion` attribute: that is the stylesheet's half of the preference, and the
 * first version of these tests set it and then measured behaviour that lives in script. The
 * component reads the policy, the policy reads `prefers-reduced-motion`, so this is the input
 * that actually reaches both halves.
 */
const reduceMotion = (page: Page) => page.emulateMedia({ reducedMotion: 'reduce' });

/* =========================================================================================
 * Toast — the exit that was missing entirely.
 * ======================================================================================= */

test('a dismissed toast plays its exit before it is taken out of the tree', async ({ page }) => {
  await page.goto('/#/components/toast');
  await page.waitForTimeout(600);
  await page.locator('#toast-dismiss-demo button').click();
  const toast = page.locator('.lg-toast');
  await expect(toast).toBeVisible();

  await toast.locator('.lg-toast-dismiss').click();
  // Still there, and moving: the record is held in the list for the length of the exit.
  await expect(toast).toHaveAttribute('data-leaving', 'true');
  const moving = await running(toast);
  expect(moving, 'the toast was removed with nothing playing').not.toHaveLength(0);

  // Part-way through, rather than on the first frame — an exit is not over when it starts.
  await page.waitForTimeout(110);
  const faded = await toast.evaluate(node => Number(getComputedStyle(node).opacity));
  expect(faded, `the toast was still fully opaque at ${faded} halfway through leaving`).toBeLessThan(1);

  // And it does leave. An exit that never finishes is a toast that never goes away.
  await expect(toast).toHaveCount(0, { timeout: 2000 });
});

test('Escape closes the newest toast through the same exit', async ({ page }) => {
  await page.goto('/#/components/toast');
  await page.waitForTimeout(600);
  await page.locator('#toast-dismiss-demo button').click();
  await expect(page.locator('.lg-toast')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.locator('.lg-toast')).toHaveAttribute('data-leaving', 'true');
  await expect(page.locator('.lg-toast')).toHaveCount(0, { timeout: 2000 });
});

test('under reduced motion a dismissed toast goes at once, with no waiting', async ({ page }) => {
  await reduceMotion(page);
  await page.goto('/#/components/toast');
  await page.waitForTimeout(600);
  await page.locator('#toast-dismiss-demo button').click();
  const toast = page.locator('.lg-toast');
  await expect(toast).toBeVisible();

  const started = Date.now();
  await toast.locator('.lg-toast-dismiss').click();
  await expect(toast).toHaveCount(0);
  /* The whole point of the preference. Holding the element for the length of an animation
     that is not running would turn "no motion" into "the same interface, slower". */
  expect(Date.now() - started, 'the dismissal waited out an animation that was switched off')
    .toBeLessThan(180);
});

/* =========================================================================================
 * Banner — no entrance and no exit; now both.
 * ======================================================================================= */

test('a banner arrives with an entrance and leaves with an exit', async ({ page }) => {
  await page.goto('/#/components/banner');
  await page.waitForTimeout(600);
  const demo = page.locator('#banner-tones-demo');
  const banner = demo.locator('.lg-banner');

  await banner.locator('.lg-banner-dismiss').click();
  await expect(banner).toHaveAttribute('data-leaving', 'true');
  expect(await running(banner), 'the banner vanished with nothing playing').not.toHaveLength(0);
  // `onDismiss` is what removes it, and it is deliberately deferred until the exit is over.
  await expect(banner).toHaveCount(0, { timeout: 2000 });

  await demo.getByRole('button', { name: '再放一条' }).click();
  const returned = demo.locator('.lg-banner');
  await expect(returned).toBeVisible();
  expect(await running(returned), 'the banner appeared with nothing playing').not.toHaveLength(0);
});

/* =========================================================================================
 * Tab panels — the incoming one faded in, the outgoing one was cut.
 * ======================================================================================= */

test('the outgoing tab panel is still displayed while it fades', async ({ page }) => {
  await page.goto('/#/components/tabs');
  await page.waitForTimeout(600);
  const tabs = page.locator('#tabs-basic .lg-tabs').first();
  const panels = tabs.locator('.lg-tab-panel');
  const leaving = panels.first();

  await tabs.getByRole('tab').nth(1).click();
  const state = await leaving.evaluate(node => ({
    display: getComputedStyle(node).display,
    opacity: Number(getComputedStyle(node).opacity),
    moving: node.getAnimations().length,
  }));
  expect(state.display, 'the panel that was left went straight to display:none').not.toBe('none');
  expect(state.moving, 'the outgoing panel was cut rather than faded').toBeGreaterThan(0);

  // And it really does end up gone, rather than sitting invisibly on top of the new one.
  await page.waitForTimeout(500);
  await expect(leaving).toHaveCSS('display', 'none');
});

test('the two tab panels overlap instead of stacking, so the page does not double in height', async ({ page }) => {
  await page.goto('/#/components/tabs');
  await page.waitForTimeout(600);
  const tabs = page.locator('#tabs-basic .lg-tabs').first();
  const region = tabs.locator('.lg-tab-panels');

  const before = (await region.boundingBox())!.height;
  await tabs.getByRole('tab').nth(1).click();
  await page.waitForTimeout(60);
  const during = (await region.boundingBox())!.height;
  /* Both panels are displayed for the length of the swap. In normal flow that is the height of
     one plus the height of the other; in a single grid cell it is the taller of the two. */
  expect(during, `the panel area went from ${before} to ${during} mid-swap`).toBeLessThan(before * 1.8 + 10);
});

/* =========================================================================================
 * Badge — a number that changed between frames.
 * ======================================================================================= */

/**
 * Nudge the example's count knob up by one.
 *
 * Page-scoped, not scoped to `#badge-basic`: the adjustable controls live in the example's
 * side panel, which is a sibling of the example itself rather than inside it.
 */
async function bumpCount(page: Page) {
  const knob = page.getByRole('slider', { name: '数量' });
  await knob.focus();
  await knob.press('ArrowRight');
}

test('a badge whose count changes says so', async ({ page }) => {
  await page.goto('/#/components/badge');
  await page.waitForTimeout(600);
  const badge = page.locator('#badge-basic .lg-badge').first();
  await expect(badge).toHaveText('3');

  // Nothing is running while it just sits there.
  expect(await running(badge), 'the badge was animating before anything changed').toHaveLength(0);

  const watch = badge.evaluate(node => new Promise<number>(resolve => {
    const start = performance.now();
    const tick = () => {
      if (node.getAnimations().length) return resolve(performance.now() - start);
      if (performance.now() - start > 1500) return resolve(-1);
      requestAnimationFrame(tick);
    };
    tick();
  }));
  await bumpCount(page);
  expect(await watch, 'the count changed and nothing moved').toBeGreaterThanOrEqual(0);
  await expect(badge).toHaveText('4');
});

test('under reduced motion the badge changes number without moving', async ({ page }) => {
  await reduceMotion(page);
  await page.goto('/#/components/badge');
  await page.waitForTimeout(600);
  const badge = page.locator('#badge-basic .lg-badge').first();
  await bumpCount(page);
  await expect(badge).toHaveText('4');
  /* `element.animate()` is script, and the blanket `animation: none` in the stylesheet does
     not reach it — the component has to ask. This is the assertion that says it does. */
  expect(await running(badge), 'the bump ran with Reduce Motion on').toHaveLength(0);
});

/* =========================================================================================
 * Split view — a column that was there and then was not.
 * ======================================================================================= */

test('hiding the sidebar closes it rather than deleting it', async ({ page }) => {
  await page.goto('/#/components/split-view');
  await page.waitForTimeout(700);
  const demo = page.locator('#split-hide-demo');
  const sidebar = demo.locator('.lg-split-column[data-column="sidebar"]');
  const wide = (await sidebar.boundingBox())!.width;
  expect(wide, 'the sidebar was not showing to begin with').toBeGreaterThan(100);

  await demo.getByRole('button', { name: '收起侧栏' }).click();
  await page.waitForTimeout(70);
  const mid = await sidebar.evaluate(node => ({ width: node.getBoundingClientRect().width, moving: node.getAnimations().length }));
  expect(mid.moving, 'the sidebar was removed with nothing playing').toBeGreaterThan(0);
  expect(mid.width, `the sidebar went from ${wide} to ${mid.width} in one step`).toBeGreaterThan(0);
  expect(mid.width).toBeLessThan(wide);

  await expect(sidebar).toHaveCSS('visibility', 'hidden', { timeout: 2000 });
});

test('showing the inspector opens it from nothing', async ({ page }) => {
  await page.goto('/#/components/split-view');
  await page.waitForTimeout(700);
  const demo = page.locator('#split-hide-demo');
  const inspector = demo.locator('.lg-split-column[data-column="inspector"]');
  await expect(inspector).toHaveCSS('visibility', 'hidden');

  await demo.getByRole('button', { name: '显示检查器' }).click();
  await page.waitForTimeout(70);
  const mid = await inspector.evaluate(node => ({ width: node.getBoundingClientRect().width, moving: node.getAnimations().length }));
  expect(mid.moving, 'the inspector appeared with nothing playing').toBeGreaterThan(0);
  expect(mid.width, 'the inspector was already at its full width one frame in').toBeLessThan(290);

  await page.waitForTimeout(500);
  expect((await inspector.boundingBox())!.width).toBeGreaterThan(200);
});

test('a column closing does not re-wrap its own contents on the way out', async ({ page }) => {
  await page.goto('/#/components/split-view');
  await page.waitForTimeout(700);
  const demo = page.locator('#split-hide-demo');
  const inner = demo.locator('.lg-split-column[data-column="sidebar"] > .lg-split-inner');
  const before = (await inner.boundingBox())!.width;

  await demo.getByRole('button', { name: '收起侧栏' }).click();
  await page.waitForTimeout(70);
  const during = await inner.evaluate(node => node.getBoundingClientRect().width);
  /* The clip moves, the content does not. A sidebar whose text reflows on every frame of its
     own collapse reads as something going wrong, not as a column closing. */
  expect(during, `the contents narrowed from ${before} to ${during} while the column closed`)
    .toBeCloseTo(before, 0);
});

/* =========================================================================================
 * Morph: a panel grows out of the control that opened it, in the direction it opened.
 *
 * HIG, and the review checklist's wording: "menus / sheets / dialogs **morph out of the
 * control** that opened them". On the web the honest approximation is a scale from the
 * trigger's own position — which the anchoring code already computes — plus a small offset
 * towards the trigger, so the first frame is nearer the button than the last.
 *
 * Measured as the gap between the two boxes, because that is the thing being claimed. A
 * transform-matrix assertion would pass on a panel that grows out of the wrong edge.
 * ======================================================================================= */

/** Distance between the panel's near edge and the trigger's, in the axis they are stacked. */
async function gapToTrigger(page: Page, panel: string, trigger: Locator) {
  const box = (await trigger.boundingBox())!;
  return page.evaluate(({ selector, top, bottom }) => {
    const node = document.querySelector(selector);
    if (!node) return Number.NaN;
    const rect = node.getBoundingClientRect();
    // Whichever way round they are: positive is "apart", and smaller is "nearer the control".
    return rect.top >= bottom ? rect.top - bottom : top - rect.bottom;
  }, { selector: panel, top: box.y, bottom: box.y + box.height });
}

for (const direction of [
  { name: 'downwards', demo: '#popover-above-demo', button: '向下', placement: 'below' },
  { name: 'upwards', demo: '#popover-above-demo', button: '向上', placement: 'above' },
]) {
  test(`a popover that opens ${direction.name} starts nearer its trigger than it ends`, async ({ page }) => {
    await page.goto('/#/components/popover');
    await page.waitForTimeout(700);
    const demo = page.locator(direction.demo);
    const trigger = demo.getByRole('button', { name: direction.button });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    const panel = page.locator('.lg-popover:popover-open');
    await expect(panel).toHaveAttribute('data-placement', direction.placement);
    const early = await gapToTrigger(page, '.lg-popover:popover-open', trigger);
    await page.waitForTimeout(700);
    const settled = await gapToTrigger(page, '.lg-popover:popover-open', trigger);

    expect(early, `it opened ${early.toFixed(1)}px from the button and settled at ${settled.toFixed(1)}px — it grew away from it`)
      .toBeLessThan(settled);
  });
}

/* =========================================================================================
 * The gaps the inventory found once it stopped reporting things that were already right.
 * ======================================================================================= */

test('the colour well swatch ring arrives rather than appears', async ({ page }) => {
  await page.goto('/#/components/color-well');
  await page.waitForTimeout(700);
  // 绿 is selected in this example, so 红 is a swatch whose ring has to arrive.
  const target = page.locator('#color-swatches-demo .lg-color-well-quick').first();
  await target.scrollIntoViewIfNeeded();
  await target.click();
  /* The ring is a `box-shadow`, and `box-shadow` was not in the transition list — so the
     selection state of a colour control changed with nothing to see. */
  const moving = await running(target);
  expect(moving.join(' '), `nothing ran on the swatch: ${moving.join(' ') || '(none)'}`).toContain('box-shadow');
});

test('a disclosure summary reacts to the pointer over time, not between frames', async ({ page }) => {
  await page.goto('/#/components/disclosure');
  await page.waitForTimeout(700);
  const summary = page.locator('#main .lg-disclosure-summary').first();
  await summary.scrollIntoViewIfNeeded();
  const box = (await summary.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  expect(await running(summary), 'the hover background switched with no transition').not.toHaveLength(0);
});

test('the split view divider lights up over time', async ({ page }) => {
  await page.goto('/#/components/split-view');
  await page.waitForTimeout(700);
  const divider = page.locator('#main .lg-split-divider').first();
  await divider.scrollIntoViewIfNeeded();
  const box = (await divider.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  expect(await running(divider), 'the divider changed colour with no transition').not.toHaveLength(0);
});

test('hovering the segment that is already selected still does something', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(700);
  const selected = page.locator('#segmented-basic .lg-segment:has(input:checked)');
  const lens = page.locator('#segmented-basic .lg-selection-lens');
  await selected.scrollIntoViewIfNeeded();
  const box = (await selected.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  /* The capsule is the selected segment's feedback, so the answer lives on the lens rather
     than on the segment — but "no answer at all" is what the inventory found sixty-three
     times, on every page that has a segmented control. */
  expect(await running(lens), 'the selected segment is the one you can drag, and it said nothing')
    .not.toHaveLength(0);
});

test('under reduced motion none of these move', async ({ page }) => {
  await reduceMotion(page);
  await page.goto('/#/components/color-well');
  await page.waitForTimeout(700);
  const swatch = page.locator('#color-swatches-demo .lg-color-well-quick').first();
  await swatch.scrollIntoViewIfNeeded();
  await swatch.click();
  expect(await running(swatch), 'the swatch ring animated with Reduce Motion on').toHaveLength(0);

  await page.goto('/#/components/disclosure');
  await page.waitForTimeout(700);
  const summary = page.locator('#main .lg-disclosure-summary').first();
  await summary.scrollIntoViewIfNeeded();
  const box = (await summary.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  expect(await running(summary), 'the summary animated with Reduce Motion on').toHaveLength(0);
});

/**
 * The same question on the other three controls built around a selected item.
 *
 * All four are dragged by whatever is currently selected, and in all four the selected item
 * was the one that answered a hover with nothing — the unselected ones all had a rule and the
 * selected one fell through it. The answer lands on the capsule (or the dot), which is a
 * sibling of the thing under the pointer, so the assertion looks where the feedback is.
 */
for (const control of [
  { name: '页内标签', url: '/#/components/tabs', item: '#tabs-basic .lg-tab[aria-selected="true"]', feedback: '#tabs-basic .lg-selection-lens' },
  { name: '标签栏', url: '/#/components/tab-bar', item: '#main .lg-tab-link[aria-current="page"]', feedback: '#main .lg-tabbar .lg-selection-lens' },
  { name: '页码点', url: '/#/components/page-control', item: '#main .lg-page-dot[aria-selected="true"]', feedback: '#main .lg-page-dot[aria-selected="true"] > span' },
]) {
  test(`hovering the current ${control.name} answers the pointer`, async ({ page }) => {
    await page.goto(control.url);
    await page.waitForTimeout(700);
    const item = page.locator(control.item).first();
    await item.scrollIntoViewIfNeeded();
    const box = (await item.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    expect(await running(page.locator(control.feedback).first()), 'the current item said nothing')
      .not.toHaveLength(0);
  });
}

test('the colour well itself reacts to the pointer, not just its swatches', async ({ page }) => {
  await page.goto('/#/components/color-well');
  await page.waitForTimeout(700);
  const box = page.locator('#main .lg-color-well-box').first();
  await box.scrollIntoViewIfNeeded();
  const rect = (await box.boundingBox())!;
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  /* The pointer is over an invisible `<input type="color">`; the visible swatch is underneath
     it, and that is what has to move. */
  expect(await running(box), 'hovering the well did nothing').not.toHaveLength(0);
  await page.mouse.down();
  await page.waitForTimeout(30);
  const pressed = await box.locator('.lg-color-well-swatch').evaluate(node =>
    new DOMMatrix(getComputedStyle(node).transform).a);
  await page.mouse.up();
  expect(pressed, `the swatch was at ${pressed.toFixed(3)} while held`).toBeLessThan(1);
});

/* =========================================================================================
 * Menu bar — a press state that was only a colour.
 * ======================================================================================= */

/**
 * Found by the sweep, not by looking: the title *had* a press state, and it was 90ms of
 * background colour, which is over before it registers as a response to anything. Every other
 * pressable surface in this library moves under the finger. This one now does too.
 */
test('pressing a menu bar title moves it, not only its colour', async ({ page }) => {
  await page.goto('/#/components/menu-bar');
  const title = page.locator('#menubar-basic .lg-menubar-title').first();
  await title.scrollIntoViewIfNeeded();
  const box = (await title.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const moving = await running(title);
  expect(moving, 'nothing was playing while the title was held down').toContain('transition:transform');
  // Part-way in: the transition is read on the frame it starts, where it has not moved yet.
  await page.waitForTimeout(120);
  const scale = await title.evaluate(node => new DOMMatrix(getComputedStyle(node).transform).a);
  expect(scale, `the title was at ${scale} while held`).toBeLessThan(1);
  await page.mouse.up();
});

test('and it does not move at all under Reduce Motion', async ({ page }) => {
  await reduceMotion(page);
  await page.goto('/#/components/menu-bar');
  const title = page.locator('#menubar-basic .lg-menubar-title').first();
  await title.scrollIntoViewIfNeeded();
  const box = (await title.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  expect(await running(title)).toHaveLength(0);
  await page.mouse.up();
});
