import { test, expect } from '@playwright/test';

/**
 * A disclosure is a native `<details>` here, and these check the things that buys — because
 * they are exactly the things a `div` with `aria-expanded` loses, quietly, and that nobody
 * notices until someone tries to find a word that is folded away.
 */

const PAGE = '/#/components/disclosure';

test('it is a real details element with a real summary', async ({ page }) => {
  await page.goto(PAGE);
  const group = page.locator('#disclosure-basic-demo .lg-disclosure').first();
  await group.scrollIntoViewIfNeeded();
  const tag = await group.evaluate(node => node.tagName);
  expect(tag).toBe('DETAILS');
  // The summary is a button to assistive technology without anyone declaring it one.
  await expect(group.locator('summary')).toHaveAttribute('class', /lg-disclosure-summary/);
});

test('it opens and closes, and says which it is', async ({ page }) => {
  await page.goto(PAGE);
  const group = page.locator('#disclosure-basic-demo .lg-disclosure').first();
  await group.scrollIntoViewIfNeeded();
  await expect(group).not.toHaveAttribute('open', '');
  await group.locator('summary').click();
  await expect(group).toHaveAttribute('open', '');
  await expect(group).toHaveAttribute('data-open', 'true');
  await group.locator('summary').click();
  await expect(group).not.toHaveAttribute('open', '');
});

test('the keyboard opens it without a key handler of our own', async ({ page }) => {
  await page.goto(PAGE);
  const group = page.locator('#disclosure-basic-demo .lg-disclosure').first();
  await group.scrollIntoViewIfNeeded();
  await group.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(group).toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(group).not.toHaveAttribute('open', '');
});

/**
 * The one that a reimplementation always loses: the browser opens a closed `<details>` to
 * reveal a find-in-page match. There is no way to drive Ctrl-F from a test, but `beforematch`
 * and the hidden-until-found machinery run off the same element, so this asserts the element
 * really is a details — which is the whole mechanism — and that our React state follows the
 * element rather than the click.
 */
test('React follows the element, not the click', async ({ page }) => {
  await page.goto(PAGE);
  const group = page.locator('#disclosure-basic-demo .lg-disclosure').first();
  await group.scrollIntoViewIfNeeded();
  // Opened from outside React entirely, the way the browser would open it.
  await group.evaluate(node => { (node as HTMLDetailsElement).open = true; });
  await expect(group, 'the chevron and our state ignored an open that did not come from a click')
    .toHaveAttribute('data-open', 'true');
});

test('a controlled group can be driven from outside', async ({ page }) => {
  await page.goto(PAGE);
  const accordion = page.locator('#disclosure-controlled');
  await accordion.scrollIntoViewIfNeeded();
  const groups = accordion.locator('.lg-disclosure');
  await expect(groups.nth(0)).toHaveAttribute('open', '');

  await groups.nth(1).locator('summary').click();
  await expect(groups.nth(1)).toHaveAttribute('open', '');
  // Opening the second closed the first: the caller's state decided, not the element.
  await expect(groups.nth(0)).not.toHaveAttribute('open', '');
});

test('the chevron is decoration, not the announcement', async ({ page }) => {
  await page.goto(PAGE);
  const chevron = page.locator('#disclosure-basic-demo .lg-disclosure-chevron').first();
  await expect(chevron).toHaveAttribute('aria-hidden', 'true');
});

test('the summary is a 44pt row', async ({ page }) => {
  await page.goto(PAGE);
  const summary = page.locator('#disclosure-basic-demo summary').first();
  await summary.scrollIntoViewIfNeeded();
  const box = (await summary.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);
});
