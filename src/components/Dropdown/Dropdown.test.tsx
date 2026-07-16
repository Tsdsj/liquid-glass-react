import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';

const ITEMS = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
];

describe('Dropdown', () => {
  it('opens the menu from its built-in button and fires onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Dropdown label="更多操作" items={ITEMS} onSelect={onSelect} />);

    const trigger = screen.getByRole('button', { name: /更多操作/ });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: '编辑' }));
    expect(onSelect).toHaveBeenCalledWith('edit');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Dropdown label="更多" items={ITEMS} disabled />);

    await user.click(screen.getByRole('button', { name: /更多/ }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
