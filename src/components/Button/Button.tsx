import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ForwardedRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { cx } from '../../core/utils/cx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glass' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

interface ButtonStyle extends CSSProperties {
  '--lg-r'?: string;
}

export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'glass',
    size = 'md',
    loading = false,
    icon,
    className,
    style,
    children,
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };
  const buttonStyle: ButtonStyle = {
    '--lg-r': 'var(--lg-button-radius)',
    ...style,
  };
  const nativeProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    ...rest,
    disabled,
    onClick: handleClick,
    'aria-busy': loading ? true : rest['aria-busy'],
  };

  return (
    <GlassSurface
      {...nativeProps}
      as="button"
      ref={ref as ForwardedRef<HTMLElement>}
      refraction={variant === 'ghost' ? 'off' : 'auto'}
      interactive={!disabled && !loading}
      className={cx('lg-button', className)}
      style={buttonStyle}
      data-variant={variant}
      data-size={size}
      data-loading={loading ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {loading || icon ? (
        <span className="lg-button__icon" aria-hidden="true">
          {loading ? <span className="lg-button__spinner lg-spin__ring" /> : icon}
        </span>
      ) : null}
      <span className="lg-button__label">{children}</span>
    </GlassSurface>
  );
});
