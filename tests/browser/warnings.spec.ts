import { test, expect } from '@playwright/test';
import { PREVIEW_PORT } from '../../playwright.config.js';

/**
 * The development-mode rules, checked against a page that breaks each of them on purpose.
 *
 * These run against the Vite dev server, not the built site: a production build replaces
 * `process.env.NODE_ENV` and folds the warnings away, which is exactly what should happen and
 * exactly why they cannot be observed in `site/dist`.
 *
 * Every rule here was previously something a person had to notice by reading a screen. Three
 * of them come from the audit that produced `reports/hig-review.md`; the fourth was already in
 * the toolbar and is included so the once-per-node bookkeeping covers it too. The fifth arrived
 * with `GlassMenuButton`: a menu has to be opened before it can be read, so below about three
 * items it reveals less than the plain buttons it replaced. The sixth, `tint-contrast`, existed
 * before this round but measured a pair of colours that were nowhere on the screen, so nothing
 * could demonstrate it firing — and nothing did.
 */

const RULES = [
  { id: 'two-prominent', match: /two glassProminent buttons share one surface/ },
  { id: 'glass-on-glass', match: /small glass inside small glass/ },
  { id: 'clear-without-tone', match: /material="clear" needs a known backdrop/ },
  { id: 'mixed-group', match: /mixes icon-only and text buttons/ },
  { id: 'short-menu', match: /GlassMenuButton has 2 items/ },
  { id: 'tint-contrast', match: /tint #ffd60a renders as rgb\(.+\) on rgb\(.+\) — \d\.\d\d:1/ },
];

async function warningsOn(page: import('@playwright/test').Page, path: string) {
  const lines: string[] = [];
  page.on('console', message => { if (message.type() === 'warning') lines.push(message.text()); });
  await page.goto(path);
  await page.waitForSelector('#main');
  await page.waitForTimeout(600);
  return lines.filter(line => line.includes('[liquid-glass-ui]'));
}

for (const rule of RULES) {
  test(`the ${rule.id} rule warns, once`, async ({ page }) => {
    const warnings = await warningsOn(page, '/#/_probe/warnings');
    const hits = warnings.filter(line => rule.match.test(line));
    expect(hits.length, `expected exactly one ${rule.id} warning, got ${hits.length}:\n${hits.join('\n')}`).toBe(1);
  });
}

test('a correct composition draws no warnings at all', async ({ page }) => {
  const warnings = await warningsOn(page, '/#/components/button');
  expect(warnings, `the documentation site should not be breaking its own rules:\n${warnings.join('\n')}`).toEqual([]);
});

/**
 * And on a phone, where the adjustable-properties panel used to break the short-menu rule.
 *
 * A two-option `select` knob became a `Picker`, and `Picker`'s automatic presentation reads the
 * *window's* size class — so in a narrow window it collapsed into a pop-up button holding two
 * items, which is precisely what `GlassMenuButton` warns about. Eight pages printed it. The
 * reference implementation tripping its own lint is worse than the lint being wrong: a reader
 * opening the console on the site that taught them the rule finds the rule being broken.
 */
test('the properties panel keeps its own rules on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ['progress', 'list', 'tooltip', 'picker']) {
    const warnings = await warningsOn(page, `/#/components/${slug}`);
    expect(warnings, `${slug} at 390px:\n${warnings.join('\n')}`).toEqual([]);
  }
});

test('the warnings are absent from a production build', async ({ page, baseURL }) => {
  /**
   * The same page served from `site/dist`. If anything here warns, the guard is not folding
   * away and every application using this library ships these messages to its users — which
   * is the bug the previous `globalThis.process?.env` form actually had.
   */
  const preview = new URL('/#/_probe/warnings', baseURL!.replace(/:\d+/, `:${PREVIEW_PORT}`)).toString();
  const lines: string[] = [];
  page.on('console', message => { if (message.type() === 'warning') lines.push(message.text()); });
  await page.goto(preview);
  await page.waitForSelector('#main');
  await page.waitForTimeout(600);
  expect(lines.filter(line => line.includes('[liquid-glass-ui]'))).toEqual([]);
});
