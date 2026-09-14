'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { GlassSurface } from '../system/surface.js';
import { cx } from '../system/utils.js';
/**
 * An inset, floating sidebar on large glass. Content scrolls *beneath* it rather than being
 * pushed aside, which is why it needs the thicker, non-flipping large material: a surface
 * this big that flipped light/dark as content passed under it would be unreadable.
 *
 * A capsule radius would make a 260x600 panel a lozenge, so large surfaces take a fixed
 * radius. Anything nested inside should be concentric with it.
 */
export const Sidebar = forwardRef(function Sidebar({ 'aria-label': label, header, footer, children, side = 'leading', className, material, backdropTone, density, renderer, radius, refraction, chroma, ...props }, ref) {
    return _jsx("aside", { ...props, ref: ref, "aria-label": label, className: cx('lg-sidebar', className), "data-side": side, children: _jsxs(GlassSurface, { material: material, backdropTone: backdropTone, density: density, renderer: renderer, refraction: refraction, chroma: chroma, size: "large", radius: radius ?? 26, className: "lg-sidebar-surface", children: [header && _jsx("div", { className: "lg-sidebar-header", children: header }), _jsx("div", { className: "lg-sidebar-body", children: children }), footer && _jsx("div", { className: "lg-sidebar-footer", children: footer })] }) });
});
