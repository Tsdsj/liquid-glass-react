import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { isSameDay } from '../../core/utils/date';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('opens a date grid on click and shows nothing selected initially', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="日期" placeholder="选择日期" locale="en-US" />);

    const input = screen.getByLabelText('日期');
    expect(input).toHaveValue('');
    await user.click(input);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a day, fires onChange, fills the input and closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        aria-label="date"
        locale="en-US"
        defaultValue={new Date(2024, 0, 15)}
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText('date');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'January 20, 2024' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(isSameDay(onChange.mock.calls[0][0] as Date, new Date(2024, 0, 20))).toBe(true);
    expect(input).toHaveValue('2024-01-20');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
  });

  it('renders a controlled value with the given format', () => {
    render(
      <DatePicker aria-label="date" value={new Date(2024, 2, 9)} format="YYYY/MM/DD" locale="en-US" />,
    );
    expect(screen.getByLabelText('date')).toHaveValue('2024/03/09');
  });

  it('moves focus with arrow keys and selects on Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        aria-label="date"
        locale="en-US"
        defaultValue={new Date(2024, 0, 15)}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('date'));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'January 15, 2024' })).toHaveFocus(),
    );

    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'January 16, 2024' })).toHaveFocus(),
    );
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'January 23, 2024' })).toHaveFocus(),
    );

    await user.keyboard('{Enter}');
    expect(isSameDay(onChange.mock.calls[0][0] as Date, new Date(2024, 0, 23))).toBe(true);
  });

  it('changes month with the header buttons', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="date" locale="en-US" defaultValue={new Date(2024, 0, 15)} />);

    await user.click(screen.getByLabelText('date'));
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('February 2024')).toBeInTheDocument();
  });

  it('marks out-of-range days disabled and ignores their selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        aria-label="date"
        locale="en-US"
        defaultValue={new Date(2024, 0, 15)}
        min={new Date(2024, 0, 10)}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('date'));
    const blocked = screen.getByRole('button', { name: 'January 5, 2024' });
    expect(blocked).toHaveAttribute('aria-disabled', 'true');
    await user.click(blocked);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="date" locale="en-US" defaultValue={new Date(2024, 0, 15)} />);

    await user.click(screen.getByLabelText('date'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
  });
});
