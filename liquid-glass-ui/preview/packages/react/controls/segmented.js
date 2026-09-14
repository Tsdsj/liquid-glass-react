'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { GlassSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { usePull, elementAt } from '../system/pull.js';
import { useFusion } from '../system/fusion.js';
import { useGlassPolicy } from '../system/provider.js';
/** Lens centre with its live pull offset removed: when the selection changes mid-drag the lens glides to the new slot while the offset eases to zero. */
export function lensOrigin(lens) {
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
/**
 * Two to five equal-width segments, text **or** icons but never both mixed. Native radio
 * inputs underneath provide form participation and arrow-key selection.
 *
 * It is a scrubber, not a row of buttons: press the selected segment and slide, and the lens
 * tracks the pointer 1:1, stretches with the drag and updates the selection *live* as it
 * crosses each segment, settling on a spring. This is the interaction most often missing
 * from imitations of the system control.
 */
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
