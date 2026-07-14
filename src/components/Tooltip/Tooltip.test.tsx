import { act, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';

afterEach(() => {
  vi.useRealTimers();
});

describe('Tooltip', () => {
  it('opens after the default hover delay and forwards ref', () => {
    vi.useFakeTimers();
    const ref = createRef<HTMLDivElement>();
    render(
      <Tooltip ref={ref} content="Helpful text">
        <button type="button" className="trigger">Info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Info' });

    fireEvent.mouseEnter(trigger);
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful text');
    expect(ref.current).toBe(screen.getByRole('tooltip'));
    expect(trigger).toHaveClass('trigger');
  });

  it('closes without delay when hover ends', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Helpful text" delay={0}>
        <button type="button">Info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Info' });

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(trigger);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-status', 'close');

    act(() => vi.advanceTimersByTime(350));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens immediately on focus without moving focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful text">
        <button type="button">Info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Info' });

    await user.tab();

    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('closes with Escape and keeps focus on the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful text">
        <button type="button">Info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Info' });

    await user.tab();
    await user.keyboard('{Escape}');

    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-status', 'close');
  });

  it('adds the tooltip relationship to the trigger', () => {
    render(
      <Tooltip content="Helpful text" delay={0}>
        <button type="button">Info</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Info' });

    fireEvent.mouseEnter(trigger);

    expect(trigger).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
  });
});
