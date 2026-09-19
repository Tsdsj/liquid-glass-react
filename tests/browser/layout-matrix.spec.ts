import { test, expect, type Page } from '@playwright/test';

/**
 * The layout containers, at every width that changes them, mirrored, and at the largest text
 * size — asserted rather than reported.
 *
 * `matrix.spec.ts` sweeps every component page and writes a list; this is the follow-up the
 * roadmap asks for, and it is a different kind of test. A container's whole job is to arrange
 * things, so "does it still fit" is not an observation about it, it is the thing it promises.
 * Three facts, on every cell:
 *
 * - the document does not scroll sideways (a horizontal scrollbar on a phone is the defect
 *   nobody can work around);
 * - the container's own box does not overflow itself, which is where a two-column layout that
 *   refuses to collapse shows up first;
 * - the container is still on screen and has a box, so "it fits" cannot be satisfied by
 *   disappearing.
 *
 * 390 is the narrowest phone in common use, 767/768 straddle the size-class boundary, and 1440
 * is a desktop window. AX5 is the largest accessibility text size — it is what actually breaks
 * a layout, and it breaks it differently once the layout is mirrored.
 */

const PAGES = [
  { slug: 'split-view', container: '.lg-split' },
  { slug: 'navigation-stack', container: '.lg-stack' },
  { slug: 'grid', container: '.lg-grid' },
  { slug: 'form', container: '.lg-form' },
  { slug: 'list', container: '.lg-list' },
] as const;

const WIDTHS = [390, 767, 768, 1440];

interface Cell { dir: 'ltr' | 'rtl'; textSize: 'l' | 'ax5' }
const CELLS: Cell[] = [
  { dir: 'ltr', textSize: 'l' },
  { dir: 'rtl', textSize: 'l' },
  { dir: 'ltr', textSize: 'ax5' },
  { dir: 'rtl', textSize: 'ax5' },
];

async function applyCell(page: Page, cell: Cell) {
  await page.evaluate(({ dir, textSize }) => {
    document.documentElement.dir = dir;
    document.documentElement.dataset.lgTextSize = textSize;
  }, cell);
  // A frame for the resize observers the containers use…
  await page.waitForTimeout(160);
  /**
   * …and then wait for the transitions to finish.
   *
   * This measures the layout a reader ends up with, not one mid-animation. A navigation stack's
   * incoming screen deliberately starts 16px to one side, and reading the box while that is
   * playing reports a 16px overflow that is the transition doing its job. (The stack clips that
   * slide so it never reaches the document — see `overflow-x: clip` in the stylesheet — but its
   * own `scrollWidth` still counts it.)
   */
  await page.waitForFunction(
    () => document.getAnimations().every(animation => animation.playState !== 'running'),
    undefined, { timeout: 5000 },
  ).catch(() => {});
}

for (const { slug, container } of PAGES) {
  test(`${slug} fits every width, both directions, at the largest text size`, async ({ page }) => {
    test.setTimeout(120_000);
    const problems: string[] = [];

    for (const width of WIDTHS) {
      for (const cell of CELLS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/#/components/${slug}`);
        await page.waitForSelector('#main');
        await applyCell(page, cell);

        const result = await page.evaluate(selector => {
          const root = document.documentElement;
          const boxes = [...document.querySelectorAll<HTMLElement>(selector)]
            .filter(node => node.getClientRects().length > 0);
          return {
            pageOverflow: root.scrollWidth - root.clientWidth,
            found: boxes.length,
            inner: boxes.map(node => ({
              overflow: node.scrollWidth - node.clientWidth,
              width: Math.round(node.getBoundingClientRect().width),
              height: Math.round(node.getBoundingClientRect().height),
            })),
          };
        }, container);

        const where = `${width}px ${cell.dir} ${cell.textSize}`;
        if (result.pageOverflow > 1) problems.push(`${where}: the page scrolls ${result.pageOverflow}px sideways`);
        if (result.found === 0) problems.push(`${where}: no ${container} on the page at all`);
        for (const box of result.inner) {
          /* One pixel of slack: sub-pixel widths round in whichever direction the layout
             happens to land, and a rounding artefact is not a layout failure. */
          if (box.overflow > 1) problems.push(`${where}: a ${container} overflows itself by ${box.overflow}px`);
          if (box.width < 2 || box.height < 2) problems.push(`${where}: a ${container} collapsed to ${box.width}×${box.height}`);
        }
      }
    }

    expect(problems, problems.join('\n')).toEqual([]);
  });
}

/**
 * The tab bar at the largest text size on the narrowest phone.
 *
 * Capping the bar's width stops it pushing the document sideways and, on its own, simply hides
 * the labels that no longer fit — which at AX5 means hiding them from exactly the people who
 * asked for bigger text. Wrapping is the reflow: every tab stays whole, on however many rows
 * it takes.
 */
test('every tab stays whole when the text is at its largest', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/#/components/button');
  await page.waitForSelector('#main');
  await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; });
  await page.waitForTimeout(300);

  /**
   * Measured on the label's line count, not on the tab's box.
   *
   * Capping the bar's width already keeps every tab inside it — flex items shrink — so a box
   * measurement passes while each two-character label is squeezed into a column one character
   * wide. What wrapping buys is that the tabs keep their natural width and take a second row,
   * so each label still reads as one line. That is the thing worth asserting.
   */
  const squeezed = await page.evaluate(() => {
    const group = document.querySelector<HTMLElement>('.lg-tabbar[data-layout="tabbar"] .lg-tabbar-group');
    if (!group) return ['no tab bar on screen'];
    return [...group.querySelectorAll<HTMLElement>('.lg-tab-label')]
      .map(label => {
        const line = parseFloat(getComputedStyle(label).lineHeight) || 16;
        return { label, lines: Math.round(label.getBoundingClientRect().height / line) };
      })
      .filter(({ lines }) => lines > 1)
      .map(({ label, lines }) => `「${label.textContent?.trim()}」 is broken over ${lines} lines`);
  });
  expect(squeezed, squeezed.join('\n')).toEqual([]);
});

/**
 * The mirror. A container that lays out by `left`/`right` rather than by start/end passes every
 * fitting check above and is still wrong — the sidebar ends up on the wrong side.
 *
 * Asserted as a mirror rather than by arithmetic, for the reason the RTL slider suspicion
 * taught: the moment a test starts computing where something *should* be, it can be wrong in
 * the same way the code is. Symmetry needs no constants.
 */
test('the split view mirrors, rather than merely fitting', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const sidebarSide = async (dir: 'ltr' | 'rtl') => {
    await page.goto('/#/components/split-view');
    await page.waitForSelector('#split-demo');
    await page.evaluate(value => { document.documentElement.dir = value; }, dir);
    await page.waitForTimeout(200);
    return page.evaluate(() => {
      const split = document.querySelector<HTMLElement>('#split-demo .lg-split')!;
      const sidebar = split.querySelector<HTMLElement>('.lg-split-column[data-column="sidebar"]')!;
      const outer = split.getBoundingClientRect(), inner = sidebar.getBoundingClientRect();
      // Distance from each edge of the split view to the sidebar.
      return { fromLeft: inner.left - outer.left, fromRight: outer.right - inner.right };
    });
  };

  const ltr = await sidebarSide('ltr');
  const rtl = await sidebarSide('rtl');
  expect(ltr.fromLeft, `the sidebar is ${ltr.fromLeft}px from the leading edge in LTR`).toBeLessThan(2);
  expect(rtl.fromRight, `the sidebar is ${rtl.fromRight}px from the leading edge in RTL`).toBeLessThan(2);
});
