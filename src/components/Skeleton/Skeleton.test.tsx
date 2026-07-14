import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a decorative text skeleton with one line by default and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Skeleton ref={ref} />);

    const root = container.querySelector('.lg-skeleton');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-variant', 'text');
    expect(root?.querySelectorAll('.lg-skeleton__line')).toHaveLength(1);
  });

  it('renders the requested number of text lines', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelectorAll('.lg-skeleton__line')).toHaveLength(3);
  });

  it('renders a circle variant as a single block', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const root = container.querySelector('.lg-skeleton');
    expect(root).toHaveAttribute('data-variant', 'circle');
    expect(container.querySelectorAll('.lg-skeleton__line')).toHaveLength(0);
    expect(container.querySelector('.lg-skeleton__block')).toBeInTheDocument();
  });

  it('applies numeric width and height as pixels on rect', () => {
    const { container } = render(<Skeleton variant="rect" width={200} height={80} />);
    expect(container.querySelector('.lg-skeleton__block')).toHaveStyle({
      width: '200px',
      height: '80px',
    });
  });

  it('toggles the animated flag', () => {
    const { container, rerender } = render(<Skeleton />);
    expect(container.querySelector('.lg-skeleton')).toHaveAttribute('data-animated');

    rerender(<Skeleton animated={false} />);
    expect(container.querySelector('.lg-skeleton')).not.toHaveAttribute('data-animated');
  });

  it('freezes the shimmer under reduced motion', () => {
    const css = readFileSync('src/components/Skeleton/skeleton.css', 'utf8');
    const reduced = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}/.exec(css);
    expect(reduced).not.toBeNull();
    expect(reduced?.[1]).toMatch(/animation:\s*none/);
  });
});
