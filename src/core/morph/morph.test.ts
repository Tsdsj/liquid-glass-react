import { describe, expect, it } from 'vitest';
import { computeMorphFrames } from './morph';

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

describe('computeMorphFrames', () => {
  it('produces two frames by default: identity start and the full delta end', () => {
    const frames = computeMorphFrames(
      rect({ left: 0, top: 0, width: 100, height: 40 }),
      rect({ left: 60, top: 20, width: 100, height: 40 }),
      12,
      12,
    );

    expect(frames).toHaveLength(2);
    expect(frames[0]).toEqual({ transform: 'translate(0px, 0px) scale(1, 1)', borderRadius: '12px' });
    expect(frames[1]).toEqual({
      transform: 'translate(60px, 20px) scale(1, 1)',
      borderRadius: '12px',
    });
  });

  it('interpolates scale from the size ratio', () => {
    const frames = computeMorphFrames(
      rect({ left: 0, top: 0, width: 100, height: 40 }),
      rect({ left: 0, top: 0, width: 200, height: 80 }),
      10,
      10,
    );
    expect(frames[frames.length - 1].transform).toBe('translate(0px, 0px) scale(2, 2)');
  });

  it('interpolates the border radius across intermediate steps', () => {
    const frames = computeMorphFrames(
      rect({ left: 0, top: 0, width: 100, height: 40 }),
      rect({ left: 0, top: 0, width: 100, height: 40 }),
      10,
      30,
      3,
    );
    expect(frames.map((frame) => frame.borderRadius)).toEqual(['10px', '20px', '30px']);
  });

  it('clamps steps to at least two and honours larger counts', () => {
    const from = rect({ left: 0, top: 0, width: 100, height: 40 });
    const to = rect({ left: 40, top: 0, width: 100, height: 40 });
    expect(computeMorphFrames(from, to, 8, 8, 1)).toHaveLength(2);
    expect(computeMorphFrames(from, to, 8, 8, 5)).toHaveLength(5);
  });

  it('is the identity transform when from equals to', () => {
    const box = rect({ left: 24, top: 12, width: 120, height: 48 });
    const frames = computeMorphFrames(box, box, 16, 16, 4);
    for (const frame of frames) {
      expect(frame).toEqual({ transform: 'translate(0px, 0px) scale(1, 1)', borderRadius: '16px' });
    }
  });

  it('guards against a zero-size source (scale stays 1)', () => {
    const frames = computeMorphFrames(
      rect({ left: 0, top: 0, width: 0, height: 0 }),
      rect({ left: 10, top: 0, width: 100, height: 40 }),
      0,
      8,
    );
    expect(frames[frames.length - 1].transform).toBe('translate(10px, 0px) scale(1, 1)');
  });
});
