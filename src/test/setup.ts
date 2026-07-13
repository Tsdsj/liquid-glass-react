import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class OffscreenCanvasMock {
  constructor(
    public width: number,
    public height: number,
  ) {}

  getContext(contextId: string) {
    if (contextId !== '2d') {
      return null;
    }

    return {
      createImageData: (width: number, height: number) => ({
        width,
        height,
        colorSpace: 'srgb',
        data: new Uint8ClampedArray(width * height * 4),
      }),
      putImageData: () => undefined,
    };
  }

  toDataURL(): string {
    return 'data:image/png;base64,mock';
  }
}

Object.defineProperty(globalThis, 'OffscreenCanvas', {
  configurable: true,
  value: OffscreenCanvasMock,
});

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: () => undefined,
});

if (typeof globalThis.requestAnimationFrame === 'undefined') {
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: (callback: FrameRequestCallback): number =>
      window.setTimeout(() => callback(performance.now()), 0),
  });
}

if (typeof globalThis.cancelAnimationFrame === 'undefined') {
  Object.defineProperty(globalThis, 'cancelAnimationFrame', {
    configurable: true,
    value: (handle: number) => window.clearTimeout(handle),
  });
}
