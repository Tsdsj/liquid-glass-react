import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { __resetGlassSupportCache } from '../../core/hooks/useGlassSupport';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders a labelled dialog, forwards ref to the panel and defaults to the right', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Drawer ref={ref} open onOpenChange={() => undefined} title="Filters">
        Body
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveTextContent('Body');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('data-placement', 'right');
    expect(ref.current).toBe(dialog);
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'reflects placement=%s on the panel',
    (placement) => {
      render(
        <Drawer open onOpenChange={() => undefined} placement={placement}>
          Body
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', placement);
    },
  );

  it('uses localized close button labels', () => {
    const { rerender } = render(
      <Drawer open onOpenChange={() => undefined}>
        Body
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();

    rerender(
      <LiquidGlassConfig locale="en-US">
        <Drawer open onOpenChange={() => undefined}>
          Body
        </Drawer>
      </LiquidGlassConfig>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        Body
      </Drawer>,
    );

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on overlay press by default but not when disabled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Drawer open onOpenChange={onOpenChange}>
        Body
      </Drawer>,
    );

    await user.click(document.querySelector('.lg-drawer__overlay') as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    rerender(
      <Drawer open onOpenChange={onOpenChange} closeOnOverlayClick={false}>
        Body
      </Drawer>,
    );
    await user.click(document.querySelector('.lg-drawer__overlay') as HTMLElement);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('locks body scrolling while open', () => {
    render(
      <Drawer open onOpenChange={() => undefined}>
        Body
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores focus to the trigger after closing', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Drawer open={open} onOpenChange={setOpen}>
            Body
          </Drawer>
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

describe('Drawer refraction gating', () => {
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

  it('gates the glass panel while the overlay stays free of animation attributes', async () => {
    render(
      <Drawer open onOpenChange={() => undefined} title="标题">
        内容
      </Drawer>,
    );

    const overlay = document.querySelector('.lg-drawer__overlay');
    expect(overlay).toHaveAttribute('data-status');

    const panel = document.querySelector('.lg-drawer__panel');
    expect(panel).toHaveClass('lg-surface');
    expect(panel).toHaveAttribute('data-status');
    expect(panel).toHaveAttribute('data-refraction-pending');

    await waitFor(() => expect(panel).not.toHaveAttribute('data-refraction-pending'), {
      timeout: 2000,
    });
  });
});
