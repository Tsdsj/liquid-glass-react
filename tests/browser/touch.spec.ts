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
  // Touch events carry viewport coordinates, so the control has to actually be in the viewport.
  // Relying on it happening to sit above the fold makes this test a hostage to page layout.
  await track.evaluate(node => node.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
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
  await button.evaluate(node => node.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
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

/**
 * The segments and tabs, asked the same question by hit test rather than by tape measure.
 *
 * `.lg-button` has grown itself a 44 hit region on coarse pointers since the first audit, and
 * `.lg-page-dot`, `.lg-split-divider` and `.lg-tab-link` followed. `.lg-segment` (36pt, and 28
 * in the compact density — the floor of the HIG's own table) and `.lg-tab` (36pt) never did,
 * while the button's own documentation promised the rule to every reader of the site.
 *
 * Probed 21px above and below the centre, which is a 42px finger box: the block axis is the one
 * that is short here, and it is the only one that was widened — packed edge to edge, a segment
 * grown sideways would put its hit region on top of its neighbour's.
 */
for (const [page_, selector] of [['segmented-control', '.lg-segment'], ['tabs', '.lg-tab']] as const) {
  test(`a finger lands on ${selector} at the top and bottom of a 44 box`, async ({ page }) => {
    await page.goto(`/#/components/${page_}`);
    await page.waitForTimeout(700);
    const missed = await page.evaluate(selector => {
      const out: string[] = [];
      for (const node of document.querySelectorAll(selector)) {
        const box = node.getBoundingClientRect();
        if (box.width === 0 || box.top < 0 || box.bottom > innerHeight) continue;
        const x = box.left + box.width / 2;
        for (const y of [box.top + box.height / 2 - 21, box.top + box.height / 2 + 21]) {
          if (y < 0 || y > innerHeight) continue;
          const hit = document.elementFromPoint(x, y);
          /* The site's own floating tab bar covers the bottom of a phone screen, and a demo
             underneath it is genuinely out of reach there — which is the documentation's
             layout, not the component's hit region. */
          if (hit?.closest('.lg-tabbar')) continue;
          /* The control itself or something inside it — *not* merely an ancestor. Accepting the
             track that contains the segment passes this test with no hit region at all, which
             is what the first version of it did: a press landing on the strip beside a segment
             selects nothing. */
          if (!hit || !node.contains(hit)) {
            out.push(`${(node.textContent || '').trim().slice(0, 8)} @${Math.round(y - box.top - box.height / 2)}`);
          }
        }
      }
      return out;
    }, selector);
    expect(missed, `presses that landed on something else: ${missed.join(', ')}`).toEqual([]);
  });
}
