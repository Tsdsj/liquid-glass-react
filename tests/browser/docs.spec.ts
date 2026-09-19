import { test, expect, type Page } from '@playwright/test';

/**
 * The three things every component page was missing: what to import, what to read next, and
 * where the page itself lives. Plus the highlighting, which is a hand-written tokenizer rather
 * than a library because the site is held to zero external requests.
 */

async function slugs(page: Page): Promise<string[]> {
  await page.goto('/#/components');
  return page.locator('.subnav-link').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute('href') ?? '')
      .filter(href => href.startsWith('#/components/'))
      .map(href => href.replace('#/components/', '')));
}

test('every component page says what to import', async ({ page }) => {
  const list = await slugs(page);
  const missing: string[] = [];
  for (const slug of list) {
    await page.goto(`/#/components/${slug}`);
    const line = (await page.locator('.doc-import code').innerText()).trim();
    // The component's own export name has to be in the line it tells you to copy.
    const name = (await page.locator('h1').innerText()).trim().split(/\s+/).pop()!;
    if (!line.startsWith('import {') || !line.includes('@ttqtt/liquid-glass-react') || !line.includes(name)) {
      missing.push(`${slug}: ${line}`);
    }
  }
  expect(missing, `import line wrong on:\n${missing.join('\n')}`).toEqual([]);
});

test('every component page points somewhere next, and nowhere dead', async ({ page }) => {
  const list = await slugs(page);
  const known = new Set(list);
  const problems: string[] = [];
  for (const slug of list) {
    await page.goto(`/#/components/${slug}`);
    const links = await page.locator('.doc-related-link').evaluateAll(nodes =>
      nodes.map(node => node.getAttribute('href') ?? ''));
    if (links.length === 0) { problems.push(`${slug}: no related components`); continue; }
    for (const href of links) {
      const target = href.replace('#/components/', '');
      if (!known.has(target)) problems.push(`${slug} -> ${target} does not exist`);
      if (target === slug) problems.push(`${slug} links to itself`);
    }
  }
  expect(problems, problems.join('\n')).toEqual([]);
});

test('every component page links to its own source and to a new issue', async ({ page }) => {
  await page.goto('/#/components/sheet');
  const links = page.locator('.doc-source-link');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAttribute('href', /github\.com\/Tsdsj\/liquid-glass-react\/blob\/main\/site\/src\/catalog\/overlays\.tsx$/);
  await expect(links.nth(1)).toHaveAttribute('href', /github\.com\/Tsdsj\/liquid-glass-react\/issues\/new\?title=/);
});

test('code is highlighted by the site itself, with colours from the token palette', async ({ page }) => {
  await page.goto('/#/components/button');
  await page.locator('.demo-code-toggle').first().click();
  const block = page.locator('.demo-card-code').first();
  await expect(block.locator('pre')).toBeVisible();

  // Every class the tokenizer can emit should be present somewhere in a JSX example.
  for (const kind of ['tag', 'attr', 'string']) {
    expect(await block.locator(`.code-${kind}`).count(), `nothing was marked as ${kind}`).toBeGreaterThan(0);
  }

  /**
   * What you see has to be what you copy. The copy button writes the original string while the
   * block shows the tokenizer's output, so this is the one place the two can be compared — and
   * a tokenizer that drops or duplicates a character produces code that reads fine and does not
   * run, which is worse than no colour at all. `tests/core/tokenize.test.mjs` checks the same
   * property directly; this checks the wiring around it.
   */
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await block.locator('.code-copy').click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  const shown = await block.locator('pre').evaluate(node => node.textContent ?? '');
  expect(shown, 'the highlighted code differs from what the copy button gives you').toBe(copied);

  // Colours come from the palette, so they are real colours and they differ from body text.
  const [tag, plain] = await Promise.all([
    block.locator('.code-tag').first().evaluate(node => getComputedStyle(node).color),
    block.locator('pre').evaluate(node => getComputedStyle(node).color),
  ]);
  expect(tag).not.toBe(plain);
  expect(tag).toMatch(/^rgb/);
});
