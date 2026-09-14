'use client';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { GlassSurface } from '../system/surface.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { cx } from '../system/utils.js';

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, GlassSurfaceOptions {
  'aria-label': string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** Trailing placement makes this an inspector rather than a navigation sidebar. */
  side?: 'leading' | 'trailing';
}

/**
 * An inset, floating sidebar on large glass. Content scrolls *beneath* it rather than being
 * pushed aside, which is why it needs the thicker, non-flipping large material: a surface
 * this big that flipped light/dark as content passed under it would be unreadable.
 *
 * A capsule radius would make a 260x600 panel a lozenge, so large surfaces take a fixed
 * radius. Anything nested inside should be concentric with it.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { 'aria-label': label, header, footer, children, side = 'leading', className,
    material, backdropTone, density, renderer, radius, refraction, chroma, ...props }, ref,
) {
  return <aside {...props} ref={ref} aria-label={label} className={cx('lg-sidebar', className)} data-side={side}>
    <GlassSurface material={material} backdropTone={backdropTone} density={density} renderer={renderer}
      refraction={refraction} chroma={chroma} size="large" radius={radius ?? 26} className="lg-sidebar-surface">
      {header && <div className="lg-sidebar-header">{header}</div>}
      <div className="lg-sidebar-body">{children}</div>
      {footer && <div className="lg-sidebar-footer">{footer}</div>}
    </GlassSurface>
  </aside>;
});
