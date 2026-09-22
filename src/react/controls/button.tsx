'use client';
import { useEffect, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { useSharedSurface } from '../system/surface.js';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { cx } from '../system/utils.js';

/**
 * Style — not size — is what marks the preferred option, and a view should carry at most
 * one prominent button. Everything else stays regular, or the emphasis means nothing.
 *
 * `glass` / `glassProminent` are the floating control-layer styles. `plain`, `gray` and
 * `tinted` are flat and belong wherever a button sits *in* content rather than above it.
 */
export type GlassButtonVariant =
  | 'glass' | 'glassProminent' | 'plain' | 'gray' | 'tinted' | 'destructive' | 'destructiveProminent';
/** Control heights. `small` keeps a 44pt hit region on touch via padding, not a smaller target. */
export type ControlSize = 'small' | 'regular' | 'large' | 'extraLarge';

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, RefAttributes<HTMLButtonElement>, GlassSurfaceOptions {
  variant?: GlassButtonVariant;
  /** Visual height of the control. Distinct from `size`, which selects the glass thickness. */
  controlSize?: ControlSize;
  loading?: boolean;
  /** Keep this button's own glass even inside a shared surface. Use sparingly — it is glass on glass. */
  independent?: boolean;
  /**
   * Leading glyph. A slot rather than a child, so the gap between the icon and the words is
   * the same on every button instead of whatever each caller typed between them.
   */
  icon?: ReactNode;
  /** Trailing glyph — a chevron, a disclosure. */
  trailingIcon?: ReactNode;
  /**
   * This button's accent, overriding `--lg-accent` for it alone. One screen can carry
   * differently-toned actions — a green Confirm beside a blue Continue.
   *
   * Any CSS colour. It is not enough on its own: a tint needs a label colour that reads on
   * it, which cannot be derived, so `tintContrast` is the other half and development mode
   * measures the pair and complains if it falls under 4.5:1.
   */
  tint?: string;
  /** The label colour on `tint`. White by default, which is right for most saturated tints. */
  tintContrast?: string;
}

type Rgba = [number, number, number, number];

/**
 * A resolved colour from a computed style: `rgb()`, `rgba()`, or the `color(srgb r g b / a)`
 * form Chrome hands back for anything that went through `color-mix()` — which is every
 * accent-derived value in this stylesheet. Its channels run 0–1, not 0–255, and reading them
 * as bytes turns any accent into near-black, which measures beautifully against a light page.
 */
function parseColour(value: string): Rgba | null {
  const parts = value.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return null;
  const scale = value.startsWith('color(') ? 255 : 1;
  return [Number(parts[0]) * scale, Number(parts[1]) * scale, Number(parts[2]) * scale,
    parts.length > 3 ? Number(parts[3]) : 1];
}

/** `over` composited onto `under`, both straight sRGB. */
const composite = (over: Rgba, under: Rgba): Rgba =>
  [0, 1, 2].map(i => over[i] * over[3] + under[i] * (1 - over[3])).concat(1) as Rgba;

/** Relative luminance, per WCAG. */
function luminance([r, g, b]: Rgba): number {
  const [lr, lg, lb] = [r, g, b].map(channel => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/**
 * What is painted behind this button's label, flattened.
 *
 * The layers, front to back: the tint layer inside the button's own decoration — which is where
 * a glass button's accent lives, rather than in its `background-color` — then the button, then
 * every ancestor until something opaque. A translucent wash over a white page and the same wash
 * over a dark one are different colours, and the whole question is what the reader sees.
 */
function paintedBehind(node: HTMLElement): Rgba {
  const layers: Rgba[] = [];
  const tint = node.querySelector<HTMLElement>(':scope > .lg-decoration .lg-tint');
  if (tint) {
    const style = getComputedStyle(tint);
    const colour = parseColour(style.backgroundColor);
    // `opacity` on the layer multiplies the alpha of the fill it carries.
    if (colour) layers.push([colour[0], colour[1], colour[2], colour[3] * Number(style.opacity || 1)]);
  }
  for (let element: HTMLElement | null = node; element; element = element.parentElement) {
    const colour = parseColour(getComputedStyle(element).backgroundColor);
    if (colour && colour[3] > 0) {
      layers.push(colour);
      if (colour[3] === 1) break;
    }
  }
  // A page that never declares an opaque background is white, the same as the browser paints it.
  return layers.reduceRight<Rgba>((under, over) => composite(over, under), [255, 255, 255, 1]);
}

const GLASSY = new Set<GlassButtonVariant>(['glass', 'glassProminent']);

export function GlassButton(
  { material, backdropTone, density, renderer, radius = 'pill', refraction, size, chroma,
    className, style, children, variant = 'glass', controlSize = 'regular', loading = false, disabled,
    independent = false, icon, trailingIcon, tint, tintContrast, type = 'button', ref, ...props }: GlassButtonProps,
) {
  const shared = useSharedSurface();
  // Flat variants never grow their own glass, and inside a shared surface neither does anything
  // else: the group is the glass, the children are items on it.
  const flat = !GLASSY.has(variant);
  const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref, (shared && !independent) || flat, true);
  /**
   * Emphasis is comparative: a second prominent button on the same surface means neither is
   * the preferred option any more, and the reader has to work out what to do from the labels.
   * Counted from the DOM rather than from a context, because the rule is about what ends up
   * next to what — two siblings from different parts of the tree still land on one bar.
   */
  useEffect(() => {
    if (!inDevelopment() || variant !== 'glassProminent') return;
    const node = glass.root.current; if (!node) return;
    const surface = node.parentElement?.closest<HTMLElement>('.lg-root'); if (!surface) return;
    // Keyed on the surface, not on the button: the problem is the pair, and both halves of it
    // run this effect. One message names the situation; two describe it twice.
    if (surface.querySelectorAll('.lg-button[data-variant="glassProminent"]').length > 1) {
      warnOnce(surface, 'two-prominent', 'two glassProminent buttons share one surface. A view has at most one preferred action; the rest stay regular, or the emphasis stops meaning anything.');
    }
  }, [glass.root, variant, children]);

  /**
   * A tint the caller chose, checked rather than trusted. The library cannot pick a readable
   * label colour — that is why there is no global `accent` prop — but it can measure the pair
   * the caller did pick and say so when the result is unreadable.
   *
   * Measured off the rendered button, not off the two props. The first version of this compared
   * `tint` with `tintContrast ?? '#fff'`, which is the pair a *prominent* button paints: white
   * on a solid accent. On `tinted`, `plain` and `destructive` the label is the tint itself over
   * a wash of it, so the check was measuring two colours that were nowhere on the screen — and
   * cheerfully passing a button that rendered at 2.87:1. A guard that measures the wrong pair is
   * worse than no guard: every caller downstream believes they have been looked at.
   */
  useEffect(() => {
    if (!inDevelopment() || !tint) return;
    const node = glass.root.current; if (!node) return;
    const ink = parseColour(getComputedStyle(node).color);
    if (!ink) return;
    const behind = paintedBehind(node);
    const pair = [luminance(composite(ink, behind)), luminance(behind)];
    const ratio = (Math.max(...pair) + 0.05) / (Math.min(...pair) + 0.05);
    if (ratio < 4.5) {
      warnOnce(node, 'tint-contrast',
        `tint ${tint} renders as rgb(${ink.slice(0, 3).map(Math.round).join(' ')}) on rgb(${behind.slice(0, 3).map(Math.round).join(' ')}) — ${ratio.toFixed(2)}:1, under the 4.5:1 floor. Pass tintContrast, or darken the tint.`);
    }
  }, [glass.root, tint, tintContrast, variant]);

  /**
   * A tint nothing paints is worth a word, because it fails by looking untouched.
   *
   * `tint` publishes `--lg-accent` and `--lg-accent-fill` on the button whatever the variant,
   * but only the four variants that draw with the accent read them back. Passed to the default
   * `glass`, or to either destructive variant — which are red by definition — it renders a
   * button identical to one with no `tint` at all, and the caller's most likely reading of
   * that is that their colour was wrong.
   */
  useEffect(() => {
    if (!inDevelopment() || !tint) return;
    const node = glass.root.current; if (!node) return;
    if (['primary', 'glassProminent', 'plain', 'tinted'].includes(variant)) return;
    warnOnce(node, 'tint-ignored',
      `tint is set on variant="${variant}", which does not paint with the accent, so it has no effect. Use variant="glassProminent" (or "primary" / "tinted" / "plain") to tint a button; the destructive variants are red by definition.`);
  }, [glass.root, tint, variant]);

  /**
   * `--lg-accent-fill` too, and set to the tint itself rather than derived from it.
   *
   * The default accent is deepened before anything paints white on it, because the brand blue
   * and a surface under a label are two different jobs (see `--lg-accent-fill` in tokens.css).
   * A caller who passes `tint` has already done that job: they named the colour *and* the
   * colour of the label on it, and the measurement above checks the pair they actually chose.
   * Deepening it again would paint a colour nobody asked for and quietly break a dark label.
   */
  const tinted = tint
    ? { '--lg-accent': tint, '--lg-accent-fill': tint, '--lg-accent-contrast': tintContrast ?? '#fff' } as CSSProperties
    : undefined;

  return <button {...props} ref={glass.ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    {...glass.attributes} data-variant={variant} data-control-size={controlSize}
    className={cx('lg-root lg-button', className)} style={{ ...glass.style, ...tinted, ...style }}>
    {glass.decoration}<span className="lg-content">
      {loading && <span className="lg-spinner" aria-hidden="true" />}
      {/* Decoration: an icon beside a label says nothing the label does not already say. */}
      {icon && <span className="lg-button-icon" aria-hidden="true">{icon}</span>}
      {children}
      {trailingIcon && <span className="lg-button-icon" data-edge="trailing" aria-hidden="true">{trailingIcon}</span>}
    </span>
  </button>;
}

export interface GlassIconButtonProps extends GlassButtonProps {
  /** Icon-only controls carry no visible text, so the accessible name is mandatory. */
  'aria-label': string;
}
export function GlassIconButton({ className, ...props }: GlassIconButtonProps) {
  return <GlassButton {...props} className={cx('lg-icon-button', className)} />;
}
