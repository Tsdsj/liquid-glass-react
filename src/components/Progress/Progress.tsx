import { forwardRef, type CSSProperties } from 'react';

export interface ProgressProps {
  value?: number;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  'aria-label'?: string;
}

interface ProgressFillStyle extends CSSProperties {
  '--lg-progress-value'?: string;
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, indeterminate = false, size = 'md', showValue = false, 'aria-label': ariaLabel },
  ref,
) {
  const clamped = clamp(value);
  const fillStyle: ProgressFillStyle = { '--lg-progress-value': `${clamped}%` };

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className="lg-progress"
      data-size={size}
      data-indeterminate={indeterminate ? '' : undefined}
    >
      <div className="lg-progress__track">
        <div className="lg-progress__fill" style={indeterminate ? undefined : fillStyle} />
      </div>
      {showValue && !indeterminate ? (
        <span className="lg-progress__value">{clamped}%</span>
      ) : null}
    </div>
  );
});
