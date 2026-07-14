import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { ProgressiveBlur } from '../progressive-blur';
import { cx } from '../utils/cx';
import { useScrollEdges } from './useScrollEdges';

export interface ScrollEdgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Extra class merged onto the inner scroll container. */
  viewportClassName?: string;
  /** Props spread onto the inner scroll container. */
  viewportProps?: HTMLAttributes<HTMLDivElement>;
  /**
   * Internal opt-in: render each edge overlay as a layered progressive blur
   * instead of the single-blur scrim. Default false keeps the DOM unchanged.
   */
  progressive?: boolean;
  children?: ReactNode;
}

/**
 * Wraps an internal scroll region and mounts a blurred edge overlay only on the
 * side(s) with hidden content, matching Apple's scroll edge effect. Overlays are
 * conditionally rendered so idle (non-overflowing) regions add no compositing
 * layer. They live inside the surrounding glass surface, whose backdrop-filter /
 * isolation makes it a backdrop root — so each overlay's own blur samples only
 * the panel's scrolled content, never the page behind it (works in every
 * browser, no Chromium-only path).
 */
export function ScrollEdge({
  className,
  viewportClassName,
  viewportProps,
  progressive = false,
  children,
  ...rest
}: ScrollEdgeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const edges = useScrollEdges(viewportRef);

  return (
    <div
      {...rest}
      className={cx('lg-scroll-edge', className)}
      data-edge-top={edges.top ? '' : undefined}
      data-edge-bottom={edges.bottom ? '' : undefined}
    >
      {edges.top ? (
        <div
          className="lg-scroll-edge__overlay"
          data-side="top"
          data-progressive={progressive ? '' : undefined}
          aria-hidden="true"
        >
          {progressive ? <ProgressiveBlur direction="to-top" /> : null}
        </div>
      ) : null}
      <div
        {...viewportProps}
        ref={viewportRef}
        className={cx('lg-scroll-edge__viewport', viewportClassName)}
      >
        {children}
      </div>
      {edges.bottom ? (
        <div
          className="lg-scroll-edge__overlay"
          data-side="bottom"
          data-progressive={progressive ? '' : undefined}
          aria-hidden="true"
        >
          {progressive ? <ProgressiveBlur direction="to-bottom" /> : null}
        </div>
      ) : null}
    </div>
  );
}
