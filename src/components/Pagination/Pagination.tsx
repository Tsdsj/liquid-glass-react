import { forwardRef } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { useControllableState } from '../../core/hooks/useControllableState';
import { computePageItems } from './computePageItems';

export interface PaginationProps {
  current?: number;
  defaultCurrent?: number;
  total: number;
  pageSize?: number;
  onChange?: (page: number) => void;
  siblingCount?: number;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

const LABELS = {
  'zh-CN': {
    nav: '分页',
    prev: '上一页',
    next: '下一页',
    page: (page: number) => `第 ${page} 页`,
  },
  'en-US': {
    nav: 'Pagination',
    prev: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
  },
} as const;

export const Pagination = /* @__PURE__ */ forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    current,
    defaultCurrent = 1,
    total,
    pageSize = 10,
    onChange,
    siblingCount = 1,
    size = 'md',
    disabled = false,
  },
  ref,
) {
  const { locale } = useLiquidGlassContext();
  const labels = LABELS[locale];
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [currentPage, setCurrentPage] = useControllableState({
    value: current,
    defaultValue: defaultCurrent,
    onChange,
  });
  const clampedCurrent = Math.min(Math.max(currentPage, 1), totalPages);

  const goTo = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === clampedCurrent) {
      return;
    }
    setCurrentPage(page);
  };

  const items = computePageItems(clampedCurrent, totalPages, siblingCount);

  return (
    <nav ref={ref} aria-label={labels.nav} className="lg-pagination" data-size={size}>
      <button
        type="button"
        className="lg-pagination__control"
        aria-label={labels.prev}
        disabled={disabled || clampedCurrent <= 1}
        onClick={() => goTo(clampedCurrent - 1)}
      >
        <span className="lg-pagination__arrow lg-pagination__arrow--prev" aria-hidden="true" />
      </button>

      {items.map((item, index) => {
        if (item === 'ellipsis-l' || item === 'ellipsis-r') {
          return (
            <span key={`${item}-${index}`} className="lg-pagination__ellipsis" aria-hidden="true">
              …
            </span>
          );
        }

        const isCurrent = item === clampedCurrent;
        return (
          <button
            key={item}
            type="button"
            className="lg-pagination__page"
            aria-label={labels.page(item)}
            aria-current={isCurrent ? 'page' : undefined}
            disabled={disabled}
            data-current={isCurrent ? '' : undefined}
            onClick={() => goTo(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        className="lg-pagination__control"
        aria-label={labels.next}
        disabled={disabled || clampedCurrent >= totalPages}
        onClick={() => goTo(clampedCurrent + 1)}
      >
        <span className="lg-pagination__arrow lg-pagination__arrow--next" aria-hidden="true" />
      </button>
    </nav>
  );
});
