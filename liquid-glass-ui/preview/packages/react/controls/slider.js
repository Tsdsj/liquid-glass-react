'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { usePull } from '../system/pull.js';
import { useGlassSurface } from '../system/material.js';
import { useGlassPolicy } from '../system/provider.js';
import { cx, useControllable } from '../system/utils.js';
import { clamp } from '@liquid-glass-ui/core';
/**
 * A real `<input type="range">` under a drawn track and knob. Rebuilding the input would
 * cost keyboard support, form participation and `aria-valuetext` for nothing.
 *
 * The knob is quiet at rest and **lifts into glass only while it is being manipulated** —
 * a transient control in the content layer, per the Liquid Glass rules. A knob that is
 * permanently glass is glass in the content layer.
 */
export function GlassSlider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, name, 'aria-label': label, formatValue, minLabel, maxLabel, className, ...surface }) {
    if (![min, max, step].every(Number.isFinite) || min >= max || step <= 0)
        throw new RangeError('GlassSlider requires finite min < max and step > 0');
    const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
    const safe = clamp(Number.isFinite(current) ? current : min, min, max), progress = (safe - min) / (max - min);
    const root = useRef(null);
    const policy = useGlassPolicy();
    // The knob keeps its glass machinery mounted so the displacement texture is not rebuilt on
    // every press; CSS decides whether that machinery is visible.
    const knob = useGlassSurface({ ...surface, radius: 'pill' });
    usePull(root, {
        limit: 10, stretch: 1,
        targets: () => knob.root.current ? [knob.root.current] : [],
        // Horizontal motion is the value itself; only vertical pull stretches the knob, horizontal shows the lag.
        origin: () => { const box = knob.root.current?.getBoundingClientRect(); return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null; },
        disabled: () => !!disabled,
    }, !policy.reduceMotion);
    return _jsxs("div", { ref: root, className: cx('lg-slider', className), "data-disabled": disabled ? 'true' : 'false', style: { '--lg-progress': progress }, children: [minLabel && _jsx("span", { className: "lg-slider-edge", "aria-hidden": "true", children: minLabel }), _jsxs("span", { className: "lg-slider-rail", children: [_jsx("span", { className: "lg-slider-track", "aria-hidden": "true", children: _jsx("span", { className: "lg-slider-fill" }) }), _jsx("span", { ref: knob.ref, ...knob.attributes, className: "lg-root lg-slider-lens", style: knob.style, "aria-hidden": "true", children: knob.decoration }), _jsx("input", { type: "range", "aria-label": label, "aria-valuetext": formatValue?.(safe), min: min, max: max, step: step, value: safe, disabled: disabled, name: name, onChange: event => setCurrent(Number(event.currentTarget.value)) })] }), maxLabel && _jsx("span", { className: "lg-slider-edge", "aria-hidden": "true", children: maxLabel })] });
}
