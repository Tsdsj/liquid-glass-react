import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetGlassSupportCache } from '../core/hooks/useGlassSupport';
import { Toaster } from './Toaster';
import { toast } from './toast';
import { resetToastStore } from './toast-store';

describe('Toaster refraction gating', () => {
  beforeEach(() => {
    __resetGlassSupportCache();
    vi.stubGlobal('CSS', { supports: vi.fn(() => true) });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 Chrome/136.0.0.0 Safari/537.36',
      userAgentData: { brands: [{ brand: 'Chromium' }] },
    });
  });

  afterEach(() => {
    act(() => resetToastStore());
    vi.unstubAllGlobals();
    __resetGlassSupportCache();
  });

  it('gates each new toast on its glass surface, then always releases it', async () => {
    render(<Toaster />);

    act(() => {
      toast.show('通知内容');
    });

    const item = document.querySelector('.lg-toast');
    expect(item).toHaveClass('lg-surface');
    expect(item).toHaveTextContent('通知内容');
    expect(item).toHaveAttribute('data-refraction-pending');

    await waitFor(
      () => expect(item).not.toHaveAttribute('data-refraction-pending'),
      { timeout: 2000 },
    );
  });

  it('does not gate toasts when glass support is absent', () => {
    vi.stubGlobal('CSS', { supports: vi.fn(() => false) });
    __resetGlassSupportCache();
    render(<Toaster />);

    act(() => {
      toast.show('通知内容');
    });

    expect(document.querySelector('.lg-toast')).not.toHaveAttribute(
      'data-refraction-pending',
    );
  });
});
