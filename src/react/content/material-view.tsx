'use client';
import { forwardRef, type HTMLAttributes } from 'react';
import type { StandardMaterial } from '../../tokens/index.js';
import { cx } from '../system/utils.js';

export interface MaterialViewProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Thicker materials give text more contrast; thinner ones keep more of the context
   * behind them. Choose by what the surface is for, never by the colour it happens to
   * produce over today's background.
   */
  thickness?: StandardMaterial;
  radius?: number;
}

/**
 * A *standard material* — the content layer's translucency tool, and the right answer
 * whenever the instinct is to reach for glass on something that does not float. It blurs
 * and tints, but it does not lens, does not carry a specular rim and does not flip with its
 * backdrop, because it is part of the content rather than hovering above it.
 *
 * Use vibrant label tones on top (`Text tone="secondary"`), and avoid `quaternary` on the
 * thin and ultraThin variants, where it falls below readable contrast.
 */
export const MaterialView = forwardRef<HTMLDivElement, MaterialViewProps>(function MaterialView(
  { thickness = 'regular', radius = 20, className, style, children, ...props }, ref,
) {
  return <div {...props} ref={ref} className={cx('lg-material-view', className)} data-thickness={thickness}
    style={{ borderRadius: `${radius}px`, ...style }}>{children}</div>;
});
