import { test, expect } from '@playwright/test';

/**
 * React only reports a hydration mismatch at the moment it happens, in a development build.
 * The existing SSR test renders to a string and reads it — useful, but it cannot see this.
 * `site/hydration-probe.html` does both passes as the page's only React work; this reads what
 * React said about them.
 *
 * `defaultOpen` overlays are the case the roadmap flagged: the server cannot emit an `open`
 * dialog, so the element arrives closed and an effect opens it. Whether that is a mismatch or
 * a legitimate client-only transition was the open question.
 */

const MISMATCH = /hydrat|did not match|server (?:rendered|html)|text content does not match/i;

test('every component hydrates onto its own server markup without complaint', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(String(error)));

  await page.goto('/hydration-probe.html');
  await expect(page.locator('#probe-done')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(600);

  const mismatches = errors.filter(line => MISMATCH.test(line));
  expect(mismatches, `React reported a hydration mismatch:\n${mismatches.join('\n---\n')}`).toEqual([]);
  expect(errors, `console errors during hydration:\n${errors.join('\n---\n')}`).toEqual([]);
});

test('a default-open dialog ends up actually open after hydration', async ({ page }) => {
  await page.goto('/hydration-probe.html');
  await expect(page.locator('#probe-done')).toBeVisible({ timeout: 15_000 });
  // Not just "no mismatch": the effect that opens it has to survive hydration, or the overlay
  // silently never appears — which would pass a mismatch check while being useless.
  const open = await page.locator('[data-case="dialog-default-open"] dialog').evaluate(node => (node as HTMLDialogElement).open);
  expect(open, 'the dialog hydrated but never opened').toBe(true);
});
