import { describe, expect, it } from 'vitest';
import { computePageItems } from './computePageItems';

describe('computePageItems', () => {
  it('lists every page when they all fit within the window', () => {
    expect(computePageItems(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
    expect(computePageItems(4, 7, 1)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('adds only a right ellipsis near the start', () => {
    expect(computePageItems(1, 10, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis-r', 10]);
    expect(computePageItems(3, 10, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis-r', 10]);
  });

  it('adds only a left ellipsis near the end', () => {
    expect(computePageItems(10, 10, 1)).toEqual([1, 'ellipsis-l', 6, 7, 8, 9, 10]);
    expect(computePageItems(8, 10, 1)).toEqual([1, 'ellipsis-l', 6, 7, 8, 9, 10]);
  });

  it('adds both ellipses in the middle', () => {
    expect(computePageItems(5, 10, 1)).toEqual([1, 'ellipsis-l', 4, 5, 6, 'ellipsis-r', 10]);
  });

  it('honours a larger sibling count', () => {
    expect(computePageItems(5, 20, 2)).toEqual([
      1,
      'ellipsis-l',
      3,
      4,
      5,
      6,
      7,
      'ellipsis-r',
      20,
    ]);
  });

  it('handles a single page', () => {
    expect(computePageItems(1, 1, 1)).toEqual([1]);
  });
});
