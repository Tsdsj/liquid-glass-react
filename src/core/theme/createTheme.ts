import type { CSSProperties } from 'react';

/**
 * Themeable subset of the `--lg-*` design tokens, keyed in camelCase.
 *
 * Covers the tokens people commonly retint/reshape (color, glass material,
 * radii, motion, type scale). Derived tokens (e.g. `--lg-accent-glass`,
 * computed via `color-mix`) and layout tokens (`--lg-control-h-*`,
 * `--lg-space-*`) are intentionally omitted from the typed helper — any token
 * can still be set directly as a CSS custom property. See the Theming guide's
 * token reference for the full list.
 */
export interface LiquidGlassThemeTokens {
  // Glass material
  blur?: string | number;
  fallbackBlur?: string | number;
  saturation?: string | number;
  refraction?: string | number;
  tint?: string;
  tintHover?: string;
  clearTint?: string;
  clearTintHover?: string;
  highlight?: string;
  shade?: string;
  dropShadow?: string;
  ambient?: string;
  // Geometry
  radiusSm?: string | number;
  radiusMd?: string | number;
  radiusLg?: string | number;
  radiusFull?: string | number;
  // Color
  accent?: string;
  accentContrast?: string;
  danger?: string;
  success?: string;
  warning?: string;
  text?: string;
  textSecondary?: string;
  textDisabled?: string;
  // Typography and motion
  font?: string;
  fontSizeSm?: string | number;
  fontSizeMd?: string | number;
  fontSizeLg?: string | number;
  ease?: string;
  easeBounce?: string;
  duration?: string;
  durationSlow?: string;
}

/**
 * A theme is a bag of `--lg-*` custom properties, ready to spread onto any
 * element's `style`. Applying it scopes the token overrides to that subtree.
 */
export type LiquidGlassTheme = CSSProperties;

function camelToKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Turn a set of camelCase token overrides into `--lg-*` custom properties.
 *
 * ```tsx
 * <div style={createTheme({ accent: '#7c3aed', radiusMd: '18px' })}>…</div>
 * ```
 */
export function createTheme(tokens: LiquidGlassThemeTokens): LiquidGlassTheme {
  const style: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (value === undefined) continue;
    style[`--lg-${camelToKebab(key)}`] = value;
  }
  return style as LiquidGlassTheme;
}
