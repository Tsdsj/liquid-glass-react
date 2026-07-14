import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders a progressbar with clamped aria values and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={42} aria-label="upload" />);

    const bar = screen.getByRole('progressbar', { name: 'upload' });
    expect(ref.current).toBe(bar);
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps out-of-range values', () => {
    const { rerender } = render(<Progress value={150} aria-label="p" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<Progress value={-20} aria-label="p" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows the percentage text when showValue is set', () => {
    render(<Progress value={42} showValue aria-label="p" />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('omits aria-valuenow while indeterminate', () => {
    render(<Progress indeterminate aria-label="p" />);
    const bar = screen.getByRole('progressbar', { name: 'p' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate');
  });

  it('degrades the indeterminate animation under reduced motion', () => {
    const css = readFileSync('src/components/Progress/progress.css', 'utf8');
    const reduced = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}/.exec(css);
    expect(reduced).not.toBeNull();
    expect(reduced?.[1]).toMatch(/animation:\s*none/);
  });
});
