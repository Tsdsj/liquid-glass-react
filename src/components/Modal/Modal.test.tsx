import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders a labelled dialog and forwards ref to the panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Modal ref={ref} open onOpenChange={() => undefined} title="Settings">
        Content
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveTextContent('Content');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(ref.current).toBe(dialog);
  });

  it('uses localized close button labels', () => {
    const { rerender } = render(
      <Modal open onOpenChange={() => undefined}>
        Content
      </Modal>,
    );
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();

    rerender(
      <LiquidGlassConfig locale="en-US">
        <Modal open onOpenChange={() => undefined}>
          Content
        </Modal>
      </LiquidGlassConfig>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        Content
      </Modal>,
    );

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on overlay press by default', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        Content
      </Modal>,
    );

    const overlay = document.querySelector('.lg-modal__overlay');
    expect(overlay).not.toBeNull();
    await user.click(overlay as HTMLElement);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('can keep the modal open on overlay press', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} closeOnOverlayClick={false}>
        Content
      </Modal>,
    );

    const overlay = document.querySelector('.lg-modal__overlay');
    await user.click(overlay as HTMLElement);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('keeps Tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside</button>
        <Modal open onOpenChange={() => undefined}>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Modal>
      </>,
    );
    const dialog = screen.getByRole('dialog');
    const outside = screen.getByText('Outside');

    for (let index = 0; index < 5; index += 1) {
      await user.tab();
      expect(outside).not.toHaveFocus();
      expect(document.activeElement).not.toBe(document.body);
    }

    expect(dialog).toBeInTheDocument();
  });

  it('locks body scrolling while open', () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores focus after closing', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onOpenChange={setOpen}>
            Content
          </Modal>
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: '关闭' }));

    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
