'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useGlassSurface } from '../system/material.js';
import { useSharedSurface } from '../system/surface.js';
import { cx } from '../system/utils.js';
const GLASSY = new Set(['glass', 'glassProminent']);
export const GlassButton = forwardRef(function GlassButton({ material, backdropTone, density, renderer, radius = 'pill', refraction, size, chroma, className, style, children, variant = 'glass', controlSize = 'regular', loading = false, disabled, independent = false, type = 'button', ...props }, ref) {
    const shared = useSharedSurface();
    // Flat variants never grow their own glass, and inside a shared surface neither does anything
    // else: the group is the glass, the children are items on it.
    const flat = !GLASSY.has(variant);
    const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref, (shared && !independent) || flat, true);
    return _jsxs("button", { ...props, ref: glass.ref, type: type, disabled: disabled || loading, "aria-busy": loading || undefined, ...glass.attributes, "data-variant": variant, "data-control-size": controlSize, className: cx('lg-root lg-button', className), style: { ...glass.style, ...style }, children: [glass.decoration, _jsxs("span", { className: "lg-content", children: [loading && _jsx("span", { className: "lg-spinner", "aria-hidden": "true" }), children] })] });
});
export const GlassIconButton = forwardRef(function GlassIconButton({ className, ...props }, ref) {
    return _jsx(GlassButton, { ...props, ref: ref, className: cx('lg-icon-button', className) });
});
