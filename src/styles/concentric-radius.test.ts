import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

function readCss(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

/**
 * Concentric-radius rule: an inset element rounds off the nearest glass surface's
 * live `--lg-r`, never dropping below `--lg-radius-sm`. Asserting the source
 * expression is enough here — jsdom does not apply stylesheet rules, and pixel
 * fidelity is verified visually in Storybook.
 */
function expectConcentricRadius(css: string, selector: string, inset: string): void {
  const block = new RegExp(
    `${selector.replace(/[.[\]]/g, '\\$&')}\\s*\\{[^}]*` +
      `border-radius:\\s*max\\(\\s*var\\(--lg-radius-sm\\)\\s*,\\s*` +
      `calc\\(\\s*var\\(--lg-r,\\s*var\\(--lg-radius-md\\)\\)\\s*-\\s*${inset.replace(/[()]/g, '\\$&')}\\s*\\)\\s*\\)`,
  );
  expect(css).toMatch(block);
}

describe('concentric radius', () => {
  it('rounds Select options off the panel radius, inset by one space unit', () => {
    expectConcentricRadius(
      readCss('../components/Select/select.css'),
      '.lg-select__option',
      'var(--lg-space-1)',
    );
  });

  it('rounds the Modal close button off the surrounding radius', () => {
    expectConcentricRadius(
      readCss('../components/Modal/modal.css'),
      '.lg-modal__close',
      'var(--lg-space-2)',
    );
  });

  it('rounds the Toast icon container off the toast radius', () => {
    expectConcentricRadius(
      readCss('../toast/toast.css'),
      '.lg-toast__icon',
      'var(--lg-space-2)',
    );
  });
});
