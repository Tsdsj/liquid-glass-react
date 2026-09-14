'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { usePull } from '../system/pull.js';
import { useGlassSurface } from '../system/material.js';
import { cx, useControllable } from '../system/utils.js';
/**
 * A capsule toggle, green when on, over a real `<input type="checkbox" role="switch">`.
 *
 * It is a drag target as well as a tap target: throw the knob and it lands on the nearer
 * side, tracking the pointer 1:1 and stretching along the drag before it springs. A
 * click-only switch is one of the clearest tells that an interface is not Apple's.
 */
export function GlassSwitch({ checked, defaultChecked = false, onCheckedChange, disabled, name, 'aria-label': label, label: visibleLabel, className, ...surface }) {
    const id = useId();
    const [active, setActive] = useControllable(checked, defaultChecked, onCheckedChange);
    const glass = useGlassSurface({ ...surface, radius: 'pill' });
    const thumb = useRef(null);
    const dragged = useRef(false);
    const labelRef = useRef(null);
    usePull(labelRef, {
        axis: 'x', limit: 14, stretch: 1.2,
        targets: () => [thumb.current, glass.root.current].filter(Boolean),
        disabled: () => !!disabled,
        onRelease: ({ dx, cancelled }) => {
            if (cancelled || Math.abs(dx) < 6) {
                dragged.current = false;
                return;
            }
            // A deliberate drag decides by direction and suppresses the label's synthetic click.
            dragged.current = true;
            const next = dx > 0;
            if (next !== active)
                setActive(next);
        },
    }, !glass.policy.reduceMotion);
    return _jsxs("label", { ref: labelRef, className: cx('lg-switch', className), "data-disabled": disabled ? 'true' : 'false', htmlFor: id, onClickCapture: event => { if (dragged.current) {
            dragged.current = false;
            event.preventDefault();
            event.stopPropagation();
        } }, children: [_jsx("input", { id: id, type: "checkbox", role: "switch", "aria-label": label, name: name, checked: active, disabled: disabled, onChange: event => setActive(event.currentTarget.checked) }), _jsxs("span", { ref: glass.ref, ...glass.attributes, className: "lg-root lg-switch-track", "data-checked": active ? 'true' : 'false', style: glass.style, "aria-hidden": "true", children: [glass.decoration, _jsx("span", { className: "lg-switch-thumb", ref: thumb })] }), visibleLabel && _jsx("span", { className: "lg-switch-label", children: visibleLabel })] });
}
