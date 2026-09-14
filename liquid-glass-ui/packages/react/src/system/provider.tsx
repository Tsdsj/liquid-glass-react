'use client';
import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { defaultPolicy, type GlassPolicy } from '@liquid-glass-ui/tokens';
export interface GlassProviderProps extends GlassPolicy {
  children: ReactNode;
  /** Opt in only after validating SVG on your actual Chrome / GPU matrix. */
  enableSvgAuto?: boolean;
}
export interface ResolvedPolicy extends Required<GlassPolicy> {
  resolvedTheme: 'light' | 'dark';
  reduceTransparency: boolean;
  reduceMotion: boolean;
  increaseContrast: boolean;
  forcedColors: boolean;
  enableSvgAuto: boolean;
}
const initial: ResolvedPolicy = { ...defaultPolicy, resolvedTheme: 'light', reduceTransparency: false, reduceMotion: false, increaseContrast: false, forcedColors: false, enableSvgAuto: false };
const PolicyContext = createContext<ResolvedPolicy>(initial);
export function useMediaQuery(query: string): boolean {
  const store = useMemo(() => ({
    subscribe(callback: () => void) {
      const media = window.matchMedia(query); media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    getSnapshot: () => typeof window !== 'undefined' && window.matchMedia(query).matches,
    getServerSnapshot: () => false,
  }), [query]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
export function GlassProvider({ children, ...overrides }: GlassProviderProps) {
  const parent = useContext(PolicyContext);
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const reduceTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  const increaseContrast = useMediaQuery('(prefers-contrast: more)');
  const forcedColors = useMediaQuery('(forced-colors: active)');
  const defined = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined));
  const merged = { ...parent, ...defined } as ResolvedPolicy;
  const value: ResolvedPolicy = {
    ...merged,
    resolvedTheme: merged.theme === 'system' ? (dark ? 'dark' : 'light') : merged.theme,
    reduceMotion: parent.reduceMotion || reduceMotion || merged.motion !== 'system',
    reduceTransparency: parent.reduceTransparency || reduceTransparency || forcedColors || merged.transparency !== 'system',
    // Increase Contrast and forced colours both mean "stop relying on translucency for legibility".
    increaseContrast: parent.increaseContrast || increaseContrast || forcedColors || merged.contrast !== 'system',
    forcedColors: parent.forcedColors || forcedColors,
  };
  return <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>;
}
export const useGlassPolicy = () => useContext(PolicyContext);
