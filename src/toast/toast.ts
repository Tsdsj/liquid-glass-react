import type { ReactNode } from 'react';
import {
  dismissToast,
  showToast,
  type ToastOptions,
} from './toast-store';

type KindToastOptions = Omit<ToastOptions, 'kind'>;

export const toast = {
  show(content: ReactNode, options?: ToastOptions): string {
    return showToast(content, options);
  },
  success(content: ReactNode, options?: KindToastOptions): string {
    return showToast(content, { ...options, kind: 'success' });
  },
  error(content: ReactNode, options?: KindToastOptions): string {
    return showToast(content, { ...options, kind: 'error' });
  },
  info(content: ReactNode, options?: KindToastOptions): string {
    return showToast(content, { ...options, kind: 'info' });
  },
  dismiss(id?: string): void {
    dismissToast(id);
  },
};

export type { ToastKind, ToastOptions } from './toast-store';
