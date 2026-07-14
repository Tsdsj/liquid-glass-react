import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { filterRegistry } from '../filter/filter-registry';
import type { MorphFrame } from './morph';
import { useMorphTransition, type MorphTransitionOptions } from './useMorphTransition';

const FRAMES: MorphFrame[] = [
  { transform: 'translate(0px, 0px) scale(1, 1)', borderRadius: '8px' },
  { transform: 'translate(40px, 0px) scale(1.2, 1)', borderRadius: '16px' },
];

function Harness({ options }: { options?: MorphTransitionOptions }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = useMorphTransition(ref, options);
  return (
    <div ref={ref} data-testid="box">
      <button type="button" onClick={() => play(FRAMES)}>
        go
      </button>
    </div>
  );
}

function stubMatchMedia(reduced: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: reduced && query.includes('reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

describe('useMorphTransition', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as { animate?: unknown }).animate;
    stubMatchMedia(false);
  });

  it('jumps straight to the final frame under reduced motion, without animating', () => {
    stubMatchMedia(true);
    const animate = vi.fn();
    (HTMLElement.prototype as { animate?: unknown }).animate = animate;

    render(<Harness />);
    fireEvent.click(screen.getByText('go'));

    const box = screen.getByTestId('box');
    expect(box.style.transform).toBe('translate(40px, 0px) scale(1.2, 1)');
    expect(box.style.borderRadius).toBe('16px');
    expect(animate).not.toHaveBeenCalled();
  });

  it('drives a Web Animations keyframe effect and cancels it on unmount', () => {
    const cancel = vi.fn();
    const animate = vi.fn((_keyframes?: unknown, _options?: unknown) => ({ cancel, onfinish: null }));
    (HTMLElement.prototype as { animate?: unknown }).animate = animate;

    const { unmount } = render(<Harness options={{ duration: 250 }} />);
    fireEvent.click(screen.getByText('go'));

    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.calls[0][0]).toEqual([
      { transform: FRAMES[0].transform, borderRadius: FRAMES[0].borderRadius },
      { transform: FRAMES[1].transform, borderRadius: FRAMES[1].borderRadius },
    ]);
    expect(animate.mock.calls[0][1]).toMatchObject({ duration: 250, fill: 'forwards' });

    unmount();
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('never acquires or releases a glass filter while morphing (shape stays locked)', () => {
    const acquire = vi.spyOn(filterRegistry, 'acquire');
    const release = vi.spyOn(filterRegistry, 'release');
    (HTMLElement.prototype as { animate?: unknown }).animate = vi.fn(() => ({
      cancel: vi.fn(),
      onfinish: null,
    }));

    render(<Harness />);
    fireEvent.click(screen.getByText('go'));

    expect(acquire).not.toHaveBeenCalled();
    expect(release).not.toHaveBeenCalled();
  });
});
