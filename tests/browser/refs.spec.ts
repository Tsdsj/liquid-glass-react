import { test, expect } from '@playwright/test';

/**
 * Two things a component library is expected to do and this one did not: hand back the DOM
 * node it rendered, and let the caller put ordinary HTML attributes on it. Without the first
 * you cannot measure a component, point `ScrollEdge.targetRef` at your own list, or anchor a
 * third-party library to it. Without the second you cannot set `id`, `style`, `data-*` or
 * `aria-describedby` — so the component cannot be referred to from anywhere else on the page.
 *
 * The harness is `site/src/pages/ref-probe.tsx`: it renders every exported component with a
 * ref and those attributes, because asking a React component whether it forwards a ref is a
 * question only React can answer. This file reads what came back.
 */

interface Result { name: string; tag: string | null; id: string | null; probe: string | null; style: string | null }

async function probe(page: import('@playwright/test').Page) {
  await page.goto('/#/_probe/refs');
  const text = await page.locator('#probe-result').textContent({ timeout: 15_000 });
  return JSON.parse(text!) as { missing: string[]; results: Result[] };
}

test('every component in the public surface is covered by the probe', async ({ page }) => {
  const { missing } = await probe(page);
  // A component exported without an entry in the harness would otherwise skip both checks below.
  expect(missing, `exported but not probed: ${missing.join(', ')}`).toEqual([]);
});

test('every component hands back the element it rendered', async ({ page }) => {
  const { results } = await probe(page);
  const silent = results.filter(r => r.tag === null).map(r => r.name);
  expect(silent, `these never called the ref: ${silent.join(', ')}`).toEqual([]);
});

test('every component passes plain HTML attributes through to that element', async ({ page }) => {
  const { results } = await probe(page);

  const noProbe = results.filter(r => r.tag !== null && r.probe !== r.name).map(r => r.name);
  expect(noProbe, `data-probe did not reach the root of: ${noProbe.join(', ')}`).toEqual([]);

  // `style` merges rather than replaces: the component's own custom properties have to survive.
  const noStyle = results.filter(r => r.tag !== null && !(r.style ?? '').includes('outline-offset')).map(r => r.name);
  expect(noStyle, `style did not reach the root of: ${noStyle.join(', ')}`).toEqual([]);

  /**
   * `id` is the one attribute some components legitimately refuse: the overlays mint their own
   * and wire `aria-controls` / `aria-labelledby` to it, so a caller-supplied id would break the
   * relationship rather than add one. Those omit `id` from their props type, and the compiler
   * is what enforces it — here we only check that the ones which do accept it honour it.
   */
  const wrongId = results.filter(r => r.id !== null && r.id !== `probe-${r.name}` && !r.id.startsWith('lg-') && !r.id.startsWith('«'))
    .map(r => `${r.name} (${r.id})`);
  expect(wrongId, `id was accepted but not applied: ${wrongId.join(', ')}`).toEqual([]);
});
