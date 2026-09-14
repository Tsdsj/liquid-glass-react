'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cx } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { Text } from './text.js';
/** A content-layer list. Rows are solid; the glass belongs to the bars floating above them. */
export function List({ variant = 'insetGrouped', className, ...props }) {
    return _jsx("div", { ...props, "data-variant": variant, className: cx('lg-list', className) });
}
export function ListSection({ header, footer, children, className, ...props }) {
    return _jsxs("section", { ...props, className: cx('lg-list-section', className), children: [header && _jsx(Text, { as: "h3", variant: "subhead", emphasized: true, tone: "secondary", className: "lg-list-header", children: header }), _jsx("ul", { className: "lg-list-group", role: "list", children: children }), footer && _jsx(Text, { variant: "footnote", tone: "secondary", className: "lg-list-footer", children: footer })] });
}
/**
 * One row. Navigating rows render as a real link or button so keyboard and assistive
 * technology get the right affordance — a `div` with an onClick is not a row, it is a trap.
 * Minimum height is the 44pt hit region even when the text is a single short line.
 */
export function ListRow({ label, secondaryLabel, value, leading, accessory, href, onSelect, disclosure, destructive, disabled, className }) {
    const interactive = !!href || !!onSelect;
    const showChevron = disclosure ?? (interactive && !accessory);
    const body = _jsxs(_Fragment, { children: [leading && _jsx("span", { className: "lg-row-leading", "aria-hidden": "true", children: leading }), _jsxs("span", { className: "lg-row-labels", children: [_jsx(Text, { as: "span", variant: "body", tone: destructive ? 'destructive' : 'primary', className: "lg-row-label", children: label }), secondaryLabel && _jsx(Text, { as: "span", variant: "footnote", tone: "secondary", className: "lg-row-secondary", children: secondaryLabel })] }), value !== undefined && _jsx(Text, { as: "span", variant: "body", tone: "secondary", className: "lg-row-value", children: value }), accessory && _jsx("span", { className: "lg-row-accessory", children: accessory }), showChevron && _jsx(LibraryIcon, { name: "chevronForward", size: 17, className: "lg-row-chevron" })] });
    return _jsx("li", { className: cx('lg-list-row', className), "data-interactive": interactive ? 'true' : undefined, "data-disabled": disabled ? 'true' : undefined, children: href
            ? _jsx("a", { className: "lg-row-hit", href: href, onClick: onSelect, "aria-disabled": disabled || undefined, children: body })
            : onSelect
                ? _jsx("button", { className: "lg-row-hit", type: "button", onClick: onSelect, disabled: disabled, children: body })
                : _jsx("div", { className: "lg-row-hit", children: body }) });
}
