import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Rate } from './Rate';

describe('Rate', () => {
  it('renders count radios and picks a value on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rate aria-label="评分" onChange={onChange} />);

    const group = screen.getByRole('radiogroup', { name: '评分' });
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);

    await user.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
    expect(group).toBeInTheDocument();
  });

  it('clears when clicking the current value again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rate aria-label="评分" defaultValue={3} onChange={onChange} />);

    expect(screen.getAllByRole('radio')[2]).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getAllByRole('radio')[2]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('moves and selects with arrow keys like a radio group', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rate aria-label="评分" defaultValue={2} onChange={onChange} />);

    screen.getAllByRole('radio')[1].focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(3);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('is read-only as a text alternative image', () => {
    render(<Rate aria-label="评分" value={4} readOnly />);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: '评分:4 / 5' })).toBeInTheDocument();
  });

  it('ignores interaction when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Rate aria-label="评分" defaultValue={2} disabled onChange={onChange} />);

    await user.click(screen.getAllByRole('radio')[4]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
