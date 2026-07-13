import { useEffect, useState } from 'react';
import { useLiquidGlassContext } from '../config/LiquidGlassConfig';

let cachedSupport: boolean | null = null;

export function detectGlassSupport(): boolean {
  if (cachedSupport !== null) {
    return cachedSupport;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    cachedSupport = false;
    return cachedSupport;
  }

  const hasBackdropFilter =
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)');

  if (!hasBackdropFilter) {
    cachedSupport = false;
    return cachedSupport;
  }

  const brands = (
    navigator as Navigator & {
      userAgentData?: { brands?: { brand: string }[] };
    }
  ).userAgentData?.brands;

  if (brands?.some(({ brand }) => brand === 'Chromium')) {
    cachedSupport = true;
    return cachedSupport;
  }

  const userAgent = navigator.userAgent;
  const isSafari = /Version\/\d+.*Safari/.test(userAgent);
  cachedSupport =
    /Chrome\/\d+|Edg\//.test(userAgent) &&
    !/Firefox|FxiOS/.test(userAgent) &&
    !isSafari;

  return cachedSupport;
}

export function useGlassSupport(): { refraction: boolean } {
  const { forceFallback } = useLiquidGlassContext();
  const [isSupported, setIsSupported] = useState(false);
  const [reducedTransparency, setReducedTransparency] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const updateReducedTransparency = (event: MediaQueryListEvent | MediaQueryList) => {
      setReducedTransparency(event.matches);
    };

    setIsSupported(detectGlassSupport());
    updateReducedTransparency(mediaQuery);
    mediaQuery.addEventListener('change', updateReducedTransparency);

    return () => mediaQuery.removeEventListener('change', updateReducedTransparency);
  }, []);

  return {
    refraction: isSupported && !forceFallback && !reducedTransparency,
  };
}

export function __resetGlassSupportCache(): void {
  cachedSupport = null;
}
