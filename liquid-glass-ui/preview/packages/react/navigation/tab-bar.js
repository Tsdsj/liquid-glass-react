'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { GlassSurface } from '../system/surface.js';
import { cx } from '../system/utils.js';
import { usePull } from '../system/pull.js';
import { useGlassPolicy, useMediaQuery } from '../system/provider.js';
import { useSelectionLens, lensOrigin } from '../controls/segmented.js';
import { GlassBadge } from '../controls/badge.js';
/**
 * The app's primary navigation: a floating capsule at the bottom on phones, the same element
 * expanded into a sidebar at regular width.
 *
 * It is a `<nav>` of links with `aria-current="page"`, **not** a tablist — these navigate
 * between sections rather than swapping panels in place. Three to five sections is the usable
 * range; anything more belongs in a sidebar. Tabs navigate, so never put actions in here.
 */
export function TabBar({ items, current, search, 'aria-label': label, minimizeOnScroll = false, sidebarBreakpoint = 1024, sidebarHeader, accessory, className, ...surface }) {
    const policy = useGlassPolicy();
    const asSidebar = useMediaQuery(`(min-width: ${sidebarBreakpoint}px)`);
    const [minimized, setMinimized] = useState(false);
    const list = useRef(null);
    const lensRef = useRef(null);
    const activeKey = items.find(item => item.key === current)?.key ?? (search?.key === current ? current : undefined);
    const lens = useSelectionLens(list, 'a[aria-current="page"]', [activeKey, items.length, asSidebar]);
    usePull(list, {
        axis: asSidebar ? 'y' : 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
    }, !policy.reduceMotion);
    useEffect(() => {
        if (!minimizeOnScroll || asSidebar || policy.reduceMotion) {
            setMinimized(false);
            return;
        }
        let previous = window.scrollY, frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const y = window.scrollY;
                // Only a deliberate scroll counts, so the bar does not flicker on rubber-banding.
                if (Math.abs(y - previous) > 6) {
                    setMinimized(y > previous && y > 64);
                    previous = y;
                }
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
    }, [minimizeOnScroll, asSidebar, policy.reduceMotion]);
    const link = (item, kind) => _jsxs("a", { className: "lg-tab-link", "data-kind": kind, href: item.href, "aria-current": item.key === current ? 'page' : undefined, onClick: item.onSelect ? event => item.onSelect(event) : undefined, children: [item.icon && _jsx("span", { className: "lg-tab-icon", "aria-hidden": "true", children: item.icon }), _jsx("span", { className: "lg-tab-label", children: item.label }), item.badge !== undefined && _jsx(GlassBadge, { count: item.badge, "aria-label": item.badgeLabel, className: "lg-tab-badge" })] }, item.key);
    return _jsxs("nav", { "aria-label": label, className: cx('lg-tabbar', className), "data-layout": asSidebar ? 'sidebar' : 'tabbar', "data-minimized": minimized ? 'true' : undefined, children: [asSidebar && sidebarHeader && _jsx("div", { className: "lg-tabbar-header", children: sidebarHeader }), _jsx(GlassSurface, { ...surface, size: asSidebar ? 'large' : 'small', radius: asSidebar ? 26 : 'pill', className: "lg-tabbar-group", children: _jsxs("div", { className: "lg-tab-links", ref: list, children: [_jsx("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => link(item, 'tab'))] }) }), search && _jsx(GlassSurface, { ...surface, size: asSidebar ? 'large' : 'small', radius: asSidebar ? 26 : 'pill', className: "lg-tabbar-group lg-tabbar-search", children: _jsx("div", { className: "lg-tab-links", children: link(search, 'search') }) }), accessory && _jsx("div", { className: "lg-tabbar-accessory", children: accessory })] });
}
