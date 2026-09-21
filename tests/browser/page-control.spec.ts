import { test, expect } from '@playwright/test';

/**
 * A row of dots that only responds to taps is the same tell as a segmented control that only
 * responds to clicks — the system one is dragged along, and that is most of what makes it feel
 * like a position rather than a set of buttons. The rest of this is the part a row of dots
 * cannot say for itself: what it is counting, and which one you are on.
 */

const PAGE = '/#/components/page-control';
const CONTROL = '#page-control-demo .lg-page-control';

test('each dot is a named, selectable tab', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator(CONTROL);
  await control.scrollIntoViewIfNeeded();
  await expect(control).toHaveAttribute('role', 'tablist');
  await expect(control).toHaveAttribute('aria-label', '引导步骤');

  const dots = control.getByRole('tab');
  await expect(dots).toHaveCount(4);
  // The dots carry their own position; "a dot" is not a name.
  await expect(dots.first()).toHaveAttribute('aria-label', '1 / 4');
  await expect(dots.first()).toHaveAttribute('aria-selected', 'true');
});

test('clicking a dot goes to that page', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator(CONTROL);
  await control.scrollIntoViewIfNeeded();
  await control.getByRole('tab', { name: '3 / 4' }).click();
  await expect(page.locator('#page-control-demo [role="status"]')).toHaveText('同步');
  await expect(control.getByRole('tab', { name: '3 / 4' })).toHaveAttribute('aria-selected', 'true');
});

test('dragging along it turns the pages', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator(CONTROL);
  await control.scrollIntoViewIfNeeded();
  const box = (await control.boundingBox())!;
  const y = box.y + box.height / 2;

  // Press at the left end and drag to the right end: first page through to last.
  await page.mouse.move(box.x + 4, y);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(box.x + (box.width - 8) * (i / 6), y);
  await page.mouse.up();

  await expect(page.locator('#page-control-demo [role="status"]'), 'the drag did not reach the last page')
    .toHaveText('完成');
});

test('it is one tab stop, and the arrow keys move inside it', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator(CONTROL);
  await control.scrollIntoViewIfNeeded();

  // Only the selected dot is in the tab order; the rest are reached with arrows.
  const tabIndexes = await control.getByRole('tab').evaluateAll(nodes => nodes.map(node => node.getAttribute('tabindex')));
  expect(tabIndexes.filter(value => value === '0')).toHaveLength(1);

  await control.getByRole('tab', { name: '1 / 4' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#page-control-demo [role="status"]')).toHaveText('权限');
  await page.keyboard.press('End');
  await expect(page.locator('#page-control-demo [role="status"]')).toHaveText('完成');
  await page.keyboard.press('Home');
  await expect(page.locator('#page-control-demo [role="status"]')).toHaveText('欢迎');
});

test('focus follows the selection, so the next arrow continues from there', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator(CONTROL);
  await control.scrollIntoViewIfNeeded();
  await control.getByRole('tab', { name: '1 / 4' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(control.getByRole('tab', { name: '2 / 4' })).toBeFocused();
});

test('the vertical form walks the other axis', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator('#page-control-vertical .lg-page-control');
  await control.scrollIntoViewIfNeeded();
  await expect(control).toHaveAttribute('aria-orientation', 'vertical');
  await control.getByRole('tab', { name: '2 / 5' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#page-control-vertical [role="status"]')).toHaveText('第 3 章');
});

test('a custom page name replaces the default', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator('#page-control-media .lg-page-control');
  await control.scrollIntoViewIfNeeded();
  await expect(control.getByRole('tab').first()).toHaveAttribute('aria-label', '第 1 张，共 6 张');
});

/**
 * And the same question for a cursor, which has a floor of its own: 24px, WCAG 2.2.
 *
 * The hit region used to be declared inside `@media (pointer: coarse)` — a hit region read as
 * a touch affair — so with a mouse the 18px of artwork *was* the target. The band is the fix
 * on the cross axis; along the row the dots stay 18px apart and are adjacent targets, which is
 * stated on the page rather than quietly not measured.
 */
test('and with a cursor it owns a 24px band, which it did not before', async ({ page }) => {
  await page.goto(PAGE);
  const control = page.locator(CONTROL);
  await control.evaluate(node => node.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(150);
  const band = await control.evaluate(node => {
    const dots = [...node.querySelectorAll<HTMLElement>('.lg-page-dot')];
    const owner = (dot: HTMLElement, dy: number) => {
      const box = dot.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2 + dy);
      return dots.indexOf((hit?.closest('.lg-page-dot') ?? hit) as HTMLElement);
    };
    return dots.map((dot, index) => [owner(dot, -11), owner(dot, 0), owner(dot, 11)].every(hit => hit === index));
  });
  expect(band, 'a dot does not own the 22px band over its own centre').toEqual([true, true, true, true]);
});

test.describe('on a touch device', () => {
  test.use({ hasTouch: true, isMobile: true });

  /**
   * The dot is drawn at 7px and has to be touchable at 44 on the axis where there is room.
   *
   * Not on both axes. The dots are 18px apart, so a 44px square around each one covers its
   * neighbours' centres, and the later one in the DOM wins the hit test — measured, before
   * this was fixed: tapping the first dot selected the second. Along the row they are adjacent
   * targets that share the axis between them, which is what adjacent targets do, and the row
   * is draggable so nobody has to land on one exactly.
   */
  test('a 7px dot is touchable at 44 across the row, without stealing its neighbours', async ({ page }) => {
    await page.goto(PAGE);
    const control = page.locator(CONTROL);
    // Centred, so both probes are inside the viewport — `elementFromPoint` answers null outside it.
    await control.evaluate(node => node.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(150);

    const result = await control.evaluate(node => {
      const dots = [...node.querySelectorAll<HTMLElement>('.lg-page-dot')];
      const owner = (dot: HTMLElement, dy: number) => {
        const box = dot.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2 + dy);
        return dots.indexOf((hit?.closest('.lg-page-dot') ?? hit) as HTMLElement);
      };
      return {
        drawn: Math.round(dots[0].querySelector('span')!.getBoundingClientRect().height),
        // Each dot owns the band above and below its own centre, and it is its own band.
        band: dots.map((dot, index) => [owner(dot, -20), owner(dot, 0), owner(dot, 20)].every(hit => hit === index)),
      };
    });

    expect(result.drawn, 'the dot is drawn small — that is the point').toBeLessThan(12);
    expect(result.band, 'a dot does not own the 40px band over its own centre').toEqual([true, true, true, true]);
  });
});

/**
 * A dot is smaller than a target is allowed to be, and what excuses it is arithmetic.
 *
 * WCAG 2.2 Target Size (Minimum) lets an undersized target through when a 24px circle centred
 * on it does not reach a neighbour's. The dots were 18px with a 4px gap — centres 22px apart,
 * circles overlapping — so the exception did not apply and the row was simply under the floor
 * for a cursor, with nothing said about it. Six pixels of gap is the whole fix.
 *
 * The cross axis is separate and stays a stated compromise: 44px regions side by side would
 * put each dot's region over its neighbour's centre, which is worse than a small target.
 */
test('the dots are far enough apart for the size exception to apply', async ({ page }) => {
  await page.goto('/#/components/page-control');
  await page.waitForTimeout(400);
  const spacing = await page.locator('#page-control-demo').evaluate(node => {
    const dots = [...node.querySelectorAll('.lg-page-dot')].map(dot => dot.getBoundingClientRect());
    const centre = (box: DOMRect) => box.left + box.width / 2;
    return dots.slice(1).map((box, index) => centre(box) - centre(dots[index]));
  });
  expect(spacing.length, 'no dots to measure').toBeGreaterThan(1);
  for (const gap of spacing) {
    expect(gap, `two dots are ${gap.toFixed(1)}px apart, centre to centre`).toBeGreaterThanOrEqual(24);
  }
});
