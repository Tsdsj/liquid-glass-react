import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createFilterRegistry, type FilterShape } from './filter-registry';

const SHAPE: FilterShape = { w: 120.4, h: 40.4, r: 14, bezel: 12, scale: 40 };

describe('filterRegistry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shares filters with an identical key and keeps snapshots stable', () => {
    const makeMap = vi.fn(() => 'data:image/png;base64,map');
    const registry = createFilterRegistry(makeMap);
    const firstId = registry.acquire(SHAPE);
    const firstSnapshot = registry.getSnapshot();
    const secondId = registry.acquire({ ...SHAPE, w: 120.49, h: 40.49 });

    expect(secondId).toBe(firstId);
    expect(registry.getSnapshot()).toBe(firstSnapshot);
    expect(makeMap).toHaveBeenCalledTimes(1);
  });

  it('uses scale as part of the sharing key', () => {
    const registry = createFilterRegistry(() => 'data:image/png;base64,map');

    expect(registry.acquire(SHAPE)).not.toBe(registry.acquire({ ...SHAPE, scale: 20 }));
    expect(registry.getSnapshot()).toHaveLength(2);
  });

  it('removes an unreferenced filter after the delay', () => {
    const listener = vi.fn();
    const registry = createFilterRegistry(() => 'data:image/png;base64,map');
    registry.subscribe(listener);
    registry.acquire(SHAPE);
    registry.release(SHAPE);

    expect(registry.getSnapshot()).toHaveLength(1);
    expect(listener).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1999);
    expect(registry.getSnapshot()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(registry.getSnapshot()).toHaveLength(0);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('cancels pending removal when the same shape is acquired again', () => {
    const registry = createFilterRegistry(() => 'data:image/png;base64,map');
    const id = registry.acquire(SHAPE);
    registry.release(SHAPE);

    vi.advanceTimersByTime(1000);
    expect(registry.acquire(SHAPE)).toBe(id);

    vi.advanceTimersByTime(2000);
    expect(registry.getSnapshot()).toHaveLength(1);
  });

  it('waits for every shared reference before scheduling removal', () => {
    const registry = createFilterRegistry(() => 'data:image/png;base64,map');
    registry.acquire(SHAPE);
    registry.acquire(SHAPE);

    registry.release(SHAPE);
    vi.advanceTimersByTime(2000);
    expect(registry.getSnapshot()).toHaveLength(1);

    registry.release(SHAPE);
    vi.advanceTimersByTime(2000);
    expect(registry.getSnapshot()).toHaveLength(0);
  });
});
