import { test, expect, type Page } from '@playwright/test';

/**
 * The documentation site's shape on a wide window.
 *
 * It is the shape a reader arrives already knowing: a band across the top with the name, the
 * areas and the search; the pages of the area you are in down the left under a rule; the page
 * in the middle; its own outline on the right. Getting there took two goes — the first put the
 * areas *and* the page list in one rail, which left a 260×1000 column holding a 228×114 capsule
 * and, on pages with no page list, a glass panel with nothing in it.
 *
 * So these are about fit and alignment rather than taste: one thing lines up with the next,
 * every column has something in it, and no column exists when it would be empty.
 */

const box = (page: Page, selector: string) => page.locator(selector).evaluate(node => {
  const rect = node.getBoundingClientRect();
  return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
});

test.describe('wide', () => {
  test.use({ viewport: { width: 1680, height: 1000 } });

  test('the band spans the window and its row lines up with the page', async ({ page }) => {
    await page.goto('/#/components/button');
    const band = await box(page, '.app-header');
    expect(band.w, 'the band stops short of the window').toBe(1680);

    /* The name sits over the rail and the actions end where the page ends — the two verticals
       the whole layout is built on. Before, the bar centred against the window while the page
       centred against what was left of it, 130px out of step. */
    const wordmark = await box(page, '.wordmark');
    const rail = await box(page, '.app-rail');
    expect(Math.abs(wordmark.x - rail.x), `name at ${wordmark.x}, rail at ${rail.x}`).toBeLessThanOrEqual(1);

    const actions = await box(page, '.app-header-actions');
    const content = await box(page, '.app-content');
    const right = content.x + content.w;
    expect(Math.abs((actions.x + actions.w) - right), `actions end ${actions.x + actions.w}, page ends ${right}`)
      .toBeLessThanOrEqual(1);
  });

  test('the areas are in the band, the pages are in the rail', async ({ page }) => {
    await page.goto('/#/components/button');
    const sections = await box(page, '.app-sections');
    const band = await box(page, '.app-header');
    expect(sections.y, 'the areas are not in the band').toBeGreaterThanOrEqual(band.y - 1);
    expect(sections.y + sections.h, 'the areas hang out of the band').toBeLessThanOrEqual(band.y + band.h + 1);

    // Four areas, one row, one highlighted.
    const xs = await page.locator('.app-sections .lg-tab-link')
      .evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().y)));
    expect(new Set(xs).size, `the areas are on rows ${[...new Set(xs)].join(', ')}`).toBe(1);
    await expect(page.locator('.app-sections .lg-tab-link[aria-current="page"]')).toHaveText(/组件/);

    // And the rail holds the pages of this area, with the one you are on marked.
    await expect(page.locator('.app-rail .subnav-link[aria-current="page"]')).toHaveText(/GlassButton/);
  });

  test('the rail stays put while the page scrolls, and keeps its own scroll', async ({ page }) => {
    await page.goto('/#/components/button');
    const band = await box(page, '.app-header');
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(400);
    const after = await box(page, '.app-rail');
    /* Pinned just under the band rather than carried off the top of the window with the page. */
    expect(after.y, `the rail is at ${after.y}, the band ends at ${band.y + band.h}`)
      .toBeGreaterThanOrEqual(band.y + band.h - 4);
    expect(after.y).toBeLessThan(200);

    const scrolls = await page.locator('.app-rail').evaluate(node => node.scrollHeight > node.clientHeight + 4);
    expect(scrolls, 'forty page names fit in the rail without scrolling, which cannot be right').toBe(true);
  });

  test('the section names stay readable once the page has scrolled', async ({ page }) => {
    await page.goto('/#/components/button');
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(500);
    /* `minimizeOnScroll` shrinks the floating bar on a phone, where it is over the content and
       taking room. In a pinned 60px band it only takes the names away while you read. */
    await expect(page.locator('.app-sections .lg-tab-link').first().locator('.lg-tab-label')).toBeVisible();
  });

  test('a page with no siblings gets the width instead of an empty column', async ({ page }) => {
    await page.goto('/#/overview');
    await expect(page.locator('.app-rail')).toHaveCount(0);
    await expect(page.locator('.app-body')).toHaveAttribute('data-rail', 'false');

    /* `<SecondaryNav/>` is a truthy element even where it renders nothing, so asking after the
       fact kept a 252px column for a list that was not there. */
    // And it keeps the site's one leading vertical rather than centring in the space.
    const heading = await box(page, 'h1');
    const wordmark = await box(page, '.wordmark');
    expect(Math.abs(heading.x - wordmark.x), `heading at ${heading.x}, name at ${wordmark.x}`)
      .toBeLessThanOrEqual(1);
    expect((await box(page, '.app-content')).w).toBeGreaterThan(900);
  });

  test('the outline reaches the trailing edge of the page', async ({ page }) => {
    await page.goto('/#/components/button');
    const outline = await box(page, '.outline');
    const content = await box(page, '.app-content');
    const gap = content.x + content.w - (outline.x + outline.w);
    expect(gap, `the outline stops ${gap}px short`).toBeLessThanOrEqual(4);
  });

  /**
   * The site writes two type sizes of its own, and for as long as they have existed neither
   * one applied: `Text` styles itself through `.lg-text[data-variant="…"]`, a class *and* an
   * attribute, so a rule of one class loses however the stylesheets are ordered. The landing
   * headline had been rendering at the plain 26px the desktop table gives a window title.
   */
  test('the landing page opens at a display size, not a window-title size', async ({ page }) => {
    await page.goto('/#/overview');
    const size = await page.locator('.overview-title')
      .evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    /* Measured off a probe, not read off the custom property: `--lg-text-largetitle-size` is
       `calc(26px * 1)` and stays a string until something asks the browser to do the
       arithmetic, so reading it gives `NaN`. */
    const largeTitle = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;font-size:var(--lg-text-largetitle-size)';
      document.body.append(probe);
      const size = parseFloat(getComputedStyle(probe).fontSize);
      probe.remove();
      return size;
    });
    expect(size, `the headline is ${size}px and largeTitle is ${largeTitle}px`).toBeGreaterThan(largeTitle * 1.5);
  });

  test('one example per row, using the whole column', async ({ page }) => {
    await page.goto('/#/components/button');
    const grid = await box(page, '.demo-grid');
    const first = await box(page, '.demo-card >> nth=0');
    expect(first.w, `the example is ${first.w}px in a ${grid.w}px column`).toBe(grid.w);

    // And the prose inside a full-width card still stops at a readable line.
    const list = await box(page, '.when-card > .plain-list');
    const card = await box(page, '.when-card');
    expect(card.w, 'the callout box stops short of the column').toBeGreaterThan(list.w + 40);
    expect(list.w, `the line inside it is ${list.w}px`).toBeLessThanOrEqual(700);
  });

  /**
   * A control and the sentence beside it line up with each other.
   *
   * The landing page's refraction row set `align-items: baseline`, which is right for two runs
   * of text and wrong the moment one of the items is a control. A flex container's baseline is
   * taken from its first flex item that has one, and a switch's first in-flow child is its
   * track — an empty block with no text — so the baseline it hands upward is synthesised from
   * the *bottom edge of the track*. The sentence was aligned to that edge and sat 9.5px below
   * the switch's own label.
   *
   * Measured on the text rather than on the boxes: the boxes are different heights and lining
   * those up is not what anyone is looking at.
   */
  test('the switch label and the sentence beside it sit on the same line', async ({ page }) => {
    await page.goto('/#/overview');
    const centres = await page.evaluate(() => {
      const middle = (node: Element | null) => {
        if (!node) return null;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        return rect.top + rect.height / 2;
      };
      return {
        label: middle(document.querySelector('.refraction-switch .lg-switch-label')),
        note: middle(document.querySelector('.refraction-note')),
      };
    });
    expect(centres.label, 'the refraction row is gone').not.toBeNull();
    expect(centres.note).not.toBeNull();
    const drift = Math.abs(centres.label! - centres.note!);
    expect(drift, `the sentence sits ${drift.toFixed(1)}px off the label`).toBeLessThanOrEqual(2);
  });
});

test.describe('laptop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('the three columns still fit, and nothing runs off the side', async ({ page }) => {
    await page.goto('/#/components/button');
    await expect(page.locator('.app-rail')).toBeVisible();
    await expect(page.locator('.outline')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

test.describe('compact', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the areas drop to the bar at the bottom and the rail goes away', async ({ page }) => {
    await page.goto('/#/components/button');
    await expect(page.locator('.app-rail')).toBeHidden();

    /* Same element, still one list: the bar is pinned to the bottom of the screen here rather
       than placed in the band. */
    const bar = await box(page, '.app-sections');
    expect(bar.y, `the bar is at ${bar.y} in an 844px window`).toBeGreaterThan(600);
    await expect(page.getByRole('button', { name: '打开显示偏好' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('one example per column, and the column fits', async ({ page }) => {
    await page.goto('/#/components/button');
    const grid = await box(page, '.demo-grid');
    const first = await box(page, '.demo-card >> nth=0');
    expect(first.w, `the example is ${first.w}px in a ${grid.w}px column`).toBeLessThanOrEqual(grid.w);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
