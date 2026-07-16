import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InputNumber } from './InputNumber';

describe('InputNumber', () => {
  it('exposes a spinbutton with aria value state', () => {
    render(<InputNumber aria-label="数量" defaultValue={3} min={0} max={10} />);
    const input = screen.getByRole('spinbutton', { name: '数量' });
    expect(input).toHaveValue('3');
    expect(input).toHaveAttribute('aria-valuenow', '3');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
  });

  it('normalizes typed text on blur (clamp + precision) and reverts invalid input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <InputNumber aria-label="金额" defaultValue={1} min={0} max={100} precision={2} onChange={onChange} />,
    );
    const input = screen.getByRole('spinbutton', { name: '金额' });

    await user.clear(input);
    await user.type(input, '123.456');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(100);
    expect(input).toHaveValue('100');

    await user.clear(input);
    await user.type(input, 'abc');
    await user.tab();
    // Invalid text reverts to the last valid value.
    expect(input).toHaveValue('100');
  });

  it('steps with keyboard arrows and the spinner buttons', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputNumber aria-label="数量" defaultValue={5} step={2} max={8} onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: '数量' });

    input.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(7);
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(8); // clamped at max

    await user.click(screen.getByRole('button', { name: '减少' }));
    expect(onChange).toHaveBeenLastCalledWith(6);
  });

  it('supports controlled value and empties to null', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputNumber aria-label="数量" value={4} onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: '数量' });

    expect(input).toHaveValue('4');
    await user.clear(input);
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(null);
    // Controlled: display stays at the prop value.
    expect(input).toHaveValue('4');
  });

  it('disables the field and steppers', () => {
    render(<InputNumber aria-label="数量" defaultValue={1} disabled />);
    expect(screen.getByRole('spinbutton', { name: '数量' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '增加' })).toBeDisabled();
  });
});
