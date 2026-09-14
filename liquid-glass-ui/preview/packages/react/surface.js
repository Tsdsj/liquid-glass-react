'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext } from 'react';
import { useGlassSurface } from './material.js';
import { useFusion } from './fusion.js';
import { cx, useMergedRef } from './utils.js';
const SharedContext = createContext(false);
export const useSharedSurface = () => useContext(SharedContext);
export const SharedSurface = SharedContext.Provider;
export const GlassSurface = forwardRef(function GlassSurface({ material, backdropTone, density, renderer, radius, refraction, className, style, children, ...props }, ref) {
    const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction }, ref);
    return _jsxs("div", { ...props, ref: glass.ref, ...glass.attributes, className: cx('lg-root lg-surface', className), style: { ...glass.style, ...style }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: children })] });
});
export const GlassGroup = forwardRef(function GlassGroup({ children, className, ...props }, ref) {
    const [root, merged] = useMergedRef(ref);
    const fusion = useFusion(root, { itemSelector: ':scope > .lg-content > .lg-button' });
    return _jsx(GlassSurface, { ...props, ref: merged, className: cx('lg-group', className), children: _jsxs(SharedSurface, { value: true, children: [fusion, children] }) });
});
