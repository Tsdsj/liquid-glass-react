import type { ReactNode } from 'react';

export interface TimelineItem {
  key: string;
  content: ReactNode;
  time?: ReactNode;
  color?: 'accent' | 'success' | 'warning' | 'danger';
  /** Custom node glyph; defaults to a token-coloured dot. */
  dot?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="lg-timeline">
      {items.map((item, index) => (
        <li key={item.key} className="lg-timeline__item" data-color={item.color}>
          <div className="lg-timeline__rail" aria-hidden="true">
            <span className="lg-timeline__dot">{item.dot}</span>
            {index < items.length - 1 ? <span className="lg-timeline__line" /> : null}
          </div>
          <div className="lg-timeline__body">
            {item.time ? <div className="lg-timeline__time">{item.time}</div> : null}
            <div className="lg-timeline__content">{item.content}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
