'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext } from 'react';
import { useGlassSurface } from './material.js';
import { useFusion } from './fusion.js';
import { cx, useMergedRef } from './utils.js';
const SharedContext = createContext(false);
export const useSharedSurface = () => useContext(SharedContext);
export const SharedSurface = SharedContext.Provider;
/**
 * A floating Liquid Glass surface. This belongs to the navigation / control layer — bars,
 * groups, overlays. It is not a card: content-layer containers use `Card`, `List` or
 * `MaterialView`, which do not sample the backdrop at all.
 */
export const GlassSurface = forwardRef(function GlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma, className, style, children, ...props }, ref) {
    const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref);
    return _jsxs("div", { ...props, ref: glass.ref, ...glass.attributes, className: cx('lg-root lg-surface', className), style: { ...glass.style, ...style }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: children })] });
});
export const GlassGroup = forwardRef(function GlassGroup({ children, className, ...props }, ref) {
    const [root, merged] = useMergedRef(ref);
    const fusion = useFusion(root, { itemSelector: ':scope > .lg-content > .lg-button' });
    return _jsx(GlassSurface, { ...props, ref: merged, className: cx('lg-group', className), children: _jsxs(SharedSurface, { value: true, children: [fusion, children] }) });
});
