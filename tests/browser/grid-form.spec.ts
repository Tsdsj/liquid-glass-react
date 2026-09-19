import { test, expect } from '@playwright/test';

/* ---------------------------------------------------------------------------------------
 * Grid. The point of `minItemWidth` is that the column count is derived, so the same grid is
 * right in a sidebar and right full width without either being written down.
 * ------------------------------------------------------------------------------------- */

/**
 * Measured by resizing the grid's **container**, not the window.
 *
 * The first version changed the viewport and read two columns at both 1440 and 700, which
 * looked like the grid ignoring its space and was not: the demo frame caps it at 392px either
 * way, so the window was never the thing that changed. That is also the whole point of the
 * component — it answers to the box it is in, and the box it is in is often not the window.
 */
test('the column count follows the space it is given, not the window', async ({ page }) => {
  await page.goto('/#/components/grid');
  const grid = page.locator('#grid-auto-demo');
  await grid.scrollIntoViewIfNeeded();

  const columnsAt = (width: number) => grid.evaluate((node, value) => {
    (node as HTMLElement).style.width = `${value}px`;
    // Force layout, then read the tracks the grid resolved to.
    void node.getBoundingClientRect();
    return getComputedStyle(node).gridTemplateColumns.split(' ').filter(Boolean).length;
  }, width);

  // minItemWidth is 140 and the gap is 12.
  expect(await columnsAt(900)).toBe(6);
  expect(await columnsAt(500)).toBe(3);
  expect(await columnsAt(300)).toBe(2);
  // Narrower than one item: one column, and it shrinks rather than overflowing.
  expect(await columnsAt(100)).toBe(1);
});

test('a single column does not overflow a container narrower than one item', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/#/components/grid');
  await page.locator('#grid-auto-demo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, `${overflow}px of sideways scroll`).toBeLessThanOrEqual(1);
});

test('a fixed column count is exactly that', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/components/grid');
  const grid = page.locator('#grid-fixed-demo');
  await grid.scrollIntoViewIfNeeded();
  const tracks = await grid.evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
  expect(tracks).toBe(3);
});

/**
 * The room a focus ring needs is the gap, floored at 8.
 *
 * The first version of this put padding on every child instead, and the test that caught it
 * is this one: `.lg-button` has padding of its own, the grid's rule lost to it, and the
 * measured room was zero. Space *between* items is the grid's to give; space *inside* one
 * belongs to the item.
 */
test('the gap leaves room for an item focus ring', async ({ page }) => {
  await page.goto('/#/components/grid');
  const grid = page.locator('#grid-focus-demo');
  await grid.scrollIntoViewIfNeeded();

  const gap = await grid.evaluate(node => parseFloat(getComputedStyle(node).columnGap));
  expect(gap).toBeGreaterThanOrEqual(8);

  const button = grid.getByRole('button').first();
  await button.focus();
  const ring = await button.evaluate(node => {
    const style = getComputedStyle(node);
    return parseFloat(style.outlineWidth) + Math.max(0, parseFloat(style.outlineOffset));
  });
  expect(gap / 2, `a ${ring}px ring with ${gap / 2}px to each side`).toBeGreaterThanOrEqual(ring - 0.5);
});

/* ---------------------------------------------------------------------------------------
 * Form. The detail that is usually skipped is the one that matters: the control is rendered
 * *inside* the label, which makes the words part of its hit region.
 * ------------------------------------------------------------------------------------- */

test('the row label is part of the control, not next to it', async ({ page }) => {
  await page.goto('/#/components/form');
  const form = page.locator('#form-basic-demo');
  await form.scrollIntoViewIfNeeded();
  const row = form.locator('.lg-form-row').first();

  /**
   * No nested labels. The obvious design wraps the control in a `<label>` so the words are
   * part of its hit region; it was tried and it does not work, because `GlassSwitch` and
   * `TextField` render a `<label>` of their own and a label inside a label is invalid — the
   * browser's answer is that the outer one stops working, measured as "clicking the row's
   * words did nothing at all". Naming stays where it already was.
   */
  const labels = await row.evaluate(node => {
    const all = [...node.querySelectorAll('label')];
    return { count: all.length, nested: all.some(label => label.querySelector('label') !== null) };
  });
  expect(labels.nested, 'a <label> inside a <label>: the outer one silently stops working').toBe(false);

  // And the control still has a name of its own, which is where the name belongs.
  await expect(row.getByRole('switch', { name: 'Wi‑Fi' })).toBeVisible();
});

test('every control in a form row is named without the row naming it', async ({ page }) => {
  await page.goto('/#/components/form');
  const form = page.locator('#form-basic-demo');
  await form.scrollIntoViewIfNeeded();
  const unnamed = await form.locator('[role="switch"], input, textarea, .lg-stepper-button').evaluateAll(nodes =>
    nodes.filter(node => !node.getAttribute('aria-label')
      && !node.getAttribute('aria-labelledby')
      && !node.closest('label')
      && !node.textContent?.trim()).length);
  expect(unnamed).toBe(0);
});

test('a section header is a real heading', async ({ page }) => {
  await page.goto('/#/components/form');
  const form = page.locator('#form-basic-demo');
  await form.scrollIntoViewIfNeeded();
  const header = form.locator('.lg-form-header');
  const tag = await header.evaluate(node => node.tagName);
  expect(tag).toBe('H3');
  // Title case, not the ALL CAPS that went with the previous design.
  await expect(header).toHaveCSS('text-transform', 'none');
});

test('the section is named and described by its own header and footer', async ({ page }) => {
  await page.goto('/#/components/form');
  const section = page.locator('#form-basic-demo .lg-form-section').first();
  await section.scrollIntoViewIfNeeded();
  const wiring = await section.evaluate(node => ({
    labelled: document.getElementById(node.getAttribute('aria-labelledby') ?? '')?.textContent,
    described: document.getElementById(node.getAttribute('aria-describedby') ?? '')?.textContent,
  }));
  expect(wiring.labelled).toBe('网络');
  expect(wiring.described).toContain('只影响这个演示');
});

test('an error is announced, not only reddened', async ({ page }) => {
  await page.goto('/#/components/form');
  const form = page.locator('#form-stacked-demo');
  await form.scrollIntoViewIfNeeded();
  const row = form.locator('.lg-form-row[data-invalid="true"]').first();
  await expect(row).toBeVisible();

  const described = await row.locator('.lg-form-row-control').getAttribute('aria-describedby');
  expect(described).toBeTruthy();
  await expect(page.locator(`#${described}`)).toContainText('完整的邮箱地址');
});

test('it is a real form', async ({ page }) => {
  await page.goto('/#/components/form');
  const form = page.locator('#form-basic-demo');
  await form.scrollIntoViewIfNeeded();
  expect(await form.evaluate(node => node.tagName)).toBe('FORM');
});

test('rows keep a 44pt height', async ({ page }) => {
  await page.goto('/#/components/form');
  const form = page.locator('#form-basic-demo');
  await form.scrollIntoViewIfNeeded();
  const heights = await form.locator('.lg-form-row-label').evaluateAll(nodes =>
    nodes.map(node => node.getBoundingClientRect().height));
  for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);
});
