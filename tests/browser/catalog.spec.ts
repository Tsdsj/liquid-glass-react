import { test, expect, type Page } from '@playwright/test';

/**
 * Every component in the catalogue gets the same baseline check. The list is read from the
 * site itself, so a component added without a documentation page — or a page that quietly
 * stops rendering — fails here rather than going unnoticed.
 */

async function slugs(page: Page): Promise<string[]> {
  await page.goto('/#/components');
  return page.locator('.subnav-link').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute('href') ?? '')
      .filter(href => href.startsWith('#/components/'))
      .map(href => href.replace('#/components/', '')));
}

test('the catalogue covers every documented component', async ({ page }) => {
  const list = await slugs(page);
  expect(list.length).toBeGreaterThanOrEqual(25);
  expect(new Set(list).size).toBe(list.length);
});

test('每个组件页都完整且没有报错', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));

  const list = await slugs(page);
  for (const slug of list) {
    await page.goto(`/#/components/${slug}`);

    // Chinese name first, then the export name — the same label the sidebar shows.
    const heading = (await page.locator('h1').textContent()) ?? '';
    expect(heading, `${slug}: heading`).toMatch(/\S+\s+\S+/);

    // A live example, the API, and the keyboard notes are the three things a reader needs.
    await expect(page.locator('.demo-card').first(), `${slug}: example`).toBeVisible();
    await expect(page.locator('.props-table tbody tr').first(), `${slug}: props`).toBeVisible();
    await expect(page.locator('.doc-a11y li').first(), `${slug}: notes`).toBeVisible();

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `${slug}: horizontal overflow`).toBe(true);
  }
  expect(errors, errors.join('\n')).toEqual([]);
});

test('每个示例都能展开看到代码', async ({ page }) => {
  const list = await slugs(page);
  for (const slug of list.slice(0, 8)) {
    await page.goto(`/#/components/${slug}`);
    const toggle = page.locator('.demo-code-toggle').first();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.demo-card-code pre').first()).toBeVisible();
  }
});

test('焦点环只在该出现时出现，而且只有一层', async ({ page }) => {
  await page.goto('/#/components/text-field');

  /**
   * A button clicked with the mouse must not ring: the pointer already told the reader where
   * they are. `:focus-visible` is what draws that line, and it is also the fix for the original
   * defect — the container used to ring on `:focus-within`, which lights up for any focus at all.
   */
  const button = page.locator('.demo-code-toggle').first();
  await button.click();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'none');

  /**
   * A text field is the documented exception: Chrome matches `:focus-visible` on it however it
   * was focused, because the reader is about to type and needs to see where the characters will
   * land. macOS rings a clicked text field too. So the thing worth holding is not "no ring on
   * click" — it is that there is exactly ONE ring, on the container, and never a second on the
   * input inside it. Two overlapping 3px rings were what the original report was about.
   */
  const box = page.locator('.lg-field-box').first();
  const input = page.getByLabel('工作区名称');
  await input.click();
  await expect(input).toBeFocused();
  await expect(box).toHaveCSS('outline-width', '2px');
  await expect(box).not.toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
  await expect(input).toHaveCSS('outline-style', 'none');
  expect(await box.evaluate(node => [...node.querySelectorAll('*')]
    .filter(child => getComputedStyle(child).outlineStyle !== 'none' && parseFloat(getComputedStyle(child).outlineWidth) > 0).length),
    'something inside the field box draws a second ring').toBe(0);

  // Arriving by keyboard lands in the same place: still one ring, still on the container.
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();
  await expect(box).toHaveCSS('outline-width', '2px');
  await expect(input).toHaveCSS('outline-style', 'none');
});

test('浮层在深色下也是深色', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const [slug, trigger, role, name] of [
    ['dialog', '打开对话框', 'dialog', '创建一个工作区'],
    ['sheet', '打开面板', 'dialog', '分享这一刻'],
    ['alert', '删除工作区', 'alertdialog', '删除这个工作区？'],
  ] as const) {
    await page.goto(`/#/components/${slug}`);
    await page.getByRole('button', { name: trigger }).click();
    const overlay = page.getByRole(role, { name });
    await expect(overlay).toBeVisible();
    // The demo frame starts in the site's appearance, so a top-layer overlay cannot land
    // as a white panel over a dark page.
    await expect(overlay).toHaveAttribute('data-lg-theme', 'dark');
  }
});

test('演示里的链接不会把读者带离当前页', async ({ page }) => {
  for (const slug of ['list', 'tab-bar', 'sidebar']) {
    await page.goto(`/#/components/${slug}`);
    const before = page.url();
    const links = page.locator('.demo-card .demo-content a');
    const count = await links.count();
    for (let index = 0; index < count; index++) {
      await links.nth(index).click({ force: true });
      expect(page.url(), `${slug}: link ${index} changed the route`).toBe(before);
    }
  }
});

test('左栏高亮跟着当前页走', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const path of ['overview', 'foundations/materials', 'components', 'guides/install']) {
    await page.goto(`/#/${path}`);
    const nav = page.getByRole('navigation', { name: '主导航' });
    await expect(nav).toHaveAttribute('data-layout', 'sidebar');
    // The section tabs and the page list inside the sidebar are separately labelled navs,
    // so each marks its own current item; this asserts the section tabs.
    const current = nav.locator('.lg-tab-link[aria-current="page"]');
    await expect(current).toHaveCount(1);
    // The highlight is drawn by a lens that has to track the vertical axis too. It glides
    // there on a spring, so this waits for it to arrive rather than sampling mid-flight.
    await expect.poll(() => nav.evaluate(node => {
      const lens = node.querySelector('.lg-selection-lens') as HTMLElement | null;
      const active = node.querySelector('.lg-tab-link[aria-current="page"]') as HTMLElement | null;
      if (!lens || !active) return -1;
      return Math.round(Math.abs(lens.getBoundingClientRect().top - active.getBoundingClientRect().top));
    }), `${path}: highlight is not on the current item`).toBeLessThanOrEqual(1);
  }
});
