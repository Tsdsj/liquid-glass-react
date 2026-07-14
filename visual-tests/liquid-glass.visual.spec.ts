import { expect, test, type Page } from '@playwright/test';

const GLOBALS = 'theme:light;wallpaper:photo;locale:zh-CN';
const STABLE_CSS = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    font-family: Arial, sans-serif !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
`;

async function openStory(page: Page, id: string): Promise<void> {
  const params = new URLSearchParams({ id, viewMode: 'story', globals: GLOBALS });
  await page.goto(`/iframe.html?${params.toString()}`, { waitUntil: 'networkidle' });
  await page.locator('#storybook-root').waitFor({ state: 'visible' });
  await page.addStyleTag({ content: STABLE_CSS });
  await page.evaluate(async () => document.fonts.ready);
  await page.waitForTimeout(500);
  expect(await page.locator('#storybook-root > *').count()).toBeGreaterThan(0);
}

test('GlassSurface material matrix', async ({ page }) => {
  await openStory(page, 'visual-materialmatrix--material-matrix');
  await expect(page.getByTestId('matrix-regular-light')).toHaveAttribute(
    'data-refraction',
    'on',
  );
  await expect(page.getByTestId('matrix-fallback-light')).toHaveAttribute(
    'data-refraction',
    'off',
  );
  await expect(page.getByTestId('matrix-reduced-light')).toHaveAttribute(
    'data-transparency',
    'reduced',
  );
  await expect(page.getByTestId('matrix-reduced-dark')).toHaveAttribute(
    'data-transparency',
    'reduced',
  );
  await page.getByTestId('matrix-hover').hover();
  await page.getByTestId('matrix-focus').focus();

  await expect(page).toHaveScreenshot('material-matrix.png');

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-contrast', value: 'more' }],
  });
  await expect.poll(
    () => page.evaluate(() => matchMedia('(prefers-contrast: more)').matches),
  ).toBe(true);
  await expect.poll(
    () =>
      page.getByTestId('matrix-regular-light').evaluate((element) =>
        getComputedStyle(element, '::before').backgroundColor,
      ),
  ).toContain('0.96');

  await page.emulateMedia({ forcedColors: 'active' });
  const forcedColorStyles = await page
    .getByTestId('matrix-regular-light')
    .evaluate((element) => {
      const surface = getComputedStyle(element);
      const rim = getComputedStyle(element, '::after');
      return {
        backdropFilter: surface.backdropFilter,
        boxShadow: rim.boxShadow,
      };
    });
  expect(forcedColorStyles.backdropFilter).toBe('none');
  expect(forcedColorStyles.boxShadow).toBe('none');
});

test('Button glass variants', async ({ page }) => {
  await openStory(page, 'components-button--variants');
  await expect(page.locator('[data-variant="accent"]').first()).toBeVisible();
  await expect(page.locator('[data-variant="danger"]').first()).toBeVisible();

  await expect(page).toHaveScreenshot('button-variants.png');
});

test('Switch pointer interaction', async ({ page }) => {
  await openStory(page, 'components-switch--variants');
  const input = page.getByRole('switch').first();
  await input.hover();
  await page.mouse.down();
  await expect(page.locator('.lg-switch__thumb').first()).toHaveAttribute(
    'data-interacting',
    '',
  );

  await expect(page).toHaveScreenshot('switch-interaction.png');
  await page.mouse.up();
});

test('Slider pointer interaction', async ({ page }) => {
  await openStory(page, 'components-slider--variants');
  const input = page.getByRole('slider').first();
  await input.hover();
  await page.mouse.down();
  await expect(page.locator('.lg-slider__thumb').first()).toHaveAttribute(
    'data-interacting',
    '',
  );

  await expect(page).toHaveScreenshot('slider-interaction.png');
  await page.mouse.up();
});

test('Popover expanded from its trigger', async ({ page }) => {
  await openStory(page, 'components-popover--viewport-edge');
  const trigger = page.getByRole('button', { name: '边缘触发器' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('data-expanded', '');
  await expect(page.getByRole('dialog')).toBeVisible();

  await expect(page).toHaveScreenshot('popover-expanded.png');
});
