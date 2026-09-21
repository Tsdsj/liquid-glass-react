import { test, expect, type Page } from '@playwright/test';
import { expectReachable } from './hit-floor.js';

/**
 * A tree is mostly keyboard, so this is mostly keyboard.
 *
 * Each test asks the outline for one thing it promises rather than for the markup it happens to
 * produce: that the whole tree is one stop, that the arrow keys walk what you can see rather
 * than what is in the DOM, that a closed folder is closed to everyone, and that the triangle
 * and the name are two different things to click.
 */

const tree = (page: Page) => page.locator('#outline-basic-demo [role="tree"]');
const row = (page: Page, key: string) => page.locator(`#outline-basic-demo [data-key="${key}"]`);
/** A row's own triangle. `[data-key] .lg-outline-twist` would also match every row inside it. */
const twist = (page: Page, key: string) =>
  page.locator(`#outline-basic-demo [data-key="${key}"] > .lg-outline-row > .lg-outline-twist`);
const label = (page: Page, key: string) =>
  page.locator(`#outline-basic-demo [data-key="${key}"] > .lg-outline-row > .lg-outline-label`);
/** The row the browser is actually on, by its key. */
const focused = (page: Page) => page.evaluate(() =>
  (document.activeElement as HTMLElement | null)?.dataset?.key ?? null);

async function open(page: Page) {
  await page.goto('/#/components/outline-view');
  await tree(page).scrollIntoViewIfNeeded();
}

/* ------------------------------------------------------------ the tab order ------------- */

test('the whole tree is one stop in the tab order, not one per row', async ({ page }) => {
  await open(page);
  /* A folder per Tab is how a tree stops being usable: ten folders of ten files is a hundred
     presses to get past it. The tree model spends one stop and then uses the arrow keys. */
  const stops = await tree(page).locator('[role="treeitem"][tabindex="0"]').count();
  expect(stops, 'more than one row is in the tab order').toBe(1);
  /* And it is the selected row that holds it: tabbing into a tree should land where you left
     off, not at the top of a folder you have already walked past. */
  await expect(row(page, 'proposal')).toHaveAttribute('tabindex', '0');

  /* And Tab leaves, rather than walking down the tree. */
  await row(page, 'docs').focus();
  await page.keyboard.press('Tab');
  expect(await focused(page), 'Tab stayed inside the tree').toBeNull();
});

/* ------------------------------------------------------------ walking ------------------- */

test('Down and Up walk the rows you can see, not the rows in the document', async ({ page }) => {
  await open(page);
  /* `drafts` is closed, and its two children are in the DOM the whole time. Stepping past it
     must land on the next visible row — a walk that followed the document would disappear into
     a folder nobody opened. */
  await row(page, 'drafts').focus();
  await page.keyboard.press('ArrowDown');
  expect(await focused(page)).toBe('images');
  await page.keyboard.press('ArrowUp');
  expect(await focused(page)).toBe('drafts');
  await page.keyboard.press('End');
  expect(await focused(page)).toBe('locked');
  await page.keyboard.press('Home');
  expect(await focused(page)).toBe('docs');
});

test('Right opens a folder and then steps into it; Left closes it and then steps out', async ({ page }) => {
  await open(page);
  await row(page, 'drafts').focus();
  await expect(row(page, 'drafts')).toHaveAttribute('aria-expanded', 'false');

  /* Two presses, not one. A key that both opened the folder and left it would never let you
     look at what it opened. */
  await page.keyboard.press('ArrowRight');
  await expect(row(page, 'drafts')).toHaveAttribute('aria-expanded', 'true');
  expect(await focused(page), 'the first Right moved as well as opened').toBe('drafts');
  await page.keyboard.press('ArrowRight');
  expect(await focused(page)).toBe('proposal-old');

  /* Left on a leaf goes up a level; Left on an open folder closes it first. */
  await page.keyboard.press('ArrowLeft');
  expect(await focused(page)).toBe('drafts');
  await page.keyboard.press('ArrowLeft');
  await expect(row(page, 'drafts')).toHaveAttribute('aria-expanded', 'false');
  expect(await focused(page), 'closing also moved').toBe('drafts');
});

test('typing a name jumps to it', async ({ page }) => {
  await open(page);
  await row(page, 'docs').focus();
  await page.keyboard.press('r');
  expect(await focused(page)).toBe('readme');
  await page.waitForTimeout(800);   // longer than the 700ms the buffer lives for
  await page.keyboard.press('r');
  expect(await focused(page), 'a second r stayed on the first match').toBe('report');
  /* Matching runs over the visible rows starting after the current one, so a third press goes
     round rather than stopping at the bottom of the list. */
  await page.waitForTimeout(800);
  await page.keyboard.press('r');
  expect(await focused(page), 'the search did not wrap back to the top').toBe('readme');
});

/* ------------------------------------------------------------ closed means closed ------- */

test('a closed folder is closed to everyone, not just to the eye', async ({ page }) => {
  await open(page);
  await expect(row(page, 'drafts')).toHaveAttribute('aria-expanded', 'false');
  /* The rows inside stay in the DOM so the height can animate. `content-visibility: hidden` is
     what makes them actually gone: not focusable, not found by find-in-page, not in the
     accessibility tree. `hidden` plus a `display` rule was the week-7 panel bug — out of the
     accessibility tree and still drawn — and this is the same mistake with the halves swapped.
     Asked of the browser rather than of the stylesheet. */
  const child = row(page, 'notes');
  expect(await child.evaluate(node => node.checkVisibility()), 'a row inside a closed folder is visible').toBe(false);
  expect(await child.evaluate(node => { node.focus(); return document.activeElement === node; }),
    'a row inside a closed folder can be focused').toBe(false);

  /* An empty container is a different statement from a leaf, and it makes it. */
  await expect(row(page, 'archive'), 'an empty folder lost its aria-expanded').toHaveAttribute('aria-expanded', 'false');
  await expect(row(page, 'readme'), 'a leaf is pretending it can open').not.toHaveAttribute('aria-expanded', /.*/);
});

test('closing a folder you are standing in catches you on the folder', async ({ page }) => {
  await open(page);
  await row(page, 'proposal').focus();
  expect(await focused(page)).toBe('proposal');
  /* Its parent is what disappears under it. Without the catch, focus falls to the document body
     and the next Tab starts again from the top of the page. */
  await twist(page, 'docs').click();
  expect(await focused(page)).toBe('docs');
});

/* ------------------------------------------------------------ the two meanings ---------- */

test('the triangle opens the folder and the name selects the row', async ({ page }) => {
  await open(page);
  const images = row(page, 'images');
  await expect(images).toHaveAttribute('aria-expanded', 'false');

  await label(page, 'images').click();
  await expect(images, 'clicking the name opened the folder').toHaveAttribute('aria-expanded', 'false');
  await expect(images).toHaveAttribute('aria-selected', 'true');

  await twist(page, 'images').click();
  await expect(images).toHaveAttribute('aria-expanded', 'true');
  await expect(images, 'clicking the triangle changed the selection too').toHaveAttribute('aria-selected', 'true');
});

test('Option-clicking the triangle opens the whole branch', async ({ page }) => {
  await open(page);
  await twist(page, 'docs').click();       // close it first
  await expect(row(page, 'docs')).toHaveAttribute('aria-expanded', 'false');

  /* "Option-clicking the disclosure triangle expands all of its subfolders." One press rather
     than one per level, which is the whole point of it. */
  await twist(page, 'docs').click({ modifiers: ['Alt'] });
  await expect(row(page, 'docs')).toHaveAttribute('aria-expanded', 'true');
  await expect(row(page, 'drafts'), 'only the top level opened').toHaveAttribute('aria-expanded', 'true');
  await expect(row(page, 'notes')).toBeVisible();
});

test('a disabled row cannot be selected, by pointer or by keyboard', async ({ page }) => {
  await open(page);
  const locked = row(page, 'locked');
  await expect(locked).toHaveAttribute('aria-disabled', 'true');
  await label(page, 'locked').click();
  await expect(locked).toHaveAttribute('aria-selected', 'false');
  await locked.focus();
  await page.keyboard.press('Enter');
  await expect(locked).toHaveAttribute('aria-selected', 'false');
});

/* ------------------------------------------------------------ what it tells others ------ */

test('the tree says how deep each row is', async ({ page }) => {
  await open(page);
  await expect(row(page, 'docs')).toHaveAttribute('aria-level', '1');
  await expect(row(page, 'proposal')).toHaveAttribute('aria-level', '2');
  await expect(row(page, 'drafts')).toHaveAttribute('aria-level', '2');
  /* The hierarchy is in the first column only, so depth is the indent and nothing else moves. */
  const indents = await page.locator('#outline-basic-demo .lg-outline-row').evaluateAll(nodes =>
    nodes.slice(0, 2).map(node => parseFloat(getComputedStyle(node).paddingInlineStart)));
  expect(indents[1] - indents[0], 'a level does not step in').toBeGreaterThan(8);
});

/**
 * A `treeitem` is the `<li>`, and the `<li>` **contains its children**.
 *
 * So `.lg-outline-item:hover` is true for the row under the pointer and for every folder it is
 * inside — put the pointer on a file three deep and four rows lit up. The selection background
 * had already been moved off the item for exactly this reason, with a comment saying so, and
 * the hover was left on it.
 *
 * The row is the thing you point at, so the row is what answers.
 */
test('hovering a row lights that row, not every folder above it', async ({ page }) => {
  await open(page);
  await twist(page, 'drafts').click();
  await expect(row(page, 'drafts')).toHaveAttribute('aria-expanded', 'true');
  /* After the folder has finished opening. Hovering while it is still growing aims the pointer
     at where the row was a moment ago and lands it on a neighbour — a flake that only showed up
     in a full run, where the machine is busy enough for the timing to matter. */
  await tree(page).evaluate(node => Promise.all(node.getAnimations({ subtree: true })
    .map(animation => animation.finished.catch(() => undefined))));

  await page.locator('#outline-basic-demo [data-key="proposal-old"] > .lg-outline-row').hover();
  const lit = await page.locator('#outline-basic-demo .lg-outline-row').evaluateAll(nodes => nodes
    .filter(node => {
      const painted = getComputedStyle(node).backgroundColor;
      /* The selected row is painted too and is not what this is about. */
      return painted !== 'rgba(0, 0, 0, 0)' && !(node.parentElement as HTMLElement).dataset.selected;
    })
    .map(node => (node.parentElement as HTMLElement).dataset.key));
  expect(lit, `${lit.length} rows are lit: ${lit.join(', ')}`).toEqual(['proposal-old']);
});

/**
 * Hover is feedback, not a replacement for the selection.
 *
 * `…:not([data-disabled="true"]) > .lg-outline-row:hover` is four class-ish parts and the
 * selected rule was three, so the hover fill won on specificity wherever they met and the blue
 * simply went away under the pointer. Asked as "is the selected row still the accent colour",
 * which is the thing a reader would say out loud.
 */
test('hovering the selected row does not take the selection away', async ({ page }) => {
  await open(page);
  const accent = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--lg-accent').trim());
  const painted = () => page.locator('#outline-basic-demo .lg-outline-lens').evaluate(node =>
    ({ background: getComputedStyle(node).backgroundColor, shown: node.dataset.shown }));

  const before = await painted();
  expect(before.shown, 'nothing is drawing the selection').toBe('true');
  await page.locator('#outline-basic-demo [data-key="proposal"] > .lg-outline-row').hover();
  const after = await painted();
  expect(after, `the selection was ${before.background} and became ${after.background} under the pointer`)
    .toEqual(before);
  expect(after.background.replace(/\s/g, ''), `the selection is not the accent (${accent})`)
    .toMatch(/^rgba?\(0,136,255/);
});

/**
 * And moving the selection is a move.
 *
 * The highlight used to be a background on each row, so changing rows was a 90ms cross-fade
 * between two boxes — which reads as an instant jump, and was reported as "no animation". It is
 * one element now, and it travels; the same thing the tab bar's sidebar form does, for the same
 * reason.
 */
test('the selection slides from one row to the next', async ({ page }) => {
  await open(page);
  const lens = page.locator('#outline-basic-demo .lg-outline-lens');
  const where = () => lens.evaluate(node => node.getBoundingClientRect().top);

  const from = await where();
  await page.locator('#outline-basic-demo [data-key="readme"] > .lg-outline-row').click();
  const moving = await lens.evaluate(node =>
    node.getAnimations().map(animation => (animation as CSSTransition).transitionProperty));
  expect(moving, 'the highlight arrived without travelling').toContain('translate');

  /* And it really is between the two rows part-way through, not merely "an animation exists". */
  const mid = await where();
  const to = await lens.evaluate(node => new Promise<number>(resolve =>
    Promise.all(node.getAnimations().map(a => a.finished.catch(() => undefined)))
      .then(() => resolve(node.getBoundingClientRect().top))));
  expect(mid, `it went ${from} → ${mid} → ${to}`).toBeGreaterThan(from);
  expect(mid).toBeLessThan(to);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await tree(page).scrollIntoViewIfNeeded();
  await page.locator('#outline-basic-demo [data-key="readme"] > .lg-outline-row').click();
  expect(await lens.evaluate(node => node.getAnimations().length),
    'the highlight still travels under Reduce Motion').toBe(0);
});

test('a row is big enough to hit with whatever you are pointing with', async ({ page }) => {
  await open(page);
  /* An outline is a desktop idiom — the HIG lists it as unsupported on iOS — and a compact
     desktop row is 32px. That is fine for a cursor and under the floor for a fingertip, and a
     desktop idiom on a web page still gets opened on a phone. */
  await expectReachable(page, page.locator('#outline-basic-demo [data-key="readme"] > .lg-outline-row'), 'an outline row');
});

test('expansion is the caller\'s to keep', async ({ page }) => {
  await page.goto('/#/components/outline-view');
  const demo = page.locator('#outline-remember-demo');
  await demo.scrollIntoViewIfNeeded();
  /* The component reports; it does not remember. A caller that never stores this gets a tree
     that opens fresh every visit — which is the honest outcome, rather than a `useState` that
     looks like it remembers until the page reloads. */
  await expect(demo.locator('#outline-open-keys')).toHaveText(/docs、drafts/);
  await demo.locator('[data-key="drafts"] > .lg-outline-row > .lg-outline-twist').click();
  await expect(demo.locator('#outline-open-keys')).toHaveText(/开着的：docs$/);
});

/* ------------------------------------------------------------ motion -------------------- */

test('a folder opening is a folder opening, and Reduce Motion stops it', async ({ page }) => {
  await open(page);
  const group = page.locator('#outline-basic-demo [data-key="images"] > .lg-outline-group');
  await twist(page, 'images').click();
  const moving = await group.evaluate(node => node.getAnimations().map(a => (a as CSSTransition).transitionProperty));
  /* `block-size` is declared; the browser reports the physical name it resolves to in this
     writing mode. Asserting the declared name would be asserting the stylesheet's spelling. */
  expect(moving, 'the folder appeared between two frames').toContain('height');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await tree(page).scrollIntoViewIfNeeded();
  await twist(page, 'images').click();
  expect(await group.evaluate(node => node.getAnimations().length),
    'something still animates under Reduce Motion').toBe(0);
});
