import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  it('opens hour/minute columns and commits a picked value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimePicker aria-label="时间" onChange={onChange} />);

    await user.click(screen.getByLabelText('时间'));
    const hours = screen.getByRole('listbox', { name: '小时' });
    const minutes = screen.getByRole('listbox', { name: '分钟' });
    expect(within(hours).getAllByRole('option').length).toBe(24);
    expect(within(minutes).getAllByRole('option').length).toBe(60);

    await user.click(within(hours).getByRole('option', { name: '09' }));
    expect(onChange).toHaveBeenLastCalledWith('09:00');
    await user.click(within(minutes).getByRole('option', { name: '30' }));
    expect(onChange).toHaveBeenLastCalledWith('09:30');
  });

  it('renders a controlled value with the given format', () => {
    render(<TimePicker aria-label="时间" value="14:05:30" format="HH:mm:ss" />);
    expect(screen.getByLabelText('时间')).toHaveValue('14:05:30');
  });

  it('steps within a column with arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimePicker aria-label="时间" value="09:30" onChange={onChange} />);

    await user.click(screen.getByLabelText('时间'));
    const hours = screen.getByRole('listbox', { name: '小时' });
    within(hours).getByRole('option', { name: '09' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('10:30');
  });

  it('clamps a selection outside the min/max window', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimePicker aria-label="时间" min="09:00" max="18:00" onChange={onChange} />);

    await user.click(screen.getByLabelText('时间'));
    const hours = screen.getByRole('listbox', { name: '小时' });
    await user.click(within(hours).getByRole('option', { name: '07' }));
    expect(onChange).toHaveBeenLastCalledWith('09:00');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<TimePicker aria-label="时间" value="09:30" />);
    await user.click(screen.getByLabelText('时间'));
    expect(screen.getByRole('listbox', { name: '小时' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { name: '小时' })).not.toBeInTheDocument(),
    );
  });
});
