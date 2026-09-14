'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from '../system/utils.js';
import { clamp } from '@liquid-glass-ui/core';
/**
 * Determinate whenever the duration is known — an indeterminate spinner tells the user
 * nothing except that the app is still alive. Never blocks the interface: show content as
 * soon as any of it exists, and prefer a skeleton that matches the final layout over a
 * spinner in the middle of an empty page.
 */
export function GlassProgress({ value, total = 100, 'aria-label': label, variant = 'bar', className }) {
    if (!Number.isFinite(total) || total <= 0)
        throw new RangeError('GlassProgress requires total > 0');
    const determinate = Number.isFinite(value);
    const fraction = determinate ? clamp(value / total, 0, 1) : 0;
    const aria = determinate
        ? { 'aria-valuenow': Math.round(fraction * 100), 'aria-valuemin': 0, 'aria-valuemax': 100 }
        : {};
    return _jsx("div", { role: "progressbar", "aria-label": label, ...aria, className: cx('lg-progress', className), "data-variant": variant, "data-determinate": determinate ? 'true' : 'false', style: { '--lg-progress': fraction }, children: variant === 'bar'
            ? _jsx("span", { className: "lg-progress-track", children: _jsx("span", { className: "lg-progress-fill" }) })
            : _jsx("span", { className: "lg-progress-ring" }) });
}
