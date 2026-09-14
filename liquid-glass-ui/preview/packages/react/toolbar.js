'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect } from 'react';
import { useGlassSurface } from './material.js';
import { useFusion } from './fusion.js';
import { SharedSurface } from './surface.js';
import { cx } from './utils.js';
/** Roving focus for toolbar BUTTONS only; complex input widgets belong outside this primitive. */
export const GlassToolbar = forwardRef(function GlassToolbar({ material, backdropTone, density, renderer, radius = 'pill', refraction, className, style, children, orientation = 'horizontal', onKeyDown, onFocusCapture, ...props }, ref) {
    const glass = useGlassSurface({ material, backdropTone, density, renderer, radius, refraction }, ref);
    const fusion = useFusion(glass.root, { itemSelector: ':scope > .lg-content > .lg-button' });
    const items = () => Array.from(glass.root.current?.querySelectorAll('button:not(:disabled)') ?? []).filter(b => b.closest('[role="toolbar"]') === glass.root.current && !b.closest('[popover]') && b.getClientRects().length > 0);
    const setTabStop = (target) => { for (const item of items())
        item.tabIndex = item === target ? 0 : -1; };
    useEffect(() => {
        const node = glass.root.current;
        if (!node)
            return;
        const reset = () => { const available = items(); const current = available.find(item => item === document.activeElement) ?? available.find(item => item.tabIndex === 0) ?? available[0]; if (current)
            setTabStop(current); };
        reset();
        const observer = new MutationObserver(reset);
        observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
        return () => observer.disconnect();
    });
    const keyboard = (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
            return;
        const available = items();
        const index = available.indexOf(document.activeElement);
        if (index < 0)
            return;
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        const previous = orientation === 'horizontal' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
        const next = orientation === 'horizontal' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
        let target = index;
        if (event.key === next)
            target = (index + 1) % available.length;
        else if (event.key === previous)
            target = (index - 1 + available.length) % available.length;
        else if (event.key === 'Home')
            target = 0;
        else if (event.key === 'End')
            target = available.length - 1;
        else
            return;
        event.preventDefault();
        setTabStop(available[target]);
        available[target].focus();
    };
    return _jsxs("div", { ...props, ref: glass.ref, role: "toolbar", "aria-orientation": orientation, ...glass.attributes, className: cx('lg-root lg-toolbar', className), "data-orientation": orientation, style: { ...glass.style, ...style }, onKeyDown: keyboard, onFocusCapture: event => { onFocusCapture?.(event); if (event.target.tagName === 'BUTTON')
            setTabStop(event.target); }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [fusion, children] }) })] });
});
export function GlassToolbarSeparator() { return _jsx("span", { className: "lg-toolbar-separator", "aria-hidden": "true" }); }
