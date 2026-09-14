'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx, useControllable } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { clamp } from '@liquid-glass-ui/core';
/**
 * Two segments sharing one surface, for small integer ranges only — past a handful of taps
 * a slider or a field is the honest control. The value is always visible, either inside the
 * stepper or immediately beside it.
 */
export function GlassStepper({ value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, 'aria-label': label, formatValue, showValue = true, decrementLabel = 'Decrease', incrementLabel = 'Increase', className, }) {
    if (!Number.isFinite(step) || step <= 0)
        throw new RangeError('GlassStepper requires step > 0');
    if (min >= max)
        throw new RangeError('GlassStepper requires min < max');
    const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
    const safe = clamp(Number.isFinite(current) ? current : 0, min, max);
    const shown = formatValue ? formatValue(safe) : String(safe);
    const nudge = (direction) => setCurrent(clamp(safe + direction * step, min, max));
    return _jsxs("div", { className: cx('lg-stepper', className), role: "group", "aria-label": label, "data-disabled": disabled ? 'true' : undefined, children: [_jsx("button", { type: "button", className: "lg-stepper-button", "aria-label": decrementLabel, disabled: disabled || safe <= min, onClick: () => nudge(-1), children: _jsx(LibraryIcon, { name: "minus", size: 18 }) }), showValue && _jsx("output", { className: "lg-stepper-value", "aria-live": "off", children: shown }), _jsx("button", { type: "button", className: "lg-stepper-button", "aria-label": incrementLabel, disabled: disabled || safe >= max, onClick: () => nudge(1), children: _jsx(LibraryIcon, { name: "plus", size: 18 }) })] });
}
