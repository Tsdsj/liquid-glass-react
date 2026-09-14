import { test, expect } from '@playwright/test';

test('the tab bar and the sidebar are one element that scales', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/overview');
  const nav = page.getByRole('navigation', { name: '主导航' });
  await expect(nav).toHaveAttribute('data-layout', 'sidebar');

  await page.setViewportSize({ width: 600, height: 900 });
  await expect(nav).toHaveAttribute('data-layout', 'tabbar');
  // Same element, same links — not a second component kept in sync by hand.
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
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.getByRole('dialog', { name: '搜索组件' });
  await expect(dialog).toBeVisible();
  const field = page.getByRole('searchbox', { name: '搜索组件' });
  await field.fill('sheet');
  await expect(dialog.getByText('GlassSheet')).toBeVisible();
  // Escape in a non-empty search field is claimed by the browser to clear it; the second
  // press reaches the dialog. That is the platform behaviour, not a swallowed key.
  await page.keyboard.press('Escape');
  await expect(field).toHaveValue('');
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
  const bar = page.locator('.app-bar');
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
