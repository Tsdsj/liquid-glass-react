import { test, expect } from '@playwright/test';

/**
 * Seven defects found by building an application with the published package.
 *
 * None of them was visible from inside the library. They were found by someone who installed
 * the tarball, read the documentation, and built a console with it — which is the only way to
 * find the ones that are about two components meeting, or about a default that is only wrong
 * on a platform the demos are not looked at on.
 *
 * Each test is written so that reverting its fix turns it red; where that took two goes, the
 * comment says what the first version measured instead.
 */

/** Relative luminance of an 8-bit sRGB triple, per WCAG. Same formula as `contrast.spec.ts`. */
function luminance([r, g, b]: number[]) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= .03928 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  };
  return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
}
const ratio = (a: number, b: number) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + .05) / (lo + .05); };

/* ------------------------------------------------------------------------------------------
   1. `theme="system"` reaches the content layer
   ------------------------------------------------------------------------------------------ */

/**
 * The dark values hang off `[data-lg-theme="dark"]` and nothing else — there is no
 * `prefers-color-scheme` rule anywhere in the stylesheet, because a theme is declared per
 * surface so a dark toolbar can sit in a light page. The provider stamped every glass surface
 * with the resolved theme and left the document root alone, so with `theme="system"` on a dark
 * system the bars went dark and every card, list and form stayed light.
 *
 * The site's boot script sets the attribute before first paint, so a plain page load cannot
 * see this. Switching the preference at runtime can: nothing but the provider writes it after
 * load.
 */
test('the resolved theme reaches the page, not only the glass', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/#/');
  await page.waitForTimeout(500);

  const setTheme = async (label: string) => {
    await page.getByRole('button', { name: '打开显示偏好' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('radio', { name: label }).click();
    await page.waitForTimeout(400);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  };

  await setTheme('浅色');
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-lg-theme'))).toBe('light');

  await setTheme('跟随系统');
  const state = await page.evaluate(() => {
    const card = document.querySelector('.lg-card');
    return {
      root: document.documentElement.getAttribute('data-lg-theme'),
      cardBackground: card ? getComputedStyle(card).backgroundColor : null,
      label: getComputedStyle(document.documentElement).getPropertyValue('--lg-label').trim(),
    };
  });
  expect(state.root, 'the root kept the theme the user had switched away from').toBe('dark');
  expect(state.label, `--lg-label was ${state.label}`).toContain('255');
});

/* ------------------------------------------------------------------------------------------
   2. `SearchField` is a field, not a hit target
   ------------------------------------------------------------------------------------------ */

/**
 * `min-height: var(--lg-hit-min)` reads the WCAG 2.2 pointer floor — the smallest a *target*
 * may be, 24px — as a control height. On a touch screen that number is 44 and happens to be
 * right, which is why it was only ever wrong with a mouse, and why every screenshot of it
 * looked fine.
 */
test('a search field is the same height as a text field beside it', async ({ page }) => {
  await page.goto('/#/components/search-field');
  await page.waitForTimeout(400);
  const search = await page.locator('.lg-search-box').first().evaluate(node => node.getBoundingClientRect().height);

  await page.goto('/#/components/text-field');
  await page.waitForTimeout(400);
  const field = await page.locator('.lg-field-box').first().evaluate(node => node.getBoundingClientRect().height);

  expect(search, `search box measured ${search}px against a ${field}px text field`).toBeCloseTo(field, 0);
  expect(search, 'the pointer field scale is 36px').toBeGreaterThanOrEqual(32);
});

/* ------------------------------------------------------------------------------------------
   3. `Screen` reserves the height of the bar that is actually there
   ------------------------------------------------------------------------------------------ */

/**
 * `.lg-tabbar` fixes itself to the viewport. Inside a screen slot that means it leaves the
 * flow, the slot measures zero, and `--lg-screen-bottom` reports the slot's own padding — 24px
 * for a 60px bar. The last stretch of every page sat under the tab bar.
 *
 * Measured against the bar's own rectangle rather than against a constant, so it stays true at
 * the text sizes where the bar grows.
 */
test('the screen reserves the real height of its bottom bar', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto('/#/');
  await page.waitForTimeout(500);

  /* The shape is built here rather than found on a page because the site has no screen with a
     bottom tab bar — it puts its own tab bar in the top slot — and that is exactly why this
     survived a release. `offsetHeight` on the slot is the number `Screen` measures. */
  const measured = await page.evaluate(() => {
    const screen = document.createElement('div');
    screen.className = 'lg-screen';
    screen.style.cssText = 'position:fixed;inset:0;visibility:hidden';
    screen.innerHTML = `<div class="lg-screen-bar" data-edge="bottom">
      <nav class="lg-tabbar" data-layout="tabbar"><div style="height:60px;width:200px"></div></nav>
    </div>`;
    document.body.append(screen);
    const slot = screen.querySelector('.lg-screen-bar') as HTMLElement;
    const bar = screen.querySelector('.lg-tabbar') as HTMLElement;
    const result = { slot: slot.offsetHeight, position: getComputedStyle(bar).position, bar: bar.getBoundingClientRect().height };
    screen.remove();
    return result;
  });
  expect(measured.position, 'a bar that fixes itself inside a slot leaves the flow').toBe('static');
  expect(measured.slot, `the slot measured ${measured.slot}px around a ${measured.bar}px bar`)
    .toBeGreaterThanOrEqual(measured.bar);
});

/* ------------------------------------------------------------------------------------------
   4. A toast does not sit on the main navigation
   ------------------------------------------------------------------------------------------ */

/**
 * The toast region was pinned to the viewport's bottom edge and knew nothing about a bottom
 * bar, so a toast landed on the same rows of pixels as the tab bar with `pointer-events: auto`
 * over them. Hit-tested rather than compared: what matters is not where the boxes are but
 * whether the tabs can still be pressed.
 */
test('a toast stays above a screen bottom bar', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto('/#/components/toast');
  await page.waitForTimeout(500);

  /* A live `Screen` publishing a bottom bar of 84px — the number a 60px tab bar and the slot's
     own padding come to. The toast region is rendered into a portal at the end of <body>, so
     the root is the only place it can read this from. */
  await page.evaluate(() => document.documentElement.style.setProperty('--lg-screen-bottom', '84px'));

  await page.getByRole('button', { name: '删除最后一项' }).first().click();
  const toast = page.locator('.lg-toast').first();
  await expect(toast).toBeVisible();
  /* After it has landed: the entrance animates from `translateY(12px)`, and measuring through
     that reads 12px lower than where the toast comes to rest. */
  await page.waitForTimeout(600);

  const clearance = await toast.evaluate(node => window.innerHeight - node.getBoundingClientRect().bottom);
  await page.evaluate(() => document.documentElement.style.removeProperty('--lg-screen-bottom'));
  expect(clearance, `the toast finished ${clearance.toFixed(0)}px above the viewport floor, inside an 84px bar`)
    .toBeGreaterThanOrEqual(84);
});

/* ------------------------------------------------------------------------------------------
   5. A list row's label outranks its decorations
   ------------------------------------------------------------------------------------------ */

/**
 * Every slot but the label was `flex: 0 0 auto`, so in a narrow column the leading glyph, the
 * value, the accessory and the chevron took the whole width and the row's own title was handed
 * what was left — 41px in the 193px a three-column split view produces on an 800px window,
 * which `overflow-wrap: anywhere` then set as a column of single characters 238px tall.
 *
 * The width is applied to the list, not the window, because the fix is a container query: the
 * row reflows against the column it is in.
 */
test('a list row keeps its label in a narrow column', async ({ page }) => {
  await page.goto('/#/components/list');
  await page.waitForTimeout(400);

  const measured = await page.evaluate(() => {
    const group = document.querySelector('.lg-list-group') as HTMLElement | null;
    const row = group?.querySelector('.lg-list-row:has(.lg-row-value)') as HTMLElement | null;
    if (!group || !row) return null;
    group.style.width = '193px';
    // Force layout before reading back.
    void group.offsetWidth;
    const labels = row.querySelector('.lg-row-labels')!.getBoundingClientRect();
    const height = row.getBoundingClientRect().height;
    group.style.width = '';
    return { label: labels.width, height };
  });
  expect(measured, 'no list row with a value to measure').not.toBeNull();
  expect(measured!.label, `the label got ${measured!.label.toFixed(1)}px of a 193px row`).toBeGreaterThan(100);
  expect(measured!.height, `the row grew to ${measured!.height.toFixed(0)}px`).toBeLessThan(140);
});

/* ------------------------------------------------------------------------------------------
   5b. A list inside glass does not repaint the glass
   ------------------------------------------------------------------------------------------ */

/**
 * Both list variants declare an opaque background, and `plain` declares `--lg-bg` — the *page*
 * background, pure black in dark. Put a navigation list in a sidebar and it punched a black
 * rectangle through the material, squared off against the panel's 26px corner.
 *
 * Measured against the panel's own radius and padding rather than against 10px, so a caller
 * who passes their own `radius` to the sidebar is still measured correctly.
 */
for (const scheme of ['light', 'dark'] as const) {
  test(`a list in a sidebar paints nothing and takes the panel's corner — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/sidebar');
    await page.waitForTimeout(500);

    const measured = await page.locator('#sidebar-basic .lg-list-group').first().evaluate(group => {
      const surface = group.closest('.lg-root') as HTMLElement;
      const style = getComputedStyle(surface);
      const read = (name: string) => parseFloat(style.getPropertyValue(name)) || 0;
      return {
        background: getComputedStyle(group).backgroundColor,
        radius: parseFloat(getComputedStyle(group).borderTopLeftRadius),
        expected: Math.max(0, read('--lg-radius-container') - read('--lg-concentric-inset')),
      };
    });
    expect(measured.background, 'the list painted over the glass').toBe('rgba(0, 0, 0, 0)');
    expect(measured.radius, `the group's corner was ${measured.radius}px against a concentric ${measured.expected}px`)
      .toBeCloseTo(measured.expected, 0);
  });
}

/* ------------------------------------------------------------------------------------------
   5c. A list column says which row the detail belongs to
   ------------------------------------------------------------------------------------------ */

/**
 * `split-views.md:13` — "persistently highlight the current selection in each pane that leads
 * to the detail view". `ListRow` had no way to say it: nothing emitted `aria-current`, and the
 * stylesheet only ever styled `[aria-current]` on a tab link and a path level. A list used as
 * the middle column of a split view could not show what was selected, so the documentation
 * site's own sidebar demo had hand-rolled rows with their own class to get around it.
 *
 * The colour is checked against the label on it, not against a constant: this is the same
 * `--lg-accent-fill` the outline view selects with, and that pairing is the one that has to
 * keep clearing 4.5:1 if the brand colour is ever changed.
 */
for (const scheme of ['light', 'dark'] as const) {
  test(`the selected row is announced and drawn — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/#/components/sidebar');
    await page.waitForTimeout(500);

    const row = page.locator('#sidebar-basic .lg-list-row[data-selected="true"]').first();
    await expect(row).toBeVisible();
    expect(await row.locator('.lg-row-hit').getAttribute('aria-current'), 'nothing was announced').toBe('true');

    const pair = await row.locator('.lg-row-hit').evaluate(hit => {
      const read = (value: string) => {
        const numbers = (value.match(/[\d.]+/g) ?? []).map(Number);
        return /^color\(srgb/.test(value) ? [numbers[0] * 255, numbers[1] * 255, numbers[2] * 255] : numbers.slice(0, 3);
      };
      const label = hit.querySelector('.lg-row-label')!;
      return { fill: read(getComputedStyle(hit).backgroundColor), ink: read(getComputedStyle(label).color) };
    });
    expect(pair.fill.join(), 'the selected row was not filled').not.toBe([0, 0, 0].join());
    const got = ratio(luminance(pair.ink), luminance(pair.fill));
    expect(got, `the selected row's label measured ${got.toFixed(2)}:1 in ${scheme}`).toBeGreaterThanOrEqual(4.5);
  });
}

/* ------------------------------------------------------------------------------------------
   6. Nothing is described by an element that is not there
   ------------------------------------------------------------------------------------------ */

/**
 * A field with both `hint` and `error` dropped the hint from the document and kept its id in
 * `aria-describedby` — a dangling IDREF, which different screen readers resolve differently,
 * and which took away the one sentence saying what a right answer looks like at the exact
 * moment the answer was wrong.
 */
test('every aria-describedby points at something', async ({ page }) => {
  await page.goto('/#/components/text-field');
  await page.waitForTimeout(400);

  /* The second field in this demo is the one with a hint *and* a validity rule. */
  const field = page.getByLabel('电子邮件').first();
  await field.fill('not-an-email');
  await page.waitForTimeout(300);

  const report = await page.evaluate(() => {
    const dangling: { described: string; missing: string }[] = [];
    for (const node of document.querySelectorAll('[aria-describedby]')) {
      for (const id of (node.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean)) {
        if (!document.getElementById(id)) dangling.push({ described: node.className || node.tagName, missing: id });
      }
    }
    const box = document.querySelector('.lg-field-input[aria-invalid="true"]')?.closest('.lg-field');
    return { dangling, messages: [...(box?.querySelectorAll('.lg-field-message') ?? [])].length };
  });
  expect(report.dangling, JSON.stringify(report.dangling)).toEqual([]);
  expect(report.messages, 'the hint disappeared when the error arrived').toBeGreaterThanOrEqual(2);
});

/* ------------------------------------------------------------------------------------------
   7. The palette keeps nothing between two openings
   ------------------------------------------------------------------------------------------ */

/**
 * Closing reset the query and not the highlight. With the same commands on screen the list's
 * contents were unchanged, so the effect keyed on them never re-ran, and the palette came back
 * with an empty field and last time's row lit — which meant ⌘K then Enter ran whatever was run
 * last time, not the row at the top of the list.
 */
test('the command palette opens on its first row every time', async ({ page }) => {
  await page.goto('/#/components/command-palette');
  await page.waitForTimeout(500);

  /* The demo palette, not the site's own ⌘K — both are `.lg-palette`, and the site's is the
     first in the document. Reading the wrong one was the first version of this test, and it
     reported "no highlight" whatever the library did. */
  const panel = page.locator('.lg-palette', { has: page.locator('h2', { hasText: '命令' }) }).first();
  const first = async () => panel.evaluate(node => {
    const input = node.querySelector('.lg-palette-input') as HTMLInputElement | null;
    const active = input?.getAttribute('aria-activedescendant');
    const options = [...node.querySelectorAll('.lg-palette-option')];
    return { index: options.findIndex(option => option.id === active), query: input?.value ?? null };
  });

  const open = async () => {
    await page.locator('#palette-basic').getByRole('button', { name: '打开命令面板' }).click();
    await expect(panel).toBeVisible();
    await page.waitForTimeout(300);
  };

  await open();
  expect((await first()).index).toBe(0);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);
  expect((await first()).index).toBeGreaterThan(0);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await open();

  const reopened = await first();
  expect(reopened.query, 'the query came back too').toBe('');
  expect(reopened.index, 'the palette reopened on the row that ran last time').toBe(0);
});

/* ------------------------------------------------------------------------------------------
   8. The focus ring answers to the brand colour the documentation points at
   ------------------------------------------------------------------------------------------ */

test('re-branding moves the focus ring with it', async ({ page }) => {
  await page.goto('/#/');
  await page.waitForTimeout(400);
  /* On the root, which is where the API table says the two derived values are computed: a
     custom property substitutes against the element it is declared on, so a local override
     further down cannot reach a `--lg-focus` that was resolved at `:root`. */
  const focus = await page.evaluate(() => {
    const root = document.documentElement;
    const before = root.style.getPropertyValue('--lg-accent');
    root.style.setProperty('--lg-accent', 'rgb(120 30 200)');
    const value = getComputedStyle(root).getPropertyValue('--lg-focus').trim();
    if (before) root.style.setProperty('--lg-accent', before); else root.style.removeProperty('--lg-accent');
    return value;
  });
  expect(focus, `--lg-focus resolved to ${focus} under a re-branded accent`).toContain('120');
});
