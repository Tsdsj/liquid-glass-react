'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useGlassSurface } from '../system/material.js';
import { SharedSurface } from '../system/surface.js';
import { GlassButton } from '../controls/button.js';
import { cx } from '../system/utils.js';
const ToastContext = createContext(null);
/**
 * The counterpart to confirmation dialogs.
 *
 * Irreversible actions get an alert or an action sheet; **reversible** ones should just
 * happen, with an Undo here. Making every delete stop and ask is how an interface becomes
 * tiring, and offering neither is how it becomes untrustworthy.
 */
export function useToast() {
    const show = useContext(ToastContext);
    if (!show)
        throw new Error('useToast must be used inside a <ToastProvider>');
    return show;
}
export function ToastProvider({ children, limit = 3 }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);
    const dismiss = useCallback((id) => setToasts(list => list.filter(toast => toast.id !== id)), []);
    const show = useCallback((options) => {
        const record = { id: nextId.current++, message: options.message, duration: options.duration ?? 6000, action: options.action };
        setToasts(list => [...list, record].slice(-limit));
    }, [limit]);
    return _jsxs(ToastContext.Provider, { value: show, children: [children, _jsx("div", { className: "lg-toast-region", role: "status", "aria-live": "polite", "aria-relevant": "additions", children: toasts.map(toast => _jsx(Toast, { toast: toast, onDismiss: () => dismiss(toast.id) }, toast.id)) })] });
}
function Toast({ toast, onDismiss }) {
    const glass = useGlassSurface({ material: 'regular', size: 'large', radius: 'pill' });
    const [paused, setPaused] = useState(false);
    const dismissRef = useRef(onDismiss);
    dismissRef.current = onDismiss;
    useEffect(() => {
        if (paused || toast.duration === Infinity)
            return;
        const timer = setTimeout(() => dismissRef.current(), toast.duration);
        return () => clearTimeout(timer);
    }, [paused, toast.duration]);
    return _jsxs("div", { ref: glass.ref, ...glass.attributes, className: cx('lg-root lg-toast'), style: glass.style, 
        // Hovering or focusing holds the toast so the undo window is not lost while reaching for it.
        onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocusCapture: () => setPaused(true), onBlurCapture: () => setPaused(false), children: [glass.decoration, _jsx("div", { className: "lg-content", children: _jsxs(SharedSurface, { value: true, children: [_jsx("span", { className: "lg-toast-message", children: toast.message }), toast.action && _jsx(GlassButton, { className: "lg-toast-action", controlSize: "small", onClick: () => { toast.action.onSelect(); onDismiss(); }, children: toast.action.label })] }) })] });
}
