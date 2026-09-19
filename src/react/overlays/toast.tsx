'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useGlassSurface } from '../system/material.js';
import { SharedSurface } from '../system/surface.js';
import { GlassButton, GlassIconButton } from '../controls/button.js';
import { LibraryIcon, type LibraryIconName } from '../system/icon.js';
import { useGlassStrings } from '../system/strings.js';
import { cx } from '../system/utils.js';

/**
 * What a toast is reporting. `neutral` is the default and is right for almost everything —
 * "Deleted", "Copied". A tone is not decoration: use it only where the outcome itself is the
 * message, and never as the only carrier of it, which is why each tone also has a glyph.
 */
export type ToastTone = 'neutral' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
  /**
   * A glyph before the message. Defaults to the tone's own, which is what keeps the tone from
   * being colour alone; pass `null` for none.
   */
  icon?: ReactNode | null;
  /** The undo affordance. This is what lets a reversible action skip the confirmation dialog. */
  action?: { label: string; onSelect: () => void };
  /** Milliseconds on screen. Undo needs long enough to read and reach — five seconds or more. */
  duration?: number;
  /**
   * The close button's name. Defaults to the provider's `close`. Set it to `null` only for a
   * toast that genuinely must not be dismissed — which is almost never, because a message
   * that cannot be got rid of is one that sits over the thing it is talking about.
   */
  dismissLabel?: string | null;
}
interface ToastRecord extends Required<Pick<ToastOptions, 'message' | 'duration'>> {
  id: number;
  action?: ToastOptions['action'];
  dismissLabel?: string | null;
  tone: ToastTone;
  icon?: ReactNode | null;
}

/** The glyph each tone carries, so the tone is never only a colour. */
const TONE_ICON: Record<ToastTone, LibraryIconName | null> = {
  neutral: null, success: 'checkmark', warning: 'minus', error: 'close',
};

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

  /**
   * Escape closes the newest one.
   *
   * A toast is not modal and takes no focus, so there is nothing for a key handler to hang
   * off — it has to listen at the window while any toast is on screen. Newest first, because
   * that is the one that just appeared over whatever the user was reading.
   *
   * It does not `preventDefault`: a toast is the least important thing on screen, and Escape
   * inside an open dialog belongs to the dialog. The dialog stops the event before it gets
   * here; if nothing does, this is the only thing Escape had to close anyway.
   */
  useEffect(() => {
    if (!toasts.length) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      setToasts(list => list.slice(0, -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toasts.length]);
  const show = useCallback((options: ToastOptions) => {
    const record: ToastRecord = { id: nextId.current++, message: options.message, duration: options.duration ?? 6000, action: options.action, dismissLabel: options.dismissLabel, tone: options.tone ?? 'neutral', icon: options.icon };
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
  const strings = useGlassStrings();
  const glass = useGlassSurface<HTMLDivElement>({ material: 'regular', size: 'large', radius: 'pill' });
  const [paused, setPaused] = useState(false);
  const dismissRef = useRef(onDismiss); dismissRef.current = onDismiss;
  useEffect(() => {
    if (paused || toast.duration === Infinity) return;
    const timer = setTimeout(() => dismissRef.current(), toast.duration);
    return () => clearTimeout(timer);
  }, [paused, toast.duration]);
  const glyph = toast.icon === null ? null
    : toast.icon ?? (TONE_ICON[toast.tone] && <LibraryIcon name={TONE_ICON[toast.tone]!} size={16} />);
  return <div ref={glass.ref} {...glass.attributes} className={cx('lg-root lg-toast')} data-tone={toast.tone} style={glass.style}
    // Hovering or focusing holds the toast so the undo window is not lost while reaching for it.
    onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
    {glass.decoration}
    <div className="lg-content"><SharedSurface value={true}>
      {glyph && <span className="lg-toast-icon" aria-hidden="true">{glyph}</span>}
      <span className="lg-toast-message">{toast.message}</span>
      {toast.action && <GlassButton className="lg-toast-action" controlSize="small"
        onClick={() => { toast.action!.onSelect(); onDismiss(); }}>{toast.action.label}</GlassButton>}
      {/* Waiting six seconds is not a way to dismiss something, and hovering to pause it is
          not available to a keyboard user at all. */}
      {toast.dismissLabel !== null && <GlassIconButton className="lg-toast-dismiss" variant="plain"
        controlSize="small" aria-label={toast.dismissLabel ?? strings.close} onClick={onDismiss}>
        <LibraryIcon name="close" size={15} />
      </GlassIconButton>}
    </SharedSurface></div>
  </div>;
}
