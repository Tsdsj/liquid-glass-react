import { test, expect } from '@playwright/test';
import { expectReachable } from './hit-floor.js';

/**
 * Checkbox and radio group: the two controls a desktop form cannot do without.
 *
 * Both are **content layer** — "use switches, checkboxes, and radio buttons in the window body,
 * not the window frame" (toggles · macOS) — so neither is glass, and neither of them is a
 * re-implementation: they are real `<input type="checkbox">` and real radio inputs sharing a
 * `name`. That is not an implementation detail to be tested around. It is the keyboard model,
 * and these tests are mostly about checking that nothing has been "helpfully" overridden.
 */

test('a checkbox is a real checkbox, and the whole row is the target', async ({ page }) => {
  await page.goto('/#/components/checkbox');
  const demo = page.locator('#checkbox-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('input[type="checkbox"]');
  await expect(input).toBeChecked();

  // The label's text, not just the 16px box — a checkbox has always worked that way.
  await demo.getByText('发送每周摘要').click();
  await expect(input).not.toBeChecked();
  await expect(demo.getByText('现在是未选中')).toBeVisible();

  // Space toggles, which is the browser's job and only stays true while nobody intercepts it.
  await input.focus();
  await page.keyboard.press('Space');
  await expect(input).toBeChecked();
});

test('a checkbox says which state it is in as a shape, not only as a colour', async ({ page }) => {
  await page.goto('/#/components/checkbox');
  const demo = page.locator('#checkbox-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  const label = demo.locator('.lg-checkbox');
  const mark = () => label.locator('.lg-checkbox-mark').evaluate(node =>
    Number(getComputedStyle(node).opacity));

  expect(await mark(), 'the checkmark is invisible while the box is on').toBeGreaterThan(.5);
  await label.click();
  await expect(label).toHaveAttribute('data-state', 'off');
  /* Polled, because the mark fades rather than blinking out: reading it in the frame after the
     attribute changed catches the transition still at its starting value, which is a true
     reading of the wrong moment. */
  await expect.poll(mark, { message: 'the empty box still shows a checkmark' }).toBeLessThan(.5);
});

/**
 * The mixed state, which is the reason a checkbox is not a switch.
 *
 * `indeterminate` is a DOM property with no attribute, so React cannot render it — it has to be
 * set on the element after the render that made it true. Get that wrong and the box *looks*
 * mixed and *announces* as unchecked, which is the half of the state a screen reader gets.
 */
test('a parent checkbox reports mixed to the accessibility tree, not just on screen', async ({ page }) => {
  await page.goto('/#/components/checkbox');
  const demo = page.locator('#checkbox-mixed-demo');
  await demo.scrollIntoViewIfNeeded();
  const parent = demo.locator('.lg-checkbox').first();
  const parentInput = parent.locator('input');

  await expect(parent).toHaveAttribute('data-state', 'mixed');
  expect(await parentInput.evaluate(node => (node as HTMLInputElement).indeterminate),
    'the box is drawn mixed and announces as unchecked').toBe(true);

  // Pressing a mixed parent turns everything on: "partly" is not something a click can mean.
  await parent.click();
  await expect(parent).toHaveAttribute('data-state', 'on');
  const children = demo.locator('input[type="checkbox"]');
  expect(await children.count()).toBe(4);
  for (let index = 1; index < 4; index++) await expect(children.nth(index)).toBeChecked();
});

test('a radio group is one tab stop, and the arrow keys move inside it', async ({ page }) => {
  await page.goto('/#/components/radio-group');
  const demo = page.locator('#radio-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  const options = demo.locator('input[type="radio"]');
  await expect(options.nth(1)).toBeChecked();

  await options.nth(1).focus();
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(2)).toBeChecked();
  /* Wrapping is the native behaviour and the one most hand-written groups get wrong: from the
     last option, Down goes back to the first rather than stopping. */
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(0)).toBeChecked();

  // One tab stop for the group: only the checked option is in the tab order.
  const tabbable = await options.evaluateAll(nodes =>
    nodes.filter(node => (node as HTMLInputElement).tabIndex >= 0 && (node as HTMLInputElement).checked).length);
  expect(tabbable, 'more than one option is reachable by Tab').toBe(1);
});

test('a disabled option is skipped rather than landed on', async ({ page }) => {
  await page.goto('/#/components/radio-group');
  const demo = page.locator('#radio-disabled-demo');
  await demo.scrollIntoViewIfNeeded();
  const options = demo.locator('input[type="radio"]');

  await options.nth(0).focus();
  await page.keyboard.press('ArrowDown');
  // 团队 is disabled, so Down from 个人 lands on 企业.
  await expect(options.nth(2)).toBeChecked();
  await expect(options.nth(1)).not.toBeChecked();
});

test('the group is named by a legend, and each option carries its own description', async ({ page }) => {
  await page.goto('/#/components/radio-group');
  const demo = page.locator('#radio-description-demo');
  await demo.scrollIntoViewIfNeeded();

  /* A `<legend>` rather than `aria-label` on the fieldset: the attribute is not announced
     consistently, and the group's question is the part a reader needs before the answers. */
  await expect(demo.locator('fieldset > legend')).toHaveText('渲染质量');
  const described = await demo.locator('input[type="radio"]').first().evaluate(node => {
    const id = node.getAttribute('aria-describedby');
    return id ? document.getElementById(id)?.textContent : null;
  });
  expect(described, 'the description is on screen but not attached to the option').toContain('默认');
});

test('both controls stay reachable on either platform', async ({ page }) => {
  await page.goto('/#/components/checkbox');
  await page.locator('#checkbox-basic-demo').scrollIntoViewIfNeeded();
  await expectReachable(page, page.locator('#checkbox-basic-demo .lg-checkbox'), 'the checkbox row');

  await page.goto('/#/components/radio-group');
  await page.locator('#radio-basic-demo').scrollIntoViewIfNeeded();
  await expectReachable(page, page.locator('#radio-basic-demo .lg-radio').first(), 'a radio row');
});
