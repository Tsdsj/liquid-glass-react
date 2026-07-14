import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { __resetFilterRegistry, filterRegistry } from '../../core/filter/filter-registry';
import { SideNav } from './SideNav';

const ITEMS = [
  { type: 'group' as const, label: 'Main' },
  { key: 'home', label: 'Home', href: '#/home' },
  { key: 'library', label: 'Library', href: '#/library' },
  { key: 'settings', label: 'Settings' },
  { key: 'archived', label: 'Archived', disabled: true },
];

describe('SideNav', () => {
  it('renders a nav with links, buttons, a group heading and the current item', () => {
    const ref = createRef<HTMLElement>();
    render(<SideNav ref={ref} aria-label="primary" items={ITEMS} defaultValue="home" />);

    expect(ref.current).toBe(screen.getByRole('navigation', { name: 'primary' }));
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home).toHaveAttribute('href', '#/home');
    expect(home).toHaveAttribute('aria-current', 'page');
    // No href => button.
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    // Group is a non-interactive heading.
    const group = screen.getByText('Main');
    expect(group.closest('a')).toBeNull();
    expect(group.closest('button')).toBeNull();
  });

  it('selects on click and reports the key in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SideNav aria-label="primary" items={ITEMS} defaultValue="home" onChange={onChange} />);

    await user.click(screen.getByRole('link', { name: 'Library' }));
    expect(onChange).toHaveBeenCalledWith('library');
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('reports without self-updating in controlled mode', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('home');
      return (
        <>
          <SideNav aria-label="primary" items={ITEMS} value={value} onChange={() => undefined} />
          <button type="button" onClick={() => setValue('settings')}>
            external
          </button>
        </>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    // Still on home because the parent kept value fixed.
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'external' }));
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not select a disabled item', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SideNav aria-label="primary" items={ITEMS} defaultValue="home" onChange={onChange} />);

    const archived = screen.getByText('Archived').closest('.lg-sidenav__item');
    expect(archived).toHaveAttribute('data-disabled');
    await user.click(archived as Element);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not rebuild any glass filter when the indicator moves', async () => {
    const user = userEvent.setup();
    __resetFilterRegistry();
    render(<SideNav aria-label="primary" items={ITEMS} defaultValue="home" />);

    const before = filterRegistry.getSnapshot().length;
    await user.click(screen.getByRole('link', { name: 'Library' }));
    await user.click(screen.getByRole('button', { name: 'Settings' }));

    expect(filterRegistry.getSnapshot().length).toBe(before);
  });
});
