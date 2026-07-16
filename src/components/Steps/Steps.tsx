import type { ReactNode } from 'react';

export interface StepItem {
  key: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface StepsProps {
  items: StepItem[];
  current?: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function Steps({ items, current = 0, direction = 'horizontal', size = 'md' }: StepsProps) {
  return (
    <ol className="lg-steps" data-direction={direction} data-size={size}>
      {items.map((item, index) => {
        const status = index < current ? 'finish' : index === current ? 'process' : 'wait';
        return (
          <li
            key={item.key}
            className="lg-steps__item"
            data-status={status}
            aria-current={status === 'process' ? 'step' : undefined}
          >
            <div className="lg-steps__rail" aria-hidden="true">
              <span className="lg-steps__indicator">{status === 'finish' ? '✓' : index + 1}</span>
              {index < items.length - 1 ? <span className="lg-steps__line" /> : null}
            </div>
            <div className="lg-steps__text">
              <div className="lg-steps__title">{item.title}</div>
              {item.description ? (
                <div className="lg-steps__description">{item.description}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
