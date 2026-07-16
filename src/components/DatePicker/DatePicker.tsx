import { useState } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { useControllableState } from '../../core/hooks/useControllableState';
import { formatDate } from '../../core/utils/date';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { Calendar } from './Calendar';
import type { DatePickerLocale } from './locale';

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (date: Date) => boolean;
  format?: string;
  weekStartsOn?: 0 | 1;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  locale?: DatePickerLocale;
  'aria-label'?: string;
}

export function DatePicker({
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
}: DatePickerProps) {
  const context = useLiquidGlassContext();
  const locale = localeProp ?? context.locale;
  const [value, setValue] = useControllableState<Date | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const today = new Date();

  const handleSelect = (date: Date) => {
    setValue(date);
    setOpen(false);
  };

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={setOpen}
      placement="bottom-start"
      content={
        <Calendar
          value={value}
          onSelect={handleSelect}
          today={today}
          min={min}
          max={max}
          disabledDate={disabledDate}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
      }
    >
      <Input
        // Combobox pattern: the trigger owns aria-haspopup / aria-expanded that
        // Popover's floating-ui role wires on; those are allowed on combobox
        // (not on a plain textbox).
        role="combobox"
        readOnly
        value={value ? formatDate(value, format) : ''}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        aria-label={ariaLabel}
        className="lg-datepicker__input"
      />
    </Popover>
  );
}
