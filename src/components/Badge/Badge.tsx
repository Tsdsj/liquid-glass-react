import { forwardRef, type ReactNode } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';

export interface BadgeProps {
  count?: number;
  max?: number;
  dot?: boolean;
  showZero?: boolean;
  children?: ReactNode;
}

function notificationSentence(count: number, locale: 'zh-CN' | 'en-US'): string {
  return locale === 'en-US' ? `${count} notifications` : `${count} 条通知`;
}

export const Badge = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { count, max = 99, dot = false, showZero = false, children },
  ref,
) {
  const { locale } = useLiquidGlassContext();
  const hasChildren = children != null;

  const showCount = count != null && (count !== 0 || showZero);
  const isVisible = dot || showCount;

  let indicator: ReactNode = null;
  if (isVisible) {
    if (dot) {
      indicator = <span className="lg-badge__dot" aria-hidden="true" />;
    } else if (count != null) {
      const display = count > max ? `${max}+` : `${count}`;
      indicator = (
        <sup className="lg-badge__count">
          <span aria-hidden="true">{display}</span>
          <span className="lg-badge__sr">{notificationSentence(count, locale)}</span>
        </sup>
      );
    }
  }

  if (hasChildren) {
    return (
      <span ref={ref} className="lg-badge" data-dot={dot ? '' : undefined}>
        <span className="lg-badge__children">{children}</span>
        {indicator}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className="lg-badge lg-badge--standalone"
      data-dot={dot ? '' : undefined}
    >
      {indicator}
    </span>
  );
});
