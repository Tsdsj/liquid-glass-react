import { useMemo, type ReactNode } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import { cx } from '../../core/utils/cx';
import { Checkbox } from '../Checkbox';
import { Pagination } from '../Pagination';
import {
  applySort,
  defaultCompare,
  paginate,
  selectionState,
  toggleAll,
  toggleKey,
  type SortOrder,
} from './table-utils';

export interface TableColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}

export interface TableSort {
  key: string;
  order: SortOrder;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  selectable?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  pagination?: { pageSize: number; page?: number; onChange?: (page: number) => void } | false;
  size?: 'sm' | 'md' | 'lg';
  emptyText?: ReactNode;
  'aria-label'?: string;
}

const LABELS = {
  'zh-CN': { selectAll: '全选', selectRow: '选择该行', empty: '暂无数据' },
  'en-US': { selectAll: 'Select all', selectRow: 'Select row', empty: 'No data' },
} as const;

export function Table<T>({
  columns,
  data,
  rowKey,
  sort: sortProp,
  defaultSort,
  onSortChange,
  selectable = false,
  selectedKeys: selectedProp,
  defaultSelectedKeys,
  onSelectionChange,
  pagination = false,
  size = 'md',
  emptyText,
  'aria-label': ariaLabel,
}: TableProps<T>) {
  const { locale } = useLiquidGlassContext();
  const labels = LABELS[locale];

  const [sort, setSort] = useControllableState<TableSort | null>({
    value: sortProp,
    defaultValue: defaultSort ?? null,
    onChange: onSortChange,
  });
  const [selectedKeys, setSelectedKeys] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: defaultSelectedKeys ?? [],
    onChange: onSelectionChange,
  });

  const paginationEnabled = pagination !== false;
  const pageSize = paginationEnabled ? pagination.pageSize : 0;
  const [page, setPage] = useControllableState<number>({
    value: paginationEnabled ? pagination.page : undefined,
    defaultValue: 1,
    onChange: paginationEnabled ? pagination.onChange : undefined,
  });

  const getKey = (row: T): string =>
    typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey]);

  const sortedData = useMemo(() => {
    if (!sort) {
      return data;
    }
    const column = columns.find((candidate) => candidate.key === sort.key);
    if (!column) {
      return data;
    }
    const comparator =
      column.sorter ??
      ((a: T, b: T) =>
        defaultCompare(
          column.dataIndex != null ? a[column.dataIndex] : undefined,
          column.dataIndex != null ? b[column.dataIndex] : undefined,
        ));
    return applySort(data, comparator, sort.order);
  }, [columns, data, sort]);

  const pagedData = paginationEnabled ? paginate(sortedData, page, pageSize) : sortedData;
  const pageKeys = pagedData.map(getKey);
  const headerSelection = selectionState(selectedKeys, pageKeys);
  const columnSpan = columns.length + (selectable ? 1 : 0);

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) {
      return;
    }
    if (!sort || sort.key !== column.key) {
      setSort({ key: column.key, order: 'asc' });
    } else if (sort.order === 'asc') {
      setSort({ key: column.key, order: 'desc' });
    } else {
      setSort(null);
    }
  };

  const ariaSortFor = (column: TableColumn<T>): 'none' | 'ascending' | 'descending' | undefined => {
    if (!column.sortable) {
      return undefined;
    }
    if (sort?.key !== column.key) {
      return 'none';
    }
    return sort.order === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <GlassSurface as="div" className="lg-table-surface" data-size={size}>
      <div className="lg-table-scroll">
        <table className="lg-table" data-size={size} aria-label={ariaLabel}>
          <thead>
            <tr>
              {selectable ? (
                <th scope="col" className="lg-table__selection">
                  <Checkbox
                    aria-label={labels.selectAll}
                    checked={headerSelection.checked}
                    indeterminate={headerSelection.indeterminate}
                    onCheckedChange={(checked) =>
                      setSelectedKeys(toggleAll(selectedKeys, pageKeys, checked))
                    }
                  />
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSortFor(column)}
                  style={{ width: column.width, textAlign: column.align }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="lg-table__sort"
                      data-order={sort?.key === column.key ? sort.order : undefined}
                      onClick={() => handleSort(column)}
                    >
                      {column.title}
                      <span className="lg-table__sort-arrow" aria-hidden="true" />
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td className="lg-table__empty" colSpan={columnSpan}>
                  {emptyText ?? labels.empty}
                </td>
              </tr>
            ) : (
              pagedData.map((row, index) => {
                const key = getKey(row);
                const selected = selectedKeys.includes(key);
                return (
                  <tr key={key} data-selected={selected ? '' : undefined}>
                    {selectable ? (
                      <td className="lg-table__selection">
                        <Checkbox
                          aria-label={labels.selectRow}
                          checked={selected}
                          onCheckedChange={() => setSelectedKeys(toggleKey(selectedKeys, key))}
                        />
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td key={column.key} style={{ textAlign: column.align }}>
                        {column.render
                          ? column.render(row, index)
                          : column.dataIndex != null
                            ? String(row[column.dataIndex] ?? '')
                            : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {paginationEnabled ? (
        <div className="lg-table__pagination">
          <Pagination
            total={sortedData.length}
            pageSize={pageSize}
            current={page}
            onChange={setPage}
            size={size === 'lg' ? 'md' : 'sm'}
          />
        </div>
      ) : null}
    </GlassSurface>
  );
}
