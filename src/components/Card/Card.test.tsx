import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlassSurface } from '../../core/GlassSurface';
import { Card } from './Card';

describe('Card', () => {
  it('renders a glass surface with children, className, ref and default padding', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} className="custom-card" data-testid="card">
        Body
      </Card>,
    );

    const host = screen.getByTestId('card');
    expect(host).toHaveClass('lg-surface', 'lg-card');
    expect(host).toHaveTextContent('Body');
    expect(host).toHaveAttribute('data-padding', 'md');
    expect(ref.current).toBe(host);
  });

  it('passes material, dim and interactive through to the glass surface', () => {
    render(
      <Card data-testid="card" material="clear" dim interactive padding="lg">
        Body
      </Card>,
    );

    const host = screen.getByTestId('card');
    expect(host).toHaveAttribute('data-material', 'clear');
    expect(host).toHaveAttribute('data-dim');
    expect(host).toHaveAttribute('data-interactive');
    expect(host).toHaveAttribute('data-padding', 'lg');
  });

  it('honours the as prop for the semantic host', () => {
    render(
      <Card as="section" data-testid="card">
        Body
      </Card>,
    );
    expect(screen.getByTestId('card').tagName).toBe('SECTION');
  });

  it('marks nested glass surfaces so the engine disables their refraction', () => {
    render(
      <Card data-testid="card">
        <GlassSurface data-testid="inner">Inner</GlassSurface>
      </Card>,
    );
    expect(screen.getByTestId('inner')).toHaveAttribute('data-nested');
  });
});
