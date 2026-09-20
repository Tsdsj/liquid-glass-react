import { expectReachable } from './hit-floor.js';
import { test, expect } from '@playwright/test';

/* =========================================================================================
 * Picker. The component is the *choice*; its shape is a consequence of how much room there is.
 * ======================================================================================= */

test('the same picker is a segmented control when there is room and a menu when there is not', async ({ page }) => {
  const demo = page.locator('#picker-automatic-demo');

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/picker');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.getByRole('radiogroup', { name: '时间范围' })).toBeVisible();

  // Under the size-class boundary the same three options become a pop-up button.
  await page.setViewportSize({ width: 600, height: 900 });
  await page.waitForTimeout(200);
  await expect(demo.getByRole('radiogroup', { name: '时间范围' })).toHaveCount(0);
  await expect(demo.getByRole('button', { name: '时间范围' })).toBeVisible();
});

test('more options than a segmented control can hold is a menu at any width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/components/picker');
  const demo = page.locator('#picker-many-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.getByRole('radiogroup')).toHaveCount(0);
  // A pop-up button says what is currently chosen — that is what makes it one.
  await expect(demo.getByRole('button', { name: '城市' })).toContainText('上海');
});

/**
 * The visible words and the control's name are the same string, and only one of them is
 * announced. Reading both would say "时间范围" twice; hiding the visible one from the
 * accessibility tree while the control carries it as its name keeps Voice Control working,
 * because what someone says still matches the control's name exactly.
 */
test('the label is said once, and is still what Voice Control matches', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/picker');
  const demo = page.locator('#picker-automatic-demo');
  await demo.scrollIntoViewIfNeeded();
  const label = demo.locator('.lg-picker-label');
  await expect(label).toHaveText('时间范围');
  await expect(label).toHaveAttribute('aria-hidden', 'true');
  const name = await demo.getByRole('radiogroup').getAttribute('aria-label');
  expect(name, 'the spoken name has to be the visible words').toBe(await label.innerText());
});

test('both forms report the same choice', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/components/picker');
  const demo = page.locator('#picker-automatic-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('radio', { name: '月', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('当前：month');

  await page.setViewportSize({ width: 600, height: 900 });
  await page.waitForTimeout(200);
  await demo.getByRole('button', { name: '时间范围' }).click();
  await page.getByRole('menuitemradio', { name: '日', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('当前：day');
});

/* =========================================================================================
 * ColorWell. A control whose entire state is a colour needs something that is not a colour.
 * ======================================================================================= */

test('it is a real colour input, not a button that opens a re-implementation', async ({ page }) => {
  await page.goto('/#/components/color-well');
  const demo = page.locator('#color-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  const input = demo.locator('.lg-color-well-input');
  expect(await input.evaluate(node => (node as HTMLInputElement).type)).toBe('color');
  // Present and focusable, rather than hidden and clicked from script.
  await input.focus();
  await expect(input).toBeFocused();
});

test('the value is readable as text, not only as a colour', async ({ page }) => {
  await page.goto('/#/components/color-well');
  const demo = page.locator('#color-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('.lg-color-well-value')).toHaveText('#0a84ff');
  // And it is attached to the control, so a screen reader hears it with the field.
  const described = await demo.locator('.lg-color-well-input').getAttribute('aria-describedby');
  expect(described).toBeTruthy();
  await expect(page.locator(`#${described}`)).toHaveText('#0a84ff');
});

test('every quick colour has a name, and the chosen one is marked by more than its colour', async ({ page }) => {
  await page.goto('/#/components/color-well');
  const demo = page.locator('#color-swatches-demo');
  await demo.scrollIntoViewIfNeeded();
  const quick = demo.locator('.lg-color-well-quick');
  expect(await quick.count()).toBeGreaterThan(2);
  const unnamed = await quick.evaluateAll(nodes => nodes.filter(node => !node.getAttribute('aria-label')).length);
  expect(unnamed, 'a row of coloured squares with no names').toBe(0);

  await expect(demo.getByRole('button', { name: '绿' })).toHaveAttribute('aria-pressed', 'true');
  await demo.getByRole('button', { name: '蓝' }).click();
  await expect(demo.getByRole('button', { name: '蓝' })).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.getByRole('button', { name: '绿' })).toHaveAttribute('aria-pressed', 'false');
});

test('the well stays reachable whatever the swatch is drawn at', async ({ page }) => {
  await page.goto('/#/components/color-well');
  const demo = page.locator('#color-basic-demo');
  await demo.scrollIntoViewIfNeeded();
  await expectReachable(page, demo.locator('.lg-color-well-box'), 'the colour well');
});

/* =========================================================================================
 * Banner. It reports; it does not interrupt.
 * ======================================================================================= */

test('a tone carries a glyph, so it is never colour alone', async ({ page }) => {
  await page.goto('/#/components/banner');
  const demo = page.locator('#banner-tones-demo');
  await demo.scrollIntoViewIfNeeded();
  const banner = demo.locator('.lg-banner');
  await expect(banner).toHaveAttribute('data-tone', 'error');
  await expect(banner.locator('.lg-banner-icon svg')).toBeVisible();
});

test('it announces politely rather than interrupting', async ({ page }) => {
  await page.goto('/#/components/banner');
  const demo = page.locator('#banner-tones-demo');
  await demo.scrollIntoViewIfNeeded();
  const banner = demo.locator('.lg-banner');
  await expect(banner).toHaveAttribute('role', 'status');
  await expect(banner).toHaveAttribute('aria-live', 'polite');
});

test('the close button is a real named button and is reachable', async ({ page }) => {
  await page.goto('/#/components/banner');
  const demo = page.locator('#banner-tones-demo');
  await demo.scrollIntoViewIfNeeded();
  const close = demo.getByRole('button', { name: '关闭这条通知' });
  await expect(close).toBeVisible();
  // The button grows its region with a pseudo-element rather than by drawing bigger.
  await expectReachable(page, close, "the banner's close button");
  await close.click();
  await expect(demo.locator('.lg-banner')).toHaveCount(0);
});

/**
 * Flicking it upwards dismisses it, and that is an addition to the button rather than a
 * replacement for it — the test above is the one that matters for anyone on a keyboard.
 */
test('a flick upwards dismisses it; a short drag does not', async ({ page }) => {
  await page.goto('/#/components/banner');
  const demo = page.locator('#banner-tones-demo');
  await demo.scrollIntoViewIfNeeded();
  const banner = demo.locator('.lg-banner');
  const box = (await banner.boundingBox())!;
  const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

  const drag = async (dy: number) => {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    for (let step = 1; step <= 6; step++) await page.mouse.move(from.x, from.y + (dy * step) / 6);
    await page.mouse.up();
    await page.waitForTimeout(120);
  };

  await drag(-20);
  await expect(banner, 'a 20px twitch closed it').toBeVisible();
  await drag(-90);
  await expect(demo.locator('.lg-banner')).toHaveCount(0);
});

test('a banner with no way to dismiss it has no close button either', async ({ page }) => {
  await page.goto('/#/components/banner');
  const demo = page.locator('#banner-placement-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('.lg-banner')).toBeVisible();
  await expect(demo.locator('.lg-banner-dismiss')).toHaveCount(0);
});
