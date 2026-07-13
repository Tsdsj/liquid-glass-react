import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useElementSize } from './useElementSize';

describe('useElementSize', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('measures the border box and updates after ResizeObserver notifications', async () => {
    let observerCallback: ResizeObserverCallback | null = null;
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        observerCallback = callback;
      }

      observe(): void {}

      unobserve(): void {}

      disconnect(): void {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const element = document.createElement('div');
    let rect = new DOMRect(0, 0, 320, 200);
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => rect);
    const ref = { current: element };
    const { result } = renderHook(() => useElementSize(ref));

    await waitFor(() => expect(result.current).toEqual({ width: 320, height: 200 }));

    rect = new DOMRect(0, 0, 420, 260);
    const entry = {
      target: element,
      contentRect: new DOMRect(0, 0, 356, 196),
    } as unknown as ResizeObserverEntry;

    act(() => {
      observerCallback?.([entry], {} as ResizeObserver);
    });

    await waitFor(() => expect(result.current).toEqual({ width: 420, height: 260 }));
  });
});
