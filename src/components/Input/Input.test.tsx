import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders slots and forwards native attributes, ref, className, and style', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Input
        ref={ref}
        prefix="@"
        suffix=".com"
        className="custom-input"
        style={{ marginTop: '12px' }}
        name="email"
        aria-label="Email"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const root = input.closest('.lg-input');
    expect(input).toHaveAttribute('name', 'email');
    expect(ref.current).toBe(input);
    expect(root).toHaveClass('custom-input');
    expect(root).toHaveStyle({ marginTop: '12px' });
    expect(root?.querySelector('.lg-input__prefix')).toHaveTextContent('@');
    expect(root?.querySelector('.lg-input__suffix')).toHaveTextContent('.com');
  });

  it('preserves native controlled input behavior', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Input value="old" onChange={onChange} aria-label="Name" />,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });

    await user.type(input, 'x');

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue('old');

    rerender(<Input value="new" onChange={onChange} aria-label="Name" />);
    expect(input).toHaveValue('new');
  });

  it('preserves native uncontrolled input behavior', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="old" aria-label="Name" />);
    const input = screen.getByRole('textbox', { name: 'Name' });

    await user.clear(input);
    await user.type(input, 'new');

    expect(input).toHaveValue('new');
  });

  it('focuses the input when its container is clicked', () => {
    render(<Input prefix="@" aria-label="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    const prefix = input.closest('.lg-input')?.querySelector('.lg-input__prefix');

    fireEvent.click(prefix as Element);

    expect(input).toHaveFocus();
  });

  it('exposes invalid state through aria and data attributes', () => {
    render(<Input invalid aria-label="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.closest('.lg-input')).toHaveAttribute('data-invalid');
  });

  it('uses native disabled behavior', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} aria-label="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    await user.type(input, 'test');

    expect(input).toBeDisabled();
    expect(input).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });
});
