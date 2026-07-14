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

  it('reads the latest border box when the scheduled frame runs', () => {
    let pendingFrame: FrameRequestCallback | null = null;
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      pendingFrame = callback;
      return 1;
    });

    const element = document.createElement('div');
    let rect = new DOMRect(0, 0, 62, 152);
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => rect);
    const ref = { current: element };
    const { result } = renderHook(() => useElementSize(ref));

    rect = new DOMRect(0, 0, 320, 152);
    act(() => {
      pendingFrame?.(performance.now());
    });

    expect(result.current).toEqual({ width: 320, height: 152 });
  });

  it('uses the untransformed HTMLElement border box when available', async () => {
    const element = document.createElement('div');
    Object.defineProperties(element, {
      offsetWidth: { configurable: true, value: 320 },
      offsetHeight: { configurable: true, value: 152 },
    });
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 307, 146),
    );
    const ref = { current: element };
    const { result } = renderHook(() => useElementSize(ref));

    await waitFor(() => expect(result.current).toEqual({ width: 320, height: 152 }));
  });
});
