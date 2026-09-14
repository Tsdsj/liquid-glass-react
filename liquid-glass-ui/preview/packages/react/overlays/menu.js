'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { useGlassSurface } from '../system/material.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover } from './anchor.js';
/**
 * A menu on large glass that morphs out of its trigger.
 *
 * The menu keyboard model is a contract, so the roles are real: Up/Down move, Home/End jump,
 * typing jumps to a matching label, Escape closes and returns focus, Tab closes. Keep groups
 * to about seven items and separate them rather than growing one long list.
 */
export function GlassMenu({ trigger, open: controlled, defaultOpen = false, onOpenChange, items, 'aria-label': label, className, align = 'end', ...surface }) {
    const id = useId();
    const triggerRef = useRef(null);
    const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
    const glass = useGlassSurface({ ...surface, material: 'regular', size: 'large' });
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
                    const enabled = Array.from(glass.root.current?.querySelectorAll('[role="menuitem"]:not(:disabled),[role="menuitemcheckbox"]:not(:disabled)') ?? []);
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
                }, children: [glass.decoration, _jsx("div", { className: "lg-content", children: items.map((item, index) => _jsxs("div", { role: "none", style: { '--lg-index': index }, children: [item.separatorBefore && _jsx("div", { role: "separator", className: "lg-menu-separator" }), _jsxs("button", { type: "button", role: item.checked === undefined ? 'menuitem' : 'menuitemcheckbox', "aria-checked": item.checked, tabIndex: -1, className: "lg-menu-item", "data-label": item.label, "data-destructive": item.destructive ? 'true' : 'false', disabled: item.disabled, onClick: () => { close(); item.onSelect(); }, children: [item.icon && _jsx("span", { className: "lg-menu-icon", "aria-hidden": "true", children: item.icon }), _jsx("span", { className: "lg-menu-label", children: item.label }), item.shortcut && _jsx("span", { "aria-hidden": "true", className: "lg-menu-shortcut", children: item.shortcut })] })] }, item.key)) })] })] });
}
