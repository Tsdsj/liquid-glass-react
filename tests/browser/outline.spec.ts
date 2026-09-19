import { test, expect } from '@playwright/test';

/**
 * Below 1280px there is no room for the outline column, so a long component page had no way to
 * move around inside itself. The compact form is the same destinations in this library's own
 * menu — which is also the honest way to find out what using it feels like.
 *
 * Every assertion here comes from the Apple-Style-Review of that menu; three of them are
 * findings it raised.
 */

test.use({ viewport: { width: 390, height: 844 } });

test('the compact outline replaces the column, never doubles it', async ({ page }) => {
  await page.goto('/#/components/button');
  await expect(page.locator('.outline-compact')).toBeVisible();
  await expect(page.locator('.outline')).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(200);
  await expect(page.locator('.outline')).toBeVisible();
  await expect(page.locator('.outline-compact')).toBeHidden();
});

test('it stays visible once the page scrolls, instead of parking under the app bar', async ({ page }) => {
  await page.goto('/#/components/button');
  await expect(page.locator('.outline-compact')).toBeVisible();
  await page.locator('#a11y').evaluate(node => node.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(400);

  /**
   * The finding this came from: both elements are sticky, the bar sits at a far higher
   * z-index, and an outline parked beneath it is invisible from the moment the page scrolls —
   * which is the only time anyone wants one.
   */
  const { barBottom, outlineTop } = await page.evaluate(() => ({
    barBottom: document.querySelector('.app-bar')!.getBoundingClientRect().bottom,
    outlineTop: document.querySelector('.outline-compact')!.getBoundingClientRect().top,
  }));
  expect(outlineTop, `the outline is ${(barBottom - outlineTop).toFixed(0)}px under the app bar`).toBeGreaterThanOrEqual(barBottom - 1);
});

test('the destinations are destinations, not checkboxes', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.locator('.outline-trigger').click();
  const menu = page.locator('.lg-menu:popover-open');
  await expect(menu).toBeVisible();

  // `checked` would render role="menuitemcheckbox" + aria-checked, which announces a toggle.
  // Choosing one of these scrolls the page; nothing is being turned on.
  const roles = await menu.locator('.lg-menu-item').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('role')))]);
  expect(roles).toEqual(['menuitem']);
  expect(await menu.locator('[aria-checked]').count()).toBe(0);
});

test('the control names the section you are in, and that name is its accessible name', async ({ page }) => {
  await page.goto('/#/components/button');
  const trigger = page.locator('.outline-trigger');
  const first = (await trigger.innerText()).trim();

  await page.locator('#a11y').evaluate(node => node.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(500);
  await expect(trigger).toHaveText(/键盘与辅助功能/);
  expect((await trigger.innerText()).trim()).not.toBe(first);

  // Voice Control matches spoken words against visible text, so the two must not diverge.
  const name = await trigger.evaluate(node => node.getAttribute('aria-label'));
  expect(name, 'an aria-label would override the visible text').toBeNull();
});

test('choosing a section moves the page to it', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.locator('.outline-trigger').click();
  await page.locator('.lg-menu:popover-open .lg-menu-item').filter({ hasText: 'API' }).click();
  await page.waitForTimeout(700);
  const top = await page.locator('#api').evaluate(node => node.getBoundingClientRect().top);
  expect(Math.abs(top), `the API section is ${top.toFixed(0)}px from the top`).toBeLessThan(160);
});

test('the menu fits the screen it opens on', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.locator('.outline-trigger').click();
  const box = (await page.locator('.lg-menu:popover-open').boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
});
