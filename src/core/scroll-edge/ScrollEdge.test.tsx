import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollEdge } from './ScrollEdge';

function setScrollMetrics(
  element: Element,
  metrics: { scrollTop: number; scrollHeight: number; clientHeight: number },
): void {
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

function getViewport(): HTMLElement {
  const viewport = document.querySelector<HTMLElement>('.lg-scroll-edge__viewport');
  if (!viewport) {
    throw new Error('viewport not found');
  }
  return viewport;
}

describe('ScrollEdge', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the children inside a viewport and no overlays when content fits', async () => {
    render(
      <ScrollEdge data-testid="scroll">
        <p>Fits</p>
      </ScrollEdge>,
    );

    const viewport = getViewport();
    setScrollMetrics(viewport, { scrollTop: 0, scrollHeight: 200, clientHeight: 200 });
    fireEvent.scroll(viewport);

    await waitFor(() =>
      expect(document.querySelectorAll('.lg-scroll-edge__overlay')).toHaveLength(0),
    );
    expect(screen.getByText('Fits')).toBeInTheDocument();
    expect(screen.getByTestId('scroll')).not.toHaveAttribute('data-edge-top');
    expect(screen.getByTestId('scroll')).not.toHaveAttribute('data-edge-bottom');
  });

  it('mounts only the bottom overlay at the top of overflowing content', async () => {
    render(
      <ScrollEdge data-testid="scroll">
        <p>Long</p>
      </ScrollEdge>,
    );

    const viewport = getViewport();
    setScrollMetrics(viewport, { scrollTop: 0, scrollHeight: 600, clientHeight: 200 });
    fireEvent.scroll(viewport);

    await waitFor(() =>
      expect(document.querySelector('.lg-scroll-edge__overlay[data-side="bottom"]')).toBeInTheDocument(),
    );
    expect(
      document.querySelector('.lg-scroll-edge__overlay[data-side="top"]'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('scroll')).toHaveAttribute('data-edge-bottom');
    expect(screen.getByTestId('scroll')).not.toHaveAttribute('data-edge-top');
  });

  it('recomputes edges when content mutates without a viewport resize', async () => {
    // Drive rAF manually so the only path that can update edges after mount is a
    // content-mutation observer — a stale scroll-scheduled frame cannot mask it.
    let pendingFrame: FrameRequestCallback | null = null;
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      pendingFrame = callback;
      return 1;
    });
    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);

    const { rerender } = render(
      <ScrollEdge data-testid="scroll">
        <p>one</p>
      </ScrollEdge>,
    );
    const viewport = getViewport();
    setScrollMetrics(viewport, { scrollTop: 0, scrollHeight: 200, clientHeight: 200 });
    act(() => pendingFrame?.(performance.now()));
    pendingFrame = null;
    expect(screen.getByTestId('scroll')).not.toHaveAttribute('data-edge-bottom');

    // The viewport box stays 200px tall, but its content grows past it. Only a
    // content-mutation observer (not ResizeObserver on the viewport) catches it.
    setScrollMetrics(viewport, { scrollTop: 0, scrollHeight: 600, clientHeight: 200 });
    await act(async () => {
      rerender(
        <ScrollEdge data-testid="scroll">
          <p>one</p>
          <p>two</p>
          <p>three</p>
        </ScrollEdge>,
      );
      // Flush the MutationObserver microtask so it schedules the next frame.
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(pendingFrame).not.toBeNull();
    act(() => pendingFrame?.(performance.now()));
    expect(screen.getByTestId('scroll')).toHaveAttribute('data-edge-bottom');
  });

  it('mounts both aria-hidden, non-focusable overlays in the middle', async () => {
    render(
      <ScrollEdge data-testid="scroll">
        <p>Long</p>
      </ScrollEdge>,
    );

    const viewport = getViewport();
    setScrollMetrics(viewport, { scrollTop: 200, scrollHeight: 600, clientHeight: 200 });
    fireEvent.scroll(viewport);

    await waitFor(() =>
      expect(document.querySelectorAll('.lg-scroll-edge__overlay')).toHaveLength(2),
    );
    for (const overlay of document.querySelectorAll('.lg-scroll-edge__overlay')) {
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
      expect(overlay).not.toHaveAttribute('tabindex');
    }
    expect(screen.getByTestId('scroll')).toHaveAttribute('data-edge-top');
    expect(screen.getByTestId('scroll')).toHaveAttribute('data-edge-bottom');
  });

  it('leaves the overlay DOM unchanged when progressive is off (regression)', async () => {
    render(
      <ScrollEdge data-testid="scroll">
        <p>Long</p>
      </ScrollEdge>,
    );

    const viewport = getViewport();
    setScrollMetrics(viewport, { scrollTop: 0, scrollHeight: 600, clientHeight: 200 });
    fireEvent.scroll(viewport);

    await waitFor(() =>
      expect(
        document.querySelector('.lg-scroll-edge__overlay[data-side="bottom"]'),
      ).toBeInTheDocument(),
    );
    const overlay = document.querySelector('.lg-scroll-edge__overlay[data-side="bottom"]');
    expect(overlay).not.toHaveAttribute('data-progressive');
    expect(overlay?.querySelector('.lg-progressive-blur')).toBeNull();
    expect(document.querySelectorAll('.lg-progressive-blur__layer')).toHaveLength(0);
  });

  it('renders progressive blur layers inside each overlay when opted in', async () => {
    render(
      <ScrollEdge progressive data-testid="scroll">
        <p>Long</p>
      </ScrollEdge>,
    );

    const viewport = getViewport();
    setScrollMetrics(viewport, { scrollTop: 200, scrollHeight: 600, clientHeight: 200 });
    fireEvent.scroll(viewport);

    await waitFor(() =>
      expect(document.querySelectorAll('.lg-scroll-edge__overlay')).toHaveLength(2),
    );
    for (const overlay of document.querySelectorAll('.lg-scroll-edge__overlay')) {
      expect(overlay).toHaveAttribute('data-progressive');
    }
    expect(document.querySelectorAll('.lg-progressive-blur__layer').length).toBeGreaterThan(0);
    expect(
      document.querySelector('.lg-scroll-edge__overlay[data-side="top"] .lg-progressive-blur'),
    ).toHaveAttribute('data-direction', 'to-top');
    expect(
      document.querySelector('.lg-scroll-edge__overlay[data-side="bottom"] .lg-progressive-blur'),
    ).toHaveAttribute('data-direction', 'to-bottom');
  });
});
