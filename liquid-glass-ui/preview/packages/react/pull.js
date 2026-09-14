'use client';
import { useEffect, useRef } from 'react';
const rubber = (d, limit) => d * limit / (limit + Math.abs(d));
const PROPS = ['--lg-shift-x', '--lg-shift-y', '--lg-stretch-x', '--lg-stretch-y'];
export function attachPull(source, getOptions = () => ({})) {
    let active = null;
    const clear = (targets) => { for (const t of targets) {
        for (const p of PROPS)
            t.style.removeProperty(p);
        t.removeAttribute('data-pulling');
    } };
    const move = (event) => {
        if (!active || event.pointerId !== active.id)
            return;
        cancelAnimationFrame(active.frame);
        active.frame = requestAnimationFrame(() => {
            if (!active)
                return;
            const o = getOptions();
            o.onMove?.(event);
            const limit = o.limit ?? 12, gain = o.stretch ?? .6, axis = o.axis ?? 'both';
            const origin = o.origin?.(event) ?? { x: active.x, y: active.y };
            const dx = axis === 'y' ? 0 : event.clientX - origin.x, dy = axis === 'x' ? 0 : event.clientY - origin.y;
            const px = rubber(dx, limit), py = rubber(dy, limit);
            for (const t of active.targets) {
                const w = t.offsetWidth || 1, h = t.offsetHeight || 1;
                const ex = Math.min(.22, Math.abs(px) / w * gain * 4), ey = Math.min(.22, Math.abs(py) / h * gain * 4);
                t.style.setProperty('--lg-shift-x', `${px.toFixed(2)}px`);
                t.style.setProperty('--lg-shift-y', `${py.toFixed(2)}px`);
                t.style.setProperty('--lg-stretch-x', (1 + ex - ey * .45).toFixed(4));
                t.style.setProperty('--lg-stretch-y', (1 + ey - ex * .45).toFixed(4));
            }
        });
    };
    const end = (event, cancelled) => {
        if (!active || event.pointerId !== active.id)
            return;
        const info = { dx: event.clientX - active.x, dy: event.clientY - active.y, cancelled, event };
        cancelAnimationFrame(active.frame);
        clear(active.targets);
        active = null;
        detach();
        getOptions().onRelease?.(info);
    };
    const up = (event) => end(event, false);
    const cancel = (event) => end(event, true);
    const detach = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
    const down = (event) => {
        if (event.button !== 0 || !event.isPrimary || active)
            return;
        const o = getOptions();
        if (o.disabled?.(event))
            return;
        const targets = (o.targets?.(event) ?? [source]).filter(Boolean);
        if (!targets.length)
            return;
        active = { id: event.pointerId, x: event.clientX, y: event.clientY, targets, frame: 0 };
        for (const t of targets)
            t.setAttribute('data-pulling', 'true');
        o.onPress?.(event);
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', cancel);
    };
    source.addEventListener('pointerdown', down);
    return () => { source.removeEventListener('pointerdown', down); if (active) {
        cancelAnimationFrame(active.frame);
        clear(active.targets);
        active = null;
    } detach(); };
}
export function usePull(source, options, enabled = true) {
    const latest = useRef(options);
    latest.current = options;
    useEffect(() => { const node = source.current; if (!node || !enabled)
        return; return attachPull(node, () => latest.current); }, [source, enabled]);
}
/** Enabled segment / tab / link under the pointer at release time, for drag-to-select behaviour. */
export function elementAt(event, selector) {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    return hit?.closest(selector) ?? null;
}
