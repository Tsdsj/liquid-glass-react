import {
  forwardRef,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  'aria-label'?: string;
}

interface SliderStyle extends CSSProperties {
  '--lg-slider-progress': string;
}

interface SliderThumbStyle extends CSSProperties {
  '--lg-r': string;
}

const THUMB_STYLE: SliderThumbStyle = {
  '--lg-r': 'var(--lg-radius-full)',
};

const CHANGE_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
]);

function calculateProgress(value: number, min: number, max: number): number {
  const range = max - min;
  if (range <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, ((value - min) / range) * 100));
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? min,
    onChange,
  });
  const interactionValueRef = useRef(currentValue);
  interactionValueRef.current = currentValue;

  const progress = calculateProgress(currentValue, min, max);
  const sliderStyle: SliderStyle = {
    '--lg-slider-progress': `${progress}%`,
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    const nextValue = Number(event.currentTarget.value);
    interactionValueRef.current = nextValue;
    setCurrentValue(nextValue);
  };

  const handlePointerUp = (_event: PointerEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChangeEnd?.(interactionValueRef.current);
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!disabled && CHANGE_KEYS.has(event.key)) {
      onChangeEnd?.(interactionValueRef.current);
    }
  };

  return (
    <div
      className="lg-slider"
      style={sliderStyle}
      data-size={size}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={handleChange}
        onPointerUp={handlePointerUp}
        onKeyUp={handleKeyUp}
        className="lg-slider__input"
      />
      <span className="lg-slider__track" aria-hidden="true">
        <span className="lg-slider__fill" />
      </span>
      <GlassSurface
        refraction="off"
        className="lg-slider__thumb"
        style={THUMB_STYLE}
        aria-hidden="true"
      />
    </div>
  );
});
