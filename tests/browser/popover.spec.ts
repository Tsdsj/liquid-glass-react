import { test, expect } from '@playwright/test';

/**
 * Two things the popovers page said about itself and did not do.
 *
 * The HIG's popovers page asks for an arrow that points as directly as possible at the element
 * that opened the panel — that is what makes a popover a popover rather than a floating card.
 * There was none: no arrow anywhere in the stylesheet.
 *
 * The same page says a popover is an iPad and Mac idiom, and that on iPhone the content should
 * be presented in a sheet instead. The component's own comment said so too, and then rendered
 * an anchored 300px panel at every width.
 */

const PAGE = '/#/components/popover';

async function openPopover(page: import('@playwright/test').Page, name = '打开面板') {
  await page.goto(PAGE);
  await page.getByRole('button', { name }).first().click();
  const panel = page.locator('.lg-popover:popover-open');
  await expect(panel).toBeVisible();
  await page.waitForTimeout(300);
  return panel;
}

test('the panel points at the control that opened it', async ({ page }) => {
  const panel = await openPopover(page);

  const arrow = await panel.evaluate(node => {
    const style = getComputedStyle(node, '::before');
    return { content: style.content, width: parseFloat(style.width), height: parseFloat(style.height) };
  });
  expect(arrow.content, 'no arrow is drawn at all').not.toBe('none');
  expect(arrow.width).toBeGreaterThan(6);
  expect(arrow.height).toBeGreaterThan(4);
});

test('the arrow sits on the edge facing the trigger, and lines up with it', async ({ page }) => {
  await openPopover(page);

  const { placement, panelBox, triggerBox, arrowCentre } = await page.evaluate(() => {
    const node = document.querySelector<HTMLElement>('.lg-popover:popover-open')!;
    const trigger = document.querySelector<HTMLElement>(`[aria-controls="${node.id}"]`)!;
    const box = node.getBoundingClientRect();
    const originX = parseFloat(getComputedStyle(node).getPropertyValue('--lg-origin-x'));
    return {
      placement: node.dataset.placement,
      panelBox: box.toJSON(),
      triggerBox: trigger.getBoundingClientRect().toJSON(),
      arrowCentre: box.left + (originX / 100) * box.width,
    };
  });

  // The panel says which side it opened on, and it has to be the truth.
  expect(placement).toBe(panelBox.top >= triggerBox.bottom ? 'below' : 'above');
  // And the arrow is under the trigger, not off at one corner.
  expect(arrowCentre).toBeGreaterThanOrEqual(triggerBox.left - 1);
  expect(arrowCentre).toBeLessThanOrEqual(triggerBox.right + 1);
});

test('a popover that opens upwards puts its arrow on the bottom edge', async ({ page }) => {
  await page.goto(PAGE);
  await page.locator('#popover-above-demo').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: '向上' }).click();
  const panel = page.locator('.lg-popover:popover-open');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-placement', 'above');
});

/**
 * Compact is the phone case. The panel becomes a bottom-anchored sheet spanning the width,
 * and the arrow goes away with it — an arrow pointing at a control halfway up the screen from
 * a panel pinned to the bottom edge would be pointing at nothing.
 */
test('on a compact width the popover becomes a bottom sheet', async ({ page }) => {
  await page.setViewportSize({ width: 420, height: 860 });
  const panel = await openPopover(page);

  await expect(panel).toHaveAttribute('data-anchor', 'bottom');

  const { box, viewport, arrow } = await page.evaluate(() => {
    const node = document.querySelector<HTMLElement>('.lg-popover:popover-open')!;
    return {
      box: node.getBoundingClientRect().toJSON(),
      viewport: { width: innerWidth, height: innerHeight },
      arrow: getComputedStyle(node, '::before').content,
    };
  });
  expect(box.width, 'still a narrow anchored panel').toBeGreaterThan(viewport.width - 48);
  expect(box.bottom, 'not anchored to the bottom edge').toBeGreaterThan(viewport.height - 60);
  expect(arrow, 'a bottom sheet still draws an arrow pointing at nothing').toBe('none');
});

test('at a regular width it stays anchored to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 860 });
  const panel = await openPopover(page);
  expect(await panel.getAttribute('data-anchor')).not.toBe('bottom');
  const width = await panel.evaluate(node => node.getBoundingClientRect().width);
  expect(width).toBeLessThan(400);
});

test('Escape still closes it and gives focus back, at either width', async ({ page }) => {
  await page.setViewportSize({ width: 420, height: 860 });
  const panel = await openPopover(page);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  expect(focused).toBe('打开面板');
});

/**
 * The four system preferences, on the parts of this that are new. Each one is a case where the
 * arrow could have become the one thing on the panel that ignored the setting.
 */
test('the arrow follows the material when transparency is reduced', async ({ page }) => {
  await page.goto(PAGE);
  await page.getByRole('button', { name: '打开显示偏好' }).click();
  await page.getByRole('switch', { name: '减少透明度' }).check();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: '打开面板' }).first().click();
  const panel = page.locator('.lg-popover:popover-open');
  await expect(panel).toBeVisible();
  await page.waitForTimeout(250);

  const { arrow, body } = await panel.evaluate(node => ({
    arrow: getComputedStyle(node, '::before').backgroundColor,
    body: getComputedStyle(node.querySelector('.lg-tint')!).backgroundColor,
  }));
  // Opaque, like the panel it hangs off — not a translucent tab left over from the glass.
  expect(arrow).toBe(body);
});

test('forced colours drop the arrow rather than paint a stray triangle', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto(PAGE);
  await page.getByRole('button', { name: '打开面板' }).first().click();
  const panel = page.locator('.lg-popover:popover-open');
  await expect(panel).toBeVisible();
  const arrow = await panel.evaluate(node => getComputedStyle(node, '::before').content);
  expect(arrow).toBe('none');
});

test('reduced motion keeps the panel usable without the entry animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PAGE);
  await page.getByRole('button', { name: '打开面板' }).first().click();
  const panel = page.locator('.lg-popover:popover-open');
  await expect(panel).toBeVisible();
  const box = (await panel.boundingBox())!;
  expect(box.height).toBeGreaterThan(80);
  await expect(panel).toHaveCSS('opacity', '1');
});
