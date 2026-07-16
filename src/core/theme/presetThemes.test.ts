import { describe, expect, it } from 'vitest';
import { presetThemes } from './presetThemes';

describe('presetThemes', () => {
  it('exposes default, midnight and warm presets', () => {
    expect(Object.keys(presetThemes).sort()).toEqual([
      'default',
      'midnight',
      'warm',
    ]);
  });

  it('default preset applies no overrides', () => {
    expect(presetThemes.default).toEqual({});
  });

  it('midnight preset retints the accent', () => {
    expect(presetThemes.midnight).toHaveProperty('--lg-accent');
  });

  it('warm preset retints the accent and softens the radius', () => {
    expect(presetThemes.warm).toHaveProperty('--lg-accent');
    expect(presetThemes.warm).toHaveProperty('--lg-radius-md');
  });
});
