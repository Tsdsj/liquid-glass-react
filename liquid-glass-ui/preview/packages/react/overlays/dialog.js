'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useRef } from 'react';
import { useGlassSurface } from '../system/material.js';
import { GlassIconButton } from '../controls/button.js';
import { SharedSurface } from '../system/surface.js';
import { LibraryIcon } from '../system/icon.js';
import { cx, useControllable } from '../system/utils.js';
import { lockScroll, triggerElement } from './anchor.js';
/**
 * A modal task on large glass, built on the native `<dialog>` so focus containment, the
 * top layer and Escape come from the platform rather than from a hand-rolled focus trap.
 *
 * Titles are bold and left-aligned, and the task is paired with a dimming layer because it
 * interrupts the main flow — parallel tasks get glass separation without the dim.
 */
export function GlassDialog({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, className, closeLabel = 'Close', dismissOnBackdrop = true, ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const restoreRef = useRef(null);
    const downOutside = useRef(false);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 28 });
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
        const unlock = lockScroll();
        return () => { if (node.open)
            node.close(); unlock(); const target = triggerRef.current ?? restoreRef.current; if (target?.isConnected)
            target.focus({ preventScroll: true }); };
    }, [open, glass.root]);
    const outside = useCallback((x, y) => {
        const rect = glass.root.current?.getBoundingClientRect();
        return !!rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
    }, [glass.root]);
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), _jsxs("dialog", { id: id, ref: glass.ref, "aria-labelledby": `${id}-title`, "aria-describedby": `${id}-desc`, ...glass.attributes, className: cx('lg-root lg-dialog', className), style: glass.style, onCancel: event => { event.preventDefault(); setOpen(false); }, onClose: () => { if (!glass.root.current?.open)
                    setOpen(false); }, onPointerDown: event => { downOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }, onClick: event => { if (dismissOnBackdrop && downOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY))
                    setOpen(false); downOutside.current = false; }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [_jsx("h2", { id: `${id}-title`, className: "lg-overlay-title", children: title }), _jsx("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), _jsx("div", { className: "lg-dialog-body", children: children }), _jsx(GlassIconButton, { className: "lg-dialog-close", "aria-label": closeLabel, variant: "plain", onClick: () => setOpen(false), children: _jsx(LibraryIcon, { name: "close", size: 18 }) })] }) })] })] });
}
