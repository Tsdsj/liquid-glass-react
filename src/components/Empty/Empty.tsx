import type { ReactNode } from 'react';
import { cx } from '../../core/utils/cx';

export interface EmptyProps {
  image?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Empty({ image, title, description, children, className }: EmptyProps) {
  return (
    <div className={cx('lg-empty', className)}>
      <div className="lg-empty__image" aria-hidden="true">
        {image ?? '📭'}
      </div>
      {title ? <p className="lg-empty__title">{title}</p> : null}
      {description ? <p className="lg-empty__description">{description}</p> : null}
      {children ? <div className="lg-empty__action">{children}</div> : null}
    </div>
  );
}
