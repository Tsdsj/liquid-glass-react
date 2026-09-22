'use client';
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { defaultPolicy, type GlassPolicy } from '../../tokens/index.js';
import { defaultStrings, StringsProvider, useGlassStrings, type GlassStrings } from './strings.js';
export interface GlassProviderProps extends GlassPolicy {
  children: ReactNode;
  /** Opt in only after validating SVG on your actual Chrome / GPU matrix. */
  enableSvgAuto?: boolean;
  /**
   * The labels the components supply themselves — the dialog close button, the stepper arrows.
   * Built in as English; pass the ones your application speaks. Partial, and nested providers
   * merge, so translating one word does not mean restating the rest.
   */
  strings?: Partial<GlassStrings>;
}
export interface ResolvedPolicy extends Required<GlassPolicy> {
  resolvedTheme: 'light' | 'dark';
  /**
   * `platform` with `auto` answered. Components that need to reason about the pointer read
   * this; nothing that only needs to *draw* differently should, because the metrics are in
   * the stylesheet where a server-rendered page already has them.
   */
  resolvedPlatform: 'desktop' | 'touch';
  reduceTransparency: boolean;
  reduceMotion: boolean;
  increaseContrast: boolean;
  forcedColors: boolean;
  enableSvgAuto: boolean;
}
const initial: ResolvedPolicy = { ...defaultPolicy, resolvedTheme: 'light', resolvedPlatform: 'touch', reduceTransparency: false, reduceMotion: false, increaseContrast: false, forcedColors: false, enableSvgAuto: false };
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
export function GlassProvider({ children, strings, ...overrides }: GlassProviderProps) {
  const parent = useContext(PolicyContext);
  const parentStrings = useGlassStrings();
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const reduceTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  const increaseContrast = useMediaQuery('(prefers-contrast: more)');
  const forcedColors = useMediaQuery('(forced-colors: active)');
  /* The same test the stylesheet makes, so the two cannot disagree about what a desktop is. */
  const pointerDesktop = useMediaQuery('(pointer: fine) and (min-width: 768px)');
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
    resolvedPlatform: merged.platform === 'auto' ? (pointerDesktop ? 'desktop' : 'touch') : merged.platform,
  };
  /**
   * The three accessibility overrides, published where CSS can read them.
   *
   * A preference that only exists in React reaches the material — which asks the policy in
   * JavaScript — and nothing else. Everything whose motion or colour is decided in a stylesheet
   * kept the media query as its only source, so an application wiring its own settings screen to
   * `motion="reduced"` got a switch that appeared to work and changed nothing outside the glass.
   * The stylesheet answers to `[data-lg-motion]`, `[data-lg-transparency]` and
   * `[data-lg-contrast]` on the root element, exactly as it already answers to `data-lg-theme`.
   *
   * Only the outermost provider writes, and only for a value explicitly overridden: `'system'`
   * means "whatever the OS says", which the media queries already handle, and a nested provider
   * scopes a subtree — writing that onto <html> would let a dark card silence the whole page.
   */
  const outermost = parent === initial;
  const { motion, transparency, contrast, platform } = merged;
  const { resolvedTheme } = value;
  useEffect(() => {
    if (!outermost || typeof document === 'undefined') return;
    const root = document.documentElement;
    const written: Array<[string, string | null]> = [
      /**
       * Theme is written *always*, including for `'system'` — and that is the one place the
       * rule below does not hold.
       *
       * The other three have a media query behind them in the stylesheet, so `'system'` is
       * already answered without an attribute. Colour has none: the dark values hang off
       * `[data-lg-theme="dark"]` and nothing else, because a theme is declared per surface so
       * that a dark toolbar can sit in a light page, and `prefers-color-scheme` cannot say
       * that. The consequence went unnoticed for a release: with `theme="system"` — the
       * README's own example — the provider stamped the glass and left `<html>` alone, so on a
       * dark system the bars went dark and every card, list and form stayed light.
       *
       * The root is only the default. Every surface still declares its own, so the dark
       * toolbar in a light page keeps working; this just stops the page itself from being the
       * one surface nobody sets.
       */
      ['data-lg-theme', resolvedTheme],
      ['data-lg-motion', motion === 'system' ? null : motion],
      ['data-lg-transparency', transparency === 'system' ? null : transparency],
      ['data-lg-contrast', contrast === 'system' ? null : contrast],
      /* `auto` writes nothing, for the same reason `'system'` does above: the media query is
         already the answer, and an attribute that merely repeats it is one more thing that can
         disagree with it. */
      ['data-lg-platform', platform === 'auto' ? null : platform],
    ];
    const before = written.map(([name]) => [name, root.getAttribute(name)] as const);
    for (const [name, value] of written) {
      if (value === null) root.removeAttribute(name); else root.setAttribute(name, value);
    }
    // Restored rather than cleared: an application may set these itself, and a provider
    // unmounting is not a reason to take away a setting it never owned.
    return () => {
      for (const [name, value] of before) {
        if (value === null) root.removeAttribute(name); else root.setAttribute(name, value);
      }
    };
  }, [outermost, resolvedTheme, motion, transparency, contrast, platform]);

  // Identity is stable while nothing is passed, so an untranslated tree never re-renders on this.
  const mergedStrings = useMemo(
    () => (strings ? { ...parentStrings, ...strings } : parentStrings),
    [parentStrings, strings],
  );
  return <PolicyContext.Provider value={value}>
    <StringsProvider value={mergedStrings}>{children}</StringsProvider>
  </PolicyContext.Provider>;
}
export const useGlassPolicy = () => useContext(PolicyContext);
export { defaultStrings, useGlassStrings, type GlassStrings };
