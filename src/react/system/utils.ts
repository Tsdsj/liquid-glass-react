import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Ref, type RefObject } from 'react';
/**
 * Runs before the browser paints, so a measurement written here is never seen a frame late.
 * Falls back to a plain effect on the server, where there is no layout to read and React warns.
 */
export const useMeasureEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;
export const cx = (...values: (string | false | null | undefined)[]) => values.filter(Boolean).join(' ');
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void | (() => void) {
  if (typeof ref === 'function') return ref(value);
  else if (ref) (ref as RefObject<T | null>).current = value;
}
export function useMergedRef<T>(external: Ref<T> | undefined) {
  const ref = useRef<T | null>(null);
  const callback = useCallback((node: T | null) => {
    ref.current = node;
    const cleanup = assignRef(external, node);
    // React 19 callback refs may return cleanup; do not discard consumer cleanups.
    return () => { ref.current = null; if (typeof cleanup === 'function') cleanup(); else assignRef(external, null); };
  }, [external]);
  return [ref, callback] as const;
}
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value === undefined ? internal : value;
  const set = useCallback((next: T) => {
    if (value === undefined) setInternal(next);
    if (!Object.is(next, current)) onChange?.(next);
  }, [value, current, onChange]);
  return [current, set] as const;
}
export function focusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'))
    .filter(el => !el.hidden && !el.closest('[inert]') && el.getClientRects().length > 0 && el.getAttribute('aria-disabled') !== 'true');
}
