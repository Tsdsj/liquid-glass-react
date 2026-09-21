import { test, expect, type Page } from '@playwright/test';
import { asPlatform } from './hit-floor.js';

/**
 * A desktop is not a large phone.
 *
 * The library was built from the iOS tables, because that is where Liquid Glass was introduced
 * and where the numbers are most fully written down. On a machine with a cursor those numbers
 * are wrong, and not marginally: a 44px control and 17px body text are sized for a fingertip
 * and for a screen held at arm's length. The HIG's macOS tables say regular controls are 22pt
 * and body text is 13/16, and `pointing-devices` says to distinguish a pointer from a
 * fingertip "only where it brings value" — drawing every control at 44px under a 1px cursor is
 * a phone interface on a desktop.
 *
 * Every metric here is decided in CSS, on purpose. A height that came out of JavaScript would
 * mean a server-rendered page arriving with touch metrics and re-laying itself out the instant
 * it hydrated, and an inline style that `platform="desktop"` could never win against. These
 * tests read the rendered box, which is the only place the claim can be checked.
 */

/** The pointer kind is a context option, so each case needs its own page. */
const withPointer = async (page: Page, url: string) => {
  await page.goto(url);
  await page.waitForTimeout(700);
};

const heightOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate(node => node.getBoundingClientRect().height);

/**
 * A token's resolved length, in pixels.
 *
 * Not `getComputedStyle(root).getPropertyValue(name)`: a custom property that is not registered
 * with `@property` computes to its literal token stream, so `--lg-text-body-size` comes back as
 * the string `calc(13px * var(--lg-text-scale))` and `parseFloat` makes `NaN` of it. Feeding it
 * to a real `font-size` makes the browser do the arithmetic, which is the number the page is
 * actually drawn with.
 */
const pxOf = (page: Page, property: string) => page.evaluate(name => {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;font-size:var(${name})`;
  document.documentElement.append(probe);
  const value = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  return value;
}, property);

/** For the values that are plain numbers rather than lengths. */
const numberOf = (page: Page, property: string) => page.evaluate(name =>
  Number(getComputedStyle(document.documentElement).getPropertyValue(name)), property);

test.describe('with a mouse on a wide window', () => {
  test('a regular button comes down from the touch height without leaving the range', async ({ page }) => {
    await withPointer(page, '/#/components/button');
    const height = await heightOf(page, '#button-variants .lg-button');
    expect(height, `the button rendered at ${height}px — that is the touch metric`).toBeLessThan(44);
    /* The band eleven component-library documentation sites sit in, measured at 1600px: Ant
       Design 32, shadcn 30, Radix 32, Naive 34, MUI 36.5, Chakra 36–40, Primer 28–32. A button
       under 28 is the AppKit table this used to hold, and it reads as chrome rather than as a
       control on a page. */
    expect(height, `the button rendered at ${height}px`).toBeGreaterThanOrEqual(32);
  });

  /**
   * The type scale does not know what is pointing at it.
   *
   * This used to assert 13/16, the AppKit body size, and the whole reason it is now 17 is that
   * 13 was the wrong table for a page in a browser — the browser's own default is 16, Apple
   * draws 17/25 on developer.apple.com, and nine of eleven documentation sites measured at
   * 1600px draw 16. Sizing the hand is a fact about the hand; the eye is the same eye.
   */
  test('body text is the same 17/22 it is under a finger', async ({ page }) => {
    await withPointer(page, '/#/components/text');
    const size = await pxOf(page, '--lg-text-body-size');
    const leading = await pxOf(page, '--lg-text-body-leading');
    expect(size, `body is ${size}px`).toBe(17);
    expect(leading, `body leading is ${leading}px`).toBe(22);
  });

  test('nothing in the text table goes under the readable floor', async ({ page }) => {
    await withPointer(page, '/#/components/text');
    const sizes = await Promise.all(['caption2', 'caption1', 'footnote', 'subhead', 'callout']
      .map(name => pxOf(page, `--lg-text-${name}-size`)));
    const smallest = Math.min(...sizes);
    expect(smallest, `the smallest style is ${smallest}px`).toBeGreaterThanOrEqual(11);
  });

  /**
   * A control that comes down for a cursor still has to be as easy to hit as the floor asks.
   *
   * Asked of the *small* button rather than the regular one, because the regular one clears
   * both floors on its own now and proves nothing. `controlSize="small"` is 28px under a
   * cursor — over the 24px WCAG minimum — and 32px under a finger, which is twelve pixels
   * under the HIG's 44 and is where the region has to do real work. The library reaches for
   * that size itself: a banner's dismiss button, a toast's, a navigation stack's back arrow.
   */
  test('a small button is reachable at whichever floor is in force', async ({ page }) => {
    await withPointer(page, '/#/components/button');
    const button = page.getByRole('button', { name: '小', exact: true }).first();
    for (const platform of ['desktop', 'touch'] as const) {
      await asPlatform(page, platform);
      const floor = await pxOf(page, '--lg-hit-min');
      /* Centred, and after the platform switch: switching it changes every control height on
         the page, so anything measured before it has moved by the time it is probed — and a
         button parked at the top of the viewport puts `y - 1` outside the document, where
         `elementFromPoint` returns null and the failure reads like a missing hit region. */
      await button.evaluate(node => node.scrollIntoView({ block: 'center' }));
      const box = (await button.boundingBox())!;
      const region = await button.evaluate(node => {
        const after = getComputedStyle(node, '::after');
        return { height: parseFloat(after.minHeight), width: parseFloat(after.minWidth) || 0 };
      });
      expect(Math.max(box.height, region.height),
        `on ${platform} the reach is ${Math.max(box.height, region.height)}px against a ${floor}px floor`)
        .toBeGreaterThanOrEqual(floor);
      expect(Math.max(box.width, region.width), `on ${platform} the reach is too narrow`)
        .toBeGreaterThanOrEqual(floor);
      /* And the region is really there, not merely declared: one pixel above the artwork has
         to belong to the button whenever the floor is taller than the artwork. */
      if (floor > box.height) {
        const hit = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('.lg-button'),
          [box.x + box.width / 2, box.y - 1] as const);
        expect(hit, `on ${platform} a pixel just above the button belongs to nothing`).toBe(true);
      }
    }
    await asPlatform(page, null);
  });

  test('the elastic stretch is gentler under a cursor', async ({ page }) => {
    await withPointer(page, '/#/components/segmented-control');
    const gain = await numberOf(page, '--lg-stretch-gain');
    expect(gain, `the gain is ${gain}`).toBeLessThan(1);
    expect(gain).toBeGreaterThan(0);
  });
});

/**
 * And the explicit setting wins in both directions.
 *
 * A preference that can only be turned on is half a switch: an application that knows its
 * users are on a touchscreen must be able to say so on a machine whose browser reports a
 * mouse, and vice versa.
 */
test('platform="touch" on a desktop brings the touch metrics back', async ({ page }) => {
  await withPointer(page, '/#/components/button');
  const before = await pxOf(page, '--lg-hit-min');
  expect(before, `the hit floor is ${before}px with a mouse`).toBe(24);

  await page.evaluate(() => document.documentElement.setAttribute('data-lg-platform', 'touch'));
  const after = await pxOf(page, '--lg-hit-min');
  const body = await pxOf(page, '--lg-text-body-size');
  expect(after, `the hit floor stayed at ${after}px`).toBe(44);
  expect(body, `body text stayed at ${body}px`).toBe(17);
});

test('platform="desktop" reaches a touchscreen that asked for it', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await withPointer(page, '/#/components/button');
  await page.evaluate(() => document.documentElement.setAttribute('data-lg-platform', 'desktop'));
  const height = await pxOf(page, '--lg-height-comfortable');
  expect(height, `the control height is ${height}px`).toBe(36);
  await context.close();
});

/**
 * And the reach follows the override, not the media query.
 *
 * The hit region used to live in two `@media` blocks, so an application that declared a
 * touchscreen on a machine reporting a mouse got the 44px *metrics* with the 24px *reach*: a
 * `controlSize="small"` dismiss button was 32px wide against the floor it had just asked for.
 * The override has to win in both directions or it is half a switch.
 */
test('declaring a touchscreen widens the hit region too, not just the metrics', async ({ page }) => {
  await withPointer(page, '/#/components/button');
  const region = () => page.locator('#button-variants .lg-button').first()
    .evaluate(node => parseFloat(getComputedStyle(node, '::after').minWidth) || 0);
  expect(await region(), 'a cursor got a 44px-wide region it never needed').toBeLessThan(24);
  await asPlatform(page, 'touch');
  expect(await region(), 'the region stayed at the pointer width under platform="touch"').toBe(44);
  await asPlatform(page, null);
});

/**
 * On a phone, none of it applies.
 *
 * A tablet with a trackpad reports a fine pointer at phone width, which is why the media query
 * asks about width as well — 22px controls on a 390px screen would be the wrong answer to the
 * right question.
 */
test('a narrow window keeps the touch metrics even with a mouse', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await withPointer(page, '/#/components/button');
  const hit = await pxOf(page, '--lg-hit-min');
  const body = await pxOf(page, '--lg-text-body-size');
  expect(hit, `the hit floor is ${hit}px on a 390px screen`).toBe(44);
  expect(body, `body text is ${body}px on a 390px screen`).toBe(17);
});

/* =========================================================================================
 * The two things the matrix found once it had desktop rows to run.
 * ======================================================================================= */

test('the split view divider can be grabbed by whatever is pointing at it', async ({ page }) => {
  await withPointer(page, '/#/components/split-view');
  const divider = page.locator('#main .lg-split-divider').first();
  await divider.scrollIntoViewIfNeeded();
  for (const platform of ['desktop', 'touch'] as const) {
    await asPlatform(page, platform);
    const floor = await pxOf(page, '--lg-hit-min');
    const box = (await divider.boundingBox())!;
    /* The line is 1px. What can be grabbed is the `::before` region around it, so the question
       is asked the way a pointer asks it: is the divider what is under this point? */
    const reach = await page.evaluate(([x, y, half]) => {
      const left = document.elementFromPoint(x - half, y);
      const right = document.elementFromPoint(x + half, y);
      return [left, right].filter(node => node?.closest('.lg-split-divider')).length;
    }, [box.x + box.width / 2, box.y + box.height / 2, floor / 2 - 2] as const);
    expect(reach, `on ${platform} only ${reach}/2 sides of a ${floor}px grab region reach the divider`).toBe(2);
  }
  await asPlatform(page, null);
});

test('a code block never follows the type scale below reading size', async ({ page }) => {
  await withPointer(page, '/#/components/button');
  const smallest = await page.locator('.code-block pre').first().evaluate(node => {
    const sizes = [node, ...node.querySelectorAll('*')]
      .map(child => parseFloat(getComputedStyle(child).fontSize));
    return Math.min(...sizes);
  });
  /* Prose can be taken in at a glance; a line of code is read character by character. Sized
     purely off the footnote style, the desktop table took it to 11px and the nested `<code>`
     took another 8% off that — 10.1px, on every page of the site. */
  expect(smallest, `the smallest text in a code block is ${smallest}px`).toBeGreaterThanOrEqual(12);
});

/**
 * A button's label is one step under the prose around it, and no further.
 *
 * It was `subhead` against the AppKit table, which made it 11px — smaller than that table's
 * own button label and smaller than the sentence beside it, so the desktop override pushed it
 * up to the body size. With one type scale, `subhead` is 15 against a 17px body: the same step
 * down that Ant Design, MUI, Radix and Chakra all draw as 14 against 16.
 */
test("a button's label is one step under the prose, never two", async ({ page }) => {
  await withPointer(page, '/#/components/button');
  const label = await page.locator('#button-variants .lg-button').first()
    .evaluate(node => parseFloat(getComputedStyle(node).fontSize));
  const body = await pxOf(page, '--lg-text-body-size');
  const subhead = await pxOf(page, '--lg-text-subhead-size');
  expect(label, `the label is ${label}px against a ${body}px body`).toBe(subhead);
  expect(body - label, `the label is ${body - label}px under the body size`).toBeLessThanOrEqual(2);
});
