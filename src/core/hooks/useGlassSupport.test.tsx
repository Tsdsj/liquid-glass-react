import { type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../config/LiquidGlassConfig';
import {
  __resetGlassSupportCache,
  detectGlassSupport,
  useGlassSupport,
} from './useGlassSupport';

interface BrowserSupportOptions {
  backdropFilter?: boolean;
  brands?: { brand: string }[];
  userAgent?: string;
}

function stubBrowserSupport({
  backdropFilter = true,
  brands,
  userAgent = '',
}: BrowserSupportOptions = {}): void {
  vi.stubGlobal('CSS', {
    supports: vi.fn(() => backdropFilter),
  });
  vi.stubGlobal('navigator', {
    userAgent,
    userAgentData: brands ? { brands } : undefined,
  });
}

describe('detectGlassSupport', () => {
  afterEach(() => {
    __resetGlassSupportCache();
    vi.unstubAllGlobals();
  });

  it('uses Chromium UA client hints when available', () => {
    stubBrowserSupport({ brands: [{ brand: 'Chromium' }] });

    expect(detectGlassSupport()).toBe(true);
  });

  it('recognizes Edge through the user agent fallback', () => {
    stubBrowserSupport({ userAgent: 'Mozilla/5.0 Chrome/136.0.0.0 Safari/537.36 Edg/136.0' });

    expect(detectGlassSupport()).toBe(true);
  });

  it('rejects Safari and Firefox user agents', () => {
    stubBrowserSupport({
      userAgent: 'Mozilla/5.0 Version/18.5 Safari/605.1.15',
    });
    expect(detectGlassSupport()).toBe(false);

    __resetGlassSupportCache();
    stubBrowserSupport({ userAgent: 'Mozilla/5.0 Firefox/137.0' });
    expect(detectGlassSupport()).toBe(false);
  });

  it('rejects engines without backdrop-filter support', () => {
    stubBrowserSupport({
      backdropFilter: false,
      brands: [{ brand: 'Chromium' }],
    });

    expect(detectGlassSupport()).toBe(false);
  });

  it('does not cache the server-side fallback result', () => {
    vi.stubGlobal('window', undefined);
    expect(detectGlassSupport()).toBe(false);

    vi.unstubAllGlobals();
    stubBrowserSupport({ brands: [{ brand: 'Chromium' }] });
    expect(detectGlassSupport()).toBe(true);
  });
});

describe('useGlassSupport', () => {
  afterEach(() => {
    __resetGlassSupportCache();
    vi.unstubAllGlobals();
  });

  it('starts in fallback mode and enables refraction after mount', async () => {
    stubBrowserSupport({ brands: [{ brand: 'Chromium' }] });
    function SupportProbe() {
      const support = useGlassSupport();
      return (
        <span
          data-refraction={support.refraction ? 'on' : 'off'}
          data-transparency={support.reducedTransparency ? 'reduced' : 'normal'}
        />
      );
    }

    expect(renderToString(<SupportProbe />)).toContain('data-refraction="off"');
    expect(renderToString(<SupportProbe />)).toContain('data-transparency="normal"');
    const { result } = renderHook(() => useGlassSupport());

    await waitFor(() => expect(result.current.refraction).toBe(true));
    expect(result.current.reducedTransparency).toBe(false);
  });

  it('reacts to reduced transparency preference changes', async () => {
    stubBrowserSupport({ brands: [{ brand: 'Chromium' }] });
    let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
    const matchMedia = vi.fn(
      (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: (
          _type: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          changeListener = listener as unknown as (event: MediaQueryListEvent) => void;
        },
        removeEventListener: () => {
          changeListener = undefined;
        },
        dispatchEvent: () => false,
      }),
    );
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    });

    const { result } = renderHook(() => useGlassSupport());

    await waitFor(() => expect(matchMedia).toHaveBeenCalled());
    expect(result.current.refraction).toBe(true);
    expect(result.current.reducedTransparency).toBe(false);

    act(() => {
      changeListener?.({ matches: true } as MediaQueryListEvent);
    });

    await waitFor(() => expect(result.current.reducedTransparency).toBe(true));
    expect(result.current.refraction).toBe(false);
  });

  it('honors LiquidGlassConfig forceFallback', async () => {
    stubBrowserSupport({ brands: [{ brand: 'Chromium' }] });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LiquidGlassConfig forceFallback>{children}</LiquidGlassConfig>
    );
    const { result } = renderHook(() => useGlassSupport(), { wrapper });

    await waitFor(() => expect(CSS.supports).toHaveBeenCalled());
    expect(result.current.refraction).toBe(false);
    expect(result.current.reducedTransparency).toBe(false);
  });

  it('honors forced reduced transparency during SSR and after mount', async () => {
    stubBrowserSupport({ brands: [{ brand: 'Chromium' }] });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LiquidGlassConfig forceReducedTransparency>{children}</LiquidGlassConfig>
    );
    function SupportProbe() {
      const support = useGlassSupport();
      return <span data-transparency={support.reducedTransparency ? 'reduced' : 'normal'} />;
    }

    expect(
      renderToString(
        <LiquidGlassConfig forceReducedTransparency>
          <SupportProbe />
        </LiquidGlassConfig>,
      ),
    ).toContain('data-transparency="reduced"');
    const { result } = renderHook(() => useGlassSupport(), { wrapper });

    await waitFor(() => expect(CSS.supports).toHaveBeenCalled());
    expect(result.current.reducedTransparency).toBe(true);
    expect(result.current.refraction).toBe(false);
  });
});
