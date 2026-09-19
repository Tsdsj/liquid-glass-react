import { test, expect } from '@playwright/test';

/**
 * Regressions for the way the controls feel under a pointer: what the light does when a gesture
 * ends, how far the glass actually travels with the finger, and what happens on the very first
 * frame of a page. All of these were reported from a real browser, and none of them is visible
 * in a screenshot — they are about the frames in between.
 */

const centre = (box: { x: number; y: number; width: number; height: number }) =>
  [box.x + box.width / 2, box.y + box.height / 2] as const;

/** Where an element's centre is, once it has stopped moving — pages animate in. */
const restingCentre = async (locator: import('@playwright/test').Locator) => {
  const read = () => locator.evaluate(node => {
    const box = node.getBoundingClientRect();
    return `${(box.left + box.width / 2).toFixed(1)},${(box.top + box.height / 2).toFixed(1)}`;
  });
  // Three reads in a row, not two: the tail of an ease can round to the same value twice.
  let previous = await read(), steady = 0;
  await expect.poll(async () => {
    const now = await read(); steady = now === previous ? steady + 1 : 0; previous = now; return steady;
  }, { intervals: Array.from({ length: 14 }, () => 80) }).toBeGreaterThanOrEqual(3);
  return previous;
};

interface TraceFrame { cx: number; left: number; right: number; p: number }

test('crossing into the next segment never throws the lens off the track', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  await restingCentre(lens);
  const box = (await track.boundingBox())!;
  const start = centre((await track.getByText('周', { exact: true }).boundingBox())!); // the selected one
  const end = centre((await track.getByText('月', { exact: true }).boundingBox())!);

  // Every frame, not every step: the defect was one painted frame wide and a step-by-step
  // assertion walks straight past it.
  await page.evaluate(() => {
    const node = document.querySelector('#segmented-basic .lg-segmented-track')!;
    const pill = node.querySelector('.lg-selection-lens')!;
    const store = window as unknown as { __pointer: number | null; __trace: TraceFrame[] };
    store.__pointer = null; store.__trace = [];
    const tick = () => {
      if (store.__pointer !== null) {
        const r = pill.getBoundingClientRect();
        store.__trace.push({ cx: r.left + r.width / 2, left: r.left, right: r.right, p: store.__pointer });
      }
      if (store.__trace.length < 300) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  await page.mouse.move(...start);
  await page.mouse.down();
  for (let i = 1; i <= 24; i++) {
    const x = start[0] + (end[0] - start[0]) * i / 24;
    await page.evaluate(value => { (window as unknown as { __pointer: number }).__pointer = value; }, x);
    await page.mouse.move(x, start[1]);
    await page.waitForTimeout(20);
  }
  await page.mouse.up();

  const trace: TraceFrame[] = await page.evaluate(() => (window as unknown as { __trace: TraceFrame[] }).__trace);
  expect(trace.length).toBeGreaterThan(15);
  // The selection moving to a new slot must not move the lens: the finger is still holding it.
  const adrift = trace.reduce((worst, frame) => Math.abs(frame.cx - frame.p) > Math.abs(worst.cx - worst.p) ? frame : worst);
  expect(Math.abs(adrift.cx - adrift.p), `lens broke away from the pointer: ${JSON.stringify(adrift)}`).toBeLessThan(12);
  // And it certainly must not leave the control. The allowance is the press swell, nothing more.
  const escaped = trace.filter(frame => frame.left < box.x - 6 || frame.right > box.x + box.width + 6);
  expect(escaped.length, `lens left the track: ${JSON.stringify(escaped[0])}`).toBe(0);
});

/**
 * The offset is derived from where the lens currently is, so anything that makes the measurement
 * disagree with what was written feeds straight back into the next frame. A still pointer is the
 * cleanest way to catch it: the correct answer cannot change, so any movement at all is the bug.
 */
for (const control of [
  { name: '分段控件', url: '/#/components/segmented-control', track: '#segmented-basic .lg-segmented-track', axis: 'x' as const },
  { name: '侧边栏', url: '/#/components/button', track: '.lg-tabbar[data-layout="sidebar"] .lg-tab-links', axis: 'y' as const },
]) {
  test(`holding ${control.name} still leaves it still`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(control.url);
    const track = page.locator(control.track);
    const lens = track.locator('.lg-selection-lens');
    await restingCentre(lens); // the page animates in; press only once it has stopped
    const current = (await track.locator('[aria-current="page"], .lg-segment:has(input:checked)').first().boundingBox())!;

    await page.mouse.move(...centre(current));
    await page.mouse.down();
    const readings: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(40);
      // Centre, not edge: the press swell legitimately grows the lens about its own centre.
      readings.push(await lens.evaluate((node, axis) => {
        const box = node.getBoundingClientRect();
        return `${node.style.getPropertyValue(`--lg-shift-${axis}`)}@${(box.left + box.width / 2).toFixed(1)},${(box.top + box.height / 2).toFixed(1)}`;
      }, control.axis));
    }
    await page.mouse.up();

    expect(new Set(readings), `offset drifted while held still: ${readings.join(' ')}`).toHaveProperty('size', 1);
  });
}

test('sliding the sidebar lens changes section as it crosses each one', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/button');
  const links = page.locator('.lg-tabbar[data-layout="sidebar"] .lg-tab-links');
  const current = (await links.locator('a[aria-current="page"]').boundingBox())!;
  const last = (await links.locator('.lg-tab-link').last().boundingBox())!;

  await page.mouse.move(...centre(current));
  await page.mouse.down();
  await page.mouse.move(current.x + current.width / 2, last.y + last.height / 2, { steps: 8 });
  // Live, before release — the same as pressing a segment and sliding.
  await expect(links.locator('.lg-tab-link').last()).toHaveAttribute('aria-current', 'page');
  await page.mouse.up();

  await expect(links.locator('.lg-tab-link').last()).toHaveAttribute('aria-current', 'page');
  await expect(links.locator('a[aria-current="page"]')).toHaveCount(1);
});

test('the lens is carried by the pointer, not merely leaning toward it', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  const trackBox = (await track.boundingBox())!;
  // From the first segment, so the whole span to the right is still inside the track.
  const start = centre((await track.getByText('日', { exact: true }).boundingBox())!);

  await page.mouse.move(...start);
  await page.mouse.down();

  // Inside the track the lens sits under the pointer, to the pixel.
  for (const offset of [12, 34, 58]) {
    await page.mouse.move(start[0] + offset, start[1], { steps: 3 });
    await page.waitForTimeout(60); // the offset is applied on the next frame, not in the event
    const box = (await lens.boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - (start[0] + offset))).toBeLessThan(2);
  }

  // Past the end it resists instead of following: it stays inside the track and squashes.
  await page.mouse.move(trackBox.x + trackBox.width + 80, start[1], { steps: 6 });
  const past = (await lens.boundingBox())!;
  expect(past.x + past.width).toBeLessThan(trackBox.x + trackBox.width + 24);
  const stretch = await lens.evaluate(node => parseFloat(node.style.getPropertyValue('--lg-stretch-x') || '1'));
  expect(stretch).toBeGreaterThan(1.05);
  await page.mouse.up();
});

test('following the pointer freely deforms the glass far less than pulling against the end', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  const trackBox = (await track.boundingBox())!;
  const start = centre((await track.getByText('日', { exact: true }).boundingBox())!);
  const read = () => lens.evaluate(node => parseFloat(node.style.getPropertyValue('--lg-stretch-x') || '1'));

  await page.mouse.move(...start);
  await page.mouse.down();
  await page.mouse.move(start[0] + 40, start[1], { steps: 8 });
  await page.waitForTimeout(120); // let the velocity term settle out of the reading
  const free = await read();
  await page.mouse.move(trackBox.x + trackBox.width + 90, start[1], { steps: 8 });
  await page.waitForTimeout(120);
  const resisting = await read();
  await page.mouse.up();

  expect(free).toBeLessThan(1.05);
  expect(resisting).toBeGreaterThan(free + .05);
});

test('the fusion layer hands the pill back by cross-fading, never in one frame', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const week = centre((await track.getByText('周', { exact: true }).boundingBox())!);
  const day = centre((await track.getByText('日', { exact: true }).boundingBox())!);

  await page.mouse.move(...week);
  await page.mouse.down();
  await page.mouse.move(...day, { steps: 6 });
  await page.mouse.up();

  // Sample the hand-back: the goo layer and the lens must always add up to one pill.
  const samples = await track.evaluate(async node => {
    const lens = node.querySelector('.lg-selection-lens') as HTMLElement;
    const goo = node.querySelector('.lg-fusion-goo') as HTMLElement;
    const out: { fade: number; lens: number; goo: number }[] = [];
    for (let i = 0; i < 40; i++) {
      out.push({
        fade: parseFloat(getComputedStyle(node).getPropertyValue('--lg-fusion-fade')) || 0,
        lens: parseFloat(getComputedStyle(lens).opacity),
        goo: parseFloat(getComputedStyle(goo).opacity),
      });
      await new Promise(r => setTimeout(r, 40));
    }
    return out;
  });

  // It ramps: at least one sample is caught part way through rather than at an endpoint.
  expect(samples.some(s => s.fade > .05 && s.fade < .95)).toBe(true);
  // And the lens is always exactly the complement of the layer standing in for it, so the
  // total never dips (a dip is the flash) and never doubles (that is two pills).
  for (const s of samples) expect(Math.abs(s.lens - (1 - s.fade))).toBeLessThan(.02);
  // It does finish, and the lens owns the pill again.
  expect(samples.at(-1)!.fade).toBe(0);
  expect(samples.at(-1)!.lens).toBeCloseTo(1, 1);
  expect(samples.at(-1)!.goo).toBe(0);
});

test('nothing springs into place on load', async ({ page }) => {
  // Recorded from before the first paint: any intermediate position means the lens animated
  // into its slot, which on a fresh page reads as the navigation bouncing for no reason.
  await page.addInitScript(() => {
    const frames: string[] = [];
    (window as Window & { __lens?: string[] }).__lens = frames;
    /**
     * One key per lens *element*, not per label.
     *
     * Keying on the nearest `aria-label` looked tidier and was wrong: two different controls on
     * a page may legitimately be named the same thing — the segmented-control page has a 密度
     * example and the knob panel underneath has a 密度 knob — and merging their positions
     * reported a lens that had never moved as having moved.
     */
    let next = 0;
    const tick = () => {
      for (const node of document.querySelectorAll<HTMLElement>('.lg-selection-lens')) {
        const style = getComputedStyle(node);
        if (!node.dataset.lensKey) {
          node.dataset.lensKey = `${node.closest('[aria-label]')?.getAttribute('aria-label') ?? '?'}#${next++}`;
        }
        if (parseFloat(style.opacity) > .01) frames.push(`${node.dataset.lensKey}|${style.transform}`);
      }
      if (frames.length < 120) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(900);

  const frames = await page.evaluate(() => (window as Window & { __lens?: string[] }).__lens ?? []);
  expect(frames.length).toBeGreaterThan(10);
  // Every visible lens held exactly one position for the whole recording.
  const byLens = new Map<string, Set<string>>();
  for (const frame of frames) {
    const [key, transform] = frame.split('|');
    if (!byLens.has(key)) byLens.set(key, new Set());
    byLens.get(key)!.add(transform);
  }
  for (const [key, positions] of byLens) expect(positions, `${key} moved on load`).toHaveProperty('size', 1);
});

test('dragging a navigation link does not start a native drag', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/button');
  const started = await page.evaluate(() => {
    const seen: boolean[] = [];
    (window as Window & { __drag?: boolean[] }).__drag = seen;
    document.addEventListener('dragstart', event => seen.push(!event.defaultPrevented), true);
    return true;
  });
  expect(started).toBe(true);

  const links = page.locator('.lg-tabbar[data-layout="sidebar"] .lg-tab-links');
  const lens = links.locator('.lg-selection-lens');
  const current = (await links.locator('a[aria-current="page"]').boundingBox())!;
  const before = (await lens.boundingBox())!;

  await page.mouse.move(...centre(current));
  await page.mouse.down();
  await page.mouse.move(current.x + current.width / 2, current.y + current.height / 2 + 54, { steps: 8 });
  // The gesture survives: the lens is being pulled, which it cannot be if the pointer stream
  // was cancelled by a native drag.
  await expect(lens).toHaveAttribute('data-pulling', 'true');
  const during = (await lens.boundingBox())!;
  expect(during.y).toBeGreaterThan(before.y + 20);
  await page.mouse.up();

  const escaped = await page.evaluate(() => (window as Window & { __drag?: boolean[] }).__drag ?? []);
  expect(escaped.filter(Boolean)).toHaveLength(0);
});

test('a prominent action on a shared surface still has a fill to sit on', async ({ page }) => {
  await page.goto('/#/components/sheet');
  await page.getByRole('button', { name: '打开面板' }).first().click();
  const confirm = page.locator('.lg-sheet .lg-button[data-variant="glassProminent"]').first();
  await expect(confirm).toBeVisible();
  const paint = await confirm.evaluate(node => {
    const style = getComputedStyle(node);
    return { background: style.backgroundColor, color: style.color, renderer: node.getAttribute('data-renderer') };
  });
  // It is on a shared surface, so it has no decoration layer of its own to tint — the accent has
  // to be its own background or the white label is painted on nothing.
  expect(paint.renderer).toBe('shared');
  expect(paint.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(paint.color).toBe('rgb(255, 255, 255)');
});

test('the virtual light source never spins the long way round', async ({ page }) => {
  await page.goto('/#/components/button');
  const button = page.locator('#button-variants .lg-button').first();
  const box = (await button.boundingBox())!;
  const [cx, cy] = centre(box);
  const radius = Math.max(box.width, box.height);

  const angles: number[] = [];
  await page.mouse.move(cx, cy);
  // Sweeps past the leading edge, where the underlying arctangent flips sign.
  for (let degrees = -170; degrees <= 190; degrees += 20) {
    await page.mouse.move(cx + Math.cos(degrees * Math.PI / 180) * radius, cy + Math.sin(degrees * Math.PI / 180) * radius);
    angles.push(await button.evaluate(node => parseFloat(node.style.getPropertyValue('--lg-light-angle')) || 0));
  }

  // A jump of a full turn is transitioned like any other change, so the highlight visibly races
  // around the silhouette — always at the same spot, which reads as a glitch rather than as light.
  for (let i = 1; i < angles.length; i++) expect(Math.abs(angles[i] - angles[i - 1])).toBeLessThan(90);
});

test('a control on an overlay borrows its surface instead of stacking a second glass', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/switch');
  await page.getByRole('button', { name: /偏好/ }).click();
  const popover = page.locator('.lg-popover');
  await expect(popover).toBeVisible();

  const layers = await popover.evaluate(node => {
    const read = (element: Element) => {
      const backdrop = element.querySelector(':scope > .lg-decoration > .lg-backdrop');
      return {
        name: element.className.replace('lg-root ', ''),
        renderer: element.getAttribute('data-renderer'),
        backdrop: backdrop ? getComputedStyle(backdrop).backdropFilter : 'none',
        background: getComputedStyle(element).backgroundColor,
      };
    };
    return { panel: read(node), inside: [...node.querySelectorAll('.lg-root')].map(read) };
  });

  // The panel is the glass. Everything on it is a filled control, the way the system draws a
  // segmented control or a switch inside a sheet.
  expect(layers.panel.backdrop).toContain('blur');
  expect(layers.inside.length).toBeGreaterThan(2);
  for (const control of layers.inside) {
    expect(control.renderer, `${control.name} kept its own renderer`).toBe('shared');
    expect(control.backdrop, `${control.name} stacked a second blur`).toBe('none');
    // …and still reads as a control rather than vanishing into the panel.
    expect(control.background, `${control.name} has no fill to be seen by`).not.toBe('rgba(0, 0, 0, 0)');
  }
});

test('the light page is a step below the cards it carries', async ({ page }) => {
  await page.goto('/#/components/button');
  const tones = await page.evaluate(() => {
    const read = (node: Element | null) => node ? getComputedStyle(node).backgroundColor : '';
    return { page: read(document.body), card: read(document.querySelector('.demo-card')) };
  });
  const level = (value: string) => value.match(/\d+/g)!.slice(0, 3).reduce((sum, part) => sum + Number(part), 0) / 3;
  /* Near-white, deliberately not white: this used to assert `rgb(255, 255, 255)` exactly, which
     was incidental to what the test is about. Full-brightness white is the glare itself, and
     `appearance.spec.ts` now keeps the top surface a few points below it. */
  expect(level(tones.card)).toBeGreaterThan(244);
  expect(level(tones.card)).toBeLessThan(255);
  // A page at the same brightness as its cards is a single flat sheet of white, which is the
  // glare; the glass also has nothing left to separate itself from.
  expect(level(tones.page)).toBeLessThan(level(tones.card) - 8);
});
