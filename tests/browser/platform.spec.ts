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
  test('a regular button is the macOS height, not the iOS one', async ({ page }) => {
    await withPointer(page, '/#/components/button');
    const height = await heightOf(page, '#button-variants .lg-button');
    expect(height, `the button rendered at ${height}px`).toBeGreaterThanOrEqual(21);
    expect(height, `the button rendered at ${height}px — that is the touch metric`).toBeLessThan(30);
  });

  test('body text is 13/16', async ({ page }) => {
    await withPointer(page, '/#/components/text');
    const size = await pxOf(page, '--lg-text-body-size');
    const leading = await pxOf(page, '--lg-text-body-leading');
    expect(size, `body is ${size}px`).toBe(13);
    expect(leading, `body leading is ${leading}px`).toBe(16);
  });

  test('nothing in the text table goes under the readable floor', async ({ page }) => {
    await withPointer(page, '/#/components/text');
    const sizes = await Promise.all(['caption2', 'caption1', 'footnote', 'subhead', 'callout']
      .map(name => pxOf(page, `--lg-text-${name}-size`)));
    const smallest = Math.min(...sizes);
    expect(smallest, `the smallest style is ${smallest}px`).toBeGreaterThanOrEqual(11);
  });

  /**
   * The point of the whole exercise, stated as the thing a reader would notice: a 22px control
   * still has to be as easy to hit as WCAG 2.2 asks. 24×24 is the pointer minimum, and the
   * control is two pixels short of it — which is exactly the kind of gap that gets waved
   * through because nobody can see it.
   */
  test('a 22px button still answers to a 24px hit region', async ({ page }) => {
    await withPointer(page, '/#/components/button');
    const button = page.locator('#button-variants .lg-button').first();
    const box = (await button.boundingBox())!;
    const region = await button.evaluate(node => {
      const after = getComputedStyle(node, '::after');
      return { height: parseFloat(after.minHeight), width: parseFloat(after.minWidth) };
    });
    expect(region.height, 'the hit region is not drawn for a fine pointer').toBeGreaterThanOrEqual(24);
    // And it really is reachable two pixels above the artwork.
    const hit = await page.evaluate(([x, y]) => {
      const node = document.elementFromPoint(x, y);
      return !!node?.closest('.lg-button');
    }, [box.x + box.width / 2, box.y - 1] as const);
    expect(hit, 'a pixel just above the button belongs to nothing').toBe(true);
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
  expect(height, `the control height is ${height}px`).toBe(22);
  await context.close();
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
