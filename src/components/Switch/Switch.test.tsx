import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('forwards native attributes and ref while applying className and style to the root', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Switch
        ref={ref}
        className="custom-switch"
        style={{ marginTop: '12px' }}
        name="notifications"
        aria-label="Notifications"
      />,
    );

    const input = screen.getByRole('switch', { name: 'Notifications' });
    const root = input.closest('label');
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).toHaveAttribute('name', 'notifications');
    expect(ref.current).toBe(input);
    expect(root).toHaveClass('lg-switch', 'custom-switch');
    expect(root).toHaveStyle({ marginTop: '12px' });
  });

  it('updates itself and calls onCheckedChange in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        defaultChecked
        onCheckedChange={onCheckedChange}
        aria-label="Notifications"
      />,
    );

    const input = screen.getByRole('switch', { name: 'Notifications' });
    expect(input).toBeChecked();

    await user.click(input);

    expect(input).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('reports changes without changing itself in controlled mode', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch checked={false} onCheckedChange={onCheckedChange} aria-label="Notifications" />,
    );
    const input = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(input);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(input).not.toBeChecked();

    rerender(
      <Switch checked onCheckedChange={onCheckedChange} aria-label="Notifications" />,
    );
    expect(input).toBeChecked();
  });

  it('toggles with Space through the native checkbox behavior', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Notifications" />);
    const input = screen.getByRole('switch', { name: 'Notifications' });

    input.focus();
    await user.keyboard(' ');

    expect(input).toBeChecked();
  });

  it('does not change or call back when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch disabled onCheckedChange={onCheckedChange} aria-label="Notifications" />,
    );
    const input = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(input);

    expect(input).toBeDisabled();
    expect(input).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('exposes size and checked states and uses a non-refracting glass thumb', () => {
    render(<Switch defaultChecked size="lg" aria-label="Notifications" />);
    const input = screen.getByRole('switch', { name: 'Notifications' });
    const root = input.closest('label');
    const thumb = root?.querySelector('.lg-switch__thumb');

    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-checked');
    expect(thumb).toHaveAttribute('data-refraction', 'off');
  });
});
