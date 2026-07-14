import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { cx } from '../../core/utils/cx';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

const REMOVE_LABEL = {
  'zh-CN': '移除',
  'en-US': 'Remove',
} as const;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { color = 'default', closable = false, onClose, icon, size = 'md', className, children, ...rest },
  ref,
) {
  const { locale } = useLiquidGlassContext();

  return (
    <span
      {...rest}
      ref={ref}
      className={cx('lg-tag', className)}
      data-color={color}
      data-size={size}
    >
      {icon != null ? (
        <span className="lg-tag__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="lg-tag__label">{children}</span>
      {closable ? (
        <button
          type="button"
          className="lg-tag__close"
          aria-label={REMOVE_LABEL[locale]}
          onClick={onClose}
        >
          <span className="lg-tag__close-icon" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
});
