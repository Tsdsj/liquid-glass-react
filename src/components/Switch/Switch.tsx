import {
  forwardRef,
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import { cx } from '../../core/utils/cx';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

interface SwitchThumbStyle extends CSSProperties {
  '--lg-r': string;
}

const THUMB_STYLE: SwitchThumbStyle = {
  '--lg-r': 'var(--lg-radius-full)',
};

const SWITCH_KEYS = new Set([' ', 'Spacebar']);

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = 'md',
    className,
    style,
    disabled,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onBlur,
    ...rest
  },
  ref,
) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentChecked, setCurrentChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentChecked(event.currentTarget.checked);
  };

  const handlePointerDown = (event: PointerEvent<HTMLInputElement>) => {
    onPointerDown?.(event);
    if (!disabled) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setIsInteracting(true);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLInputElement>) => {
    onPointerUp?.(event);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    setIsInteracting(false);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLInputElement>) => {
    onPointerCancel?.(event);
    setIsInteracting(false);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLInputElement>) => {
    onPointerLeave?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (!disabled && SWITCH_KEYS.has(event.key)) {
      setIsInteracting(true);
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(event);
    if (SWITCH_KEYS.has(event.key)) {
      setIsInteracting(false);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    setIsInteracting(false);
  };

  useEffect(() => {
    if (disabled) {
      setIsInteracting(false);
    }
  }, [disabled]);

  return (
    <label
      className={cx('lg-switch', className)}
      style={style}
      data-size={size}
      data-checked={currentChecked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        role="switch"
        checked={currentChecked}
        disabled={disabled}
        onChange={handleChange}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        className="lg-switch__input"
      />
      <span className="lg-switch__track" aria-hidden="true">
        <GlassSurface
          refraction="off"
          className="lg-switch__thumb"
          style={THUMB_STYLE}
          data-interacting={isInteracting ? '' : undefined}
        />
      </span>
    </label>
  );
});
