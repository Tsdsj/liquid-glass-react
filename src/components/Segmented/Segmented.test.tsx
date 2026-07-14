import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { __resetFilterRegistry, filterRegistry } from '../../core/filter/filter-registry';
import { Segmented } from './Segmented';

const OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

describe('Segmented', () => {
  it('renders a radiogroup of radios and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Segmented ref={ref} aria-label="range" options={OPTIONS} defaultValue="week" />);

    const group = screen.getByRole('radiogroup', { name: 'range' });
    expect(group).toHaveClass('lg-segmented');
    expect(ref.current).toBe(group);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'false');
  });

  it('defaults to the first enabled option', () => {
    render(
      <Segmented
        aria-label="range"
        options={[
          { label: 'Day', value: 'day', disabled: true },
          { label: 'Week', value: 'week' },
        ]}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
  });

  it('selects on click and reports the value in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented aria-label="range" options={OPTIONS} defaultValue="day" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Month' }));

    expect(onChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
  });

  it('reports without self-updating in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Segmented aria-label="range" options={OPTIONS} value="day" onChange={onChange} />,
    );

    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');

    rerender(<Segmented aria-label="range" options={OPTIONS} value="week" onChange={onChange} />);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves and selects with arrow keys, wrapping and skipping disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Segmented
        aria-label="range"
        defaultValue="day"
        onChange={onChange}
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week', disabled: true },
          { label: 'Month', value: 'month' },
        ]}
      />,
    );

    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('month');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('day');
  });

  it('keeps a single tab stop via roving tabindex', () => {
    render(<Segmented aria-label="range" options={OPTIONS} defaultValue="week" />);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('tabindex', '-1');
  });

  it('does not fire changes when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Segmented aria-label="range" options={OPTIONS} defaultValue="day" disabled onChange={onChange} />,
    );

    await user.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Month' })).toBeDisabled();
  });

  it('does not rebuild any glass filter when the selection slides', async () => {
    const user = userEvent.setup();
    __resetFilterRegistry();
    render(<Segmented aria-label="range" options={OPTIONS} defaultValue="day" />);

    const before = filterRegistry.getSnapshot().length;
    await user.click(screen.getByRole('radio', { name: 'Month' }));
    await user.click(screen.getByRole('radio', { name: 'Week' }));

    expect(filterRegistry.getSnapshot().length).toBe(before);
  });

  it('reflects a controlled value driven by the parent', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('day');
      return <Segmented aria-label="range" options={OPTIONS} value={value} onChange={setValue} />;
    }

    render(<Controlled />);
    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
  });
});
