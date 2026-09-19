import { test, expect } from '@playwright/test';

test('a sheet settles at its detents and goes opaque at full height', async ({ page }) => {
  await page.goto('/#/components/sheet');
  await page.getByRole('button', { name: '打开面板' }).click();
  const sheet = page.getByRole('dialog', { name: '分享这一刻' });
  await expect(sheet).toBeVisible();
  const offset = async () => parseFloat(await sheet.evaluate(node => node.style.getPropertyValue('--lg-sheet-offset')));
  expect(await offset()).toBeCloseTo(50, 1);

  // The grabber is a slider: keyboard users get the same detents as a drag.
  const grabber = page.getByRole('slider', { name: /height/ });
  await grabber.focus();
  await page.keyboard.press('ArrowUp');
  await expect(sheet).toHaveAttribute('data-full', 'true');
  expect(await offset()).toBeLessThan(10);

  await page.keyboard.press('ArrowDown');
  await expect(sheet).not.toHaveAttribute('data-full', 'true');
  // Below the smallest detent the gesture is a dismissal.
  await page.keyboard.press('ArrowDown');
  await expect(sheet).toBeHidden();
});

test('dragging the grabber tracks the pointer and snaps to the nearest detent', async ({ page }) => {
  await page.goto('/#/components/sheet');
  await page.getByRole('button', { name: '打开面板' }).click();
  const sheet = page.getByRole('dialog', { name: '分享这一刻' });
  // The sheet rises into place, so wait for it to settle before measuring the grabber —
  // otherwise the recorded position is somewhere along the entry animation.
  await expect.poll(() => sheet.evaluate(node => getComputedStyle(node).translate)).toBe('0px 50%');
  const grabber = page.locator('.lg-sheet-grabber');
  const box = (await grabber.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y - 260, { steps: 8 });
  await expect(sheet).toHaveAttribute('data-dragging', 'true');
  await page.mouse.up();
  await expect(sheet).not.toHaveAttribute('data-dragging', 'true');
  await expect(sheet).toHaveAttribute('data-full', 'true');
});

/**
 * `placement` existed inside the anchoring code but was never on the props of either overlay,
 * so a caller had no way to say "open upwards" — the panel always took whichever side had room.
 * That is right by default and wrong whenever the trigger sits in a toolbar the panel should
 * clear. Measured rather than asserted from a class: what matters is which side it lands on.
 */
test('a popover opens on the side placement asks for', async ({ page }) => {
  await page.goto('/#/components/popover');
  const demo = page.locator('#popover-above-demo');
  await expect(demo).toBeVisible();

  /**
   * Two things have to be pinned down before the prop is observable at all.
   *
   * The demo is centred so both triggers have room above and below: hard against the bottom
   * edge, a below-placed panel gets clamped back on screen and every placement resolves
   * upwards. And the click is dispatched in the page rather than through Playwright, which
   * scrolls each control just far enough to reach it — that left the two buttons at different
   * heights, where `auto` happened to pick a different side for each and the test passed
   * whether or not `placement` did anything.
   */
  const sideOf = async (label: string) => {
    await demo.evaluate(node => node.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(100);
    const trigger = demo.getByRole('button', { name: label, exact: true });
    await trigger.evaluate(node => (node as HTMLElement).click());
    const panel = page.locator('.lg-popover:popover-open');
    await expect(panel).toBeVisible();
    // Anchoring runs in an effect and then a frame; `top` appearing inline means it has landed.
    await expect(panel).toHaveAttribute('style', /top:\s*\d/);
    const origin = await panel.evaluate(node => node.style.getPropertyValue('--lg-origin-y'));
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    return origin === '100%' ? 'above' : 'below';
  };

  expect(await sideOf('向上')).toBe('above');
  expect(await sideOf('向下')).toBe('below');
});

test('an alert focuses the safe action and Escape runs cancel', async ({ page }) => {
  await page.goto('/#/components/alert');
  const trigger = page.getByRole('button', { name: '删除工作区' });
  await trigger.click();
  const alert = page.getByRole('alertdialog', { name: '删除这个工作区？' });
  await expect(alert).toBeVisible();
  // A destructive option is on offer, so focus starts on Cancel.
  await expect(alert.getByRole('button', { name: '取消' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(alert).toBeHidden();
  await expect(page.locator('#alert-destructive [role="status"]')).toHaveText('已取消');

  await trigger.click();
  await alert.getByRole('button', { name: '删除', exact: true }).click();
  await expect(page.locator('#alert-destructive [role="status"]')).toHaveText('已删除（只是演示）');
});

test('an alert title is bold and left aligned, never centred', async ({ page }) => {
  await page.goto('/#/components/alert');
  await page.getByRole('button', { name: '删除工作区' }).click();
  const title = page.locator('.lg-alert-title');
  const style = await title.evaluate(node => {
    const computed = getComputedStyle(node);
    return { align: computed.textAlign, weight: computed.fontWeight };
  });
  expect(['start', 'left']).toContain(style.align);
  expect(Number(style.weight)).toBeGreaterThanOrEqual(600);
});

test('an action sheet orders destructive choices last and separates cancel', async ({ page }) => {
  await page.goto('/#/components/action-sheet');
  await page.getByRole('button', { name: '更多操作' }).click();
  const items = page.locator('.lg-action-item');
  await expect(items).toHaveCount(3);
  await expect(items.last()).toHaveAttribute('data-destructive', 'true');
  await expect(page.locator('.lg-action-cancel')).toBeVisible();
  await page.getByRole('menuitem', { name: '分享' }).click();
  await expect(page.locator('#sheet-actions [role="status"]')).toHaveText('分享');
});

test('a reversible delete offers undo instead of a confirmation', async ({ page }) => {
  await page.goto('/#/components/toast');
  await page.getByRole('button', { name: '删除最后一项' }).click();
  const toast = page.locator('.lg-toast');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('已删除');
  await expect(page.getByText('剩余：草稿 A、草稿 B')).toBeVisible();
  await toast.getByRole('button', { name: '撤销' }).click();
  await expect(page.getByText('剩余：草稿 A、草稿 B、草稿 C')).toBeVisible();
  await expect(toast).toBeHidden();
});

test('the toast region is polite, not assertive', async ({ page }) => {
  await page.goto('/#/components/toast');
  const region = page.locator('.lg-toast-region');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveAttribute('role', 'status');
});

test('overlays use large glass, which does not flip with the backdrop', async ({ page }) => {
  await page.goto('/#/components/menu');
  await page.getByRole('button', { name: '打开菜单' }).click();
  // Named, not `.lg-menu`: the page's own outline menu is a second one in the document.
  await expect(page.getByRole('menu', { name: '示例菜单' })).toHaveAttribute('data-glass-size', 'large');
});
