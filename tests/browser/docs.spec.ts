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

/**
 * The documentation site's own promises.
 *
 * `scripts/check-props.mjs` already refuses to build a page with fewer than three examples or
 * with none adjustable — that is the structural half, and it runs before anything is
 * published. What it cannot see is whether the adjustable example actually *works*: whether
 * turning a knob changes what is on screen and what the code block says, and whether the
 * things the search claims to index can actually be found.
 */

/* ---------- D3: the adjustable example ---------- */

test('a knob changes the example and the code together', async ({ page }) => {
  await page.goto('/#/components/button');
  const card = page.locator('.demo-card[data-adjustable="true"]');
  await card.scrollIntoViewIfNeeded();

  // Open the code so both halves are readable at once.
  await card.getByRole('button', { name: /显示代码/ }).click();
  const code = card.locator('.demo-card-code');
  await expect(code).not.toContainText('controlSize');

  await card.getByRole('radio', { name: '大', exact: true }).click();

  const button = card.locator('.demo-stage').getByRole('button', { name: '可调节的按钮' });
  await expect(button).toHaveAttribute('data-control-size', 'large');
  await expect(code, 'the snippet did not follow the knob').toContainText('controlSize="large"');
});

test('a boolean knob is a real switch with a name', async ({ page }) => {
  await page.goto('/#/components/button');
  const panel = page.locator('.knob-panel');
  await panel.scrollIntoViewIfNeeded();
  const unnamed = await panel.locator('[role="switch"], button, input').evaluateAll(nodes =>
    nodes.filter(node => !node.getAttribute('aria-label')
      && !node.getAttribute('aria-labelledby')
      && !node.closest('label')
      && !node.textContent?.trim()).length);
  expect(unnamed, 'a knob with no name is a control nobody can reach').toBe(0);
});

/**
 * The knob panel is apparatus, not part of the example.
 *
 * It is built from this library's own controls, so a `Picker` knob really is a second
 * segmented control and a number knob really is a second stepper. They sit outside the element
 * the example's anchor names, which is what keeps "the segmented control in this example" from
 * meaning two different things.
 */
test('the knobs are outside the example they adjust', async ({ page }) => {
  await page.goto('/#/components/segmented-control');
  const stage = page.locator('#segmented-basic');
  await expect(stage).toHaveClass(/demo-stage/);
  await expect(stage.locator('.knob-panel')).toHaveCount(0);
  await expect(stage.locator('.lg-segmented-track')).toHaveCount(1);
});

/* ---------- D1: three examples, and they are different questions ---------- */

test('every component page shows at least three examples', async ({ page }) => {
  await page.goto('/#/components/switch');
  await expect(page.locator('.demo-card')).toHaveCount(3);
  // Distinct anchors, so the outline can name each of them.
  const ids = await page.locator('.demo-stage[id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(ids).size).toBe(ids.length);
});

/* ---------- D5: search reaches inside the pages ---------- */

const openSearch = async (page: import('@playwright/test').Page) => {
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.getByRole('dialog', { name: '搜索' });
  await expect(dialog).toBeVisible();
  return dialog;
};

test('searching finds a property name, not only a component name', async ({ page }) => {
  await page.goto('/#/overview');
  const dialog = await openSearch(page);
  await page.getByRole('searchbox', { name: '搜索' }).fill('marks');
  const row = dialog.getByRole('listitem').filter({ hasText: 'marks' }).first();
  await expect(row).toBeVisible();
  await expect(row).toContainText('属性');
});

test('choosing a property result lands on that page at its API table', async ({ page }) => {
  await page.goto('/#/overview');
  await openSearch(page);
  await page.getByRole('searchbox', { name: '搜索' }).fill('marks');
  await page.getByRole('listitem').filter({ hasText: 'marks' }).first().getByRole('button').click();

  await expect(page).toHaveURL(/#\/components\/slider/);
  await page.waitForTimeout(400);
  const top = await page.locator('#api').evaluate(node => node.getBoundingClientRect().top);
  expect(top, `the API section is ${top.toFixed(0)}px from the top`).toBeLessThan(300);
});

test('searching finds an example by its title', async ({ page }) => {
  await page.goto('/#/overview');
  const dialog = await openSearch(page);
  await page.getByRole('searchbox', { name: '搜索' }).fill('刻度');
  const row = dialog.getByRole('listitem').filter({ hasText: '刻度' }).first();
  await expect(row).toBeVisible();
  await expect(row).toContainText('示例');
});

test('searching finds a section heading', async ({ page }) => {
  await page.goto('/#/overview');
  const dialog = await openSearch(page);
  await page.getByRole('searchbox', { name: '搜索' }).fill('键盘与辅助功能');
  await expect(dialog.getByRole('listitem').first()).toContainText('章节');
});

/* ---------- D8: the refraction switch ---------- */

/**
 * The overview states that refraction is off by default and only Chromium can do it. That
 * sentence sat on the page for months with no way to see the difference, which reads as an
 * excuse rather than a boundary. The switch is the demonstration — and where the browser
 * cannot do it, it says so instead of pretending.
 */
test('the refraction switch turns refraction on where the browser can do it', async ({ page, browserName }) => {
  await page.goto('/#/overview');
  const toggle = page.getByRole('switch', { name: '边缘折射' });
  await expect(toggle).toBeVisible();

  const capable = await page.evaluate(() => CSS.supports('backdrop-filter', 'url("#glass-probe")'));
  if (!capable) {
    await expect(toggle, `${browserName} cannot refract, so the switch must be disabled`).toBeDisabled();
    await expect(page.locator('.refraction-switch')).toContainText('不支持折射');
    return;
  }

  // Off to begin with: this is the library's default and the page says so.
  await expect(page.locator('.media-viewer .lg-root[data-renderer="svg"]')).toHaveCount(0);
  await toggle.click();
  await page.waitForTimeout(400);
  await expect(page.locator('.media-viewer .lg-root[data-renderer="svg"]').first()).toBeVisible();

  // And only this demo — the rest of the page keeps the default.
  await expect(page.locator('.lg-tabbar[data-renderer="svg"]')).toHaveCount(0);
});


/* ---------- The demo audit: the page has to do what the page says ----------
 *
 * These come from reading the site as a set of claims rather than as a set of screens. A page
 * that prints "36px" beside a field, or "the hit region is 44", has made a statement that can be
 * measured — and nothing had ever measured them.
 */

test('the field sizes a page prints are the sizes it renders', async ({ page }) => {
  await page.goto('/#/components/text-field');
  await page.locator('#field-sizes-demo').scrollIntoViewIfNeeded();
  const claims = await page.locator('#field-sizes-demo .lg-field-box').evaluateAll(nodes => nodes
    .map(node => ({
      said: node.querySelector('input')?.getAttribute('placeholder') ?? '',
      measured: Math.round(node.getBoundingClientRect().height),
    }))
    .filter(entry => /^\d+px$/.test(entry.said)));
  expect(claims.length, 'the size comparison is gone').toBeGreaterThanOrEqual(3);
  for (const { said, measured } of claims) {
    expect(measured, `the placeholder says ${said} and it renders ${measured}px`).toBe(parseInt(said, 10));
  }
});

test('every overlay page can be seen over a photograph', async ({ page }) => {
  /* A glass surface's whole claim is that it takes its colour from what is behind it, and the
     eleven components for which "floats above content" is the entire description were the ones
     with no content to float above. `scripts/check-props.mjs` keeps this true for all of them;
     this checks that the switch a reader needs actually reaches the screen. */
  for (const slug of ['popover', 'sheet', 'toast', 'banner']) {
    await page.goto(`/#/components/${slug}`);
    await expect(page.getByRole('radio', { name: '图片背景' }),
      `${slug} offers no way to see it over anything`).toHaveCount(1);
  }
});

test('the adjustable example can be put back the way it was written', async ({ page }) => {
  await page.goto('/#/components/card');
  const panel = page.locator('.knob-panel');
  await panel.scrollIntoViewIfNeeded();
  // Nothing has moved, so there is nothing to undo and no control saying otherwise.
  await expect(panel.getByRole('button', { name: '恢复示例原样' })).toHaveCount(0);

  const raised = panel.getByRole('switch', { name: '投影' });
  await raised.check();
  const reset = panel.getByRole('button', { name: '恢复示例原样' });
  await expect(reset).toBeVisible();
  await reset.click();
  await expect(reset).toHaveCount(0);
  await expect(raised).not.toBeChecked();
});

test('no label on this site contains another label', async ({ page }) => {
  /* The site's own `Form` page tells readers not to do this, and the preferences popover did it
     three times — a `<label>` row wrapped around a `GlassSwitch`, which renders its own. */
  await page.goto('/#/components/form');
  await page.getByRole('button', { name: '打开显示偏好' }).click();
  const nested = await page.evaluate(() =>
    [...document.querySelectorAll('label label')].map(node => node.className));
  expect(nested, `nested labels: ${nested.join(', ')}`).toEqual([]);
});

test('the text size switch reaches the size the layout rules were measured at', async ({ page }) => {
  await page.goto('/#/components/list');
  await page.getByRole('button', { name: '打开显示偏好' }).click();
  await page.getByRole('radio', { name: 'AX5' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-lg-text-size', 'ax5');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    'the largest text size pushes the document sideways').toBe(true);
});

test('a related-component card wraps rather than widening the document', async ({ page }) => {
  /* 「分段控件 GlassSegmentedControl」 — one unbreakable Latin token, 408px wide inside a 341px
     card at AX3 on a phone. Five pages moved 50px sideways because of it, and `app.css` had
     already learned this lesson in six other places. */
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ['button', 'switch', 'picker']) {
    await page.goto(`/#/components/${slug}`);
    await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax3'; });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${slug} is ${overflow}px wider than the window at AX3`).toBeLessThanOrEqual(0);
  }
});

test('a heading inside an example sits below the example’s own title', async ({ page }) => {
  /* The page's example titles are `h3`. A `NavigationBar` demo emitting `h3` too put sample
     titles and page structure on one level: a reader moving by heading on the navigation-stack
     page heard "设置, 设置, 基础用法, 调整属性, 收件箱" as a flat run, and only half of those
     are in the outline on the right. */
  for (const slug of ['text', 'navigation-bar', 'navigation-stack']) {
    await page.goto(`/#/components/${slug}`);
    await page.waitForSelector('#main');
    const inside = await page.evaluate(() =>
      [...document.querySelectorAll('.demo-stage :is(h1,h2,h3)')].map(node => node.textContent?.trim() ?? ''));
    expect(inside, `${slug}: ${inside.join(', ')}`).toEqual([]);
  }
});
