import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders content, className, ref, native attributes and default data attributes', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Tag ref={ref} className="custom-tag" title="hint">
        React
      </Tag>,
    );

    const tag = screen.getByText('React').closest('.lg-tag');
    expect(tag).toHaveClass('lg-tag', 'custom-tag');
    expect(tag).toHaveAttribute('title', 'hint');
    expect(tag).toHaveAttribute('data-color', 'default');
    expect(tag).toHaveAttribute('data-size', 'md');
    expect(ref.current).toBe(tag);
  });

  it('maps color and size to data attributes', () => {
    render(
      <Tag color="success" size="sm">
        Done
      </Tag>,
    );
    const tag = screen.getByText('Done').closest('.lg-tag');
    expect(tag).toHaveAttribute('data-color', 'success');
    expect(tag).toHaveAttribute('data-size', 'sm');
  });

  it('renders an icon when provided', () => {
    render(<Tag icon={<span data-testid="tag-icon">★</span>}>Starred</Tag>);
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });

  it('renders no close button unless closable', () => {
    render(<Tag>Plain</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a close button with the localized aria-label and fires onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        Removable
      </Tag>,
    );

    const close = screen.getByRole('button', { name: '移除' });
    await user.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('localizes the close label to English via config', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <Tag closable>Removable</Tag>
      </LiquidGlassConfig>,
    );
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });
});
