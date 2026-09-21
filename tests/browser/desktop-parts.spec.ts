import { test, expect } from '@playwright/test';
import { expectReachable } from './hit-floor.js';

/**
 * The five things week 7 added, each checked at the thing it promises rather than at the
 * markup it happens to produce: a box that names its group, a path that folds in the middle,
 * a panel that floats without trapping anyone, a toolbar that gives up its items in order,
 * and a sheet that is a different object on a desk.
 */

/* ---------------------------------------------------------------- GroupBox ------------- */

test('a box is a named group, and the name is above the box', async ({ page }) => {
  await page.goto('/#/components/group-box');
  const group = page.getByRole('group', { name: '网络' }).first();
  await expect(group).toBeVisible();
  /* "macOS displays a box's title above it" — asserted by geometry, because that is the part
     a caller can see and the part a stylesheet change could quietly undo. */
  const [title, body] = await page.locator('.lg-groupbox-title, .lg-groupbox-body').evaluateAll(nodes =>
    nodes.slice(0, 2).map(node => node.getBoundingClientRect().top));
  expect(title, `the title is at ${title} and the box at ${body}`).toBeLessThan(body);
});

/* ---------------------------------------------------------------- PathBar -------------- */

test('the last level of a path is where you are, not a link to it', async ({ page }) => {
  await page.goto('/#/components/path-bar');
  const bar = page.locator('#path-basic-demo .lg-path');
  const last = bar.locator('.lg-path-level').last();
  await expect(last).toHaveAttribute('aria-current', 'page');
  expect(await last.evaluate(node => node.tagName), 'the current level is a link').toBe('SPAN');
  await expect(bar.locator('.lg-path-level[href]').first()).toBeVisible();
});

test('a path too long for its box folds in the middle and keeps the ends', async ({ page }) => {
  await page.goto('/#/components/path-bar');
  const bar = page.locator('#path-basic-demo .lg-path');
  await bar.scrollIntoViewIfNeeded();
  const more = bar.getByRole('button', { name: 'More levels' });
  await expect(more, 'nothing folded at the demo width').toBeVisible();

  /* The two levels that say what this is are the two that never go. */
  const labels = await bar.locator('.lg-path-label').allInnerTexts();
  expect(labels[0]).toBe('Macintosh HD');
  expect(labels[labels.length - 1]).toBe('设计稿 v7.sketch');

  /* And what folded is still reachable, which is the difference between collapsing and losing. */
  await more.click();
  await expect(page.getByRole('menuitem', { name: '用户' })).toBeVisible();
});

test('a path level is big enough to click with whatever you are pointing with', async ({ page }) => {
  await page.goto('/#/components/path-bar');
  const level = page.locator('#path-basic-demo .lg-path-level[href]').first();
  await level.scrollIntoViewIfNeeded();
  /* Footnote type in 2px of padding came to 22px — a hair under the 24 a cursor needs. It was
     the "More" button that carried a floor and the levels themselves that did not, which is
     backwards: the levels are what people aim at. */
  await expectReachable(page, level, 'a path level');
});

test('a path that fits does not fold', async ({ page }) => {
  await page.goto('/#/components/path-bar');
  const short = page.locator('.lg-path').filter({ hasText: '最近项目' }).first();
  await short.scrollIntoViewIfNeeded();
  await expect(short.locator('.lg-path-more')).toHaveCount(0);
});

/* ---------------------------------------------------------------- Panel ---------------- */

test('a panel floats without taking the page hostage', async ({ page }) => {
  await page.goto('/#/components/panel');
  const panel = page.locator('#panel-basic-demo .lg-panel');
  await expect(panel).toHaveAttribute('role', 'dialog');
  await expect(panel).toHaveAttribute('aria-modal', 'false');
  /* Non-modal means the rest of the page is still there: no backdrop element, and the sidebar
     link beside it is still reachable. A panel that inerted the page would be a dialog. */
  await expect(page.locator('#panel-basic-demo dialog')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /按钮 GlassButton/ }).first()).toBeEnabled();
});

test('a panel can be moved without a pointer', async ({ page }) => {
  await page.goto('/#/components/panel');
  const panel = page.locator('#panel-basic-demo .lg-panel');
  await panel.scrollIntoViewIfNeeded();
  const before = (await panel.boundingBox())!;
  await panel.locator('.lg-panel-bar').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const after = (await panel.boundingBox())!;
  expect(after.x - before.x, `the panel moved ${after.x - before.x}px`).toBe(16);
  await page.keyboard.press('Shift+ArrowDown');
  const down = (await panel.boundingBox())!;
  expect(down.y - after.y, 'Shift did not take a bigger step').toBe(40);
});

test('collapsing a panel rolls it up and says so', async ({ page }) => {
  await page.goto('/#/components/panel');
  const panel = page.locator('#panel-basic-demo .lg-panel');
  await panel.scrollIntoViewIfNeeded();
  const collapse = panel.getByRole('button', { name: 'Collapse 检查器' });
  const tall = (await panel.boundingBox())!.height;
  await collapse.click();
  await expect(panel.getByRole('button', { name: 'Expand 检查器' })).toHaveAttribute('aria-expanded', 'false');
  const short = (await panel.boundingBox())!.height;
  expect(short, `the panel is ${short}px collapsed against ${tall}px open`).toBeLessThan(tall);
  await expect(panel.getByRole('slider', { name: '大小' })).toBeHidden();
});

/**
 * A panel opens inside its container even when the caller's `defaultPosition` says otherwise.
 *
 * The position is a guess made before anything is measured. On a phone the container is
 * routinely narrower than the offset it was given, and a panel that opens past the edge is
 * clipped by the container's overflow — including the title bar, which is the only part that
 * could drag it back.
 */
test('a panel opens inside its container, whatever offset it was given', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await page.goto('/#/components/panel');
  const frame = page.locator('#panel-basic-demo');
  await frame.scrollIntoViewIfNeeded();
  const outer = (await frame.boundingBox())!;
  const panel = (await page.locator('#panel-basic-demo .lg-panel').boundingBox())!;
  expect(Math.round(panel.x + panel.width), `the panel ends at ${panel.x + panel.width}, the frame at ${outer.x + outer.width}`)
    .toBeLessThanOrEqual(Math.round(outer.x + outer.width) + 1);
});

/* ---------------------------------------------------------------- Toolbar overflow ----- */

test('a toolbar gives up its items from the end and keeps them reachable', async ({ page }) => {
  await page.goto('/#/components/toolbar');
  const demo = page.locator('#toolbar-overflow-demo');
  await demo.scrollIntoViewIfNeeded();
  const shown = () => demo.locator('.lg-button:not([aria-label="More"])').count();

  /* Polled, not read once: collapsing takes a measuring render and a resize notification, so a
     count taken in the same breath as the click is a count of the width before it. */
  await page.getByRole('radio', { name: '宽', exact: true }).click();
  await expect.poll(shown, { message: 'nothing came back at the wide width' }).toBe(7);
  await page.getByRole('radio', { name: '窄', exact: true }).click();
  await expect.poll(shown, { message: 'nothing folded at the narrow width' }).toBeLessThan(4);

  /* The ones that went are in the menu, not gone: an item nobody can reach is not "collapsed". */
  await demo.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitem', { name: '代码' })).toBeVisible();
});

/* ---------------------------------------------------------------- Sheet, on a desk ----- */

/**
 * Driven by the window's width, not by `data-lg-platform`.
 *
 * That attribute is what the *stylesheet* reads; `resolvedPlatform`, which is what decides
 * which object this is, comes from the provider answering `(pointer: fine) and (min-width:
 * 768px)`. Setting the attribute from a test changes the metrics and not the component — and
 * the component is the thing under test. A desktop-sized window with a mouse is a desk; a
 * 390px one is not, whatever is pointing at it.
 */
test('a sheet is an edge sheet in a phone-shaped window and a centred card in a desk-shaped one', async ({ page }) => {
  await page.goto('/#/components/sheet');
  await page.getByRole('button', { name: '打开面板' }).first().click();
  const sheet = page.locator('.lg-sheet[open]');
  await expect(sheet).toBeVisible();

  await expect(sheet).toHaveAttribute('data-form', 'card');
  /* After the entrance, not during it: the card drops in from above, and a box measured
     mid-transition is a box measured 24px from where it lands. */
  await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'));
  /* No grabber, because there are no detents to drag between — and a handle that does nothing
     is worse than no handle. */
  await expect(sheet.locator('.lg-sheet-grabber')).toHaveCount(0);
  const card = (await sheet.boundingBox())!;

  /* Centred in the window rather than anchored to an edge. */
  const viewport = page.viewportSize()!;
  const above = card.y, below = viewport.height - (card.y + card.height);
  expect(Math.abs(above - below), `${above} above and ${below} below`).toBeLessThanOrEqual(2);

  await page.setViewportSize({ width: 430, height: 900 });
  await expect(sheet).toHaveAttribute('data-form', 'edge');
  await expect(sheet.locator('.lg-sheet-grabber')).toHaveCount(1);
  const edge = (await sheet.boundingBox())!;
  expect(edge.height, `the edge sheet is ${edge.height}px tall against the card's ${card.height}`)
    .toBeGreaterThan(card.height);
});
