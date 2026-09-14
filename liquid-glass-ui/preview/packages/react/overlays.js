'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cloneElement, useCallback, useEffect, useId, useRef } from 'react';
import { useGlassSurface } from './material.js';
import { GlassIconButton } from './button.js';
import { SharedSurface } from './surface.js';
import { assignRef, cx, focusable, useControllable } from './utils.js';
function triggerElement(trigger, ref, id, open, kind, setOpen) {
    if (!trigger)
        return null;
    return cloneElement(trigger, {
        'aria-haspopup': kind, 'aria-expanded': open, 'aria-controls': id,
        ref: node => {
            const originalCleanup = assignRef(trigger.props.ref, node), localCleanup = assignRef(ref, node);
            return () => {
                if (typeof originalCleanup === 'function')
                    originalCleanup();
                else
                    assignRef(trigger.props.ref, null);
                if (typeof localCleanup === 'function')
                    localCleanup();
                else
                    assignRef(ref, null);
            };
        },
        onClick: event => { trigger.props.onClick?.(event); if (!event.defaultPrevented)
            setOpen(!open); },
    });
}
/** Native top-layer popover with controlled React state and bounded anchor positioning. */
function usePopover(open, setOpen, panel, trigger, align, menu) {
    const onChange = useRef(setOpen);
    onChange.current = setOpen;
    useEffect(() => {
        const node = panel.current;
        if (!node)
            return;
        const toggled = (event) => {
            const state = event.newState;
            onChange.current(state === 'open');
        };
        node.addEventListener('toggle', toggled);
        return () => node.removeEventListener('toggle', toggled);
    }, [panel]);
    useEffect(() => {
        const node = panel.current;
        if (!node)
            return;
        if (!open) {
            if (node.matches(':popover-open'))
                node.hidePopover();
            return;
        }
        if (typeof node.showPopover !== 'function') {
            onChange.current(false);
            return;
        }
        if (!node.matches(':popover-open'))
            node.showPopover();
        let frame = 0;
        const position = () => {
            const rect = trigger.current?.getBoundingClientRect();
            if (!rect) {
                node.style.left = `${Math.max(16, (innerWidth - node.offsetWidth) / 2)}px`;
                node.style.top = '96px';
                return;
            }
            const width = node.offsetWidth, height = node.offsetHeight;
            const x = align === 'end' ? rect.right - width : align === 'center' ? rect.left + (rect.width - width) / 2 : rect.left;
            const below = rect.bottom + 10;
            const top = below + height <= innerHeight - 16 ? below : Math.max(16, rect.top - height - 10);
            const left = Math.max(16, Math.min(x, innerWidth - width - 16)), resolvedTop = Math.min(top, Math.max(16, innerHeight - height - 16));
            node.style.left = `${left}px`;
            node.style.top = `${resolvedTop}px`;
            // Grow out of the trigger: the transform origin is the trigger centre projected onto the panel box.
            const originX = Math.max(0, Math.min(100, (rect.left + rect.width / 2 - left) / width * 100));
            node.style.setProperty('--lg-origin-x', `${originX}%`);
            node.style.setProperty('--lg-origin-y', resolvedTop >= rect.bottom ? '0%' : '100%');
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
        position();
        const first = menu ? node.querySelector('[role="menuitem"]:not(:disabled)') : focusable(node)[0];
        (first ?? node).focus({ preventScroll: true });
        const resize = new ResizeObserver(schedule);
        resize.observe(node);
        if (trigger.current)
            resize.observe(trigger.current);
        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, true);
        return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true); };
    }, [open, panel, trigger, align, menu]);
}
export function GlassPopover({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, align = 'end', className, ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular' });
    usePopover(open, setOpen, glass.root, triggerRef, align, false);
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), _jsxs("div", { popover: "auto", id: id, ref: glass.ref, role: "dialog", tabIndex: -1, "aria-labelledby": `${id}-title`, "aria-describedby": description ? `${id}-desc` : undefined, ...glass.attributes, className: cx('lg-root lg-popover', className), style: glass.style, onKeyDown: event => { if (event.key === 'Escape') {
                    event.preventDefault();
                    setOpen(false);
                    triggerRef.current?.focus();
                } }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [_jsx("h3", { id: `${id}-title`, className: "lg-overlay-title", children: title }), description && _jsx("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), children] }) })] })] });
}
export function GlassMenu({ trigger, open: controlled, defaultOpen = false, onOpenChange, items, 'aria-label': label, className, align = 'end', ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular' });
    const search = useRef({ text: '', time: 0 });
    usePopover(open, setOpen, glass.root, triggerRef, align, true);
    const close = () => { setOpen(false); triggerRef.current?.focus(); };
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'menu', setOpen), _jsxs("div", { id: id, ref: glass.ref, popover: "auto", role: "menu", tabIndex: -1, "aria-label": label, ...glass.attributes, className: cx('lg-root lg-menu', className), style: glass.style, onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
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
                    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                        const now = Date.now();
                        search.current.text = (now - search.current.time > 700 ? '' : search.current.text) + event.key.toLocaleLowerCase();
                        search.current.time = now;
                        const match = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)].find(button => button.dataset.label?.toLocaleLowerCase().startsWith(search.current.text));
                        if (match) {
                            event.preventDefault();
                            match.focus();
                        }
                        return;
                    }
                    else
                        return;
                    event.preventDefault();
                    enabled[next]?.focus();
                }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: items.map((item, index) => _jsxs("div", { role: "none", style: { '--lg-index': index }, children: [item.separatorBefore && _jsx("div", { role: "separator", className: "lg-menu-separator" }), _jsxs("button", { type: "button", role: "menuitem", tabIndex: -1, className: "lg-menu-item", "data-label": item.label, "data-destructive": item.destructive ? 'true' : 'false', disabled: item.disabled, onClick: () => { close(); item.onSelect(); }, children: [item.label, item.shortcut && _jsx("span", { "aria-hidden": "true", className: "lg-menu-shortcut", children: item.shortcut })] })] }, item.key)) })] })] });
}
let scrollLocks = 0;
let previousOverflow = '';
function lockScroll() {
    if (scrollLocks++ === 0) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    return () => { if (--scrollLocks === 0)
        document.body.style.overflow = previousOverflow; };
}
export function GlassDialog({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, className, closeLabel = '关闭对话框', dismissOnBackdrop = true, ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const restoreRef = useRef(null);
    const downOutside = useRef(false);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular', radius: surface.radius ?? 28 });
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
    const outside = useCallback((x, y) => { const rect = glass.root.current?.getBoundingClientRect(); return !!rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom); }, [glass.root]);
    return _jsxs(_Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), _jsxs("dialog", { id: id, ref: glass.ref, "aria-labelledby": `${id}-title`, "aria-describedby": `${id}-desc`, ...glass.attributes, className: cx('lg-root lg-dialog', className), style: glass.style, onCancel: event => { event.preventDefault(); setOpen(false); }, onClose: () => { if (!glass.root.current?.open)
                    setOpen(false); }, onPointerDown: event => { downOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }, onClick: event => { if (dismissOnBackdrop && downOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY))
                    setOpen(false); downOutside.current = false; }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [_jsx("h2", { id: `${id}-title`, className: "lg-overlay-title", children: title }), _jsx("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), _jsx("div", { className: "lg-dialog-body", children: children }), _jsx(GlassIconButton, { className: "lg-dialog-close", "aria-label": closeLabel, variant: "ghost", onClick: () => setOpen(false), children: _jsx("span", { "aria-hidden": "true", children: "\u00D7" }) })] }) })] })] });
}
export function GlassMenuDescription(props) { return _jsx("p", { ...props, className: cx('lg-overlay-description', props.className) }); }
