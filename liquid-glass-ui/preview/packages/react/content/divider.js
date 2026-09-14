'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from '../system/utils.js';
/**
 * A separator in the content layer. Bars and toolbars do not need one: their separation
 * comes from the glass and the scroll edge effect, not from a drawn line.
 */
export function Divider({ orientation = 'horizontal', inset = 0, className, style, ...props }) {
    return _jsx("div", { ...props, role: "separator", "aria-orientation": orientation, "data-orientation": orientation, className: cx('lg-divider', className), style: { [orientation === 'horizontal' ? 'marginInlineStart' : 'marginBlockStart']: inset ? `${inset}px` : undefined, ...style } });
}
