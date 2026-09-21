import { test, expect } from '@playwright/test';

/**
 * Three pieces of polish from the 0.0.2 survey. Each is a thing the system control does and
 * this one did not, and each is only visible once you try to use the control for real rather
 * than look at it.
 */

/* ---------------------------------------------------------------------------------------
 * P6 — a stepper you have to click forty times is not a stepper.
 *
 * The system control repeats while held, and the HIG's steppers page asks for a Shift
 * modifier that moves in larger steps over a wide range. Without either, the only way from 1
 * to 40 is forty presses, which is exactly when someone gives up and types into a field that
 * is not there.
 * ------------------------------------------------------------------------------------- */

const STEPPER = '/#/components/stepper';

/** The demo's readout, which is the value without reaching into the component's internals. */
async function stepperValue(page: import('@playwright/test').Page) {
  return Number(await page.locator('#stepper-basic .lg-stepper-value').innerText());
}

test('holding the stepper keeps counting', async ({ page }) => {
  await page.goto(STEPPER);
  const plus = page.locator('#stepper-basic .lg-stepper-button').last();
  await plus.scrollIntoViewIfNeeded();
  const before = await stepperValue(page);

  const box = (await plus.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(900);
  await page.mouse.up();

  const after = await stepperValue(page);
  expect(after - before, `held for 900ms and moved ${after - before}`).toBeGreaterThan(2);
});

test('letting go stops it', async ({ page }) => {
  await page.goto(STEPPER);
  const plus = page.locator('#stepper-basic .lg-stepper-button').last();
  await plus.scrollIntoViewIfNeeded();
  const box = (await plus.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(700);
  await page.mouse.up();

  const settled = await stepperValue(page);
  await page.waitForTimeout(500);
  expect(await stepperValue(page), 'the repeat outlived the press').toBe(settled);
});

test('a plain click still moves exactly one step', async ({ page }) => {
  await page.goto(STEPPER);
  const plus = page.locator('#stepper-basic .lg-stepper-button').last();
  await plus.scrollIntoViewIfNeeded();
  const before = await stepperValue(page);
  await plus.click();
  expect(await stepperValue(page) - before).toBe(1);
});

test('Shift moves in tens', async ({ page }) => {
  await page.goto(STEPPER);
  // The basic demo is capped at 9, so this uses the wide-range one where 10× is meaningful.
  const stepper = page.locator('#stepper-wide');
  await stepper.scrollIntoViewIfNeeded();
  const value = () => stepper.locator('.lg-stepper-value').innerText().then(Number);
  const before = await value();
  await stepper.locator('.lg-stepper-button').last().click({ modifiers: ['Shift'] });
  expect(await value() - before).toBe(10);
});

test('the repeat stops at the limit rather than running past it', async ({ page }) => {
  await page.goto(STEPPER);
  const stepper = page.locator('#stepper-basic');
  await stepper.scrollIntoViewIfNeeded();
  const plus = stepper.locator('.lg-stepper-button').last();
  const box = (await plus.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1600);
  await page.mouse.up();
  // The demo's range is 1–9.
  expect(await stepperValue(page)).toBe(9);
  await expect(plus).toBeDisabled();
});

/* ---------------------------------------------------------------------------------------
 * P8 — a toast you can only wait out.
 *
 * It had no close button and ignored Escape, so the only ways to get rid of one were to wait
 * six seconds or to keep the pointer away from it. A keyboard user had neither.
 * ------------------------------------------------------------------------------------- */

const TOAST = '/#/components/toast';

test('a toast can be dismissed', async ({ page }) => {
  await page.goto(TOAST);
  await page.getByRole('button', { name: '删除最后一项' }).click();
  const toast = page.locator('.lg-toast');
  await expect(toast).toBeVisible();

  const close = toast.getByRole('button', { name: '关闭' });
  await expect(close).toBeVisible();
  await close.click();
  await expect(toast).toBeHidden();
});

test('Escape dismisses the newest one', async ({ page }) => {
  await page.goto(TOAST);
  await page.getByRole('button', { name: '删除最后一项' }).click();
  await expect(page.locator('.lg-toast')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.lg-toast')).toBeHidden();
});

test('the close button is a real target, not a decoration', async ({ page }) => {
  await page.goto(TOAST);
  await page.getByRole('button', { name: '删除最后一项' }).click();
  const close = page.locator('.lg-toast').getByRole('button', { name: '关闭' });
  await expect(close).toBeVisible();
  const box = (await close.boundingBox())!;
  // Drawn small; the region is not. This is measured on the element the finger lands on.
  expect(Math.max(box.width, box.height)).toBeGreaterThan(20);
});

test('undo still works and still closes the toast', async ({ page }) => {
  await page.goto(TOAST);
  await page.getByRole('button', { name: '删除最后一项' }).click();
  const toast = page.locator('.lg-toast');
  await toast.getByRole('button', { name: '撤销' }).click();
  await expect(toast).toBeHidden();
  await expect(page.getByText('剩余：草稿 A、草稿 B、草稿 C')).toBeVisible();
});

/* ---------------------------------------------------------------------------------------
 * P9 — Increase Contrast asks custom elements for a border.
 *
 * White on red measures 4.6:1 and passes AA on its own, so this is consistency rather than a
 * contrast failure: every other surface in the library grows an edge under this setting, and
 * one that does not looks like something the setting forgot.
 * ------------------------------------------------------------------------------------- */

test('a badge grows a border when contrast is increased', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/#/components/badge');
  const badge = page.locator('.lg-badge').first();
  await badge.scrollIntoViewIfNeeded();
  const style = await badge.evaluate(node => {
    const computed = getComputedStyle(node);
    return { width: parseFloat(computed.borderTopWidth), colour: computed.borderTopColor };
  });
  expect(style.width).toBeGreaterThan(0);
  expect(style.colour).not.toBe('rgba(0, 0, 0, 0)');
});

test('and has none without it', async ({ page }) => {
  await page.goto('/#/components/badge');
  const badge = page.locator('.lg-badge').first();
  await badge.scrollIntoViewIfNeeded();
  const width = await badge.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth));
  expect(width).toBe(0);
});

/**
 * Two questions the audit had to ask on every page at once, and which no single component test
 * would have caught: whether any id is claimed twice, and whether the headings step.
 *
 * Both are cheap to check and invisible to read for. The duplicate was a demo whose wrapper
 * repeated the id the stage around it already had, so the outline's link to that example had
 * two places to land. The skip was structural: the card's `h3` title was written *after* the
 * example it names, so an example containing its own `h4` emitted it first.
 */
const PAGES_WITH_HEADINGS = ['text', 'list', 'navigation-bar', 'navigation-stack', 'form', 'split-view', 'outline-view'];

for (const slug of PAGES_WITH_HEADINGS) {
  test(`the headings on the ${slug} page step one level at a time`, async ({ page }) => {
    await page.goto(`/#/components/${slug}`);
    await page.waitForTimeout(400);
    const outline = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('main :is(h1,h2,h3,h4,h5,h6)')]
        .filter(node => node.getBoundingClientRect().height > 0)
        .map(node => ({ level: Number(node.tagName[1]), text: (node.textContent ?? '').trim().slice(0, 20) })));

    expect(outline.filter(entry => entry.level === 1).length, 'a page has exactly one h1').toBe(1);
    let previous = 0;
    for (const entry of outline) {
      expect(entry.level,
        `「${entry.text}」 is an h${entry.level} after an h${previous}`).toBeLessThanOrEqual(previous + 1);
      previous = entry.level;
    }
  });
}

test('no page claims the same id twice', async ({ page }) => {
  for (const slug of ['menu-button', 'text', 'card', 'list', 'button', 'panel', 'toolbar', 'popover', 'sheet', 'outline-view']) {
    await page.goto(`/#/components/${slug}`);
    await page.waitForTimeout(250);
    const repeated = await page.evaluate(() => {
      const seen = new Set<string>(), twice: string[] = [];
      for (const node of document.querySelectorAll('[id]')) {
        if (seen.has(node.id)) twice.push(node.id);
        seen.add(node.id);
      }
      return twice;
    });
    expect(repeated, `${slug} repeats ${repeated.join(', ')}`).toEqual([]);
  }
});
