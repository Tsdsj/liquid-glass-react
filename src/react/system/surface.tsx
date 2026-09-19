'use client';
import { type HTMLAttributes, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from './material.js';
import { useFusion } from './fusion.js';
import { cx, useMergedRef } from './utils.js';
import { SharedSurface } from './shared.js';
export { useSharedSurface, SharedSurface } from './shared.js';
export interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions {}
/**
 * A floating Liquid Glass surface. This belongs to the navigation / control layer — bars,
 * groups, overlays. It is not a card: content-layer containers use `Card`, `List` or
 * `MaterialView`, which do not sample the backdrop at all.
 */
export function GlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma, className, style, children, ref, ...props }: GlassSurfaceProps) {
  const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref);
  return <div {...props} ref={glass.ref} {...glass.attributes} className={cx('lg-root lg-surface', className)} style={{ ...glass.style, ...style }}>
    {glass.decoration}<div className="lg-content">{children}</div>
  </div>;
}
export function GlassGroup({ children, className, ref, ...props }: GlassSurfaceProps) {
  const [root, merged] = useMergedRef<HTMLDivElement>(ref);
  const fusion = useFusion(root, { itemSelector: ':scope > .lg-content > .lg-button' });
  return <GlassSurface {...props} ref={merged} className={cx('lg-group', className)}><SharedSurface value={true}>{fusion}{children}</SharedSurface></GlassSurface>;
}
