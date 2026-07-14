import {
  forwardRef,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
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

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = 'md',
    className,
    style,
    disabled,
    ...rest
  },
  ref,
) {
  const [currentChecked, setCurrentChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentChecked(event.currentTarget.checked);
  };

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
        className="lg-switch__input"
      />
      <span className="lg-switch__track" aria-hidden="true">
        <GlassSurface
          refraction="off"
          className="lg-switch__thumb"
          style={THUMB_STYLE}
        />
      </span>
    </label>
  );
});
