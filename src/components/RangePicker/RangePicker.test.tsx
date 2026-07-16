import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { isSameDay } from '../../core/utils/date';
import { RangePicker } from './RangePicker';

describe('RangePicker', () => {
  it('opens a grid and picks a start then end, ordering reversed clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RangePicker
        aria-label="日期范围"
        locale="en-US"
        defaultValue={[new Date(2024, 0, 1), null]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Start date'));
    expect(screen.getByRole('grid')).toBeInTheDocument();

    // Click end first (Jan 20), then start earlier (Jan 10) — result is ordered.
    await user.click(screen.getByRole('button', { name: 'January 20, 2024' }));
    await user.click(screen.getByRole('button', { name: 'January 10, 2024' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [start, end] = onChange.mock.calls[0][0] as [Date, Date];
    expect(isSameDay(start, new Date(2024, 0, 10))).toBe(true);
    expect(isSameDay(end, new Date(2024, 0, 20))).toBe(true);
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
  });

  it('fills both inputs from a controlled value', () => {
    render(
      <RangePicker
        aria-label="range"
        locale="en-US"
        value={[new Date(2024, 2, 3), new Date(2024, 2, 9)]}
      />,
    );
    expect(screen.getByLabelText('Start date')).toHaveValue('2024-03-03');
    expect(screen.getByLabelText('End date')).toHaveValue('2024-03-09');
  });

  it('cancels a half-made selection on Escape and keeps the previous value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RangePicker
        aria-label="range"
        locale="en-US"
        defaultValue={[new Date(2024, 0, 5), new Date(2024, 0, 8)]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Start date'));
    await user.click(screen.getByRole('button', { name: 'January 15, 2024' })); // start of a new range
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
    expect(onChange).not.toHaveBeenCalled();
    // Previous value preserved.
    expect(screen.getByLabelText('Start date')).toHaveValue('2024-01-05');
  });
});
