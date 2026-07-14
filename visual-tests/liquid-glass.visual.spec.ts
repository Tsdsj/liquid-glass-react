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

interface FloatingFrame {
  opacity: number;
  pending: boolean;
  refraction: string | null;
}

interface FloatingFrameOptions {
  triggerSelector?: string;
  triggerText?: string;
  hostSelector: string;
  panelSelector: string;
}

async function captureFloatingFrames(
  page: Page,
  options: FloatingFrameOptions,
): Promise<FloatingFrame[]> {
  return page.evaluate(async (input) => {
    const trigger = input.triggerSelector
      ? document.querySelector(input.triggerSelector)
      : [...document.querySelectorAll('button')].find(
          (button) => button.textContent?.trim() === input.triggerText,
        );
    if (!(trigger instanceof HTMLElement)) {
      throw new Error('Floating trigger not found.');
    }

    const frames: FloatingFrame[] = [];
    const startedAt = performance.now();
    trigger.click();

    await new Promise<void>((resolve) => {
      const record = () => {
        const host = document.querySelector(input.hostSelector);
        const panel = document.querySelector(input.panelSelector);
        if (host instanceof HTMLElement && panel instanceof HTMLElement) {
          frames.push({
            opacity: Number(getComputedStyle(host).opacity),
            pending: panel.hasAttribute('data-refraction-pending'),
            refraction: panel.dataset.refraction ?? null,
          });
        }

        if (performance.now() - startedAt < 500) {
          requestAnimationFrame(record);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(record);
    });

    return frames;
  }, options);
}

function expectNoVisibleFallback(frames: FloatingFrame[], label: string): void {
  const visibleFrames = frames.filter(({ opacity }) => opacity > 0.01);
  expect(visibleFrames.length, `${label} never became visible`).toBeGreaterThan(0);
  expect(
    visibleFrames.every(({ pending, refraction }) => !pending && refraction === 'on'),
    `${label} exposed fallback material while visible`,
  ).toBe(true);
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

test('Default-open Popover waits for refraction before becoming visible', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const frames: FloatingFrame[] = [];
    const startedAt = performance.now();
    Object.assign(window, { __liquidGlassFrames: frames });

    const record = () => {
      const host = document.querySelector('.lg-popover');
      const panel = document.querySelector('.lg-popover__panel');
      if (host instanceof HTMLElement && panel instanceof HTMLElement) {
        frames.push({
          opacity: Number(getComputedStyle(host).opacity),
          pending: panel.hasAttribute('data-refraction-pending'),
          refraction: panel.dataset.refraction ?? null,
        });
      }

      if (performance.now() - startedAt < 1000) {
        requestAnimationFrame(record);
      }
    };
    requestAnimationFrame(record);
  });

  await openStory(page, 'components-popover--states');
  const frames = await page.evaluate(
    () =>
      (
        window as Window & {
          __liquidGlassFrames?: FloatingFrame[];
        }
      ).__liquidGlassFrames ?? [],
  );
  expectNoVisibleFallback(frames, 'Default-open Popover');
});

test('Floating panels wait for refraction before becoming visible', async ({ page }) => {
  const cases = [
    {
      story: 'components-select--form',
      options: {
        triggerSelector: '.lg-select__trigger',
        hostSelector: '.lg-select__panel',
        panelSelector: '.lg-select__panel',
      },
    },
    {
      story: 'components-popover--viewport-edge',
      options: {
        triggerText: '边缘触发器',
        hostSelector: '.lg-popover',
        panelSelector: '.lg-popover__panel',
      },
    },
    {
      story: 'components-modal--playground',
      options: {
        triggerText: '打开弹窗',
        hostSelector: '.lg-modal__panel',
        panelSelector: '.lg-modal__panel',
      },
    },
    {
      story: 'feedback-toaster--playground',
      options: {
        triggerText: '显示通知',
        hostSelector: '.lg-toast',
        panelSelector: '.lg-toast',
      },
    },
  ] satisfies Array<{ story: string; options: FloatingFrameOptions }>;

  for (const item of cases) {
    await openStory(page, item.story);
    expectNoVisibleFallback(
      await captureFloatingFrames(page, item.options),
      item.story,
    );
  }
});
