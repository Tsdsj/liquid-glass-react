import { forwardRef, type CSSProperties } from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: number | string;
  height?: number | string;
  lines?: number;
  animated?: boolean;
}

function toDimension(value: number | string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines = 1, animated = true },
  ref,
) {
  const dimensionStyle: CSSProperties = {
    width: toDimension(width),
    height: toDimension(height),
  };

  return (
    <div
      ref={ref}
      className="lg-skeleton"
      aria-hidden="true"
      data-variant={variant}
      data-animated={animated ? '' : undefined}
    >
      {variant === 'text' ? (
        Array.from({ length: Math.max(1, lines) }, (_, index) => (
          <span
            key={index}
            className="lg-skeleton__line"
            data-last={index === lines - 1 && lines > 1 ? '' : undefined}
            style={index === 0 ? dimensionStyle : { height: dimensionStyle.height }}
          />
        ))
      ) : (
        <span className="lg-skeleton__block" style={dimensionStyle} />
      )}
    </div>
  );
});
