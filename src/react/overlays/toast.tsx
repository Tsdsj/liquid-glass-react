'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useGlassSurface } from '../system/material.js';
import { SharedSurface } from '../system/surface.js';
import { GlassButton } from '../controls/button.js';
import { cx } from '../system/utils.js';

export interface ToastOptions {
  message: string;
  /** The undo affordance. This is what lets a reversible action skip the confirmation dialog. */
  action?: { label: string; onSelect: () => void };
  /** Milliseconds on screen. Undo needs long enough to read and reach — five seconds or more. */
  duration?: number;
}
interface ToastRecord extends Required<Pick<ToastOptions, 'message' | 'duration'>> {
  id: number;
  action?: ToastOptions['action'];
}

const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);

/**
 * The counterpart to confirmation dialogs.
 *
 * Irreversible actions get an alert or an action sheet; **reversible** ones should just
 * happen, with an Undo here. Making every delete stop and ask is how an interface becomes
 * tiring, and offering neither is how it becomes untrustworthy.
 */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside a <ToastProvider>');
  return show;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** How many can stack before the oldest is dropped. */
  limit?: number;
}
export function ToastProvider({ children, limit = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);
  const dismiss = useCallback((id: number) => setToasts(list => list.filter(toast => toast.id !== id)), []);
  const show = useCallback((options: ToastOptions) => {
    const record: ToastRecord = { id: nextId.current++, message: options.message, duration: options.duration ?? 6000, action: options.action };
    setToasts(list => [...list, record].slice(-limit));
  }, [limit]);
  return <ToastContext.Provider value={show}>
    {children}
    {/* Polite, not assertive: a toast reports something that already happened. */}
    <div className="lg-toast-region" role="status" aria-live="polite" aria-relevant="additions">
      {toasts.map(toast => <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />)}
    </div>
  </ToastContext.Provider>;
}

function Toast({ toast, onDismiss }: { toast: ToastRecord; onDismiss: () => void }) {
  const glass = useGlassSurface<HTMLDivElement>({ material: 'regular', size: 'large', radius: 'pill' });
  const [paused, setPaused] = useState(false);
  const dismissRef = useRef(onDismiss); dismissRef.current = onDismiss;
  useEffect(() => {
    if (paused || toast.duration === Infinity) return;
    const timer = setTimeout(() => dismissRef.current(), toast.duration);
    return () => clearTimeout(timer);
  }, [paused, toast.duration]);
  return <div ref={glass.ref} {...glass.attributes} className={cx('lg-root lg-toast')} style={glass.style}
    // Hovering or focusing holds the toast so the undo window is not lost while reaching for it.
    onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
    {glass.decoration}
    <div className="lg-content"><SharedSurface value={true}>
      <span className="lg-toast-message">{toast.message}</span>
      {toast.action && <GlassButton className="lg-toast-action" controlSize="small"
        onClick={() => { toast.action!.onSelect(); onDismiss(); }}>{toast.action.label}</GlassButton>}
    </SharedSurface></div>
  </div>;
}
