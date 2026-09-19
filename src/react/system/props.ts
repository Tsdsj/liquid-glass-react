'use client';
import type { GlassSurfaceOptions } from './material.js';

/**
 * Several components used to collect their rest props as glass options and hand the whole
 * object to `useGlassSurface`. That worked while the props type listed nothing else, but it
 * also meant an `id`, a `style` or a `data-*` the caller wrote went into the options object
 * and never reached the DOM. Now that those components accept HTML attributes, the two have
 * to be told apart — by name, once, here, rather than by each component guessing.
 *
 * Internal: not re-exported from the package entry point. It exists so the split is written
 * down in one place, not so callers can do it themselves.
 */
const SURFACE_KEYS = ['material', 'backdropTone', 'density', 'renderer', 'radius', 'size', 'refraction', 'chroma'] as const;

export function splitSurface<P extends GlassSurfaceOptions>(props: P): [GlassSurfaceOptions, Omit<P, keyof GlassSurfaceOptions>] {
  const surface: Record<string, unknown> = {};
  const rest = { ...props } as Record<string, unknown>;
  for (const key of SURFACE_KEYS) {
    if (key in rest) { surface[key] = rest[key]; delete rest[key]; }
  }
  return [surface as GlassSurfaceOptions, rest as Omit<P, keyof GlassSurfaceOptions>];
}
