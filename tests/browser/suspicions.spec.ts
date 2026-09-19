import { test, expect } from '@playwright/test';

/**
 * The six suspicions from the 0.0.2 survey, each written as the measurement that would show
 * it if it were real.
 *
 * A suspicion is not a defect. These were written from reading code, which is how you find
 * places a bug *could* be, not places one *is*. Each of these either reproduces — and then it
 * gets fixed and this becomes the regression test — or it does not, and the test stays anyway
 * as the thing that says so, because "we checked and it was fine" is worth exactly as much as
 * the measurement behind it.
 */

/* ---------------------------------------------------------------------------------------
 * 1. The selection lens across the 1024 boundary.
 *
 * `useSelectionLens` suppresses its first frame while `placed` is false. Switching between the
 * tab bar and the sidebar changes the lens from horizontal to vertical coordinates and does
 * not reset that flag, so the suspicion was a visible jump across the layout change.
 * ------------------------------------------------------------------------------------- */
test('the selection lens does not fly across the layout switch', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto('/#/components/button');
  await page.waitForTimeout(400);

  const lens = page.locator('.lg-tabbar .lg-selection-lens').first();
  await expect(lens).toBeVisible();

  /* Sample every frame across the change rather than before and after: a single frame in the
     wrong place is exactly what this is looking for, and it is gone by the next one. */
  const samples: { x: number; y: number }[] = [];
  const collect = page.evaluate(() => new Promise<{ x: number; y: number }[]>(resolve => {
    const out: { x: number; y: number }[] = [];
    let frames = 0;
    const tick = () => {
      const node = document.querySelector('.lg-tabbar .lg-selection-lens');
      if (node) { const box = node.getBoundingClientRect(); out.push({ x: box.x, y: box.y }); }
      if (++frames < 40) requestAnimationFrame(tick); else resolve(out);
    };
    requestAnimationFrame(tick);
  }));
  await page.setViewportSize({ width: 1040, height: 900 });
  samples.push(...await collect);

  expect(samples.length).toBeGreaterThan(10);
  // Nothing may leave the window, in either direction, at any frame.
  const escaped = samples.filter(point => point.x < -80 || point.x > 1040 + 80 || point.y < -80 || point.y > 980);
  expect(escaped, `the lens left the window on ${escaped.length} frames: ${JSON.stringify(escaped.slice(0, 3))}`).toHaveLength(0);
});

/* ---------------------------------------------------------------------------------------
 * 2. The slider in RTL.
 *
 * `--lg-progress` drives the fill. Whether it lands on a logical or a physical property
 * decides whether an RTL slider fills from the correct end, and the two are indistinguishable
 * until you look.
 * ------------------------------------------------------------------------------------- */
test('an RTL slider is the mirror of an LTR one', async ({ page }) => {
  /**
   * Measured as a mirror rather than against computed positions. The first version of this
   * test asserted where the fill and the knob *should* be and got the arithmetic wrong — it
   * compared against the rail while the track is inset 13px inside it — and reported a defect
   * that was not there. Mirror symmetry needs no arithmetic and cannot be wrong about insets:
   * whatever the geometry is, RTL has to be its reflection.
   */
  const measure = async (direction: 'ltr' | 'rtl') => {
    await page.goto('/#/components/slider');
    await page.evaluate(dir => { document.documentElement.dir = dir; }, direction);
    await page.waitForTimeout(300);
    const slider = page.locator('#slider-basic .lg-slider').first();
    await slider.scrollIntoViewIfNeeded();
    await slider.locator('input[type="range"]').evaluate(node => {
      const input = node as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(input, '80');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(400);
    return slider.evaluate(node => {
      const box = (selector: string) => node.querySelector(selector)!.getBoundingClientRect();
      const track = box('.lg-slider-track'), fill = box('.lg-slider-fill'), knob = box('.lg-slider-lens');
      return {
        fillWidth: fill.width,
        // Where the fill and the knob sit, as a fraction of the track, from the *leading* edge.
        fillLead: Math.abs((getComputedStyle(node).direction === 'rtl' ? track.right - fill.right : fill.left - track.left)) / track.width,
        knobLead: Math.abs((getComputedStyle(node).direction === 'rtl'
          ? track.right - (knob.left + knob.width / 2)
          : (knob.left + knob.width / 2) - track.left)) / track.width,
      };
    });
  };

  const ltr = await measure('ltr');
  const rtl = await measure('rtl');

  // The fill starts at the leading edge in both, and is the same length.
  expect(rtl.fillLead, 'the RTL fill does not start at the leading edge').toBeLessThan(0.02);
  expect(ltr.fillLead).toBeLessThan(0.02);
  expect(Math.abs(rtl.fillWidth - ltr.fillWidth)).toBeLessThan(2);
  // And the knob is the same distance along, measured from the leading edge in each.
  expect(Math.abs(rtl.knobLead - ltr.knobLead),
    `knob at ${rtl.knobLead.toFixed(3)} of the track in RTL, ${ltr.knobLead.toFixed(3)} in LTR`).toBeLessThan(0.03);
});

/* ---------------------------------------------------------------------------------------
 * 3. The sheet title against the grabber at AX5.
 *
 * The title is a large-title variant. At the largest accessibility size it runs to several
 * lines, and the suspicion was that it grows upwards into the drag handle.
 * ------------------------------------------------------------------------------------- */
test('the sheet title clears the grabber at the largest text size', async ({ page }) => {
  await page.goto('/#/components/sheet');
  await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; });
  await page.getByRole('button', { name: '打开面板' }).first().click();
  const sheet = page.locator('.lg-sheet[open]');
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(500);

  const boxes = await sheet.evaluate(node => ({
    grabber: node.querySelector('.lg-sheet-grabber')!.getBoundingClientRect().toJSON(),
    title: node.querySelector('.lg-overlay-title')!.getBoundingClientRect().toJSON(),
  }));
  expect(boxes.title.top, `title top ${Math.round(boxes.title.top)} vs grabber bottom ${Math.round(boxes.grabber.bottom)}`)
    .toBeGreaterThanOrEqual(boxes.grabber.bottom - 1);
});

/* ---------------------------------------------------------------------------------------
 * 4. The material through a theme change.
 *
 * `--lg-backdrop` is a transitioned property and a theme change rewrites the tokens behind
 * it, so the suspicion was a white flash as the two interpolate through an intermediate value.
 * ------------------------------------------------------------------------------------- */
test('switching appearance does not flash the glass white', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(400);

  const samples = await page.evaluate(() => new Promise<string[]>(resolve => {
    const tint = document.querySelector('.lg-tabbar-group .lg-tint')!;
    const out: string[] = [];
    let frames = 0;
    const tick = () => {
      out.push(getComputedStyle(tint).backgroundColor);
      if (++frames < 30) requestAnimationFrame(tick); else resolve(out);
    };
    requestAnimationFrame(tick);
    // Flip the theme the way the site does, one frame in.
    requestAnimationFrame(() => {
      document.documentElement.dataset.appTheme = 'dark';
      document.documentElement.setAttribute('data-lg-theme', 'dark');
    });
  }));

  /* The failure mode is a frame lighter than both endpoints. Parse the alpha-weighted
     luminance and check nothing overshoots what the light theme itself was. */
  const luminance = (colour: string) => {
    const parts = colour.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
    const [r, g, b] = parts;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };
  const values = samples.map(luminance);
  const ceiling = Math.max(values[0], values[values.length - 1]) + 0.08;
  const overshoot = values.filter(value => value > ceiling);
  expect(overshoot, `${overshoot.length} frames brighter than both ends: ${overshoot.slice(0, 3).join(', ')}`).toHaveLength(0);
});

/* ---------------------------------------------------------------------------------------
 * 5. The fusion layer under forced colours.
 *
 * alpha.5 added a switch that stops the fusion rAF loop under Increase Contrast. Forced
 * colours is a different media query and was never tested, so the suspicion was a loop still
 * running on a display that cannot show what it draws.
 * ------------------------------------------------------------------------------------- */
test('forced colours stop the fusion layer, not just hide it', async ({ page }) => {
  /**
   * The first version of this counted every animation frame while a button was held and read
   * 33 as a leak. It was measuring the wrong loop. The frames belong to `usePull`, which is
   * the press deformation, and that is *supposed* to run here: forced colours is a statement
   * about colour, not about motion, and a control that stopped responding to a press because
   * the palette changed would be a different bug. Reduce Motion is the setting that stops it,
   * and it already does.
   *
   * The claim under test is about the fusion layer specifically, so this asks about the
   * fusion layer specifically: it is not rendered, which means its loop never starts.
   */
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#/components/button');
  await page.waitForTimeout(600);
  expect(await page.locator('.lg-fusion').count(), 'the fusion layer is still mounted').toBe(0);

  // And the page is quiet once nothing is being pressed — no loop outlived its gesture.
  const idle = await page.evaluate(() => new Promise<number>(resolve => {
    let frames = 0;
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => { frames++; return original(callback); };
    setTimeout(() => { window.requestAnimationFrame = original; resolve(frames); }, 600);
  }));
  expect(idle, `an idle page under forced colours scheduled ${idle} frames`).toBeLessThanOrEqual(2);
});

test('and so does Increase Contrast, which is where the switch came from', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/#/components/button');
  await page.waitForTimeout(600);
  expect(await page.locator('.lg-fusion').count()).toBe(0);
});

test('with neither, the fusion layer is there — so the checks above mean something', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(600);
  expect(await page.locator('.lg-fusion').count()).toBeGreaterThan(0);
});

/* ---------------------------------------------------------------------------------------
 * 6. Roving focus into a segmented control.
 *
 * `docs/known-limitations.md` recorded that a toolbar's arrow-key traversal cannot reach the
 * segments of a segmented control inside it, and there was no test. The *fix* changes existing
 * keyboard behaviour and belongs to 0.3.0; proving it exists belongs here.
 * ------------------------------------------------------------------------------------- */
test('a segmented control inside a toolbar: what arrow keys actually do', async ({ page }) => {
  await page.goto('/#/components/toolbar');
  const toolbar = page.getByRole('toolbar', { name: '视图工具栏' });
  await toolbar.scrollIntoViewIfNeeded();
  const segmented = toolbar.locator('.lg-segmented');
  test.skip(await segmented.count() === 0, 'the toolbar demo has no segmented control in it');

  await toolbar.locator('button, [role="radio"]').first().focus();
  const visited: string[] = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('ArrowRight');
    visited.push(await page.evaluate(() => {
      const active = document.activeElement;
      return `${active?.tagName}.${String(active?.className).split(' ')[0]}`;
    }));
  }
  test.info().annotations.push({ type: 'roving-focus', description: visited.join(' → ') });

  /**
   * **Reproduced.** Eight presses of Right, and focus never once lands inside the segmented
   * control: the toolbar's traversal walks `button` children, and a segmented control's
   * options are radio inputs behind the segments, with a keyboard model of their own.
   *
   * This asserts the behaviour as it *is*, not as it should be. Fixing it changes what arrow
   * keys already do inside a toolbar, which is a breaking change and belongs to 0.3.0; the
   * job here was to prove the limitation is real rather than suspected. When 0.3.0 fixes it,
   * this expectation inverts and the comment goes — that is the point of writing it down as a
   * measurement instead of a sentence in a document.
   */
  const reachedSegment = visited.some(entry => entry.includes('lg-segment'));
  expect(reachedSegment,
    `arrow keys reached the segmented control — the 0.3.0 fix has landed, so invert this. Visited: ${visited.join(' → ')}`)
    .toBe(false);

  // What they do instead: stay on the buttons, and never get stuck.
  expect(visited.every(entry => entry.startsWith('BUTTON'))).toBe(true);
});
