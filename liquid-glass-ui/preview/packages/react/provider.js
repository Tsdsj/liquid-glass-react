'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { defaultPolicy } from '@liquid-glass-ui/tokens';
const initial = { ...defaultPolicy, resolvedTheme: 'light', reduceTransparency: false, reduceMotion: false, forcedColors: false, enableSvgAuto: false };
const PolicyContext = createContext(initial);
export function useMediaQuery(query) {
    const store = useMemo(() => ({
        subscribe(callback) {
            const media = window.matchMedia(query);
            media.addEventListener('change', callback);
            return () => media.removeEventListener('change', callback);
        },
        getSnapshot: () => typeof window !== 'undefined' && window.matchMedia(query).matches,
        getServerSnapshot: () => false,
    }), [query]);
    return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
export function GlassProvider({ children, ...overrides }) {
    const parent = useContext(PolicyContext);
    const dark = useMediaQuery('(prefers-color-scheme: dark)');
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const reduceTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
    const forcedColors = useMediaQuery('(forced-colors: active)');
    const defined = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined));
    const merged = { ...parent, ...defined };
    const value = {
        ...merged,
        resolvedTheme: merged.theme === 'system' ? (dark ? 'dark' : 'light') : merged.theme,
        reduceMotion: parent.reduceMotion || reduceMotion || merged.motion !== 'system',
        reduceTransparency: parent.reduceTransparency || reduceTransparency || forcedColors || merged.transparency !== 'system',
        forcedColors: parent.forcedColors || forcedColors,
    };
    return _jsx(PolicyContext.Provider, { value: value, children: children });
}
export const useGlassPolicy = () => useContext(PolicyContext);
