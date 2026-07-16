import { useRef, useState, type KeyboardEvent } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { useControllableState } from '../../core/hooks/useControllableState';

export interface RateProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Number of stars. */
  count?: number;
  disabled?: boolean;
  /** Display-only: renders as a text-alternative image instead of radios. */
  readOnly?: boolean;
  'aria-label'?: string;
}

const STAR_LABEL = {
  'zh-CN': (n: number) => `${n} 星`,
  'en-US': (n: number) => `${n} star${n > 1 ? 's' : ''}`,
} as const;

export function Rate({
  value: valueProp,
  defaultValue,
  onChange,
  count = 5,
  disabled = false,
  readOnly = false,
  'aria-label': ariaLabel,
}: RateProps) {
  const { locale } = useLiquidGlassContext();
  const [value, setValue] = useControllableState<number>({
    value: valueProp,
    defaultValue: defaultValue ?? 0,
    onChange,
  });
  const [hovered, setHovered] = useState<number | null>(null);
  const starsRef = useRef<Array<HTMLButtonElement | null>>([]);

  if (readOnly) {
    return (
      <span
        className="lg-rate"
        role="img"
        aria-label={`${ariaLabel ?? ''}${ariaLabel ? ':' : ''}${value} / ${count}`}
        data-readonly=""
      >
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className="lg-rate__star"
            data-filled={index < value ? '' : undefined}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </span>
    );
  }

  const pick = (next: number) => {
    if (disabled) {
      return;
    }
    // Picking the current value again clears the rating.
    setValue(next === value ? 0 : next);
  };

  const move = (event: KeyboardEvent<HTMLElement>, delta: 1 | -1) => {
    event.preventDefault();
    const next = Math.min(count, Math.max(1, (value || 1) + delta));
    setValue(next);
    starsRef.current[next - 1]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      move(event, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      move(event, -1);
    }
  };

  const display = hovered ?? value;
  // Roving tabindex: the checked star (or the first) is the single tab stop.
  const tabStop = value > 0 ? value - 1 : 0;

  return (
    <span
      className="lg-rate"
      role="radiogroup"
      aria-label={ariaLabel}
      data-disabled={disabled ? '' : undefined}
      onKeyDown={handleKeyDown}
      onPointerLeave={() => setHovered(null)}
    >
      {Array.from({ length: count }, (_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            ref={(element) => {
              starsRef.current[index] = element;
            }}
            type="button"
            role="radio"
            className="lg-rate__star"
            aria-checked={value === starValue}
            aria-label={STAR_LABEL[locale](starValue)}
            tabIndex={index === tabStop ? 0 : -1}
            disabled={disabled}
            data-filled={starValue <= display ? '' : undefined}
            onPointerEnter={() => !disabled && setHovered(starValue)}
            onClick={() => pick(starValue)}
          >
            ★
          </button>
        );
      })}
    </span>
  );
}
