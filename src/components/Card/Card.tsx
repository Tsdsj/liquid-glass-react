import {
  forwardRef,
  type ElementType,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { cx } from '../../core/utils/cx';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  material?: 'regular' | 'clear';
  dim?: boolean;
  radius?: number | string;
  interactive?: boolean;
  children: ReactNode;
}

// Cards read as a larger, softer pane than controls, so the refraction bezel is
// widened past the GlassSurface default.
const CARD_BEZEL = 16;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    as = 'div',
    padding = 'md',
    material = 'regular',
    dim = false,
    radius,
    interactive = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <GlassSurface
      {...rest}
      as={as}
      ref={ref as ForwardedRef<HTMLElement>}
      refraction="auto"
      bezel={CARD_BEZEL}
      material={material}
      dim={dim}
      radius={radius}
      interactive={interactive}
      className={cx('lg-card', className)}
      data-padding={padding}
    >
      {children}
    </GlassSurface>
  );
});
