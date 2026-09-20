import { test, expect, type Page } from '@playwright/test';

/**
 * The documentation site as a desktop window.
 *
 * Every assertion here started as a measurement of what was wrong. At 1680×1000 the navigation
 * was a 228×114 capsule floating in a 260×1000 rail with 886px of nothing under it; the title
 * bar centred itself against the whole window while the content centred against what was left
 * of it, so the two were 130px out of step and the toolbar read as unanchored; and the page's
 * own outline stopped 170px short of the right edge.
 *
 * So these are alignment and fit, not appearance: things line up with each other, nothing
 * floats in a column it does not fill, and the chrome is made of the library's own components
 * doing the job they were written for.
 */

const box = (page: Page, selector: string) => page.locator(selector).evaluate(node => {
  const rect = node.getBoundingClientRect();
  return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
});

test.describe('wide', () => {
  test.use({ viewport: { width: 1680, height: 1000 } });

  test('the title bar and the page are the same column', async ({ page }) => {
    await page.goto('/#/components/button');
    const bar = await box(page, '.app-bar');
    const content = await box(page, '.app-content');
    expect({ x: bar.x, w: bar.w }, 'the title bar is not over the page it belongs to')
      .toEqual({ x: content.x, w: content.w });

    // And the leading edge of the commands is the leading edge of the heading.
    const menubar = await box(page, '.app-menubar');
    const heading = await box(page, 'h1');
    expect(Math.abs(menubar.x - heading.x), `menu bar at ${menubar.x}, heading at ${heading.x}`).toBeLessThanOrEqual(1);
  });

  test('the sidebar is a source list that fills its rail', async ({ page }) => {
    await page.goto('/#/components/button');
    const rail = await box(page, '.lg-tabbar[data-layout="sidebar"]');
    const surface = await box(page, '.lg-tabbar-group');
    /* Within the rail's own padding. The capsule used to be 114px tall in a 1000px rail, which
       is what made the whole left of the window read as empty. */
    expect(surface.h, `the source list is ${surface.h} of a ${rail.h} rail`).toBeGreaterThan(rail.h * 0.8);

    // The section links and the page list are one material, not two treatments in one column.
    const inside = await page.locator('.lg-tabbar-group .lg-tabbar-accessory').count();
    expect(inside, 'the page list is outside the source list surface').toBe(1);
  });

  test('the page list scrolls without taking the sections with it', async ({ page }) => {
    await page.goto('/#/components/button');
    const links = page.locator('.lg-tabbar[data-layout="sidebar"] .lg-tab-links');
    const before = await box(page, '.lg-tabbar .lg-tab-link >> nth=0');
    await page.locator('.lg-tabbar-accessory').evaluate(node => { node.scrollTop = 400; });
    const after = await box(page, '.lg-tabbar .lg-tab-link >> nth=0');
    expect(after.y, 'scrolling the page list moved the section links').toBe(before.y);
    // Four sections in a column, not wrapped into columns of their own.
    const xs = await links.locator('.lg-tab-link').evaluateAll(nodes =>
      nodes.map(node => Math.round(node.getBoundingClientRect().x)));
    expect(new Set(xs).size, `the section links start at ${xs.join(', ')}`).toBe(1);

    /* And all four are on screen at once. A list of forty pages under them is tall enough to
       take the whole rail if the sections are allowed to shrink to fit around it — they were
       squeezed into a 47px scroller, which looks like a rendering fault rather than a list. */
    const list = await box(page, '.lg-tabbar[data-layout="sidebar"] .lg-tab-links');
    const count = xs.length;
    expect(list.h, `${count} section links share ${list.h}px`).toBeGreaterThanOrEqual(count * 24);
  });

  test('the outline reaches the trailing edge of the page', async ({ page }) => {
    await page.goto('/#/components/button');
    const outline = await box(page, '.outline');
    const content = await box(page, '.app-content');
    const gap = content.x + content.w - (outline.x + outline.w);
    expect(gap, `the outline stops ${gap}px short of the page's trailing edge`).toBeLessThanOrEqual(24);
  });

  test('prose keeps a measure while examples keep the column', async ({ page }) => {
    await page.goto('/#/components/button');
    const lede = await box(page, '.page-lede');
    const grid = await box(page, '.demo-grid');
    expect(lede.w, `the summary line is ${lede.w}px wide`).toBeLessThanOrEqual(700);
    expect(grid.w, 'the examples were capped along with the prose').toBeGreaterThan(900);

    /* And an example is wide enough to be an example. Three to a row gave each one 327px, at
       which the button page's row of seven buttons wrapped into three lines — the reader was
       being shown what the component does in a narrow column, not what it looks like. */
    const first = await box(page, '.demo-card >> nth=0');
    expect(first.w, `the first example is ${first.w}px wide`).toBeGreaterThanOrEqual(420);
  });

  /**
   * The menu bar is the site's own use of `MenuBar`, and the point of it is that the items do
   * something. A menu bar of placeholders would be the opposite of what this page is for.
   */
  test('a menu command changes the window it is in', async ({ page }) => {
    await page.goto('/#/components/button');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-lg-text-size', 'l');

    await page.getByRole('menuitem', { name: '文字' }).click();
    await page.getByRole('menuitemradio', { name: '小' }).click();
    await expect(html).toHaveAttribute('data-lg-text-size', 'm');

    await page.getByRole('menuitem', { name: '辅助功能' }).click();
    await page.getByRole('menuitemcheckbox', { name: '减少动效' }).click();
    /* The attribute the stylesheet answers to, written where the provider writes it. A menu
       item that only re-rendered its own checkmark would pass a test that looked at the menu. */
    await expect(html).toHaveAttribute('data-lg-motion', 'reduced');
  });

  test('appearance is a choice out of a list and the switches are not', async ({ page }) => {
    await page.goto('/#/components/button');
    /* The roles carry the difference: picking a theme clears the other two, ticking "reduce
       motion" does not touch the other switches, and a screen reader is told which is which. */
    await page.getByRole('menuitem', { name: '外观' }).click();
    await expect(page.getByRole('menuitemradio')).toHaveCount(3);
    await page.keyboard.press('Escape');

    await page.getByRole('menuitem', { name: '辅助功能' }).click();
    await expect(page.getByRole('menuitemcheckbox')).toHaveCount(3);
  });
});

/**
 * A short window with the largest text is where the source list runs out of room.
 *
 * Coverage rather than proof, and worth saying so: the source list did lay its four sections
 * out two-by-two at one point — `.lg-tab-links` wraps by default, which is the reflow the
 * largest text sizes need on a phone, and a wrapping column becomes *columns* as soon as it is
 * squeezed. Giving the page list a zero flex-basis stopped the squeezing, so nothing reaches
 * that state any more and no revert turns this red. It stays because it is the state that
 * would produce it again.
 */
test.describe('short window, largest text', () => {
  test.use({ viewport: { width: 1024, height: 560 } });

  test('the sections stay in one column when the rail runs out of height', async ({ page }) => {
    /* The overview, which has no page list under the sections — so nothing else in the column
       absorbs the shortfall and the links are the only thing left to shrink. */
    for (const path of ['components/button', 'overview']) {
      await page.goto(`/#/${path}`);
      await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; });
      const xs = await page.locator('.lg-tabbar[data-layout="sidebar"] .lg-tab-link')
        .evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().x)));
      expect(new Set(xs).size, `on ${path} the section links start at ${xs.join(', ')}`).toBe(1);
    }
  });
});

test.describe('compact', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('there is no menu bar where there is no window', async ({ page }) => {
    await page.goto('/#/components/button');
    await expect(page.locator('.app-menubar')).toBeHidden();
    // The settings are still reachable; they are simply all in the popover.
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
