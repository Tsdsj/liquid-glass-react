'use client';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../system/utils.js';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner radius in CSS px. Children marked `Concentric` derive their radius from it. */
  radius?: number;
  /** Inner padding in CSS px. This is also the inset a concentric child subtracts. */
  padding?: number;
  /**
   * `grouped` (default) is the card-on-a-grouped-background pairing used by settings and
   * feed layouts; `plain` sits directly on the app background.
   */
  fill?: 'grouped' | 'plain' | 'secondary';
  /** A resting shadow. Cards are content, so this stays subtle — it is not a glass lift. */
  raised?: boolean;
}

/**
 * A content-layer container. Deliberately not glass: Liquid Glass belongs to the floating
 * control and navigation layer, and a page full of translucent cards is the single most
 * common way an interface stops looking like Apple's. Cards use solid grouped backgrounds
 * so the material above them has something to refract.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { radius = 26, padding = 16, fill = 'grouped', raised = false, className, style, children, ...props }, ref,
) {
  return <div {...props} ref={ref} className={cx('lg-card', className)} data-fill={fill} data-raised={raised ? 'true' : undefined}
    style={{ '--lg-radius-container': `${radius}px`, '--lg-concentric-inset': `${padding}px`, padding: `${padding}px`, borderRadius: `${radius}px`, ...style } as CSSProperties}>
    {children}
  </div>;
});

export interface ConcentricProps extends HTMLAttributes<HTMLDivElement> {
  /** Fallback radius for when this element also appears outside a container. */
  minimum?: number;
}
/**
 * Gives a nested element a radius concentric with its container: container radius minus the
 * padding between them, so both corners share a centre of curvature. Getting this wrong is
 * visible — too large reads as a pinched corner, too small as a flared one. Resolved in CSS
 * from the container's own custom properties, so it survives a retune of the radius scale.
 */
export const Concentric = forwardRef<HTMLDivElement, ConcentricProps>(function Concentric(
  { minimum = 0, className, style, children, ...props }, ref,
) {
  return <div {...props} ref={ref} className={cx('lg-concentric', className)}
    style={{ '--lg-concentric-min': `${minimum}px`, ...style } as CSSProperties}>{children}</div>;
});
