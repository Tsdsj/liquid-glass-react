import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../core/utils/cx';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampDate,
  inRange,
  isSameDay,
  orderDates,
} from '../../core/utils/date';
import type { DatePickerLocale } from './locale';
import { CALENDAR_LABELS, MONTH_NAMES, WEEKDAY_NAMES } from './locale';

export interface CalendarProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  today: Date;
  min?: Date;
  max?: Date;
  disabledDate?: (date: Date) => boolean;
  weekStartsOn: 0 | 1;
  locale: DatePickerLocale;
  // Range-highlight extensions (internal, used by RangePicker; single-date
  // DatePicker leaves them undefined and behaves exactly as before).
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  /** Tentative end while the second endpoint is being chosen. */
  previewDate?: Date | null;
  onHover?: (date: Date | null) => void;
  onFocusDate?: (date: Date) => void;
}

function dayLabel(date: Date, locale: DatePickerLocale): string {
  return locale === 'zh-CN'
    ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    : `${MONTH_NAMES['en-US'][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function Calendar({
  value,
  onSelect,
  today,
  min,
  max,
  disabledDate,
  weekStartsOn,
  locale,
  rangeStart,
  rangeEnd,
  previewDate,
  onHover,
  onFocusDate,
}: CalendarProps) {
  const labels = CALENDAR_LABELS[locale];
  const [focusedDate, setFocusedDate] = useState<Date>(() =>
    clampDate(rangeStart ?? value ?? today, min, max),
  );
  const focusedRef = useRef<HTMLButtonElement | null>(null);

  // Move real focus onto the roving-tabindex day whenever it changes (also on
  // open, so focus enters the grid). Report it so a range picker can preview
  // against the keyboard-focused day too.
  useEffect(() => {
    focusedRef.current?.focus();
    onFocusDate?.(focusedDate);
  }, [focusedDate, onFocusDate]);

  // Ordered [lo, hi] for the active range (committed end, else tentative end).
  const rangeBounds = rangeStart
    ? orderDates(rangeStart, rangeEnd ?? previewDate ?? rangeStart)
    : null;

  const viewYear = focusedDate.getFullYear();
  const viewMonth = focusedDate.getMonth();
  const grid = buildMonthGrid(viewYear, viewMonth, weekStartsOn);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    WEEKDAY_NAMES[locale][(weekStartsOn + i) % 7],
  );
  const title =
    locale === 'zh-CN'
      ? `${viewYear}年${viewMonth + 1}月`
      : `${MONTH_NAMES['en-US'][viewMonth]} ${viewYear}`;

  const isDisabled = (date: Date): boolean =>
    !inRange(date, min, max) || Boolean(disabledDate?.(date));

  const weekStartOffset = (date: Date): number => (date.getDay() - weekStartsOn + 7) % 7;

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(focusedDate, -1);
        break;
      case 'ArrowRight':
        next = addDays(focusedDate, 1);
        break;
      case 'ArrowUp':
        next = addDays(focusedDate, -7);
        break;
      case 'ArrowDown':
        next = addDays(focusedDate, 7);
        break;
      case 'Home':
        next = addDays(focusedDate, -weekStartOffset(focusedDate));
        break;
      case 'End':
        next = addDays(focusedDate, 6 - weekStartOffset(focusedDate));
        break;
      case 'PageUp':
        next = addMonths(focusedDate, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(focusedDate, event.shiftKey ? 12 : 1);
        break;
      // Enter/Space are handled by the focused day <button>'s native click.
      default:
        return;
    }
    event.preventDefault();
    setFocusedDate(next);
  };

  const weeks = Array.from({ length: 6 }, (_, w) => grid.slice(w * 7, w * 7 + 7));

  return (
    <div className="lg-calendar">
      <div className="lg-calendar__header">
        <button
          type="button"
          className="lg-calendar__nav"
          aria-label={labels.prevMonth}
          onClick={() => setFocusedDate(addMonths(focusedDate, -1))}
        >
          ‹
        </button>
        <div className="lg-calendar__title" aria-live="polite">
          {title}
        </div>
        <button
          type="button"
          className="lg-calendar__nav"
          aria-label={labels.nextMonth}
          onClick={() => setFocusedDate(addMonths(focusedDate, 1))}
        >
          ›
        </button>
      </div>
      <table
        role="grid"
        className="lg-calendar__grid"
        onKeyDown={handleKeyDown}
        onPointerLeave={onHover ? () => onHover(null) : undefined}
      >
        <thead>
          <tr>
            {weekdays.map((weekday, index) => (
              <th key={index} scope="col" className="lg-calendar__weekday">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day) => {
                const disabled = isDisabled(day);
                const inSelectedRange = rangeBounds
                  ? inRange(day, rangeBounds[0], rangeBounds[1])
                  : false;
                const isRangeStart = rangeBounds ? isSameDay(day, rangeBounds[0]) : false;
                const isRangeEnd = rangeBounds ? isSameDay(day, rangeBounds[1]) : false;
                const selected = rangeBounds
                  ? isRangeStart || isRangeEnd
                  : value
                    ? isSameDay(day, value)
                    : false;
                const focused = isSameDay(day, focusedDate);
                const isToday = isSameDay(day, today);
                const outside = day.getMonth() !== viewMonth;
                return (
                  <td
                    key={day.getTime()}
                    role="gridcell"
                    aria-selected={selected}
                    className="lg-calendar__cell"
                  >
                    <button
                      ref={focused ? focusedRef : undefined}
                      type="button"
                      className={cx('lg-calendar__day')}
                      tabIndex={focused ? 0 : -1}
                      aria-label={dayLabel(day, locale)}
                      aria-disabled={disabled || undefined}
                      aria-current={isToday ? 'date' : undefined}
                      data-outside={outside ? '' : undefined}
                      data-selected={selected ? '' : undefined}
                      data-today={isToday ? '' : undefined}
                      data-in-range={inSelectedRange && !selected ? '' : undefined}
                      data-range-start={isRangeStart ? '' : undefined}
                      data-range-end={isRangeEnd ? '' : undefined}
                      onPointerEnter={onHover ? () => onHover(day) : undefined}
                      onClick={() => {
                        setFocusedDate(day);
                        if (!disabled) {
                          onSelect(day);
                        }
                      }}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
