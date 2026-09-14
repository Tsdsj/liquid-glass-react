'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { usePull } from './pull.js';
import { GlassSurface } from './surface.js';
import { useGlassSurface } from './material.js';
import { useGlassPolicy as useGlassSurfacePolicy } from './provider.js';
import { cx, useControllable } from './utils.js';
import { clamp } from '@liquid-glass-ui/core';
export function GlassSlider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, name, 'aria-label': label, formatValue, className, ...surface }) {
    if (![min, max, step].every(Number.isFinite) || min >= max || step <= 0)
        throw new RangeError('GlassSlider requires finite min < max and step > 0');
    const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
    const safe = clamp(Number.isFinite(current) ? current : min, min, max), progress = (safe - min) / (max - min);
    const root = useRef(null);
    const lens = useRef(null);
    const glassPolicy = useGlassSurfacePolicy();
    usePull(root, {
        limit: 10, stretch: 1,
        targets: () => lens.current ? [lens.current] : [],
        // Horizontal motion is the value itself; only vertical pull stretches the lens, horizontal shows the lag.
        origin: () => { const box = lens.current?.getBoundingClientRect(); return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null; },
        disabled: () => !!disabled,
    }, !glassPolicy.reduceMotion);
    return _jsxs("div", { ref: root, className: cx('lg-slider', className), "data-disabled": disabled ? 'true' : 'false', style: { '--lg-progress': progress }, children: [_jsx("span", { className: "lg-slider-track", "aria-hidden": "true", children: _jsx("span", { className: "lg-slider-fill" }) }), _jsx(GlassSurface, { ...surface, ref: lens, radius: "pill", className: "lg-slider-lens", "aria-hidden": "true" }), _jsx("input", { type: "range", "aria-label": label, "aria-valuetext": formatValue?.(safe), min: min, max: max, step: step, value: safe, disabled: disabled, name: name, onChange: event => setCurrent(Number(event.currentTarget.value)) })] });
}
export function GlassSwitch({ checked, defaultChecked = false, onCheckedChange, disabled, name, 'aria-label': label, label: visibleLabel, className, ...surface }) {
    const id = useId();
    const [active, setActive] = useControllable(checked, defaultChecked, onCheckedChange);
    const glass = useGlassSurface({ ...surface, radius: 'pill' });
    const thumb = useRef(null);
    const dragged = useRef(false);
    const labelRef = useRef(null);
    usePull(labelRef, {
        axis: 'x', limit: 14, stretch: 1.2,
        targets: () => [thumb.current, glass.root.current].filter(Boolean),
        disabled: () => !!disabled,
        onRelease: ({ dx, cancelled }) => {
            if (cancelled || Math.abs(dx) < 6) {
                dragged.current = false;
                return;
            }
            // A deliberate drag decides by direction and suppresses the label's synthetic click.
            dragged.current = true;
            const next = dx > 0;
            if (next !== active)
                setActive(next);
        },
    }, !glass.policy.reduceMotion);
    return _jsxs("label", { ref: labelRef, className: cx('lg-switch', className), "data-disabled": disabled ? 'true' : 'false', htmlFor: id, onClickCapture: event => { if (dragged.current) {
            dragged.current = false;
            event.preventDefault();
            event.stopPropagation();
        } }, children: [_jsx("input", { id: id, type: "checkbox", role: "switch", "aria-label": label, name: name, checked: active, disabled: disabled, onChange: event => setActive(event.currentTarget.checked) }), _jsxs("span", { ref: glass.ref, ...glass.attributes, className: "lg-root lg-switch-track", "data-checked": active ? 'true' : 'false', style: glass.style, "aria-hidden": "true", children: [glass.decoration, _jsx("span", { className: "lg-switch-thumb", ref: thumb })] }), visibleLabel && _jsx("span", { className: "lg-switch-label", children: visibleLabel })] });
}
