'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useGlassSurface } from './material.js';
import { useSharedSurface } from './surface.js';
import { cx } from './utils.js';
export const GlassButton = forwardRef(function GlassButton({ material, backdropTone, density, renderer, radius = 'pill', refraction, className, style, children, variant = 'default', loading = false, disabled, independent = false, type = 'button', ...props }, ref) {
    const shared = useSharedSurface();
    const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction }, ref, (shared && !independent) || variant === 'ghost', true);
    return _jsxs("button", { ...props, ref: glass.ref, type: type, disabled: disabled || loading, "aria-busy": loading || undefined, ...glass.attributes, "data-variant": variant, className: cx('lg-root lg-button', className), style: { ...glass.style, ...style }, children: [glass.decoration, _jsxs("span", { className: "lg-content", children: [loading && _jsx("span", { className: "lg-spinner", "aria-hidden": "true" }), children] })] });
});
export const GlassIconButton = forwardRef(function GlassIconButton({ className, ...props }, ref) {
    return _jsx(GlassButton, { ...props, ref: ref, className: cx('lg-icon-button', className) });
});
