import { describe, expect, it } from 'vitest';
import { createTheme } from './createTheme';

describe('createTheme', () => {
  it('maps a single-word token to its --lg- custom property', () => {
    expect(createTheme({ accent: '#7c3aed' })).toEqual({
      '--lg-accent': '#7c3aed',
    });
  });

  it('converts camelCase and suffixed keys to kebab custom properties', () => {
    expect(
      createTheme({
        fallbackBlur: '12px',
        radiusMd: '18px',
        fontSizeSm: '12px',
        durationSlow: '400ms',
        accentContrast: '#000',
        easeBounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }),
    ).toEqual({
      '--lg-fallback-blur': '12px',
      '--lg-radius-md': '18px',
      '--lg-font-size-sm': '12px',
      '--lg-duration-slow': '400ms',
      '--lg-accent-contrast': '#000',
      '--lg-ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    });
  });

  it('returns an empty object for no overrides', () => {
    expect(createTheme({})).toEqual({});
  });

  it('skips undefined values so partial overrides stay clean', () => {
    expect(createTheme({ accent: '#7c3aed', tint: undefined })).toEqual({
      '--lg-accent': '#7c3aed',
    });
  });

  it('preserves numeric token values', () => {
    expect(createTheme({ saturation: 1.5 })).toEqual({
      '--lg-saturation': 1.5,
    });
  });
});
