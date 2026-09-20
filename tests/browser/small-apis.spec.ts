import { asPlatform } from './hit-floor.js';
import { test, expect } from '@playwright/test';

/**
 * The batch of small additions from the 0.0.2 survey. Each one was something a caller had to
 * do by hand, and each hand-rolled version got a detail wrong that is invisible until it is
 * measured — the gap beside an icon, whether a tinted label can be read, whether a suggestion
 * list is announced at all.
 */

/* ---------- GlassButton: icon slots and a per-instance tint ---------- */

test('an icon slot is a fixed gap, not whatever the caller typed', async ({ page }) => {
  await page.goto('/#/components/button');
  const demo = page.locator('#button-icons-demo');
  await demo.scrollIntoViewIfNeeded();
  const gaps = await demo.locator('.lg-button .lg-content').evaluateAll(nodes =>
    nodes.map(node => getComputedStyle(node).columnGap));
  expect(gaps.length).toBeGreaterThan(2);
  // Every button with an icon gets the same gap, whichever side the icon is on.
  expect(new Set(gaps).size, `gaps differ: ${gaps.join(', ')}`).toBe(1);
});

test('icons are decoration, and the label is still the name', async ({ page }) => {
  await page.goto('/#/components/button');
  const demo = page.locator('#button-icons-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.getByRole('button', { name: '新建', exact: true })).toBeVisible();
  const hidden = await demo.locator('.lg-button-icon').evaluateAll(nodes =>
    nodes.every(node => node.getAttribute('aria-hidden') === 'true'));
  expect(hidden).toBe(true);
});

test('a tint applies to that button alone', async ({ page }) => {
  await page.goto('/#/components/button');
  const demo = page.locator('#button-tint-demo');
  await demo.scrollIntoViewIfNeeded();
  const accents = await demo.locator('.lg-button').evaluateAll(nodes =>
    nodes.map(node => getComputedStyle(node).getPropertyValue('--lg-accent').trim()));
  expect(accents).toHaveLength(3);
  expect(accents[0]).not.toBe(accents[1]);
  // The third takes no tint, so it is still the document's accent.
  expect(accents[2]).not.toBe(accents[0]);
});

/* ---------- GlassSlider: tick marks ---------- */

test('marks land on the values they name', async ({ page }) => {
  await page.goto('/#/components/slider');
  const demo = page.locator('#slider-marks-demo');
  await demo.scrollIntoViewIfNeeded();

  const [stepped, explicit] = await demo.locator('.lg-slider').evaluateAll(nodes =>
    nodes.map(node => [...node.querySelectorAll('.lg-slider-mark')]
      .map(mark => Number((mark as HTMLElement).style.getPropertyValue('--lg-mark')))));
  // min 0, max 4, step 1 → five marks at 0, .25, .5, .75, 1.
  expect(stepped).toEqual([0, 0.25, 0.5, 0.75, 1]);
  // [0, 25, 50, 75, 100] over 0–100 → the same fractions, named rather than derived.
  expect(explicit).toEqual([0, 0.25, 0.5, 0.75, 1]);
});

test('marks say nothing to a screen reader, because the value already does', async ({ page }) => {
  await page.goto('/#/components/slider');
  const demo = page.locator('#slider-marks-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('.lg-slider-marks').first()).toHaveAttribute('aria-hidden', 'true');
  // The value is where the meaning is.
  const slider = demo.getByRole('slider', { name: '画质等级' });
  await expect(slider).toHaveAttribute('aria-valuetext', /第 \d 档/);
});

/* ---------- ToastProvider: tone ---------- */

test('a tone brings a glyph, so it is not colour alone', async ({ page }) => {
  await page.goto('/#/components/toast');
  const demo = page.locator('#toast-tone-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '成功' }).click();

  const toast = page.locator('.lg-toast');
  await expect(toast).toBeVisible();
  await expect(toast).toHaveAttribute('data-tone', 'success');
  await expect(toast.locator('.lg-toast-icon')).toBeVisible();
});

test('the default tone is neutral and draws no glyph', async ({ page }) => {
  await page.goto('/#/components/toast');
  const demo = page.locator('#toast-tone-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '中性（默认）' }).click();
  const toast = page.locator('.lg-toast');
  await expect(toast).toHaveAttribute('data-tone', 'neutral');
  expect(await toast.locator('.lg-toast-icon').count()).toBe(0);
});

/* ---------- TextField: multiline and control sizes ---------- */

test('multiline is a real textarea', async ({ page }) => {
  await page.goto('/#/components/text-field');
  const demo = page.locator('#field-multiline-demo');
  await demo.scrollIntoViewIfNeeded();
  const field = demo.getByLabel('备注');
  await expect(field).toHaveJSProperty('tagName', 'TEXTAREA');

  // Enter inserts a newline rather than submitting anything.
  await field.click();
  await field.fill('一行');
  await page.keyboard.press('Enter');
  await page.keyboard.type('两行');
  expect(await field.inputValue()).toBe('一行\n两行');
});

test('the label still points at it', async ({ page }) => {
  await page.goto('/#/components/text-field');
  const demo = page.locator('#field-multiline-demo');
  await demo.scrollIntoViewIfNeeded();
  const id = await demo.getByLabel('备注').getAttribute('id');
  await expect(demo.locator(`label[for="${id}"]`)).toHaveText('备注');
});

/**
 * Three sizes have to be three sizes, and on a touchscreen the text in them may not shrink.
 *
 * The 16px floor is iOS Safari's rule, not a design one: below it, focusing a field zooms the
 * page. That reason does not exist on a machine with a mouse, and keeping the floor there had
 * a visible cost — a 16px line cannot fit inside a 22px box, so `small` and `regular` came out
 * the same height and the control had two sizes wearing three names.
 */
test('a smaller control is not smaller text on a touchscreen, and is still a smaller control', async ({ page }) => {
  await page.goto('/#/components/text-field');
  const demo = page.locator('#field-sizes-demo');
  await demo.scrollIntoViewIfNeeded();

  await asPlatform(page, 'touch');
  const touchSizes = await demo.locator('.lg-field-input').evaluateAll(nodes =>
    nodes.map(node => parseFloat(getComputedStyle(node).fontSize)));
  for (const size of touchSizes) {
    expect(size, `${size}px would make iOS Safari zoom the page on focus`).toBeGreaterThanOrEqual(16);
  }

  for (const platform of ['desktop', 'touch'] as const) {
    await asPlatform(page, platform);
    const boxes = await demo.locator('.lg-field-box').evaluateAll(nodes =>
      nodes.map(node => Math.round(node.getBoundingClientRect().height)));
    expect(boxes[0], `${platform}: ${boxes.join(' / ')}`).toBeLessThan(boxes[1]);
    expect(boxes[1], `${platform}: ${boxes.join(' / ')}`).toBeLessThan(boxes[2]);
  }
  await asPlatform(page, null);
});

/* ---------- SearchField: suggestions ---------- */

const SEARCH = '#search-suggestions-demo';

test('suggestions make it a combobox, announced as one', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const demo = page.locator(SEARCH);
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('.lg-search-input');

  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAttribute('aria-expanded', 'false');

  await input.fill('g');
  const list = demo.getByRole('listbox');
  await expect(list).toBeVisible();
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).toHaveAttribute('aria-controls', (await list.getAttribute('id'))!);
});

test('the keyboard walks the list without leaving the field', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const demo = page.locator(SEARCH);
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('.lg-search-input');
  await input.fill('g');
  await expect(demo.getByRole('listbox')).toBeVisible();

  await page.keyboard.press('ArrowDown');
  /* Focus stays in the input — moving it into the list is the usual mistake, and it stops the
     next keystroke reaching the field. The highlight travels by id instead. */
  await expect(input).toBeFocused();
  const active = await input.getAttribute('aria-activedescendant');
  expect(active).toBeTruthy();
  await expect(page.locator(`#${active}`)).toHaveAttribute('aria-selected', 'true');
  expect(await demo.getByRole('option', { selected: true }).count()).toBe(1);
});

/**
 * The highlight has to survive the render the caller causes.
 *
 * Filtering belongs to the caller, so `suggestions` is normally built inline and is a new array
 * on every render. The reset-the-highlight effect was keyed on that array's identity, so it
 * fired after the render that had just moved the highlight and cleared it again — a race that
 * passed often enough to look fine. The pause is the whole point: it lets every effect the
 * keypress caused run before anything is read.
 */
test('the highlight is not cleared by the list being rebuilt', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const demo = page.locator(SEARCH);
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('.lg-search-input');
  await input.fill('g');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(250);
  expect(await input.getAttribute('aria-activedescendant'),
    'the highlight was cleared by a re-render').toBeTruthy();
});

test('Enter takes the highlighted suggestion', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const demo = page.locator(SEARCH);
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('.lg-search-input');
  await input.fill('g');
  await page.keyboard.press('ArrowDown');
  const chosen = (await demo.getByRole('option', { selected: true }).innerText()).trim();
  await page.keyboard.press('Enter');

  await expect(demo.locator('[role="status"]')).toHaveText(`选了：${chosen}`);
  expect(await input.inputValue()).toBe(chosen);
  await expect(demo.getByRole('listbox')).toBeHidden();
});

test('clicking one takes it too', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const demo = page.locator(SEARCH);
  await demo.scrollIntoViewIfNeeded();
  await demo.locator('.lg-search-input').fill('g');
  const option = demo.getByRole('option').first();
  const chosen = (await option.innerText()).trim();
  await option.click();
  await expect(demo.locator('[role="status"]')).toHaveText(`选了：${chosen}`);
});

/**
 * Escape closes the list and stops. `type="search"` has a browser behaviour on Escape —
 * clearing the field — and losing a query because the suggestions happened to be open would
 * be its own small disaster.
 */
test('Escape closes the list without clearing the query', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const demo = page.locator(SEARCH);
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('.lg-search-input');
  await input.fill('g');
  await expect(demo.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(demo.getByRole('listbox')).toBeHidden();
  expect(await input.inputValue()).toBe('g');
});

test('a search field without suggestions is not a combobox', async ({ page }) => {
  await page.goto('/#/components/search-field');
  const basic = page.locator('#search-basic .lg-search-input');
  await basic.scrollIntoViewIfNeeded();
  expect(await basic.getAttribute('role')).toBeNull();
  expect(await basic.getAttribute('aria-expanded')).toBeNull();
});
