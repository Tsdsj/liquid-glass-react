import type { ReactNode } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { GlassSurface } from '../../core/GlassSurface';

export type AlertKind = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  kind?: AlertKind;
  title?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode | false;
  children?: ReactNode;
}

const DEFAULT_ICONS: Record<AlertKind, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  danger: '⛔',
};

const CLOSE_LABEL = { 'zh-CN': '关闭', 'en-US': 'Close' } as const;

export function Alert({
  kind = 'info',
  title,
  closable = false,
  onClose,
  icon,
  children,
}: AlertProps) {
  const { locale } = useLiquidGlassContext();
  // warning/danger are assertive; info/success are polite status updates.
  const role = kind === 'warning' || kind === 'danger' ? 'alert' : 'status';
  const iconNode = icon === false ? null : (icon ?? DEFAULT_ICONS[kind]);

  return (
    <GlassSurface as="div" className="lg-alert" data-kind={kind} role={role}>
      {iconNode !== null ? (
        <span className="lg-alert__icon" aria-hidden="true">
          {iconNode}
        </span>
      ) : null}
      <div className="lg-alert__body">
        {title ? <div className="lg-alert__title">{title}</div> : null}
        {children ? <div className="lg-alert__content">{children}</div> : null}
      </div>
      {closable ? (
        <button
          type="button"
          className="lg-alert__close"
          aria-label={CLOSE_LABEL[locale]}
          onClick={onClose}
        >
          ×
        </button>
      ) : null}
    </GlassSurface>
  );
}
