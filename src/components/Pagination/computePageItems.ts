export type PageItem = number | 'ellipsis-l' | 'ellipsis-r';

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * Builds the visible page sequence with collapsed ellipses. First and last page
 * are always present; `siblingCount` pages sit on each side of `current`, and an
 * 'ellipsis-l' / 'ellipsis-r' marks each collapsed gap.
 */
export function computePageItems(
  current: number,
  totalPages: number,
  siblingCount = 1,
): PageItem[] {
  if (totalPages <= 1) {
    return [1];
  }

  // first + last + current + 2*siblings + two ellipsis slots.
  const totalSlots = 2 * siblingCount + 5;
  if (totalSlots >= totalPages) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;
  const edgeCount = 3 + 2 * siblingCount;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, edgeCount), 'ellipsis-r', totalPages];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis-l', ...range(totalPages - edgeCount + 1, totalPages)];
  }
  return [1, 'ellipsis-l', ...range(leftSibling, rightSibling), 'ellipsis-r', totalPages];
}
