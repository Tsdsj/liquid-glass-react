import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Command, type CommandItem } from './Command';

function makeItems(onRun: (key: string) => void): CommandItem[] {
  return [
    { key: 'new', label: 'New file', keywords: ['create'], group: 'File', onRun: () => onRun('new') },
    { key: 'open', label: 'Open file', group: 'File', onRun: () => onRun('open') },
    { key: 'copy', label: 'Copy link', keywords: ['duplicate'], group: 'Edit', onRun: () => onRun('copy') },
  ];
}

function renderCommand(ui: React.ReactElement) {
  return render(<LiquidGlassConfig locale="en-US">{ui}</LiquidGlassConfig>);
}

describe('Command', () => {
  it('filters by label and keyword and shows an empty state', async () => {
    const user = userEvent.setup();
    renderCommand(<Command items={makeItems(() => {})} open onOpenChange={() => {}} />);

    const input = screen.getByRole('combobox');
    expect(screen.getAllByRole('option')).toHaveLength(3);

    await user.type(input, 'dup'); // keyword of "Copy link"
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('Copy link');

    await user.clear(input);
    await user.type(input, 'zzzz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No matching commands')).toBeInTheDocument();
  });

  it('navigates with arrow keys via aria-activedescendant and runs on Enter', async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    const onOpenChange = vi.fn();
    renderCommand(<Command items={makeItems(onRun)} open onOpenChange={onOpenChange} />);

    const input = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', options[0].id));

    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', options[1].id);

    await user.keyboard('{Enter}');
    expect(onRun).toHaveBeenCalledWith('open');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('runs an item on click', async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    renderCommand(<Command items={makeItems(onRun)} open onOpenChange={() => {}} />);

    await user.click(screen.getByRole('option', { name: 'Copy link' }));
    expect(onRun).toHaveBeenCalledWith('copy');
  });
});
