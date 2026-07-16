import { useEffect, useState } from 'react';
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
import { formatDate, orderDates } from '../../core/utils/date';
import { Calendar } from '../DatePicker/Calendar';
import type { DatePickerLocale } from '../DatePicker/locale';
import { Input } from '../Input';

export type DateRange = [Date | null, Date | null];

export interface RangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (date: Date) => boolean;
  format?: string;
  weekStartsOn?: 0 | 1;
  placeholder?: [string, string];
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  locale?: DatePickerLocale;
  'aria-label'?: string;
}

const RANGE_LABEL = {
  'zh-CN': { start: '起始日期', end: '结束日期' },
  'en-US': { start: 'Start date', end: 'End date' },
} as const;

const RANGE_TRANSITION_DURATION = 350;
const RANGE_MIDDLEWARE = [offset(8), flip(), shift({ padding: 8 })];

export function RangePicker({
  value: valueProp,
  defaultValue,
  onChange,
  min,
  max,
  disabledDate,
  format = 'YYYY-MM-DD',
  weekStartsOn = 1,
  placeholder,
  size = 'md',
  disabled = false,
  locale: localeProp,
  'aria-label': ariaLabel,
}: RangePickerProps) {
  const context = useLiquidGlassContext();
  const locale = localeProp ?? context.locale;
  const labels = RANGE_LABEL[locale];
  const [value, setValue] = useControllableState<DateRange>({
    value: valueProp,
    defaultValue: defaultValue ?? [null, null],
    onChange,
  });
  const [open, setOpen] = useState(false);
  // The first-clicked endpoint while a new range is being made; null when idle.
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [preview, setPreview] = useState<Date | null>(null);
  const today = new Date();

  const { refs, floatingStyles, context: floating } = useFloating({
    open: disabled ? false : open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: RANGE_MIDDLEWARE,
    whileElementsMounted: autoUpdate,
    transform: false,
  });
  const click = useClick(floating, { enabled: !disabled });
  const dismiss = useDismiss(floating);
  const role = useRole(floating, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const { isMounted, status } = useTransitionStatus(floating, {
    duration: RANGE_TRANSITION_DURATION,
  });

  // Fresh selection each time the panel opens.
  useEffect(() => {
    if (open) {
      setPendingStart(null);
      setPreview(null);
    }
  }, [open]);

  const handleSelect = (date: Date) => {
    if (pendingStart === null) {
      setPendingStart(date);
      setPreview(date);
      return;
    }
    const ordered = orderDates(pendingStart, date);
    setValue(ordered);
    setOpen(false);
  };

  const fmt = (date: Date | null) => (date ? formatDate(date, format) : '');
  const selecting = pendingStart !== null;

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        role="group"
        aria-label={ariaLabel}
        className="lg-range-picker"
        data-size={size}
        data-disabled={disabled ? '' : undefined}
      >
        <Input
          readOnly
          value={fmt(value[0])}
          aria-label={labels.start}
          placeholder={placeholder?.[0]}
          size={size}
          disabled={disabled}
          className="lg-range-picker__input"
        />
        <span className="lg-range-picker__separator" aria-hidden="true">
          →
        </span>
        <Input
          readOnly
          value={fmt(value[1])}
          aria-label={labels.end}
          placeholder={placeholder?.[1]}
          size={size}
          disabled={disabled}
          className="lg-range-picker__input"
        />
      </div>

      {isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating} modal={false}>
            <GlassSurface
              {...getFloatingProps()}
              ref={refs.setFloating}
              refraction="auto"
              bezel={16}
              className="lg-range-picker__panel"
              style={floatingStyles}
              data-status={status}
            >
              <Calendar
                value={null}
                onSelect={handleSelect}
                today={today}
                min={min}
                max={max}
                disabledDate={disabledDate}
                weekStartsOn={weekStartsOn}
                locale={locale}
                rangeStart={selecting ? pendingStart : value[0]}
                rangeEnd={selecting ? null : value[1]}
                previewDate={selecting ? preview : null}
                onHover={selecting ? setPreview : undefined}
                onFocusDate={selecting ? setPreview : undefined}
              />
            </GlassSurface>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
