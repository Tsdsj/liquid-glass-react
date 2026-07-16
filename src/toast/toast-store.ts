import type { ReactNode } from 'react';

export type ToastKind = 'default' | 'success' | 'error' | 'info';

export interface ToastOptions {
  duration?: number;
  icon?: ReactNode;
  kind?: ToastKind;
}

export interface ToastItem {
  id: string;
  content: ReactNode;
  duration: number;
  icon?: ReactNode;
  kind: ToastKind;
  exiting: boolean;
}

type Listener = () => void;
type Timer = ReturnType<typeof setTimeout>;

const DEFAULT_DURATION = 3000;
const EXIT_DURATION = 300;
const EMPTY_TOASTS: readonly ToastItem[] = [];

let nextId = 0;
let snapshot: readonly ToastItem[] = EMPTY_TOASTS;
const listeners = new Set<Listener>();
const autoDismissTimers = new Map<string, Timer>();
const removalTimers = new Map<string, Timer>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function clearTimer(timerMap: Map<string, Timer>, id: string): void {
  const timer = timerMap.get(id);
  if (timer !== undefined) {
    clearTimeout(timer);
    timerMap.delete(id);
  }
}

function removeToast(id: string): void {
  clearTimer(autoDismissTimers, id);
  clearTimer(removalTimers, id);
  const nextSnapshot = snapshot.filter((toast) => toast.id !== id);
  if (nextSnapshot.length === snapshot.length) {
    return;
  }

  snapshot = nextSnapshot;
  emit();
}

export function subscribeToastStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastSnapshot(): readonly ToastItem[] {
  return snapshot;
}

export function getToastServerSnapshot(): readonly ToastItem[] {
  return EMPTY_TOASTS;
}

// One-shot DEV hint (M28 consumer audit): calling toast with no <Toaster/>
// mounted silently shows nothing — surface that instead of leaving new users
// guessing. Same one-time-warning posture as GlassSurface's string-radius hint.
let hasWarnedMissingHost = false;

export function showToast(content: ReactNode, options: ToastOptions = {}): string {
  if (import.meta.env.DEV && listeners.size === 0 && !hasWarnedMissingHost) {
    hasWarnedMissingHost = true;
    console.warn(
      '[liquid-glass-react] toast was called but no <Toaster/> is mounted — nothing will be shown. Mount <Toaster/> once near the app root.',
    );
  }

  nextId += 1;
  const id = `lg-toast-${nextId}`;
  const duration = options.duration ?? DEFAULT_DURATION;
  const toast: ToastItem = {
    id,
    content,
    duration,
    icon: options.icon,
    kind: options.kind ?? 'default',
    exiting: false,
  };

  snapshot = [toast, ...snapshot];
  emit();

  if (Number.isFinite(duration)) {
    const timer = setTimeout(() => dismissToast(id), Math.max(0, duration));
    autoDismissTimers.set(id, timer);
  }

  return id;
}

export function dismissToast(id?: string): void {
  const ids = id ? [id] : snapshot.map((toast) => toast.id);
  const idSet = new Set(ids);
  let didChange = false;

  const nextSnapshot = snapshot.map((toast) => {
    if (!idSet.has(toast.id) || toast.exiting) {
      return toast;
    }

    didChange = true;
    clearTimer(autoDismissTimers, toast.id);
    const timer = setTimeout(() => removeToast(toast.id), EXIT_DURATION);
    removalTimers.set(toast.id, timer);
    return { ...toast, exiting: true };
  });

  if (didChange) {
    snapshot = nextSnapshot;
    emit();
  }
}

export function trimToasts(max: number): void {
  const normalizedMax = Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 0;
  if (snapshot.length <= normalizedMax) {
    return;
  }

  const discarded = snapshot.slice(normalizedMax);
  discarded.forEach((toast) => {
    clearTimer(autoDismissTimers, toast.id);
    clearTimer(removalTimers, toast.id);
  });
  snapshot = snapshot.slice(0, normalizedMax);
  emit();
}

export function resetToastStore(): void {
  autoDismissTimers.forEach((timer) => clearTimeout(timer));
  removalTimers.forEach((timer) => clearTimeout(timer));
  autoDismissTimers.clear();
  removalTimers.clear();
  snapshot = EMPTY_TOASTS;
  nextId = 0;
  hasWarnedMissingHost = false;
  emit();
}
