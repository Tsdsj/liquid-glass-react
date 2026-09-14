'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { useGlassSurface } from '../system/material.js';
import { GlassButton } from '../controls/button.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { lockScroll, triggerElement } from './anchor.js';
/**
 * A short, unavoidable decision. The title is bold and **left-aligned** — centred alert text
 * is the old design — and there are at most three actions.
 *
 * Reserve alerts for things the user must act on. A destructive action needs either this
 * (with a red action and Cancel focused) or an immediate Undo; routine information needs
 * neither, and marketing never belongs here.
 */
export function GlassAlert({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, message, actions, className, ...surface }) {
    if (actions.length === 0)
        throw new Error('GlassAlert requires at least one action');
    if (actions.length > 3)
        throw new RangeError('GlassAlert supports at most three actions; use an action sheet for longer lists');
    const id = useId();
    const triggerRef = useRef(null);
    const restoreRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 26 });
    const hasDestructive = actions.some(action => action.role === 'destructive');
    useEffect(() => {
        const node = glass.root.current;
        if (!node)
            return;
        if (!open) {
            if (node.open)
                node.close();
            return;
        }
        restoreRef.current = document.activeElement;
        if (!node.open)
            node.showModal();
        // When something irreversible is on offer, the safe option is the one under the user's hands.
        const preferred = node.querySelector(hasDestructive ? '[data-role="cancel"]' : '[data-role="default"]')
            ?? node.querySelector('.lg-alert-action');
        preferred?.focus({ preventScroll: true });
        const unlock = lockScroll();
        return () => { if (node.open)
            node.close(); unlock(); const target = triggerRef.current ?? restoreRef.current; if (target?.isConnected)
            target.focus({ preventScroll: true }); };
    }, [open, glass.root, hasDestructive]);
    const run = (action) => { setOpen(false); action.onSelect?.(); };
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), _jsxs("dialog", { id: id, ref: glass.ref, role: "alertdialog", "aria-labelledby": `${id}-title`, "aria-describedby": message ? `${id}-msg` : undefined, ...glass.attributes, className: cx('lg-root lg-dialog lg-alert', className), style: glass.style, onCancel: event => {
                    event.preventDefault();
                    // Escape means "get me out", so it runs the cancel action rather than silently closing.
                    const cancel = actions.find(action => action.role === 'cancel');
                    setOpen(false);
                    cancel?.onSelect?.();
                }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [_jsx("h2", { id: `${id}-title`, className: "lg-overlay-title lg-alert-title", children: title }), message && _jsx("p", { id: `${id}-msg`, className: "lg-overlay-description lg-alert-message", children: message }), _jsx("div", { className: "lg-alert-actions", "data-count": actions.length, children: actions.map(action => _jsx(GlassButton, { className: "lg-alert-action", "data-role": action.role ?? 'default', variant: action.role === 'destructive' ? 'destructive' : action.role === 'cancel' ? 'gray' : 'tinted', independent: true, onClick: () => run(action), children: action.label }, action.key)) })] }) })] })] });
}
