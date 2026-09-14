'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createSpring } from '@liquid-glass-ui/core';
import { useGlassSurface } from '../system/material.js';
import { useGlassPolicy } from '../system/provider.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { lockScroll, triggerElement } from './anchor.js';
/** Fraction of the viewport each detent occupies. `large` stops just short of the top. */
const DETENT_FRACTION = { medium: .5, large: .94 };
/** At or above this fraction the sheet is effectively full height: opaque, anchored to the edge. */
const FULL = .9;
/**
 * A sheet that is inset from the display edge on glass and grows as it is dragged up,
 * becoming **opaque and anchored to the edge at full height** — translucency at full height
 * would just be a blurry app behind a wall of text.
 *
 * The drag is the point: the sheet tracks the finger 1:1 and settles on a spring at the
 * nearest detent, and it is interruptible mid-flight. Only `transform` moves, never `height`,
 * so the drag stays on the compositor.
 */
export function GlassSheet({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, detents = ['medium', 'large'], defaultDetent, onDetentChange, grabber = true, className, ...surface }) {
    if (detents.length === 0)
        throw new Error('GlassSheet requires at least one detent');
    const id = useId();
    const triggerRef = useRef(null);
    const restoreRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const [detent, setDetent] = useControllable(undefined, defaultDetent ?? detents[0], onDetentChange);
    const policy = useGlassPolicy();
    const glass = useGlassSurface({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 38 });
    const fractions = detents.map(name => DETENT_FRACTION[name]);
    const [full, setFull] = useState(DETENT_FRACTION[detent] >= FULL);
    const spring = useRef(null);
    /** One writer for the visible fraction, so the drag and the spring cannot fight each other. */
    const paint = useCallback((fraction) => {
        const node = glass.root.current;
        if (!node)
            return;
        node.style.setProperty('--lg-sheet-offset', `${((1 - fraction) * 100).toFixed(3)}%`);
        setFull(fraction >= FULL);
    }, [glass.root]);
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
        paint(DETENT_FRACTION[detent]);
        const unlock = lockScroll();
        return () => { if (node.open)
            node.close(); unlock(); const target = triggerRef.current ?? restoreRef.current; if (target?.isConnected)
            target.focus({ preventScroll: true }); };
        // `detent` is intentionally not a dependency: re-running this on every detent change would
        // close and reopen the dialog mid-drag.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, glass.root, paint]);
    useEffect(() => { if (open)
        paint(DETENT_FRACTION[detent]); }, [detent, open, paint]);
    useEffect(() => {
        const node = glass.root.current;
        if (!node || !open)
            return;
        const handle = node.querySelector('.lg-sheet-grabber');
        if (!handle)
            return;
        let active = false, startY = 0, startFraction = 0, height = 1, pointer = -1, frame = 0, latest = 0;
        const settle = (fraction) => {
            // Nearest detent wins; below the smallest one the gesture is a dismissal.
            if (fraction < fractions[0] * .6) {
                setOpen(false);
                return;
            }
            const nearest = fractions.reduce((best, value) => Math.abs(value - fraction) < Math.abs(best - fraction) ? value : best, fractions[0]);
            const name = detents[fractions.indexOf(nearest)];
            if (policy.reduceMotion) {
                paint(nearest);
                setDetent(name);
                return;
            }
            spring.current?.stop();
            const animation = createSpring(fraction, paint, { stiffness: 260, damping: 26 });
            spring.current = animation;
            animation.to(nearest);
            setDetent(name);
        };
        const move = (event) => {
            if (!active || event.pointerId !== pointer)
                return;
            latest = startFraction + (startY - event.clientY) / height;
            cancelAnimationFrame(frame);
            // Rubber-band past the top so the sheet never detaches from the finger.
            frame = requestAnimationFrame(() => paint(Math.min(1, Math.max(.04, latest > 1 ? 1 + (latest - 1) * .2 : latest))));
        };
        const end = () => {
            if (!active)
                return;
            active = false;
            pointer = -1;
            cancelAnimationFrame(frame);
            node.removeAttribute('data-dragging');
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
            settle(Math.min(1, Math.max(.04, latest)));
        };
        const down = (event) => {
            if (event.button !== 0 || !event.isPrimary)
                return;
            spring.current?.stop();
            // Measured once at gesture start; reading layout inside pointermove is what drops frames.
            height = window.innerHeight || 1;
            const offset = parseFloat(getComputedStyle(node).getPropertyValue('--lg-sheet-offset')) || 0;
            startFraction = 1 - offset / 100;
            latest = startFraction;
            startY = event.clientY;
            active = true;
            pointer = event.pointerId;
            node.setAttribute('data-dragging', 'true');
            window.addEventListener('pointermove', move, { passive: true });
            window.addEventListener('pointerup', end);
            window.addEventListener('pointercancel', end);
        };
        handle.addEventListener('pointerdown', down);
        return () => { handle.removeEventListener('pointerdown', down); end(); spring.current?.stop(); };
    }, [open, glass.root, detents.join(), policy.reduceMotion, paint, setDetent, setOpen]);
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), _jsxs("dialog", { id: id, ref: glass.ref, "aria-labelledby": `${id}-title`, "aria-describedby": description ? `${id}-desc` : undefined, ...glass.attributes, className: cx('lg-root lg-sheet', className), "data-full": full ? 'true' : undefined, style: { '--lg-sheet-offset': `${(1 - DETENT_FRACTION[detent]) * 100}%`, ...glass.style }, onCancel: event => { event.preventDefault(); setOpen(false); }, onClose: () => { if (!glass.root.current?.open)
                    setOpen(false); }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [grabber && detents.length > 1 && _jsx("div", { className: "lg-sheet-grabber", role: "slider", tabIndex: 0, "aria-label": `${title} height`, "aria-valuetext": detent, "aria-valuenow": fractions.indexOf(DETENT_FRACTION[detent]), "aria-valuemin": 0, "aria-valuemax": detents.length - 1, onKeyDown: event => {
                                        const index = detents.indexOf(detent);
                                        if (event.key === 'ArrowUp' && index < detents.length - 1) {
                                            event.preventDefault();
                                            setDetent(detents[index + 1]);
                                        }
                                        else if (event.key === 'ArrowDown') {
                                            event.preventDefault();
                                            if (index > 0)
                                                setDetent(detents[index - 1]);
                                            else
                                                setOpen(false);
                                        }
                                    }, children: _jsx("span", { "aria-hidden": "true" }) }), _jsxs("div", { className: "lg-sheet-scroll", children: [_jsx("h2", { id: `${id}-title`, className: "lg-overlay-title", children: title }), description && _jsx("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), children] })] }) })] })] });
}
