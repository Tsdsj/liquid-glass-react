import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { GlassSurface } from '../core/GlassSurface';
import {
  getToastServerSnapshot,
  getToastSnapshot,
  subscribeToastStore,
  trimToasts,
  type ToastKind,
} from './toast-store';

export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToasterProps {
  position?: ToasterPosition;
  max?: number;
}

interface ToastSurfaceStyle extends CSSProperties {
  '--lg-r': string;
}

const TOAST_SURFACE_STYLE: ToastSurfaceStyle = {
  '--lg-r': 'var(--lg-radius-full)',
};

const DEFAULT_ICONS: Partial<Record<ToastKind, ReactNode>> = {
  success: '\u2713',
  error: '\u00d7',
  info: 'i',
};

function normalizeMax(max: number): number {
  return Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 0;
}

export function Toaster({ position = 'top-center', max = 5 }: ToasterProps) {
  const toasts = useSyncExternalStore(
    subscribeToastStore,
    getToastSnapshot,
    getToastServerSnapshot,
  );
  const normalizedMax = normalizeMax(max);
  const visibleToasts = useMemo(
    () => toasts.slice(0, normalizedMax),
    [normalizedMax, toasts],
  );

  useEffect(() => {
    trimToasts(normalizedMax);
  }, [normalizedMax, toasts]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="lg-toaster"
      data-position={position}
      role="status"
      aria-live="polite"
    >
      {visibleToasts.map((item) => {
        const icon = item.icon ?? DEFAULT_ICONS[item.kind];
        return (
          <GlassSurface
            key={item.id}
            refraction="auto"
            bezel={14}
            className="lg-toast"
            style={TOAST_SURFACE_STYLE}
            data-kind={item.kind}
            data-exiting={item.exiting ? '' : undefined}
          >
            {icon ? (
              <span className="lg-toast__icon" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span className="lg-toast__content">{item.content}</span>
          </GlassSurface>
        );
      })}
    </div>,
    document.body,
  );
}
