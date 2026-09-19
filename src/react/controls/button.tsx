'use client';
import { type ButtonHTMLAttributes, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { useSharedSurface } from '../system/surface.js';
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
}

const GLASSY = new Set<GlassButtonVariant>(['glass', 'glassProminent']);

export function GlassButton(
  { material, backdropTone, density, renderer, radius = 'pill', refraction, size, chroma,
    className, style, children, variant = 'glass', controlSize = 'regular', loading = false, disabled,
    independent = false, type = 'button', ref, ...props }: GlassButtonProps,
) {
  const shared = useSharedSurface();
  // Flat variants never grow their own glass, and inside a shared surface neither does anything
  // else: the group is the glass, the children are items on it.
  const flat = !GLASSY.has(variant);
  const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref, (shared && !independent) || flat, true);
  return <button {...props} ref={glass.ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    {...glass.attributes} data-variant={variant} data-control-size={controlSize}
    className={cx('lg-root lg-button', className)} style={{ ...glass.style, ...style }}>
    {glass.decoration}<span className="lg-content">{loading && <span className="lg-spinner" aria-hidden="true" />}{children}</span>
  </button>;
}

export interface GlassIconButtonProps extends GlassButtonProps {
  /** Icon-only controls carry no visible text, so the accessible name is mandatory. */
  'aria-label': string;
}
export function GlassIconButton({ className, ...props }: GlassIconButtonProps) {
  return <GlassButton {...props} className={cx('lg-icon-button', className)} />;
}
