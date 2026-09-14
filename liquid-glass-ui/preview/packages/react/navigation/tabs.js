'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { GlassSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { usePull, elementAt } from '../system/pull.js';
import { useGlassPolicy } from '../system/provider.js';
import { useSelectionLens, lensOrigin } from '../controls/segmented.js';
/**
 * In-page tabs that swap content — `role="tablist"` with real panels. This is deliberately
 * not the app's tab bar: navigating between sections of the app is a `<nav>` of links
 * (`TabBar`), because a tablist tells assistive technology the content is swapping in place.
 */
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
