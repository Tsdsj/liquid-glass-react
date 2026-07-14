import {
  forwardRef,
  Fragment,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

const NAV_LABEL = {
  'zh-CN': '面包屑',
  'en-US': 'Breadcrumb',
} as const;

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = '/' },
  ref,
) {
  const { locale } = useLiquidGlassContext();

  return (
    <nav ref={ref} aria-label={NAV_LABEL[locale]} className="lg-breadcrumb">
      <ol className="lg-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          let content: ReactNode;
          if (isLast) {
            content = (
              <span className="lg-breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            );
          } else if (item.href != null) {
            content = (
              <a className="lg-breadcrumb__link" href={item.href} onClick={item.onClick}>
                {item.label}
              </a>
            );
          } else if (item.onClick) {
            content = (
              <button type="button" className="lg-breadcrumb__link" onClick={item.onClick}>
                {item.label}
              </button>
            );
          } else {
            content = <span className="lg-breadcrumb__text">{item.label}</span>;
          }

          return (
            <Fragment key={index}>
              <li className="lg-breadcrumb__item">{content}</li>
              {isLast ? null : (
                <li className="lg-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
});
