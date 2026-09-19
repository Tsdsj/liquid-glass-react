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
 * items it reveals less than the plain buttons it replaced.
 */

const RULES = [
  { id: 'two-prominent', match: /two glassProminent buttons share one surface/ },
  { id: 'glass-on-glass', match: /small glass inside small glass/ },
  { id: 'clear-without-tone', match: /material="clear" needs a known backdrop/ },
  { id: 'mixed-group', match: /mixes icon-only and text buttons/ },
  { id: 'short-menu', match: /GlassMenuButton has 2 items/ },
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
