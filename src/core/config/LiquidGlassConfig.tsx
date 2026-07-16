import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { LiquidGlassTheme } from '../theme/createTheme';

export type LiquidGlassLocale = 'zh-CN' | 'en-US';

export interface LiquidGlassConfigProps {
  forceFallback?: boolean;
  forceReducedTransparency?: boolean;
  locale?: LiquidGlassLocale;
  /**
   * Scope a set of `--lg-*` token overrides (see {@link createTheme}) onto the
   * subtree. Applied via a `display: contents` wrapper, so layout is untouched.
   * Omit it and no wrapper is rendered.
   */
  theme?: LiquidGlassTheme;
  children: ReactNode;
}

export interface LiquidGlassContextValue {
  forceFallback: boolean;
  forceReducedTransparency: boolean;
  insideGlass: boolean;
  locale: LiquidGlassLocale;
}

const DEFAULT_CONTEXT: LiquidGlassContextValue = {
  forceFallback: false,
  forceReducedTransparency: false,
  insideGlass: false,
  locale: 'zh-CN',
};

export const LiquidGlassContext = createContext<LiquidGlassContextValue>(DEFAULT_CONTEXT);

export function useLiquidGlassContext(): LiquidGlassContextValue {
  return useContext(LiquidGlassContext);
}

export function LiquidGlassConfig({
  forceFallback = false,
  forceReducedTransparency = false,
  locale,
  theme,
  children,
}: LiquidGlassConfigProps) {
  const parent = useLiquidGlassContext();
  const value = useMemo<LiquidGlassContextValue>(
    () => ({
      forceFallback: parent.forceFallback || forceFallback,
      forceReducedTransparency:
        parent.forceReducedTransparency || forceReducedTransparency,
      insideGlass: parent.insideGlass,
      locale: locale ?? parent.locale,
    }),
    [
      forceFallback,
      forceReducedTransparency,
      locale,
      parent.forceFallback,
      parent.forceReducedTransparency,
      parent.insideGlass,
      parent.locale,
    ],
  );

  const scoped = theme ? (
    <div style={{ display: 'contents', ...theme }}>{children}</div>
  ) : (
    children
  );

  return <LiquidGlassContext.Provider value={value}>{scoped}</LiquidGlassContext.Provider>;
}
