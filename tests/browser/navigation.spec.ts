import { test, expect } from '@playwright/test';

/**
 * One element, two places. The site keeps the tab bar in its capsule form at every width and
 * moves *where it is*: placed in the band on a wide window, pinned to the bottom of the screen
 * on a phone. It is the same element and the same four links either way — not a second
 * component kept in step by hand.
 *
 * (The other form, the bar expanded into a sidebar, is `TabBar`'s own and is exercised on its
 * documentation page. This site no longer uses it: the areas belong in the band and the rail
 * belongs to the pages of the area you are in.)
 */
test('the navigation is one element that moves rather than two that agree', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/overview');
  const nav = page.getByRole('navigation', { name: '主导航' });
  await expect(nav).toHaveAttribute('data-layout', 'tabbar');
  const band = await page.locator('.app-header').boundingBox();
  const wide = await nav.boundingBox();
  expect(wide!.y, 'the areas are not in the band').toBeLessThan(band!.y + band!.height);

  await page.setViewportSize({ width: 600, height: 900 });
  const narrow = await nav.boundingBox();
  expect(narrow!.y, 'the areas did not drop to the bottom of the screen').toBeGreaterThan(600);
  await expect(nav.locator('.lg-tab-link')).toHaveCount(4);
});

test('navigation is a nav of links with aria-current, not a tablist', async ({ page }) => {
  await page.goto('/#/components');
  const nav = page.getByRole('navigation', { name: '主导航' });
  await expect(nav.locator('[role="tablist"]')).toHaveCount(0);
  await expect(nav.locator('a[aria-current="page"]')).toHaveCount(1);
  await expect(nav.locator('a[aria-current="page"]')).toContainText('组件');
});

test('search is its own destination at the trailing end', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/#/overview');
  // Two glass groups: the sections, and search on a surface of its own.
  await expect(page.locator('.lg-tabbar .lg-tabbar-group')).toHaveCount(1);
  await expect(page.locator('.lg-tabbar .lg-tabbar-search')).toHaveCount(0);
});

test('command-K opens component search and Escape restores focus', async ({ page }) => {
  await page.goto('/#/overview');
  /* The modifier the button prints, not the one this machine happens to use: `mod` is resolved
     from what the browser reports, and the hint and the binding come from the same parse. */
  const hint = await page.getByRole('button', { name: /^搜索/ }).first().getAttribute('aria-label');
  await page.keyboard.press(`${hint?.includes('⌘') ? 'Meta' : 'Control'}+k`);
  const dialog = page.getByRole('dialog', { name: '搜索文档' });
  await expect(dialog).toBeVisible();
  const field = page.getByRole('combobox', { name: '搜索文档' });
  await field.fill('sheet');
  await expect(dialog.getByText('GlassSheet').first()).toBeVisible();
  /**
   * One press, not two. The old hand-assembled search used `type="search"`, where the browser
   * claims the first Escape to clear the field — so closing a search you had typed into took
   * two presses. The palette's field is plain text and Escape reaches the dialog, which is the
   * platform's own way out of a modal and the only one anybody expects.
   */
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('the skip link moves focus to the main region without changing route', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('h1')).toContainText('GlassButton');
});

test('the navigation bar has no background, border or shadow of its own', async ({ page }) => {
  await page.goto('/#/overview');
  /* The band is drawn by the scroll edge once content goes under it, never by a bar
     background — which is the custom bar treatment the design removed. */
  const bar = page.locator('.app-header');
  const style = await bar.evaluate(node => {
    const computed = getComputedStyle(node);
    return { background: computed.backgroundColor, border: computed.borderBottomWidth, shadow: computed.boxShadow };
  });
  expect(style.background).toBe('rgba(0, 0, 0, 0)');
  expect(style.border).toBe('0px');
  expect(style.shadow).toBe('none');
});

test('every component page is reachable and complete', async ({ page }) => {
  await page.goto('/#/components');
  const links = await page.locator('.subnav-link').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute('href')).filter((href): href is string => !!href && href.startsWith('#/components/')));
  expect(links.length).toBeGreaterThanOrEqual(20);
  for (const href of links) {
    await page.goto(`/${href}`);
    await expect(page.locator('h1')).not.toHaveText('没有这一页');
    await expect(page.locator('.demo-card').first()).toBeVisible();
    await expect(page.locator('.props-table tbody tr').first()).toBeVisible();
    // Chinese name first, export name second — the same label the sidebar shows.
    const heading = await page.locator('h1').textContent();
    expect(heading).toMatch(/^\S+\s\S+/);
  }
});
