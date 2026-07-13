import { createRef, type CSSProperties } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../config/LiquidGlassConfig';
import { filterRegistry } from '../filter/filter-registry';
import { __resetGlassSupportCache } from '../hooks/useGlassSupport';
import { GlassSurface } from './GlassSurface';

describe('GlassSurface', () => {
  afterEach(() => {
    __resetGlassSupportCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.documentElement.style.removeProperty('--lg-refraction');
  });

  it('renders the requested host element and forwards native props and ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <GlassSurface
        ref={ref}
        as="section"
        radius={18}
        tint="rgb(255 255 255 / 0.3)"
        interactive
        className="custom-surface"
        data-testid="surface"
        aria-label="Preview panel"
      >
        Content
      </GlassSurface>,
    );

    const surface = screen.getByTestId('surface');
    expect(surface.tagName).toBe('SECTION');
    expect(surface).toHaveClass('lg-surface', 'custom-surface');
    expect(surface).toHaveAttribute('aria-label', 'Preview panel');
    expect(surface).toHaveAttribute('data-interactive');
    expect(surface).toHaveAttribute('data-refraction', 'off');
    expect(surface.style.getPropertyValue('--lg-r')).toBe('18px');
    expect(surface.style.getPropertyValue('--lg-tint')).toBe('rgb(255 255 255 / 0.3)');
    expect(ref.current).toBe(surface);
    expect(surface.querySelector('.lg-surface__content')).toHaveTextContent('Content');
  });

  it('marks nested surfaces so CSS can disable their backdrop-filter', () => {
    render(
      <GlassSurface data-testid="outer">
        <GlassSurface data-testid="inner">Nested</GlassSurface>
      </GlassSurface>,
    );

    expect(screen.getByTestId('outer')).not.toHaveAttribute('data-nested');
    expect(screen.getByTestId('inner')).toHaveAttribute('data-nested');
    expect(screen.getByTestId('inner')).toHaveAttribute('data-refraction', 'off');
  });

  it('stays in fallback mode when forced by configuration', () => {
    render(
      <LiquidGlassConfig forceFallback>
        <GlassSurface data-testid="surface">Fallback</GlassSurface>
      </LiquidGlassConfig>,
    );

    expect(screen.getByTestId('surface')).toHaveAttribute('data-refraction', 'off');
  });

  it('warns once and disables refraction for string radii', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(
      <GlassSurface radius="50%" data-testid="surface">
        Rounded
      </GlassSurface>,
    );

    rerender(
      <GlassSurface radius="20px" data-testid="surface">
        Rounded
      </GlassSurface>,
    );

    expect(screen.getByTestId('surface')).toHaveAttribute('data-refraction', 'off');
    expect(warning).toHaveBeenCalledTimes(1);
  });

  it('switches to a border-box-sized filter after resize settles', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('CSS', { supports: vi.fn(() => true) });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 Chrome/136.0.0.0 Safari/537.36',
      userAgentData: { brands: [{ brand: 'Chromium' }] },
    });
    const refractionStyle: CSSProperties & { '--lg-refraction': string } = {
      '--lg-refraction': '40',
    };

    let resizeCallback: ResizeObserverCallback | null = null;
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      observe(): void {}

      unobserve(): void {}

      disconnect(): void {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    let rect = new DOMRect(0, 0, 320, 200);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => rect);
    const { unmount } = render(
      <GlassSurface radius={14} style={refractionStyle} data-testid="surface">
        Resizable
      </GlassSurface>,
    );
    const flushNextTimer = async () => {
      await act(async () => {
        await vi.runOnlyPendingTimersAsync();
      });
    };

    await flushNextTimer();
    await flushNextTimer();
    await flushNextTimer();

    expect(filterRegistry.getSnapshot()).toEqual([
      expect.objectContaining({ w: 320, h: 200, scale: 40 }),
    ]);
    expect(document.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);

    rect = new DOMRect(0, 0, 420, 260);
    const surface = screen.getByTestId('surface');
    const entry = {
      target: surface,
      contentRect: new DOMRect(0, 0, 356, 196),
    } as unknown as ResizeObserverEntry;

    act(() => {
      resizeCallback?.([entry], {} as ResizeObserver);
    });
    await flushNextTimer();
    await flushNextTimer();
    await flushNextTimer();

    expect(filterRegistry.getSnapshot()).toEqual(
      expect.arrayContaining([expect.objectContaining({ w: 420, h: 260, scale: 40 })]),
    );
    expect(surface.style.getPropertyValue('--lg-filter-url')).toContain('url(#lg-f-');

    unmount();
    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });
});
