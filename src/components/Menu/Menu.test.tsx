import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from './Menu';

const ITEMS = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { type: 'divider' as const },
  { key: 'archive', label: 'Archive', disabled: true },
  { key: 'delete', label: 'Delete', danger: true },
];

function Basic(props: Partial<React.ComponentProps<typeof Menu>>) {
  return (
    <Menu items={ITEMS} {...props}>
      <button type="button">Actions</button>
    </Menu>
  );
}

describe('Menu', () => {
  it('opens on trigger click and renders items and a divider', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('selects an item, fires onSelect, closes and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic onSelect={onSelect} />);

    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }));

    expect(onSelect).toHaveBeenCalledWith('duplicate');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('opens with ArrowDown and focuses the first item', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');

    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus(),
    );
  });

  it('opens with ArrowUp and focuses the last item', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');

    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus(),
    );
  });

  it('skips disabled items during arrow navigation', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    // Open and wait for the list to register (item refs mount async), then
    // navigate: Edit -> Duplicate -> (skip disabled Archive) Delete.
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus(),
    );
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus(),
    );
  });

  it('selects the focused item with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic onSelect={onSelect} />);

    // Gate each step on focus settling so the follow-up keys can't outrun the
    // async list-navigation setup (flaky under parallel CI otherwise).
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus(),
    );
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus(),
    );
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('duplicate');
  });

  it('moves focus to a typed match', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    // Open via keyboard so focus is inside the list, wait for it to settle,
    // then typeahead.
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus(),
    );
    await user.keyboard('de');
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus(),
    );
  });

  it('does not fire onSelect for a disabled item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Basic onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('marks danger items', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-danger');
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Basic />);

    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes on outside press', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Basic />
        <button type="button">outside</button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('button', { name: 'outside' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('supports controlled open state', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            external
          </button>
          <Menu items={ITEMS} open={open} onOpenChange={setOpen}>
            <button type="button">Actions</button>
          </Menu>
        </>
      );
    }

    render(<Controlled />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'external' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
