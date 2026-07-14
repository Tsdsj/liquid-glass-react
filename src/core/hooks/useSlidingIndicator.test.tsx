import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { computeIndicatorStyle, useSlidingIndicator } from './useSlidingIndicator';

function rect(partial: Partial<DOMRect>): DOMRect {
  return {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    toJSON: () => ({}),
    ...partial,
  } as DOMRect;
}

interface HarnessProps {
  containerRect: DOMRect;
  itemRect: DOMRect | null;
}

function Harness({ containerRect, itemRect }: HarnessProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const style = useSlidingIndicator(containerRef, itemRef);
  return (
    <div
      ref={(el) => {
        if (el) {
          el.getBoundingClientRect = () => containerRect;
        }
        containerRef.current = el;
      }}
    >
      {itemRect ? (
        <div
          ref={(el) => {
            if (el) {
              el.getBoundingClientRect = () => itemRect;
            }
            itemRef.current = el;
          }}
        />
      ) : null}
      <div
        data-testid="indicator"
        data-transform={style?.transform ?? ''}
        data-width={style?.width ?? ''}
        data-height={style?.height ?? ''}
      />
    </div>
  );
}

describe('computeIndicatorStyle', () => {
  it('translates by the item offset relative to the container and matches its box', () => {
    const style = computeIndicatorStyle(
      rect({ left: 0, top: 0 }),
      rect({ left: 10, top: 4, width: 40, height: 24 }),
    );

    expect(style).toEqual({
      transform: 'translate(10px, 4px)',
      width: '40px',
      height: '24px',
    });
  });

  it('subtracts the container origin so a scrolled container still yields a local offset', () => {
    const style = computeIndicatorStyle(
      rect({ left: 100, top: 50 }),
      rect({ left: 160, top: 50, width: 30, height: 20 }),
    );

    expect(style.transform).toBe('translate(60px, 0px)');
    expect(style.width).toBe('30px');
    expect(style.height).toBe('20px');
  });
});

describe('useSlidingIndicator', () => {
  it('measures the active item and exposes an applicable style', () => {
    render(
      <Harness
        containerRect={rect({ left: 0, top: 0, width: 200, height: 32 })}
        itemRect={rect({ left: 12, top: 4, width: 64, height: 24 })}
      />,
    );

    const indicator = screen.getByTestId('indicator');
    expect(indicator.dataset.transform).toBe('translate(12px, 4px)');
    expect(indicator.dataset.width).toBe('64px');
    expect(indicator.dataset.height).toBe('24px');
  });

  it('returns no style when the active item is missing', () => {
    render(
      <Harness
        containerRect={rect({ left: 0, top: 0, width: 200, height: 32 })}
        itemRect={null}
      />,
    );

    const indicator = screen.getByTestId('indicator');
    expect(indicator.dataset.transform).toBe('');
    expect(indicator.dataset.width).toBe('');
    expect(indicator.dataset.height).toBe('');
  });
});
