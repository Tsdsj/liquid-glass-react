import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders an image with alt and forwards its ref and default shape', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} src="/a.png" alt="Ada" />);

    const img = screen.getByRole('img', { name: 'Ada' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/a.png');
    const root = ref.current;
    expect(root).toHaveClass('lg-avatar');
    expect(root).toHaveAttribute('data-shape', 'circle');
    expect(root).toHaveAttribute('data-size', 'md');
  });

  it('falls back to the fallback content when the image fails to load', () => {
    render(<Avatar src="/broken.png" alt="Ada" fallback="AD" />);

    fireEvent.error(screen.getByRole('img', { name: 'Ada' }));

    expect(document.querySelector('img')).toBeNull();
    const fallback = screen.getByText('AD');
    expect(fallback.closest('[role="img"]')).toHaveAttribute('aria-label', 'Ada');
  });

  it('renders a labelled text fallback when there is no src', () => {
    render(<Avatar alt="Grace Hopper" fallback="GH" />);

    const fallback = screen.getByRole('img', { name: 'Grace Hopper' });
    expect(fallback).toHaveTextContent('GH');
    expect(fallback.tagName).not.toBe('IMG');
  });

  it('maps size and shape to data attributes', () => {
    render(<Avatar alt="A" size="lg" shape="square" fallback="A" />);
    const fallback = screen.getByRole('img', { name: 'A' });
    const root = fallback.closest('.lg-avatar');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-shape', 'square');
  });
});
