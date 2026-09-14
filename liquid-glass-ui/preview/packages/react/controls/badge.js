'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from '../system/utils.js';
/**
 * Colour alone never carries the meaning here: the badge always contains a number or a
 * label, and the accessible name spells out what it counts.
 */
export function GlassBadge({ count, max = 99, children, tone = 'notification', dot = false, className, ...props }) {
    const text = dot ? null : children ?? (count === undefined ? null : count > max ? `${max}+` : String(count));
    if (!dot && (text === null || text === ''))
        return null;
    return _jsx("span", { ...props, className: cx('lg-badge', className), "data-tone": tone, "data-dot": dot ? 'true' : undefined, children: text });
}
