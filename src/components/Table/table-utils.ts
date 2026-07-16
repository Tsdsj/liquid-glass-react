export type SortOrder = 'asc' | 'desc';

/** Nullish-first; numbers by magnitude, everything else by locale string order. */
export function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return -1;
  }
  if (b == null) {
    return 1;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}

/**
 * Sort a copy of `data` with `comparator`, negated for descending so equal keys
 * stay in their original order (stable) in both directions.
 */
export function applySort<T>(
  data: T[],
  comparator: (a: T, b: T) => number,
  order: SortOrder,
): T[] {
  const direction = order === 'desc' ? -1 : 1;
  return [...data].sort((a, b) => direction * comparator(a, b));
}

/** 1-based page slice. */
export function paginate<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}

/** Page count, never below 1 (an empty table still has one page). */
export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function toggleKey(selected: string[], key: string): string[] {
  const set = new Set(selected);
  if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
  return [...set];
}

/** Select-all over the current page: add or remove only the page's keys. */
export function toggleAll(selected: string[], pageKeys: string[], checked: boolean): string[] {
  const set = new Set(selected);
  for (const key of pageKeys) {
    if (checked) {
      set.add(key);
    } else {
      set.delete(key);
    }
  }
  return [...set];
}

/** Header checkbox state across the current page. */
export function selectionState(
  selected: string[],
  pageKeys: string[],
): { checked: boolean; indeterminate: boolean } {
  if (pageKeys.length === 0) {
    return { checked: false, indeterminate: false };
  }
  const set = new Set(selected);
  const onPage = pageKeys.filter((key) => set.has(key)).length;
  return {
    checked: onPage === pageKeys.length,
    indeterminate: onPage > 0 && onPage < pageKeys.length,
  };
}
