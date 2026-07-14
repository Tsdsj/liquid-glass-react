import {
  forwardRef,
  useCallback,
  useRef,
  type ForwardedRef,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { cx } from '../../core/utils/cx';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: 'sm' | 'md' | 'lg';
  prefix?: ReactNode;
  suffix?: ReactNode;
  invalid?: boolean;
}

function assignRef(ref: ForwardedRef<HTMLInputElement>, value: HTMLInputElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    prefix,
    suffix,
    invalid = false,
    className,
    style,
    disabled,
    ...rest
  },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );
  const handleContainerClick = (event: MouseEvent<HTMLElement>) => {
    if (!disabled && event.target !== inputRef.current) {
      inputRef.current?.focus();
    }
  };

  return (
    <GlassSurface
      refraction="off"
      className={cx('lg-input', className)}
      style={style}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={handleContainerClick}
    >
      {prefix ? <span className="lg-input__prefix">{prefix}</span> : null}
      <input
        {...rest}
        ref={setInputRef}
        disabled={disabled}
        aria-invalid={invalid ? true : rest['aria-invalid']}
        className="lg-input__el"
      />
      {suffix ? <span className="lg-input__suffix">{suffix}</span> : null}
    </GlassSurface>
  );
});
