import { createRef, type CSSProperties } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
    expect(surface).toHaveAttribute('data-material', 'regular');
    expect(surface).toHaveAttribute('data-refraction', 'off');
    expect(surface).not.toHaveAttribute('data-refraction-pending');
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

  it('supports regular and clear material semantics', () => {
    render(
      <>
        <GlassSurface data-testid="regular">Regular</GlassSurface>
        <GlassSurface material="clear" data-testid="clear">
          Clear
        </GlassSurface>
      </>,
    );

    expect(screen.getByTestId('regular')).toHaveAttribute('data-material', 'regular');
    expect(screen.getByTestId('clear')).toHaveAttribute('data-material', 'clear');
  });

  it('stays in fallback mode when forced by configuration', () => {
    render(
      <LiquidGlassConfig forceFallback>
        <GlassSurface data-testid="surface">Fallback</GlassSurface>
      </LiquidGlassConfig>,
    );

    expect(screen.getByTestId('surface')).toHaveAttribute('data-refraction', 'off');
    expect(screen.getByTestId('surface')).not.toHaveAttribute(
      'data-refraction-pending',
    );
    expect(screen.getByTestId('surface')).not.toHaveAttribute('data-transparency');
  });

  it('marks forced reduced transparency and disables refraction', () => {
    render(
      <LiquidGlassConfig forceReducedTransparency>
        <GlassSurface data-testid="surface">Opaque</GlassSurface>
      </LiquidGlassConfig>,
    );

    expect(screen.getByTestId('surface')).toHaveAttribute(
      'data-transparency',
      'reduced',
    );
    expect(screen.getByTestId('surface')).toHaveAttribute('data-refraction', 'off');
    expect(screen.getByTestId('surface')).not.toHaveAttribute(
      'data-refraction-pending',
    );
  });

  it('coalesces pointer light updates and preserves user handlers', () => {
    vi.stubGlobal('PointerEvent', MouseEvent);
    let pendingFrame: FrameRequestCallback | undefined;
    const requestFrame = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        pendingFrame = callback;
        return 1;
      });
    const onPointerMove = vi.fn();
    const onPointerEnter = vi.fn();
    const onPointerLeave = vi.fn();
    const onPointerDown = vi.fn();
    const onPointerUp = vi.fn();
    const onPointerCancel = vi.fn();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(10, 20, 200, 100),
    );
    render(
      <GlassSurface
        interactive
        data-testid="surface"
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        Interactive
      </GlassSurface>,
    );
    const surface = screen.getByTestId('surface');
    const framesBeforePointerInteraction = requestFrame.mock.calls.length;

    fireEvent.pointerEnter(surface, { clientX: 30, clientY: 30 });
    fireEvent.pointerMove(surface, { clientX: 60, clientY: 70 });
    expect(requestFrame).toHaveBeenCalledTimes(framesBeforePointerInteraction + 1);

    act(() => pendingFrame?.(performance.now()));
    expect(surface.style.getPropertyValue('--lg-pointer-x')).toBe('25%');
    expect(surface.style.getPropertyValue('--lg-pointer-y')).toBe('50%');

    fireEvent.pointerDown(surface, { clientX: 60, clientY: 70 });
    expect(surface).toHaveAttribute('data-pressed');
    fireEvent.pointerUp(surface, { clientX: 60, clientY: 70 });
    expect(surface).not.toHaveAttribute('data-pressed');
    fireEvent.pointerDown(surface, { clientX: 60, clientY: 70 });
    fireEvent.pointerCancel(surface);
    expect(surface).not.toHaveAttribute('data-pressed');
    fireEvent.pointerLeave(surface);
    act(() => pendingFrame?.(performance.now()));
    expect(surface.style.getPropertyValue('--lg-pointer-x')).toBe('50%');
    expect(surface.style.getPropertyValue('--lg-pointer-y')).toBe('0%');

    expect(onPointerEnter).toHaveBeenCalledTimes(1);
    expect(onPointerMove).toHaveBeenCalledTimes(1);
    expect(onPointerDown).toHaveBeenCalledTimes(2);
    expect(onPointerUp).toHaveBeenCalledTimes(1);
    expect(onPointerCancel).toHaveBeenCalledTimes(1);
    expect(onPointerLeave).toHaveBeenCalledTimes(1);
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

  it('creates the initial filter immediately and debounces later resizes', async () => {
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
    const surface = screen.getByTestId('surface');
    expect(surface).toHaveAttribute('data-refraction-pending');
    const advanceTime = async (milliseconds: number) => {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(milliseconds);
      });
    };

    await advanceTime(16);
    await advanceTime(16);
    await advanceTime(16);
    await advanceTime(16);

    expect(filterRegistry.getSnapshot()).toEqual([
      expect.objectContaining({ w: 320, h: 200, scale: 40 }),
    ]);
    expect(surface).toHaveAttribute('data-refraction', 'on');
    expect(surface).not.toHaveAttribute('data-refraction-pending');
    expect(document.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);

    rect = new DOMRect(0, 0, 420, 260);
    const entry = {
      target: surface,
      contentRect: new DOMRect(0, 0, 356, 196),
    } as unknown as ResizeObserverEntry;

    act(() => {
      resizeCallback?.([entry], {} as ResizeObserver);
    });
    await advanceTime(16);

    expect(filterRegistry.getSnapshot()).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ w: 420, h: 260, scale: 40 })]),
    );

    await advanceTime(149);
    expect(filterRegistry.getSnapshot()).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ w: 420, h: 260, scale: 40 })]),
    );

    await advanceTime(1);
    await advanceTime(16);

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
