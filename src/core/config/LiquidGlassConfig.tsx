import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface LiquidGlassConfigProps {
  forceFallback?: boolean;
  children: ReactNode;
}

export interface LiquidGlassContextValue {
  forceFallback: boolean;
  insideGlass: boolean;
}

const DEFAULT_CONTEXT: LiquidGlassContextValue = {
  forceFallback: false,
  insideGlass: false,
};

export const LiquidGlassContext = createContext<LiquidGlassContextValue>(DEFAULT_CONTEXT);

export function useLiquidGlassContext(): LiquidGlassContextValue {
  return useContext(LiquidGlassContext);
}

export function LiquidGlassConfig({
  forceFallback = false,
  children,
}: LiquidGlassConfigProps) {
  const parent = useLiquidGlassContext();
  const value = useMemo<LiquidGlassContextValue>(
    () => ({
      forceFallback: parent.forceFallback || forceFallback,
      insideGlass: parent.insideGlass,
    }),
    [forceFallback, parent.forceFallback, parent.insideGlass],
  );

  return <LiquidGlassContext.Provider value={value}>{children}</LiquidGlassContext.Provider>;
}
