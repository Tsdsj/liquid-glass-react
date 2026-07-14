import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders its label and forwards native attributes, ref, className, and style', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Checkbox
        ref={ref}
        className="custom-checkbox"
        style={{ marginTop: '12px' }}
        name="terms"
      >
        Accept terms
      </Checkbox>,
    );

    const input = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Accept terms' });
    const root = input.closest('label');
    expect(input).toHaveAttribute('name', 'terms');
    expect(ref.current).toBe(input);
    expect(root).toHaveClass('lg-checkbox', 'custom-checkbox');
    expect(root).toHaveStyle({ marginTop: '12px' });
  });

  it('updates itself and calls onCheckedChange in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox defaultChecked onCheckedChange={onCheckedChange}>
        Accept terms
      </Checkbox>,
    );
    const input = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(input).toBeChecked();
    await user.click(input);

    expect(input).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('reports changes without changing itself in controlled mode', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange}>
        Accept terms
      </Checkbox>,
    );
    const input = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(input);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(input).not.toBeChecked();

    rerender(
      <Checkbox checked onCheckedChange={onCheckedChange}>
        Accept terms
      </Checkbox>,
    );
    expect(input).toBeChecked();
  });

  it('syncs the indeterminate property and mixed aria state', () => {
    const { rerender } = render(<Checkbox indeterminate>Accept terms</Checkbox>);
    const input = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Accept terms' });
    const root = input.closest('label');

    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute('aria-checked', 'mixed');
    expect(root).toHaveAttribute('data-indeterminate');

    rerender(<Checkbox>Accept terms</Checkbox>);
    expect(input.indeterminate).toBe(false);
    expect(input).not.toHaveAttribute('aria-checked');
  });

  it('toggles with Space through native checkbox behavior', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Accept terms</Checkbox>);
    const input = screen.getByRole('checkbox', { name: 'Accept terms' });

    input.focus();
    await user.keyboard(' ');

    expect(input).toBeChecked();
  });

  it('does not change or call back when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange}>
        Accept terms
      </Checkbox>,
    );
    const input = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(input);

    expect(input).toBeDisabled();
    expect(input).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
