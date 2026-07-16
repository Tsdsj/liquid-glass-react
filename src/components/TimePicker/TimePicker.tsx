import { useRef, useState, type KeyboardEvent } from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import {
  buildTimeColumn,
  clampTime,
  formatTime,
  parseTime,
  type TimeFormat,
} from '../../core/utils/time';
import { Input } from '../Input';

export interface TimePickerProps {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  format?: TimeFormat;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  min?: string;
  max?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  locale?: 'zh-CN' | 'en-US';
  'aria-label'?: string;
}

const COLUMN_LABEL = {
  'zh-CN': { hours: '小时', minutes: '分钟', seconds: '秒' },
  'en-US': { hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
} as const;

const TIME_TRANSITION_DURATION = 350;
const TIME_MIDDLEWARE = [offset(8), flip(), shift({ padding: 8 })];

type ColumnKey = 'hours' | 'minutes' | 'seconds';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  format = 'HH:mm',
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  min,
  max,
  placeholder,
  size = 'md',
  disabled = false,
  locale: localeProp,
  'aria-label': ariaLabel,
}: TimePickerProps) {
  const context = useLiquidGlassContext();
  const locale = localeProp ?? context.locale;
  const columnLabels = COLUMN_LABEL[locale];
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const { refs, floatingStyles, context: floating } = useFloating({
    open: disabled ? false : open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: TIME_MIDDLEWARE,
    whileElementsMounted: autoUpdate,
    transform: false,
  });
  const click = useClick(floating, { enabled: !disabled });
  const dismiss = useDismiss(floating);
  const role = useRole(floating, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const { isMounted, status } = useTransitionStatus(floating, {
    duration: TIME_TRANSITION_DURATION,
  });

  const parts = parseTime(value ?? '', format) ?? { hours: 0, minutes: 0, seconds: 0 };
  const withSeconds = format === 'HH:mm:ss';

  const columns: Array<{ key: ColumnKey; label: string; values: number[] }> = [
    { key: 'hours', label: columnLabels.hours, values: buildTimeColumn(24, hourStep) },
    { key: 'minutes', label: columnLabels.minutes, values: buildTimeColumn(60, minuteStep) },
    ...(withSeconds
      ? [{ key: 'seconds' as ColumnKey, label: columnLabels.seconds, values: buildTimeColumn(60, secondStep) }]
      : []),
  ];

  const commit = (key: ColumnKey, columnValue: number) => {
    const next = { ...parts, [key]: columnValue };
    setValue(clampTime(formatTime(next, format), min, max, format));
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    column: { key: ColumnKey; values: number[] },
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown') {
      nextIndex = Math.min(column.values.length - 1, index + 1);
    } else if (event.key === 'ArrowUp') {
      nextIndex = Math.max(0, index - 1);
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = column.values.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    const nextValue = column.values[nextIndex];
    optionRefs.current.get(`${column.key}-${nextValue}`)?.focus();
    commit(column.key, nextValue);
  };

  return (
    <>
      <Input
        ref={refs.setReference}
        {...getReferenceProps()}
        role="combobox"
        readOnly
        value={value ?? ''}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        className="lg-time-picker__input"
      />

      {isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating} modal={false}>
            <GlassSurface
              {...getFloatingProps()}
              ref={refs.setFloating}
              refraction="auto"
              bezel={16}
              className="lg-time-picker__panel"
              style={floatingStyles}
              data-status={status}
            >
              <div className="lg-time-picker__columns">
                {columns.map((column) => {
                  const activeValue = parts[column.key];
                  const activeIndex = Math.max(0, column.values.indexOf(activeValue));
                  return (
                    <ul
                      key={column.key}
                      role="listbox"
                      aria-label={column.label}
                      className="lg-time-picker__column"
                    >
                      {column.values.map((columnValue, index) => {
                        const selected = columnValue === activeValue;
                        return (
                          <li key={columnValue} role="presentation">
                            <button
                              ref={(element) => {
                                const key = `${column.key}-${columnValue}`;
                                if (element) {
                                  optionRefs.current.set(key, element);
                                } else {
                                  optionRefs.current.delete(key);
                                }
                              }}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              tabIndex={index === activeIndex ? 0 : -1}
                              className="lg-time-picker__option"
                              data-selected={selected ? '' : undefined}
                              onClick={() => commit(column.key, columnValue)}
                              onKeyDown={(event) => handleOptionKeyDown(event, column, index)}
                            >
                              {pad2(columnValue)}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  );
                })}
              </div>
            </GlassSurface>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
