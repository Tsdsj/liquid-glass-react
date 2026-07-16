import { useState, type KeyboardEvent } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { useControllableState } from '../../core/hooks/useControllableState';
import { Input } from '../Input';
import { applyPrecision, clampNumber, parseNumericInput, stepValue } from './input-number-utils';

export interface InputNumberProps {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places committed values are rounded to. */
  precision?: number;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  'aria-label'?: string;
}

const STEP_LABEL = {
  'zh-CN': { up: '增加', down: '减少' },
  'en-US': { up: 'Increase', down: 'Decrease' },
} as const;

export function InputNumber({
  value: valueProp,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  precision,
  placeholder,
  size = 'md',
  disabled = false,
  'aria-label': ariaLabel,
}: InputNumberProps) {
  const { locale } = useLiquidGlassContext();
  const labels = STEP_LABEL[locale];
  const [value, setValue] = useControllableState<number | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    onChange,
  });
  // Free-typing draft; cleared on commit so display re-derives from the value.
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? (value == null ? '' : String(value));

  const commitText = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '') {
      setValue(null);
      setDraft(null);
      return;
    }
    const parsed = parseNumericInput(trimmed);
    if (parsed === null) {
      // Invalid text reverts to the last valid value.
      setDraft(null);
      return;
    }
    setValue(clampNumber(applyPrecision(parsed, precision), min, max));
    setDraft(null);
  };

  const stepBy = (direction: 1 | -1) => {
    if (disabled) {
      return;
    }
    const base = draft !== null ? parseNumericInput(draft) : value;
    setValue(stepValue(base ?? value, direction, step, min, max, precision));
    setDraft(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      stepBy(-1);
    } else if (event.key === 'Enter') {
      commitText(event.currentTarget.value);
    }
  };

  return (
    <span className="lg-input-number" data-size={size}>
      <Input
        role="spinbutton"
        inputMode="decimal"
        autoComplete="off"
        aria-label={ariaLabel}
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        value={display}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commitText(event.target.value)}
        onKeyDown={handleKeyDown}
        suffix={
          <span className="lg-input-number__steppers">
            <button
              type="button"
              className="lg-input-number__step"
              aria-label={labels.up}
              tabIndex={-1}
              disabled={disabled}
              onClick={() => stepBy(1)}
            >
              <span className="lg-input-number__arrow" data-direction="up" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lg-input-number__step"
              aria-label={labels.down}
              tabIndex={-1}
              disabled={disabled}
              onClick={() => stepBy(-1)}
            >
              <span className="lg-input-number__arrow" data-direction="down" aria-hidden="true" />
            </button>
          </span>
        }
      />
    </span>
  );
}
