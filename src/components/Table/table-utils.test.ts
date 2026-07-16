import { describe, expect, it } from 'vitest';
import {
  applySort,
  defaultCompare,
  paginate,
  pageCount,
  selectionState,
  toggleAll,
  toggleKey,
} from './table-utils';

describe('defaultCompare', () => {
  it('orders numbers by magnitude and strings by locale', () => {
    expect(defaultCompare(2, 10)).toBeLessThan(0);
    expect(defaultCompare('b', 'a')).toBeGreaterThan(0);
  });

  it('sorts nullish values first', () => {
    expect(defaultCompare(null, 1)).toBeLessThan(0);
    expect(defaultCompare(1, null)).toBeGreaterThan(0);
    expect(defaultCompare(null, null)).toBe(0);
  });
});

describe('applySort', () => {
  const rows = [{ n: 3 }, { n: 1 }, { n: 2 }];
  const byN = (a: { n: number }, b: { n: number }) => a.n - b.n;

  it('sorts ascending and descending without mutating input', () => {
    expect(applySort(rows, byN, 'asc').map((r) => r.n)).toEqual([1, 2, 3]);
    expect(applySort(rows, byN, 'desc').map((r) => r.n)).toEqual([3, 2, 1]);
    expect(rows.map((r) => r.n)).toEqual([3, 1, 2]);
  });

  it('is stable for equal keys in both directions', () => {
    const items = [
      { k: 1, id: 'a' },
      { k: 1, id: 'b' },
      { k: 0, id: 'c' },
    ];
    const byK = (a: { k: number }, b: { k: number }) => a.k - b.k;
    expect(applySort(items, byK, 'asc').map((r) => r.id)).toEqual(['c', 'a', 'b']);
    expect(applySort(items, byK, 'desc').map((r) => r.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('paginate', () => {
  const data = [1, 2, 3, 4, 5];

  it('slices by 1-based page', () => {
    expect(paginate(data, 1, 2)).toEqual([1, 2]);
    expect(paginate(data, 2, 2)).toEqual([3, 4]);
    expect(paginate(data, 3, 2)).toEqual([5]);
  });

  it('counts pages, minimum one', () => {
    expect(pageCount(5, 2)).toBe(3);
    expect(pageCount(0, 2)).toBe(1);
  });
});

describe('selection', () => {
  it('toggles a single key on and off', () => {
    expect(toggleKey(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleKey(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('select-all adds only the page keys, deselect removes only them', () => {
    expect(toggleAll(['x'], ['a', 'b'], true).sort()).toEqual(['a', 'b', 'x']);
    expect(toggleAll(['a', 'b', 'x'], ['a', 'b'], false)).toEqual(['x']);
  });

  it('reports header checkbox state over the current page', () => {
    expect(selectionState([], ['a', 'b'])).toEqual({ checked: false, indeterminate: false });
    expect(selectionState(['a'], ['a', 'b'])).toEqual({ checked: false, indeterminate: true });
    expect(selectionState(['a', 'b'], ['a', 'b'])).toEqual({ checked: true, indeterminate: false });
    expect(selectionState(['a'], [])).toEqual({ checked: false, indeterminate: false });
  });
});
