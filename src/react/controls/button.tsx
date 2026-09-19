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

/** Relative luminance, for the development-mode check on a caller's tint. */
function luminance(colour: string): number | null {
  if (typeof document === 'undefined') return null;
  const probe = document.createElement('span');
  probe.style.color = colour;
  document.body.appendChild(probe);
  const parsed = getComputedStyle(probe).color.match(/[\d.]+/g);
  probe.remove();
  if (!parsed || parsed.length < 3) return null;
  const [r, g, b] = parsed.slice(0, 3).map(Number).map(channel => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
   */
  useEffect(() => {
    if (!inDevelopment() || !tint) return;
    const node = glass.root.current; if (!node) return;
    const background = luminance(tint), foreground = luminance(tintContrast ?? '#fff');
    if (background === null || foreground === null) return;
    const ratio = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
    if (ratio < 4.5) {
      warnOnce(node, 'tint-contrast',
        `tint ${tint} against ${tintContrast ?? '#fff'} measures ${ratio.toFixed(2)}:1, under the 4.5:1 floor. Pass tintContrast, or darken the tint.`);
    }
  }, [glass.root, tint, tintContrast]);

  const tinted = tint
    ? { '--lg-accent': tint, '--lg-accent-contrast': tintContrast ?? '#fff' } as CSSProperties
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
