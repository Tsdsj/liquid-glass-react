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
  await rail.scrollIntoViewIfNeeded();
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

/**
 * A knob on somebody else's surface has to stay visible when it is held.
 *
 * Pressing the slider inside a floating `Panel` made the knob vanish. The pressed state says
 * "lift into glass" — `background: transparent`, and let the glass layers underneath show —
 * but a control on a shared surface has already given up its own pane, so it renders flat and
 * has no layers. The press took the fill away and handed the knob to something that was never
 * drawn. Reported on a `Panel`; it was equally true in every popover, sheet and toolbar group
 * in the library, which is why a whole release went by without anyone noticing.
 *
 * Measured against the track it sits on rather than on its own, and that distinction is the
 * test: a transparent knob screenshots as whatever is behind it, and "there are bright pixels
 * in this box" is true either way. The knob is white and the filled track is the accent, so
 * the question with an answer is *how far apart they are* — 255 against 130 when it is drawn,
 * and the track's own colour when it is not.
 */
test('a slider knob on a shared surface is still there while you hold it', async ({ page }) => {
  await page.goto('/#/components/panel');
  const demo = page.locator('#panel-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  const lens = demo.locator('.lg-slider-lens').first();
  await expect(lens).toBeVisible();
  expect(await lens.evaluate(node => node.dataset.renderer),
    'this slider is not on a shared surface, so it cannot prove anything').toBe('shared');

  /** The knob's centre and the track a knob-and-a-half to its leading side, in grey levels. */
  const sample = async () => {
    const shot = (await page.screenshot()).toString('base64');
    const box = await lens.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width };
    });
    return page.evaluate(async ([data, at]) => {
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext('2d')!;
      context.drawImage(bitmap, 0, 0);
      /* Device pixels: a screenshot is not necessarily one pixel per CSS pixel. */
      const scale = bitmap.width / window.innerWidth;
      const grey = (x: number, y: number) => {
        const [r, g, b] = context.getImageData(Math.round(x * scale), Math.round(y * scale), 1, 1).data;
        return Math.round((r + g + b) / 3);
      };
      return { knob: grey(at.x, at.y), track: grey(at.x - at.w * 1.6, at.y) };
    }, [shot, box] as const);
  };

  const atRest = await sample();
  expect(atRest.knob - atRest.track,
    `at rest the knob reads ${atRest.knob} and the track beside it ${atRest.track} — this is not the knob`)
    .toBeGreaterThan(60);

  const box = (await lens.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(260);
  const held = await sample();
  await page.mouse.up();

  /**
   * Against itself, not against a floor.
   *
   * A transparent knob is not black — it is the panel's own glass seen through a hole, with the
   * lift shadow around it, and that measured **217** where the knob measures 255. Bright enough
   * to pass "is there something light here", and on screen it is a knob that disappeared. What
   * has an answer is whether it changed: the knob is `#fff` at rest and `#fff` held, so any
   * real dimming is the fill being taken away.
   */
  expect(atRest.knob - held.knob,
    `the knob dimmed from ${atRest.knob} to ${held.knob} the moment it was held`).toBeLessThan(15);
});
