import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type LiquidGlassLocale = 'zh-CN' | 'en-US';

export interface LiquidGlassConfigProps {
  forceFallback?: boolean;
  forceReducedTransparency?: boolean;
  locale?: LiquidGlassLocale;
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

  return <LiquidGlassContext.Provider value={value}>{children}</LiquidGlassContext.Provider>;
}
