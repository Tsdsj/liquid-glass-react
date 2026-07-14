import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a standalone count with a screen-reader sentence and forwards its ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} count={5} />);

    expect(ref.current).toHaveClass('lg-badge');
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('5 条通知')).toBeInTheDocument();
  });

  it('caps the visible count at max with a plus suffix', () => {
    render(<Badge count={100} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
    expect(screen.getByText('100 条通知')).toBeInTheDocument();
  });

  it('honours a custom max', () => {
    render(<Badge count={10} max={9} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('hides a zero count unless showZero is set', () => {
    const { rerender } = render(<Badge count={0} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();

    rerender(<Badge count={0} showZero />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders a decorative dot with no number', () => {
    render(<Badge dot />);
    const dot = document.querySelector('.lg-badge__dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText(/条通知/)).not.toBeInTheDocument();
  });

  it('wraps children and overlays the badge', () => {
    render(
      <Badge count={3}>
        <button type="button">inbox</button>
      </Badge>,
    );
    expect(screen.getByRole('button', { name: 'inbox' })).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('localizes the screen-reader sentence to English', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <Badge count={2} />
      </LiquidGlassConfig>,
    );
    expect(screen.getByText('2 notifications')).toBeInTheDocument();
  });
});
