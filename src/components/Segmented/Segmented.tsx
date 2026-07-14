import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import { useSlidingIndicator } from '../../core/hooks/useSlidingIndicator';

export interface SegmentedOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

function assignRef(ref: ForwardedRef<HTMLDivElement>, value: HTMLDivElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function firstEnabledValue(options: SegmentedOption[]): string {
  return options.find((option) => !option.disabled)?.value ?? '';
}

export const Segmented = forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  {
    options,
    value,
    defaultValue,
    onChange,
    size = 'md',
    block = false,
    disabled = false,
    'aria-label': ariaLabel,
  },
  forwardedRef,
) {
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabledValue(options),
    onChange,
  });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Runs before the sliding-indicator effect (declared first) so it always
  // measures the button matching the current value.
  useLayoutEffect(() => {
    activeRef.current = buttonsRef.current.get(currentValue) ?? null;
  });
  const indicatorStyle = useSlidingIndicator(rootRef, activeRef);

  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      rootRef.current = element;
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  const select = (nextValue: string) => {
    if (disabled || nextValue === currentValue) {
      return;
    }
    setCurrentValue(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let direction = 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      direction = 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      direction = -1;
    } else {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }
    const buttons = Array.from(
      root.querySelectorAll<HTMLButtonElement>('button[role="radio"]'),
    ).filter((button) => !button.disabled);
    if (buttons.length === 0) {
      return;
    }

    event.preventDefault();
    const currentIndex = buttons.findIndex((button) => button === event.target);
    const startIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (startIndex + direction + buttons.length) % buttons.length;
    const nextButton = buttons[nextIndex];
    nextButton.focus();
    select(nextButton.value);
  };

  return (
    <div
      ref={setRootRef}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled ? true : undefined}
      className="lg-segmented"
      data-size={size}
      data-block={block ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onKeyDown={handleKeyDown}
    >
      <GlassSurface
        aria-hidden="true"
        interactive
        className="lg-segmented__thumb"
        style={indicatorStyle ?? undefined}
        data-hidden={indicatorStyle ? undefined : ''}
      />
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled;
        const selected = option.value === currentValue;
        return (
          <button
            key={option.value}
            ref={(element) => {
              if (element) {
                buttonsRef.current.set(option.value, element);
              } else {
                buttonsRef.current.delete(option.value);
              }
            }}
            type="button"
            role="radio"
            value={option.value}
            aria-checked={selected}
            disabled={optionDisabled}
            tabIndex={selected ? 0 : -1}
            className="lg-segmented__option"
            data-selected={selected ? '' : undefined}
            onClick={() => select(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
});
