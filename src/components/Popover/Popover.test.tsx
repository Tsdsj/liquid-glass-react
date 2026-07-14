import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetGlassSupportCache } from '../../core/hooks/useGlassSupport';
import { Popover } from './Popover';

async function waitForClose(): Promise<void> {
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
}

describe('Popover', () => {
  it('opens from the trigger and forwards ref to the dialog', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover ref={ref} content={<button type="button">Action</button>}>
        <button type="button" className="trigger">Details</button>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveClass('trigger');
    await user.click(trigger);

    expect(trigger).toHaveAttribute('data-expanded');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', 'bottom');
    expect(ref.current).toBe(screen.getByRole('dialog'));
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
  });

  it.each(['{Enter}', ' '])('opens with %s', async (key) => {
    const user = userEvent.setup();
    render(
      <Popover content="Content">
        <button type="button">Details</button>
      </Popover>,
    );

    screen.getByRole('button', { name: 'Details' }).focus();
    await user.keyboard(key);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes with Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<button type="button">Action</button>}>
        <button type="button">Details</button>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Details' });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitForClose();
    expect(trigger).not.toHaveAttribute('data-expanded');
    expect(trigger).toHaveFocus();
  });

  it('closes when pressing outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover content="Content">
          <button type="button">Details</button>
        </Popover>
        <button type="button">Outside</button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Details' }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitForClose();
  });

  it('reports changes without changing itself in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange} content="Content">
        <button type="button">Details</button>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Details' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Popover open onOpenChange={onOpenChange} content="Content">
        <button type="button">Details</button>
      </Popover>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('supports defaultOpen and can hide the arrow', () => {
    const { container } = render(
      <Popover defaultOpen showArrow={false} content="Content">
        <button type="button">Details</button>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(container.querySelector('.lg-popover__arrow')).not.toBeInTheDocument();
  });
});

describe('Popover refraction gating', () => {
  beforeEach(() => {
    __resetGlassSupportCache();
    vi.stubGlobal('CSS', { supports: vi.fn(() => true) });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 Chrome/136.0.0.0 Safari/537.36',
      userAgentData: { brands: [{ brand: 'Chromium' }] },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    __resetGlassSupportCache();
  });

  it('mounts a default-open popover gated on the glass panel, then always releases it', async () => {
    render(
      <Popover defaultOpen content="内容">
        <button type="button">触发</button>
      </Popover>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('lg-popover');
    expect(dialog).toHaveAttribute('data-status');

    const panel = dialog.querySelector('.lg-popover__panel');
    expect(panel).toHaveClass('lg-surface');
    expect(panel).toHaveAttribute('data-refraction-pending');

    await waitFor(
      () => expect(panel).not.toHaveAttribute('data-refraction-pending'),
      { timeout: 2000 },
    );
  });

  it('does not gate the panel when glass support is absent', async () => {
    vi.stubGlobal('CSS', { supports: vi.fn(() => false) });
    __resetGlassSupportCache();
    render(
      <Popover defaultOpen content="内容">
        <button type="button">触发</button>
      </Popover>,
    );

    const panel = screen.getByRole('dialog').querySelector('.lg-popover__panel');
    expect(panel).not.toHaveAttribute('data-refraction-pending');
  });
});
