import { expect, type Page, type Locator } from '@playwright/test';

/**
 * How big a target has to be, which is a question about the pointer and not about the control.
 *
 * There are two floors and they are both real: **44×44** for a fingertip (HIG, Layout) and
 * **24×24** for a cursor (WCAG 2.2, Target Size (Minimum)). Until the desktop metrics existed
 * there was only ever one pointer kind in these tests, so several of them simply said `44` —
 * and when a regular control became 22px tall on a machine with a mouse, every one of those
 * assertions failed for the same wrong reason: they were asking whether this was still a phone.
 *
 * Read from the page rather than decided here, so a test cannot disagree with the stylesheet
 * about which platform it is running on.
 */
export const hitFloor = (page: Page) => page.evaluate(() => {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;font-size:var(--lg-hit-min)';
  document.documentElement.append(probe);
  const value = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  return value;
});

/** Force the other platform's metrics for the length of one assertion. */
export const asPlatform = (page: Page, platform: 'desktop' | 'touch' | null) =>
  page.evaluate(value => {
    if (value === null) document.documentElement.removeAttribute('data-lg-platform');
    else document.documentElement.setAttribute('data-lg-platform', value);
  }, platform);

/**
 * The size of what can actually be pressed: the element's own box, or the pseudo-element hit
 * region if it is drawn larger. A control is allowed to look smaller than it is — that is the
 * whole mechanism — so measuring the artwork alone answers a question nobody asked.
 */
export const reachOf = (target: Locator) => target.evaluate(node => {
  const box = node.getBoundingClientRect();
  const after = getComputedStyle(node, '::after');
  const min = (value: string) => (Number.isFinite(parseFloat(value)) ? parseFloat(value) : 0);
  return {
    width: Math.max(box.width, after.content === 'none' ? 0 : min(after.minWidth)),
    height: Math.max(box.height, after.content === 'none' ? 0 : min(after.minHeight)),
  };
});

/** `target` is reachable on this platform, and on the other one too. */
export async function expectReachable(page: Page, target: Locator, what: string) {
  for (const platform of ['desktop', 'touch'] as const) {
    await asPlatform(page, platform);
    const floor = await hitFloor(page);
    const reach = await reachOf(target);
    expect(reach.height, `${what} is ${reach.height}px tall against a ${floor}px ${platform} floor`)
      .toBeGreaterThanOrEqual(floor);
    expect(reach.width, `${what} is ${reach.width}px wide against a ${floor}px ${platform} floor`)
      .toBeGreaterThanOrEqual(floor);
  }
  await asPlatform(page, null);
}
