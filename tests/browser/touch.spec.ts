import { test, expect } from '@playwright/test';

/**
 * The drag behaviour was measured with a mouse. A finger is a different input: the browser owns
 * the gesture until `touch-action` says otherwise, hover never happens, and the hit area matters
 * because a fingertip is not a pixel. Emulation is not a real device — it cannot tell us how the
 * control *feels* — but it does settle the things that are decided by code.
 */
/* A phone viewport with a real touch input, spelled out rather than taken from a device preset:
   the presets also pick the browser engine, and this suite needs to run in the same Chrome as
   everything else. */
test.use({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

test('the draggable controls claim the axis they need and leave the page the other one', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(700);
  const actions = await page.evaluate(() => {
    const read = (selector: string) => {
      const node = document.querySelector(selector);
      return node ? getComputedStyle(node).touchAction : 'missing';
    };
    return {
      segmented: read('.lg-segmented-track'),
      tabs: read('.lg-tab-list'),
      links: read('.lg-tab-links'),
      switch: read('.lg-switch'),
      slider: read('.lg-slider input'),
    };
  });
  // pan-y everywhere a horizontal drag is ours: the page still scrolls vertically under the finger.
  for (const [name, value] of Object.entries(actions)) {
    if (value === 'missing') continue;
    expect(value, `${name} did not reserve the drag axis`).toBe('pan-y');
  }
  expect(actions.segmented).toBe('pan-y');
});

test('a finger carries the segment lens the same way a pointer does', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  await page.waitForTimeout(900);
  const track = page.locator('#segmented-basic .lg-segmented-track');
  const lens = track.locator('.lg-selection-lens');
  const week = (await track.getByText('周', { exact: true }).boundingBox())!;
  const month = (await track.getByText('月', { exact: true }).boundingBox())!;
  const y = week.y + week.height / 2;

  // Raw touch events: page.tap() cannot express a drag.
  await page.touchscreen.tap(week.x + week.width / 2, y);
  await page.waitForTimeout(400);

  const client = await page.context().newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart', touchPoints: [{ x: week.x + week.width / 2, y }],
  });
  for (let i = 1; i <= 8; i++) {
    const x = week.x + week.width / 2 + (month.x - week.x) * i / 8;
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await page.waitForTimeout(25);
  }
  await expect(lens).toHaveAttribute('data-pulling', 'true');
  const box = (await lens.boundingBox())!;
  const finger = week.x + week.width / 2 + (month.x - week.x);
  expect(Math.abs(box.x + box.width / 2 - finger), 'the lens did not follow the finger').toBeLessThan(14);
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

  await expect(page.locator('#segmented-basic').getByRole('radio', { name: '月', exact: true })).toBeChecked();
});

test('nothing is left hovering after a tap', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(700);
  // A touch screen reports no hover capability, so the hover rules must be inert.
  expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
  const button = page.locator('#button-variants .lg-button').first();
  const scale = () => button.evaluate(node => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
    return matrix.a;
  });
  const box = (await button.boundingBox())!;
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(700);
  // Hover would leave it at --lg-hover-scale (1.015). The tolerance is the tail of the press
  // spring, which is three orders of magnitude smaller than the state being ruled out.
  expect(Math.abs(await scale() - 1), 'a hover scale outlived the tap').toBeLessThan(.004);
});

test('every control a finger can reach is at least 44 across', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.waitForTimeout(700);
  const small = await page.evaluate(() => {
    const targets = [...document.querySelectorAll('button, a[href], [role="switch"], [role="slider"]')];
    return targets
      .filter(node => node.getClientRects().length > 0)
      .map(node => {
        const own = node.getBoundingClientRect();
        // The hit area may be grown by a pseudo-element; measure what the finger can actually land on.
        const after = getComputedStyle(node, '::after');
        const grown = after.content !== 'none'
          ? { w: Math.max(own.width, parseFloat(after.minWidth) || 0), h: Math.max(own.height, parseFloat(after.minHeight) || 0) }
          : { w: own.width, h: own.height };
        return { label: (node.getAttribute('aria-label') || node.textContent || '').trim().slice(0, 16), ...grown };
      })
      .filter(t => t.w < 44 || t.h < 44);
  });
  expect(small, `targets under 44: ${JSON.stringify(small)}`).toEqual([]);
});
