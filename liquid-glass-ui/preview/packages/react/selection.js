'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { GlassSurface, SharedSurface } from './surface.js';
import { cx, useControllable } from './utils.js';
import { usePull, elementAt } from './pull.js';
import { useFusion } from './fusion.js';
import { useGlassPolicy } from './provider.js';
/** Lens centre with its live pull offset removed: when the selection changes mid-drag the lens glides to the new slot while the offset eases to zero. */
function lensOrigin(lens) {
    if (!lens)
        return null;
    const box = lens.getBoundingClientRect();
    const shift = parseFloat(lens.style.getPropertyValue('--lg-shift-x')) || 0;
    return { x: box.left + box.width / 2 - shift, y: box.top + box.height / 2 };
}
/** Measures the selected child and positions a single shared lens that glides between choices. */
export function useSelectionLens(root, selector, deps) {
    const [lens, setLens] = useState({ opacity: 0 });
    useEffect(() => {
        const node = root.current;
        if (!node)
            return;
        const update = () => {
            const target = node.querySelector(selector);
            if (target)
                setLens({ width: target.offsetWidth, height: target.offsetHeight, transform: `translateX(${target.offsetLeft}px)`, opacity: 1 });
            else
                setLens({ opacity: 0 });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        if (typeof document !== 'undefined' && 'fonts' in document)
            document.fonts.ready.then(update, () => { });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, selector, ...deps]);
    return lens;
}
/** Native radio inputs provide form participation and arrow-key selection. */
export function GlassSegmentedControl({ items, value, defaultValue, onValueChange, name, disabled, className, 'aria-label': label, ...surface }) {
    const id = useId();
    const [selected, setSelected] = useControllable(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
    const root = useRef(null);
    const policy = useGlassPolicy();
    const lens = useSelectionLens(root, '.lg-segment:has(input:checked)', [selected, items]);
    const lensRef = useRef(null);
    const fusion = useFusion(root, { itemSelector: '.lg-segment:not([data-disabled="true"])', lensSelector: '.lg-selection-lens' });
    usePull(root, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
        disabled: event => !!disabled || !!event.target.closest('[data-disabled="true"]'),
        // The lens follows the pointer and the selection switches live as it crosses each segment.
        onPress: event => pick(event), onMove: event => pick(event),
    }, !policy.reduceMotion && !disabled);
    function pick(event) {
        const hit = elementAt(event, '.lg-segment');
        const input = hit?.querySelector('input');
        if (input && !input.disabled && input.value !== selected && root.current?.contains(input))
            setSelected(input.value);
    }
    return _jsx(GlassSurface, { ...surface, radius: surface.radius ?? 'pill', className: cx('lg-segmented', className), children: _jsxs("div", { className: "lg-segmented-track", ref: root, role: "radiogroup", "aria-label": label, children: [fusion, _jsx("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => _jsxs("label", { className: "lg-segment", "data-disabled": disabled || item.disabled ? 'true' : 'false', children: [_jsx("input", { type: "radio", name: name ?? `segment-${id}`, value: item.value, checked: selected === item.value, disabled: disabled || item.disabled, onChange: () => setSelected(item.value) }), _jsx("span", { children: item.label })] }, item.value))] }) });
}
export function GlassTabs({ items, value, defaultValue, onValueChange, 'aria-label': label, className, ...surface }) {
    const id = useId();
    const [selected, setSelected] = useControllable(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
    const refs = useRef([]);
    const list = useRef(null);
    const policy = useGlassPolicy();
    const lens = useSelectionLens(list, '.lg-tab[aria-selected="true"]', [selected, items]);
    const lensRef = useRef(null);
    usePull(list, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
        disabled: event => !!event.target.closest('button:disabled'),
        onPress: event => pick(event), onMove: event => pick(event),
        onRelease: ({ event, cancelled }) => { if (!cancelled)
            elementAt(event, '.lg-tab')?.focus({ preventScroll: true }); },
    }, !policy.reduceMotion);
    function pick(event) {
        const hit = elementAt(event, '.lg-tab');
        const index = refs.current.indexOf(hit);
        if (hit && !hit.disabled && index >= 0 && items[index].value !== selected)
            setSelected(items[index].value);
    }
    return _jsxs("div", { className: cx('lg-tabs', className), children: [_jsx(GlassSurface, { ...surface, className: "lg-tabs-surface", radius: "pill", children: _jsxs("div", { className: "lg-tab-list", role: "tablist", "aria-label": label, ref: list, children: [_jsx("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map((item, index) => _jsx("button", { ref: node => { refs.current[index] = node; }, type: "button", role: "tab", id: `${id}-tab-${index}`, "aria-controls": `${id}-panel-${index}`, "aria-selected": selected === item.value, tabIndex: selected === item.value ? 0 : -1, disabled: item.disabled, className: "lg-tab", onClick: () => setSelected(item.value), onKeyDown: event => {
                                const enabled = items.map((x, i) => x.disabled ? -1 : i).filter(i => i >= 0);
                                const current = enabled.indexOf(index);
                                let next;
                                const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
                                if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight'))
                                    next = enabled[(current + 1) % enabled.length];
                                else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft'))
                                    next = enabled[(current - 1 + enabled.length) % enabled.length];
                                else if (event.key === 'Home')
                                    next = enabled[0];
                                else if (event.key === 'End')
                                    next = enabled.at(-1);
                                else
                                    return;
                                event.preventDefault();
                                setSelected(items[next].value);
                                refs.current[next]?.focus();
                            }, children: item.label }, item.value))] }) }), items.map((item, index) => _jsx("div", { role: "tabpanel", id: `${id}-panel-${index}`, "aria-labelledby": `${id}-tab-${index}`, hidden: selected !== item.value, tabIndex: 0, className: "lg-tab-panel", children: item.content }, item.value))] });
}
export function GlassNavBar({ items, 'aria-label': label, className, material, backdropTone, density, renderer, radius, refraction, ...props }) {
    const list = useRef(null);
    const policy = useGlassPolicy();
    const currentKey = items.find(item => item.current)?.href;
    const lens = useSelectionLens(list, 'a[aria-current="page"]', [currentKey, items.length]);
    const lensRef = useRef(null);
    usePull(list, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
    }, !policy.reduceMotion);
    return _jsx("nav", { ...props, "aria-label": label, className: cx('lg-nav', className), children: _jsx(GlassSurface, { material: material, backdropTone: backdropTone, density: density, renderer: renderer, radius: radius ?? 'pill', refraction: refraction, children: _jsx(SharedSurface, { value: true, children: _jsxs("div", { className: "lg-nav-items", ref: list, children: [_jsx("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => _jsx("a", { href: item.href, "aria-current": item.current ? 'page' : undefined, onClick: item.onSelect ? event => item.onSelect(event) : undefined, children: item.label }, item.href))] }) }) }) });
}
