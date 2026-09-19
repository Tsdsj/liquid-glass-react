import { test, expect } from '@playwright/test';

/**
 * `align` is written in logical terms — `start` and `end`, not `left` and `right` — because the
 * HIG's right-to-left page says to think in leading and trailing. The anchor maths did not:
 * it read `rect.right` for `end` whatever the direction, so every menu, popover and action
 * sheet in an RTL document aligned to the physical right edge, which is the *leading* side
 * there. This measures the edges rather than trusting the attribute.
 */

/** Flip the document and let the layout settle before anything is measured. */
async function goRtl(page: import('@playwright/test').Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
  await page.waitForTimeout(300);
}

test('a menu aligns to the trailing edge of its trigger in RTL, not the right edge', async ({ page }) => {
  await goRtl(page, '/#/components/menu');

  const trigger = page.getByRole('button', { name: '打开菜单' }).first();
  await trigger.scrollIntoViewIfNeeded();
  const triggerBox = (await trigger.boundingBox())!;
  await trigger.click();

  const menu = page.getByRole('menu', { name: '示例菜单' });
  await expect(menu).toBeVisible();
  await page.waitForTimeout(250);
  const menuBox = (await menu.boundingBox())!;

  /**
   * `align="end"` is the default. In RTL the trailing edge is the left one, so the menu's left
   * edge must sit at the trigger's left edge. Before the fix it was the two *right* edges that
   * lined up, which put a 300px menu out past the trigger on the wrong side.
   */
  expect(Math.abs(menuBox.x - triggerBox.x),
    `menu left ${menuBox.x} vs trigger left ${triggerBox.x} — aligned to the physical right instead`)
    .toBeLessThan(2);
});

test('the origin follows the trigger in RTL, so the menu still grows out of it', async ({ page }) => {
  await goRtl(page, '/#/components/menu');
  const trigger = page.getByRole('button', { name: '打开菜单' }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const menu = page.getByRole('menu', { name: '示例菜单' });
  await expect(menu).toBeVisible();
  await page.waitForTimeout(250);

  // The transform origin is a percentage across the panel; the trigger centre must land inside it.
  const { origin, menuBox, triggerBox } = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>('.lg-menu[popover]:popover-open')!;
    const button = document.querySelector<HTMLElement>('[aria-controls="' + panel.id + '"]')!;
    return {
      origin: parseFloat(panel.style.getPropertyValue('--lg-origin-x')),
      menuBox: panel.getBoundingClientRect().toJSON(),
      triggerBox: button.getBoundingClientRect().toJSON(),
    };
  });
  const projected = (triggerBox.left + triggerBox.width / 2 - menuBox.left) / menuBox.width * 100;
  expect(origin).toBeGreaterThanOrEqual(0);
  expect(origin).toBeLessThanOrEqual(100);
  expect(Math.abs(origin - projected), 'the origin is not the trigger centre projected onto the panel').toBeLessThan(2);
});

test('the same alignment holds in LTR, so the fix is a swap and not a flip', async ({ page }) => {
  await page.goto('/#/components/menu');
  const trigger = page.getByRole('button', { name: '打开菜单' }).first();
  await trigger.scrollIntoViewIfNeeded();
  const triggerBox = (await trigger.boundingBox())!;
  await trigger.click();
  const menu = page.getByRole('menu', { name: '示例菜单' });
  await expect(menu).toBeVisible();
  await page.waitForTimeout(250);
  const menuBox = (await menu.boundingBox())!;
  // LTR trailing edge is the right one.
  expect(Math.abs((menuBox.x + menuBox.width) - (triggerBox.x + triggerBox.width))).toBeLessThan(2);
});
