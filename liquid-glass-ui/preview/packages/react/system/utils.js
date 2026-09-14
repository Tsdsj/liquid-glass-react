import { useCallback, useRef, useState } from 'react';
export const cx = (...values) => values.filter(Boolean).join(' ');
export function assignRef(ref, value) {
    if (typeof ref === 'function')
        return ref(value);
    else if (ref)
        ref.current = value;
}
export function useMergedRef(external) {
    const ref = useRef(null);
    const callback = useCallback((node) => {
        ref.current = node;
        const cleanup = assignRef(external, node);
        // React 19 callback refs may return cleanup; do not discard consumer cleanups.
        return () => { ref.current = null; if (typeof cleanup === 'function')
            cleanup();
        else
            assignRef(external, null); };
    }, [external]);
    return [ref, callback];
}
export function useControllable(value, defaultValue, onChange) {
    const [internal, setInternal] = useState(defaultValue);
    const current = value === undefined ? internal : value;
    const set = useCallback((next) => {
        if (value === undefined)
            setInternal(next);
        if (!Object.is(next, current))
            onChange?.(next);
    }, [value, current, onChange]);
    return [current, set];
}
export function focusable(root) {
    return Array.from(root.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'))
        .filter(el => !el.hidden && !el.closest('[inert]') && el.getClientRects().length > 0 && el.getAttribute('aria-disabled') !== 'true');
}
