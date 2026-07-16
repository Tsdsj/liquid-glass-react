import { createTheme, type LiquidGlassTheme } from './createTheme';

/**
 * Ready-made themes, each a {@link LiquidGlassTheme} you can spread onto a
 * container's `style` (or pass to `LiquidGlassConfig theme=`). They only
 * retune tokens — dark mode still comes from `data-theme="dark"`.
 */
export const presetThemes: Record<'default' | 'midnight' | 'warm', LiquidGlassTheme> = {
  // Baseline — no overrides, useful as an explicit "reset to defaults".
  default: createTheme({}),
  // Cool indigo accent over a deep, bluish glass tint.
  midnight: createTheme({
    accent: '#5e5ce6',
    tint: 'rgb(40 42 66 / 0.35)',
    tintHover: 'rgb(52 54 82 / 0.48)',
    highlight: 'rgb(180 190 255 / 0.45)',
  }),
  // Amber accent, warmer tint, softer corners.
  warm: createTheme({
    accent: '#ff9f0a',
    tint: 'rgb(255 244 230 / 0.3)',
    tintHover: 'rgb(255 238 214 / 0.45)',
    radiusMd: '18px',
    radiusLg: '26px',
  }),
};
