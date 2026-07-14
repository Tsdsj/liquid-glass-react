import { forwardRef, useEffect, type ForwardedRef, type ReactNode } from 'react';
import { useRadioGroupContext } from './RadioGroupContext';

export interface RadioProps {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, disabled: itemDisabled = false, children },
  forwardedRef,
) {
  const group = useRadioGroupContext();
  const disabled = group.disabled || itemDisabled;
  const checked = group.value === value;
  const tabbable = group.rovingValue === value;

  const { register } = group;
  useEffect(() => register(value, disabled), [register, value, disabled]);

  return (
    <label
      className="lg-radio"
      data-size={group.size}
      data-checked={checked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        ref={forwardedRef}
        type="radio"
        className="lg-radio__input"
        name={group.name}
        value={value}
        checked={checked}
        disabled={disabled}
        tabIndex={tabbable ? 0 : -1}
        onChange={() => group.onSelect(value)}
      />
      <span className="lg-radio__circle" aria-hidden="true">
        <span className="lg-radio__dot" />
      </span>
      {children != null ? <span className="lg-radio__label">{children}</span> : null}
    </label>
  );
});
