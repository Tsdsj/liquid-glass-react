import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type ForwardedRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../core/hooks/useControllableState';
import { cx } from '../../core/utils/cx';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

function assignRef(ref: ForwardedRef<HTMLInputElement>, value: HTMLInputElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const Checkbox = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    indeterminate = false,
    size = 'md',
    children,
    className,
    style,
    disabled,
    ...rest
  },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentChecked, setCurrentChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentChecked(event.currentTarget.checked);
    event.currentTarget.indeterminate = indeterminate;
  };

  return (
    <label
      className={cx('lg-checkbox', className)}
      style={style}
      data-size={size}
      data-checked={currentChecked ? '' : undefined}
      data-indeterminate={indeterminate ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        {...rest}
        ref={setInputRef}
        type="checkbox"
        checked={currentChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : rest['aria-checked']}
        onChange={handleChange}
        className="lg-checkbox__input"
      />
      <span className="lg-checkbox__box" aria-hidden="true">
        <svg className="lg-checkbox__icon" viewBox="0 0 18 18">
          <polyline className="lg-checkbox__check" points="3.5,9 7,12.5 14.5,5" />
          <line className="lg-checkbox__indeterminate" x1="4" y1="9" x2="14" y2="9" />
        </svg>
      </span>
      {children ? <span className="lg-checkbox__label">{children}</span> : null}
    </label>
  );
});
