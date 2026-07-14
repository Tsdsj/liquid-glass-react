import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type LiquidGlassLocale = 'zh-CN' | 'en-US';

export interface LiquidGlassConfigProps {
  forceFallback?: boolean;
  locale?: LiquidGlassLocale;
  children: ReactNode;
}

export interface LiquidGlassContextValue {
  forceFallback: boolean;
  insideGlass: boolean;
  locale: LiquidGlassLocale;
}

const DEFAULT_CONTEXT: LiquidGlassContextValue = {
  forceFallback: false,
  insideGlass: false,
  locale: 'zh-CN',
};

export const LiquidGlassContext = createContext<LiquidGlassContextValue>(DEFAULT_CONTEXT);

export function useLiquidGlassContext(): LiquidGlassContextValue {
  return useContext(LiquidGlassContext);
}

export function LiquidGlassConfig({
  forceFallback = false,
  locale,
  children,
}: LiquidGlassConfigProps) {
  const parent = useLiquidGlassContext();
  const value = useMemo<LiquidGlassContextValue>(
    () => ({
      forceFallback: parent.forceFallback || forceFallback,
      insideGlass: parent.insideGlass,
      locale: locale ?? parent.locale,
    }),
    [forceFallback, locale, parent.forceFallback, parent.insideGlass, parent.locale],
  );

  return <LiquidGlassContext.Provider value={value}>{children}</LiquidGlassContext.Provider>;
}
