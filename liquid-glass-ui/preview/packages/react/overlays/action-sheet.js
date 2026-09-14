'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { useGlassSurface } from '../system/material.js';
import { useMediaQuery } from '../system/provider.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover } from './anchor.js';
/**
 * A short list of choices that springs from the control that triggered it. Destructive
 * choices sit at the bottom of the list in red, and Cancel is separated from the rest so it
 * cannot be hit by accident.
 *
 * The rest of the interface stays interactive: this is a set of options, not a modal task.
 * On a phone it anchors to the bottom of the screen; on wider layouts it stays attached to
 * its source control.
 */
export function GlassActionSheet({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, message, actions, cancelLabel = 'Cancel', onCancel, 'aria-label': label, align = 'center', className, ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const wide = useMediaQuery('(min-width: 768px)');
    const glass = useGlassSurface({ ...surface, material: 'regular', size: 'large' });
    usePopover(open, setOpen, glass.root, triggerRef, align, true, wide ? 'auto' : 'above');
    const close = () => { setOpen(false); triggerRef.current?.focus(); };
    // Destructive choices are ordered last so a mis-tap lands on something recoverable.
    const ordered = [...actions].sort((a, b) => Number(!!a.destructive) - Number(!!b.destructive));
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'menu', setOpen), _jsxs("div", { id: id, ref: glass.ref, popover: "auto", role: "menu", tabIndex: -1, "aria-label": label, ...glass.attributes, className: cx('lg-root lg-action-sheet', className), style: glass.style, "data-anchor": wide ? 'source' : 'bottom', onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
                        onCancel?.();
                        return;
                    }
                    if (event.key === 'Tab') {
                        close();
                        return;
                    }
                    const enabled = Array.from(glass.root.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') ?? []);
                    const index = enabled.indexOf(document.activeElement);
                    if (!enabled.length)
                        return;
                    let next = index;
                    if (event.key === 'ArrowDown')
                        next = (index + 1) % enabled.length;
                    else if (event.key === 'ArrowUp')
                        next = (index - 1 + enabled.length) % enabled.length;
                    else if (event.key === 'Home')
                        next = 0;
                    else if (event.key === 'End')
                        next = enabled.length - 1;
                    else
                        return;
                    event.preventDefault();
                    enabled[next]?.focus();
                }, children: [glass.decoration, _jsxs("div", { className: "lg-content", children: [(title || message) && _jsxs("div", { className: "lg-sheet-heading", role: "none", children: [title && _jsx("p", { className: "lg-overlay-title", children: title }), message && _jsx("p", { className: "lg-overlay-description", children: message })] }), _jsx("div", { className: "lg-action-list", role: "none", children: ordered.map(action => _jsxs("button", { type: "button", role: "menuitem", tabIndex: -1, className: "lg-action-item", "data-destructive": action.destructive ? 'true' : undefined, disabled: action.disabled, onClick: () => { close(); action.onSelect?.(); }, children: [action.icon && _jsx("span", { className: "lg-action-icon", "aria-hidden": "true", children: action.icon }), action.label] }, action.key)) }), _jsx("button", { type: "button", role: "menuitem", tabIndex: -1, className: "lg-action-cancel", onClick: () => { close(); onCancel?.(); }, children: cancelLabel })] })] })] });
}
