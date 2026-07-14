import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders content, icon, className, ref, and native attributes', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button
        ref={ref}
        icon={<span>+</span>}
        className="custom-button"
        type="submit"
        name="action"
      >
        Continue
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button).toHaveClass('lg-button', 'custom-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('data-variant', 'glass');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(ref.current).toBe(button);
    expect(button.querySelector('.lg-button__icon')).toHaveTextContent('+');
  });

  it('exposes variant and size states through data attributes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('fires click handlers for pointer interaction', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks clicks while loading without setting disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving' });
    await user.click(button);

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).not.toBeDisabled();
    expect(button.querySelector('.lg-button__spinner')).toBeInTheDocument();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses native disabled behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Disabled' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports Enter and Space through native button keyboard behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Keyboard</Button>);
    const button = screen.getByRole('button', { name: 'Keyboard' });

    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
