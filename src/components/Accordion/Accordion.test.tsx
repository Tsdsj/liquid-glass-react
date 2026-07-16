import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, type AccordionItem } from './Accordion';

const ITEMS: AccordionItem[] = [
  { key: 'a', title: '面板一', content: '内容一' },
  { key: 'b', title: '面板二', content: '内容二' },
  { key: 'c', title: '面板三', content: '内容三', disabled: true },
];

describe('Accordion', () => {
  it('expands one panel at a time by default and wires aria', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} />);

    const first = screen.getByRole('button', { name: '面板一' });
    const second = screen.getByRole('button', { name: '面板二' });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('region', { name: '面板一' })).toBeInTheDocument();

    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');

    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows multiple open panels when multiple is set', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} multiple />);

    await user.click(screen.getByRole('button', { name: '面板一' }));
    await user.click(screen.getByRole('button', { name: '面板二' }));
    expect(screen.getByRole('button', { name: '面板一' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '面板二' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not toggle a disabled item', async () => {
    const user = userEvent.setup();
    render(<Accordion items={ITEMS} />);
    const disabled = screen.getByRole('button', { name: '面板三' });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(disabled).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports controlled open keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Accordion items={ITEMS} value={['a']} onChange={onChange} />);

    expect(screen.getByRole('button', { name: '面板一' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: '面板二' }));
    expect(onChange).toHaveBeenCalledWith(['b']);
    // Controlled value unchanged.
    expect(screen.getByRole('button', { name: '面板一' })).toHaveAttribute('aria-expanded', 'true');
  });
});
