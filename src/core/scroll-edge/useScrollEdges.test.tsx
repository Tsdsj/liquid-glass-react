import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrollEdges } from './useScrollEdges';

interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

function setScrollMetrics(element: HTMLElement, metrics: ScrollMetrics): void {
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    writable: true,
    value: metrics.scrollTop,
  });
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: metrics.scrollHeight,
  });
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: metrics.clientHeight,
  });
}

describe('useScrollEdges', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function renderWithFrame(element: HTMLElement) {
    let pendingFrame: FrameRequestCallback | null = null;
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      pendingFrame = callback;
      return 1;
    });
    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);
    const ref = { current: element };
    const view = renderHook(() => useScrollEdges(ref));
    const flush = () => act(() => pendingFrame?.(performance.now()));
    return { ...view, flush };
  }

  it('shows only the bottom edge when scrolled to the top of overflowing content', () => {
    const element = document.createElement('div');
    setScrollMetrics(element, { scrollTop: 0, scrollHeight: 400, clientHeight: 200 });
    const { result, flush } = renderWithFrame(element);

    flush();

    expect(result.current).toEqual({ top: false, bottom: true });
  });

  it('shows both edges when scrolled to the middle', () => {
    const element = document.createElement('div');
    setScrollMetrics(element, { scrollTop: 100, scrollHeight: 400, clientHeight: 200 });
    const { result, flush } = renderWithFrame(element);

    flush();

    expect(result.current).toEqual({ top: true, bottom: true });
  });

  it('shows only the top edge when scrolled to the bottom', () => {
    const element = document.createElement('div');
    setScrollMetrics(element, { scrollTop: 200, scrollHeight: 400, clientHeight: 200 });
    const { result, flush } = renderWithFrame(element);

    flush();

    expect(result.current).toEqual({ top: true, bottom: false });
  });

  it('shows no edges when content fits within the viewport', () => {
    const element = document.createElement('div');
    setScrollMetrics(element, { scrollTop: 0, scrollHeight: 200, clientHeight: 200 });
    const { result, flush } = renderWithFrame(element);

    flush();

    expect(result.current).toEqual({ top: false, bottom: false });
  });

  it('recomputes edges when the element scrolls', () => {
    const element = document.createElement('div');
    setScrollMetrics(element, { scrollTop: 0, scrollHeight: 400, clientHeight: 200 });
    const { result, flush } = renderWithFrame(element);
    flush();
    expect(result.current).toEqual({ top: false, bottom: true });

    setScrollMetrics(element, { scrollTop: 200, scrollHeight: 400, clientHeight: 200 });
    act(() => {
      element.dispatchEvent(new Event('scroll'));
    });
    flush();

    expect(result.current).toEqual({ top: true, bottom: false });
  });

  it('recomputes edges when the observed content resizes', () => {
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
    setScrollMetrics(element, { scrollTop: 0, scrollHeight: 200, clientHeight: 200 });
    const { result, flush } = renderWithFrame(element);
    flush();
    expect(result.current).toEqual({ top: false, bottom: false });

    setScrollMetrics(element, { scrollTop: 0, scrollHeight: 500, clientHeight: 200 });
    act(() => {
      observerCallback?.([], {} as ResizeObserver);
    });
    flush();

    expect(result.current).toEqual({ top: false, bottom: true });
  });

  it('removes listeners and cancels pending frames on unmount', () => {
    const disconnect = vi.fn();
    class ResizeObserverMock {
      observe(): void {}

      unobserve(): void {}

      disconnect(): void {
        disconnect();
      }
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const cancelFrame = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const element = document.createElement('div');
    setScrollMetrics(element, { scrollTop: 0, scrollHeight: 400, clientHeight: 200 });
    const removeEventListener = vi.spyOn(element, 'removeEventListener');
    const ref = { current: element };
    const { unmount } = renderHook(() => useScrollEdges(ref));

    unmount();

    expect(disconnect).toHaveBeenCalled();
    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(cancelFrame).toHaveBeenCalled();
  });

  it('returns no edges when the ref is empty (SSR-safe default)', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useScrollEdges(ref));

    expect(result.current).toEqual({ top: false, bottom: false });
  });
});
