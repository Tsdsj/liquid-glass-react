import { act, createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster } from './Toaster';
import { toast } from './toast';
import {
  dismissToast,
  getToastSnapshot,
  resetToastStore,
  showToast,
  trimToasts,
} from './toast-store';

beforeEach(() => {
  resetToastStore();
});

afterEach(() => {
  act(() => resetToastStore());
  vi.useRealTimers();
});

describe('toast store', () => {
  it('returns ids and keeps newer toasts first without a mounted Toaster', () => {
    expect(() => {
      const first = showToast('First', { duration: Infinity });
      const second = showToast('Second', { duration: Infinity });

      expect(first).toBe('lg-toast-1');
      expect(second).toBe('lg-toast-2');
    }).not.toThrow();
    expect(getToastSnapshot().map((item) => item.content)).toEqual(['Second', 'First']);
  });

  it('automatically exits and removes a toast', () => {
    vi.useFakeTimers();
    showToast('Saved');

    act(() => vi.advanceTimersByTime(3000));
    expect(getToastSnapshot()[0]?.exiting).toBe(true);

    act(() => vi.advanceTimersByTime(300));
    expect(getToastSnapshot()).toHaveLength(0);
  });

  it('dismisses one toast by id', () => {
    vi.useFakeTimers();
    const first = showToast('First', { duration: Infinity });
    showToast('Second', { duration: Infinity });

    dismissToast(first);
    expect(getToastSnapshot().find((item) => item.id === first)?.exiting).toBe(true);
    expect(getToastSnapshot().find((item) => item.content === 'Second')?.exiting).toBe(false);

    act(() => vi.advanceTimersByTime(300));
    expect(getToastSnapshot().map((item) => item.content)).toEqual(['Second']);
  });

  it('dismisses all toasts', () => {
    vi.useFakeTimers();
    showToast('First', { duration: Infinity });
    showToast('Second', { duration: Infinity });

    dismissToast();
    expect(getToastSnapshot().every((item) => item.exiting)).toBe(true);

    act(() => vi.advanceTimersByTime(300));
    expect(getToastSnapshot()).toHaveLength(0);
  });

  it('keeps the snapshot stable when dismiss changes nothing', () => {
    showToast('Persistent', { duration: Infinity });
    const currentSnapshot = getToastSnapshot();

    dismissToast('missing');

    expect(getToastSnapshot()).toBe(currentSnapshot);
  });

  it('trims the oldest toasts and clears their timers', () => {
    vi.useFakeTimers();
    showToast('First');
    showToast('Second');
    showToast('Third');

    trimToasts(2);
    expect(getToastSnapshot().map((item) => item.content)).toEqual(['Third', 'Second']);

    act(() => vi.advanceTimersByTime(3300));
    expect(getToastSnapshot()).toHaveLength(0);
  });

  it('applies convenience kinds', () => {
    toast.success('Success', { duration: Infinity });
    toast.error('Error', { duration: Infinity });
    toast.info('Info', { duration: Infinity });

    expect(getToastSnapshot().map((item) => item.kind)).toEqual(['info', 'error', 'success']);
  });

  it('renders an accessible live region and enforces max', async () => {
    render(createElement(Toaster, { max: 2 }));

    await act(async () => {
      toast.show('First', { duration: Infinity });
      toast.show('Second', { duration: Infinity });
      toast.show('Third', { duration: Infinity });
    });

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('Third');
    expect(region).toHaveTextContent('Second');
    expect(region).not.toHaveTextContent('First');
    expect(getToastSnapshot()).toHaveLength(2);
  });
});
