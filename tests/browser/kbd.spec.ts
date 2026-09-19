import { test, expect } from '@playwright/test';

/**
 * Two things a hand-written shortcut hint gets wrong, and both of them silently.
 *
 * The modifier order on Apple platforms is fixed — ⌃ ⌥ ⇧ ⌘, Command nearest the key it
 * modifies — and nothing stops someone typing them in the order they thought of them.
 *
 * And the glyphs are not text a screen reader can read. ⌘ is announced as "place of interest
 * sign" or skipped entirely, depending on the reader, so a hint that looks perfect is either
 * nonsense or silence to the people who most need to know the shortcut exists.
 */

const PAGE = '/#/components/kbd';

test('the modifiers come out in the platform order, whatever order they went in', async ({ page }) => {
  await page.goto(PAGE);
  const rendered = await page.locator('#kbd-order-demo .lg-kbd').evaluateAll(nodes =>
    nodes.map(node => node.textContent?.trim()));
  // "K+cmd+shift" and "shift ctrl opt cmd S" — Command last, before the key.
  expect(rendered[0]).toBe('⇧⌘K');
  expect(rendered[1]).toBe('⌃⌥⇧⌘S');
});

test('words become glyphs, and unknown keys are left alone', async ({ page }) => {
  await page.goto(PAGE);
  const rendered = await page.locator('#kbd-basic-demo .lg-kbd').evaluateAll(nodes =>
    nodes.map(node => node.textContent?.trim()));
  expect(rendered).toEqual(['⌘K', '⇧⌘P', '⌃⌥⌫', '⎋', '↑']);
});

test('a screen reader hears words, not glyphs', async ({ page }) => {
  await page.goto(PAGE);
  const first = page.locator('#kbd-basic-demo .lg-kbd').first();
  await expect(first).toHaveAttribute('aria-label', 'Command K');

  // And the glyphs themselves are hidden, so they are not read twice or read as junk.
  const hidden = await first.locator('span').getAttribute('aria-hidden');
  expect(hidden).toBe('true');
});

test('every glyph it draws has a word behind it', async ({ page }) => {
  await page.goto(PAGE);
  const pairs = await page.locator('#kbd-basic-demo .lg-kbd').evaluateAll(nodes =>
    nodes.map(node => ({ shown: node.textContent?.trim() ?? '', spoken: node.getAttribute('aria-label') ?? '' })));
  expect(pairs).toEqual([
    { shown: '⌘K', spoken: 'Command K' },
    { shown: '⇧⌘P', spoken: 'Shift Command P' },
    { shown: '⌃⌥⌫', spoken: 'Control Option Delete' },
    { shown: '⎋', spoken: 'Escape' },
    { shown: '↑', spoken: '↑' },
  ]);
  // The last pair is the honest limit: an arrow glyph has no word in the table, so it is
  // announced as itself. Better than silence, and a caller who needs "Up arrow" passes it.
});

test('it is text, not a control', async ({ page }) => {
  await page.goto(PAGE);
  const tag = await page.locator('#kbd-basic-demo .lg-kbd').first().evaluate(node => node.tagName);
  expect(tag).toBe('KBD');
  // Nothing focusable, nothing clickable: a shortcut hint is not the command.
  expect(await page.locator('#kbd-basic-demo .lg-kbd[tabindex], #kbd-basic-demo button.lg-kbd').count()).toBe(0);
});
