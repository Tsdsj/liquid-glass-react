export type GlassMaterial = 'regular' | 'clear';
export type GlassRenderer = 'auto' | 'css' | 'svg';
export type GlassTheme = 'system' | 'light' | 'dark';
export type GlassDensity = 'compact' | 'comfortable';
export type GlassTransparency = 'system' | 'reduced' | 'opaque';
export type GlassMotion = 'system' | 'reduced' | 'none';
export type GlassContrast = 'system' | 'more';
/**
 * Which set of metrics the interface is drawn with.
 *
 * `auto` — the default — reads `(pointer: fine) and (min-width: 768px)`: a cursor, on a screen
 * wide enough that a desktop layout is the honest one. A tablet with a trackpad reports a fine
 * pointer at phone width, and 22px controls there would be the wrong answer to the right
 * question. The resolved value is on the policy as `resolvedPlatform` and, when it was
 * overridden explicitly, on `<html>` as `data-lg-platform`.
 */
export type GlassPlatform = 'auto' | 'desktop' | 'touch';
export type BackdropTone = 'light' | 'dark' | 'mixed';
export type GlassQuality = 'balanced' | 'high';
/**
 * Small glass (buttons, tab bar, toolbar) flips light/dark with what is behind it.
 * Large glass (sidebar, menu, sheet, popover, alert) is thicker, more opaque, has a
 * deeper shadow and stronger lensing, and deliberately does NOT flip — flipping a
 * large surface is distracting.
 */
export type GlassSize = 'small' | 'large';
/** Standard materials belong to the content layer, never to floating controls. */
export type StandardMaterial = 'ultraThin' | 'thin' | 'regular' | 'thick';
/** Web equivalent of Dynamic Type content sizes. `ax1`–`ax5` are the accessibility sizes. */
export type TextSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl' | 'ax1' | 'ax2' | 'ax3' | 'ax4' | 'ax5';
export type TextStyle =
  | 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'body'
  | 'callout' | 'subhead' | 'footnote' | 'caption1' | 'caption2';

export interface GlassPolicy {
  material?: GlassMaterial;
  renderer?: GlassRenderer;
  quality?: GlassQuality;
  theme?: GlassTheme;
  density?: GlassDensity;
  transparency?: GlassTransparency;
  motion?: GlassMotion;
  contrast?: GlassContrast;
  platform?: GlassPlatform;
}

/** Optical parameters per material and per glass size. Sizes are CSS pixels. */
export const materialTokens = {
  regular: {
    small: { blur: 14, saturation: 1.15, refraction: 18, edge: 16 },
    large: { blur: 40, saturation: 1.3, refraction: 26, edge: 22 },
  },
  clear: {
    small: { blur: 1.5, saturation: 1.08, refraction: 32, edge: 18 },
    large: { blur: 6, saturation: 1.12, refraction: 40, edge: 24 },
  },
} as const;

/**
 * Touch metrics. The heights here are the iOS ones and are what the stylesheet's
 * `--lg-height-*` tokens hold by default; on desktop CSS substitutes the macOS table, so
 * `controlHeight` is the number to reason about in TypeScript rather than the number that will
 * necessarily be drawn. `radius` is not switched by platform: it feeds the refraction geometry,
 * and changing the lens's shape by pointer kind is a different decision from changing its size.
 */
export const densityTokens = {
  compact: { controlHeight: 36, radius: 12, gap: 6 },
  comfortable: { controlHeight: 44, radius: 18, gap: 8 },
} as const;

/** The same two, as macOS draws them: regular 22pt, small 19. See `tokens.css`. */
export const desktopDensityTokens = {
  compact: { controlHeight: 19, radius: 12, gap: 6 },
  comfortable: { controlHeight: 22, radius: 18, gap: 8 },
} as const;

export const motionTokens = { press: 90, release: 220, layout: 280, spring: 520, overlay: 360 } as const;

/** 4pt grid plus the HIG layout metrics that components read from TypeScript. */
export const spacingTokens = {
  space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space8: 32, space10: 40,
  margin: 16, marginRegular: 20, hitMin: 44, readable: 672, sidebarWidth: 260, controlGap: 8,
} as const;

/** Fixed radii. Capsule is height/2; concentric radii come from `concentricRadius` in core. */
export const radiusTokens = {
  xs: 6, s: 10, m: 14, l: 20, xl: 26, xxl: 34, sheet: 38, window: 24,
} as const;

/**
 * iOS text styles at the Large (default) content size. `tracking` is in em, taken
 * from the HIG "1/1000 em" column so it survives Dynamic Type scaling.
 * 11pt (caption2) is the floor for readable text — nothing may go below it.
 */
export const textStyles: Record<TextStyle, { size: number; leading: number; tracking: number; weight: number; emphasizedWeight: number }> = {
  largeTitle: { size: 34, leading: 41, tracking: .012, weight: 400, emphasizedWeight: 700 },
  title1: { size: 28, leading: 34, tracking: .014, weight: 400, emphasizedWeight: 700 },
  title2: { size: 22, leading: 28, tracking: -.012, weight: 400, emphasizedWeight: 700 },
  title3: { size: 20, leading: 25, tracking: -.023, weight: 400, emphasizedWeight: 600 },
  headline: { size: 17, leading: 22, tracking: -.026, weight: 600, emphasizedWeight: 600 },
  body: { size: 17, leading: 22, tracking: -.026, weight: 400, emphasizedWeight: 600 },
  callout: { size: 16, leading: 21, tracking: -.020, weight: 400, emphasizedWeight: 600 },
  subhead: { size: 15, leading: 20, tracking: -.016, weight: 400, emphasizedWeight: 600 },
  footnote: { size: 13, leading: 18, tracking: -.006, weight: 400, emphasizedWeight: 600 },
  caption1: { size: 12, leading: 16, tracking: 0, weight: 400, emphasizedWeight: 600 },
  caption2: { size: 11, leading: 13, tracking: .006, weight: 400, emphasizedWeight: 600 },
};

/** Multiplier applied to the whole type scale per Dynamic Type content size. */
export const textScale: Record<TextSize, number> = {
  xs: .824, s: .882, m: .941, l: 1, xl: 1.118, xxl: 1.235, xxxl: 1.353,
  ax1: 1.647, ax2: 1.941, ax3: 2.353, ax4: 2.765, ax5: 3.118,
};

/** Overlay stacking bands. A new overlay picks the band it belongs to. */
export const zIndexTokens = {
  content: 0, scrollEdge: 10, sidebar: 15, tabBar: 20,
  sheetBackdrop: 30, sheet: 31, menu: 40, alert: 41, toast: 60,
} as const;

export const defaultPolicy: Required<GlassPolicy> = {
  material: 'regular', renderer: 'auto', quality: 'balanced', theme: 'system',
  density: 'comfortable', transparency: 'system', motion: 'system', contrast: 'system',
  platform: 'auto',
};
