'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { useGlassSurface } from '../system/material.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover } from './anchor.js';
/**
 * A non-modal panel anchored to the control that opened it, on large glass. Escape closes it
 * and returns focus to the trigger; a click outside light-dismisses it.
 *
 * On a phone this pattern should become a sheet instead — a popover with an arrow pointing at
 * a control is an iPad and Mac idiom.
 */
export function GlassPopover({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, align = 'end', className, ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular', size: 'large' });
    usePopover(open, setOpen, glass.root, triggerRef, align, false);
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), _jsxs("div", { popover: "auto", id: id, ref: glass.ref, role: "dialog", tabIndex: -1, "aria-labelledby": `${id}-title`, "aria-describedby": description ? `${id}-desc` : undefined, ...glass.attributes, className: cx('lg-root lg-popover', className), style: glass.style, onKeyDown: event => { if (event.key === 'Escape') {
                    event.preventDefault();
                    setOpen(false);
                    triggerRef.current?.focus();
                } }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [_jsx("h3", { id: `${id}-title`, className: "lg-overlay-title", children: title }), description && _jsx("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), children] }) })] })] });
}
export function GlassMenuDescription(props) {
    return _jsx("p", { ...props, className: cx('lg-overlay-description', props.className) });
}
