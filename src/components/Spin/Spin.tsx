import {
  forwardRef,
  type ForwardedRef,
  type ReactNode,
} from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';

export interface SpinProps {
  spinning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tip?: ReactNode;
  children?: ReactNode;
}

const LOADING_TEXT = {
  'zh-CN': '加载中',
  'en-US': 'Loading',
} as const;

export const Spin = /* @__PURE__ */ forwardRef<HTMLDivElement, SpinProps>(function Spin(
  { spinning = true, size = 'md', tip, children },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { locale } = useLiquidGlassContext();
  const hasChildren = children != null;

  const indicator = (
    <span role="status" aria-live="polite" className="lg-spin__indicator">
      <span className="lg-spin__ring" aria-hidden="true" />
      {tip != null ? <span className="lg-spin__tip">{tip}</span> : null}
      <span className="lg-spin__sr">{LOADING_TEXT[locale]}</span>
    </span>
  );

  if (hasChildren) {
    return (
      <div
        ref={ref}
        className="lg-spin lg-spin--wrap"
        data-size={size}
        data-spinning={spinning ? '' : undefined}
      >
        <div className="lg-spin__children">{children}</div>
        {spinning ? <div className="lg-spin__overlay">{indicator}</div> : null}
      </div>
    );
  }

  return (
    <div ref={ref} className="lg-spin" data-size={size} data-spinning={spinning ? '' : undefined}>
      {spinning ? indicator : null}
    </div>
  );
});
