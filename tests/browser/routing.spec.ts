import { test, expect } from '@playwright/test';

/**
 * A hash router moves between pages without the browser doing any of what it does for a real
 * navigation. Two of those omissions are only felt by someone not looking at the screen: the
 * window title never changes, so a screen reader and the tab strip keep announcing the first
 * page visited; and focus stays wherever it was, so the next Tab continues through the page
 * that just left.
 *
 * This is the part of the screen-reader work (R1) that code can actually settle. It is not a
 * substitute for the rest of it.
 */

test('the window title follows the page', async ({ page }) => {
  await page.goto('/#/');
  await expect(page).toHaveTitle(/概览 · Liquid Glass UI/);

  await page.goto('/#/components/button');
  await expect(page).toHaveTitle(/按钮 GlassButton · Liquid Glass UI/);

  await page.goto('/#/guides/theming');
  await expect(page).toHaveTitle(/换主题色 · Liquid Glass UI/);
});

test('navigating moves focus into the new page, but the first load does not', async ({ page }) => {
  await page.goto('/#/');
  // Nothing has been navigated yet, so focus belongs where the browser put it — moving it here
  // would jump straight past the skip link that exists for this.
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('main');

  await page.locator('.lg-tab-link').filter({ hasText: '组件' }).first().click();
  await expect(page).toHaveTitle(/组件 · Liquid Glass UI/);
  expect(await page.evaluate(() => document.activeElement?.id), 'focus was left on the previous page').toBe('main');
});

/**
 * The changelog page is the repository's own CHANGELOG.md, inlined at build time. Two copies of
 * a release note is one copy too many, so the assertion is that what the page shows is what the
 * file says — starting with the version the footer prints.
 */
test('the changelog page is the file, not a transcription of it', async ({ page }) => {
  await page.goto('/#/changelog');
  await expect(page).toHaveTitle(/更新日志 · Liquid Glass UI/);

  const version = (await page.locator('.app-footer-link').first().innerText()).replace(/^更新日志\s*/, '');
  const first = await page.locator('.md-h[data-level="2"]').first().textContent();
  expect(first?.trim(), 'the newest section does not match the version in the footer').toBe(version?.trim());

  // The subset renderer has to actually render: headings, bullets and code, not a wall of text.
  expect(await page.locator('.md-h[data-level="3"]').count()).toBeGreaterThan(5);
  expect(await page.locator('.md-list li').count()).toBeGreaterThan(20);
  expect(await page.locator('.md-code').count()).toBeGreaterThan(20);
  // Nothing left unparsed: a construct the renderer does not know would survive as its markers.
  const text = await page.locator('.md').innerText();
  expect(text, 'raw Markdown markers reached the page').not.toMatch(/\*\*|^#{1,4}\s|^[-*]\s{2}/m);
});

test('the changelog belongs to no section, so nothing in the navigation claims it', async ({ page }) => {
  await page.goto('/#/changelog');
  await expect(page.locator('#main')).toBeVisible();
  expect(await page.locator('.lg-tab-link[aria-current="page"]').count(), 'a section is highlighted for a page outside every section').toBe(0);
});

test('the skip link reaches the main region', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.className ?? '');
  expect(focused, 'the skip link is not the first tab stop').toContain('skip-link');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('main');
});
