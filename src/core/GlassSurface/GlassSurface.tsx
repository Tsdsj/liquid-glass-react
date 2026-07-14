import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  LiquidGlassContext,
  useLiquidGlassContext,
  type LiquidGlassContextValue,
} from '../config/LiquidGlassConfig';
import { GlassFilterDefs, useFilterDefsHost } from '../filter/GlassFilterDefs';
import { filterRegistry, type FilterShape } from '../filter/filter-registry';
import { useElementSize, type ElementSize } from '../hooks/useElementSize';
import { useGlassSupport } from '../hooks/useGlassSupport';
import { cx } from '../utils/cx';

export interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  radius?: number | string;
  refraction?: 'auto' | 'off';
  depth?: number;
  bezel?: number;
  tint?: string;
  interactive?: boolean;
  material?: 'regular' | 'clear';
}

interface GlassSurfaceStyle extends CSSProperties {
  '--lg-r'?: string;
  '--lg-tint'?: string;
  '--lg-surface-tint'?: string;
  '--lg-filter-url'?: string;
}

interface ActiveFilter {
  id: string;
}

interface PointerPosition {
  x: number;
  y: number;
}

const RESIZE_SETTLE_DELAY = 150;
let hasWarnedAboutStringRadius = false;

function assignRef(ref: ForwardedRef<HTMLElement>, value: HTMLElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function sizesMatch(first: ElementSize, second: ElementSize): boolean {
  return first.width === second.width && first.height === second.height;
}

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function formatPercentage(value: number): string {
  return `${Math.round(clampPercentage(value) * 100) / 100}%`;
}

export const GlassSurface = forwardRef<HTMLElement, GlassSurfaceProps>(function GlassSurface(
  {
    as,
    radius,
    refraction = 'auto',
    depth = 1,
    bezel = 12,
    tint,
    interactive = false,
    material = 'regular',
    className,
    style,
    children,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    ...rest
  },
  forwardedRef,
) {
  const Component = as ?? 'div';
  const hostRef = useRef<HTMLElement | null>(null);
  const size = useElementSize(hostRef);
  const glassSupport = useGlassSupport();
  const context = useLiquidGlassContext();
  const [stableSize, setStableSize] = useState<ElementSize>({ width: 0, height: 0 });
  const [defaultRadius, setDefaultRadius] = useState<number | null>(null);
  const [refractionBase, setRefractionBase] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [hasResolvedClientSupport, setHasResolvedClientSupport] = useState(false);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef<PointerPosition>({ x: 50, y: 0 });

  const setHostRef = useCallback(
    (element: HTMLElement | null) => {
      hostRef.current = element;
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  const applyPointerPosition = useCallback(() => {
    pointerFrameRef.current = null;
    const element = hostRef.current;
    if (!element) {
      return;
    }

    const { x, y } = pointerPositionRef.current;
    element.style.setProperty('--lg-pointer-x', formatPercentage(x));
    element.style.setProperty('--lg-pointer-y', formatPercentage(y));
  }, []);

  const schedulePointerPosition = useCallback(
    (position: PointerPosition) => {
      pointerPositionRef.current = position;
      if (pointerFrameRef.current === null) {
        pointerFrameRef.current = requestAnimationFrame(applyPointerPosition);
      }
    },
    [applyPointerPosition],
  );

  const schedulePointerEventPosition = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        schedulePointerPosition({ x: 50, y: 0 });
        return;
      }

      schedulePointerPosition({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      });
    },
    [schedulePointerPosition],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    if (interactive) {
      schedulePointerEventPosition(event);
    }
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerEnter?.(event);
    if (interactive) {
      schedulePointerEventPosition(event);
    }
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerLeave?.(event);
    if (interactive) {
      event.currentTarget.removeAttribute('data-pressed');
      schedulePointerPosition({ x: 50, y: 0 });
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerDown?.(event);
    if (interactive) {
      event.currentTarget.setAttribute('data-pressed', '');
      schedulePointerEventPosition(event);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerUp?.(event);
    if (interactive) {
      event.currentTarget.removeAttribute('data-pressed');
      schedulePointerEventPosition(event);
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerCancel?.(event);
    if (interactive) {
      event.currentTarget.removeAttribute('data-pressed');
      schedulePointerPosition({ x: 50, y: 0 });
    }
  };

  useEffect(() => {
    if (interactive) {
      return;
    }

    const element = hostRef.current;
    element?.removeAttribute('data-pressed');
    element?.style.removeProperty('--lg-pointer-x');
    element?.style.removeProperty('--lg-pointer-y');
  }, [interactive]);

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setHasResolvedClientSupport(true);
  }, []);

  useEffect(() => {
    if (
      import.meta.env.DEV &&
      typeof radius === 'string' &&
      !hasWarnedAboutStringRadius
    ) {
      hasWarnedAboutStringRadius = true;
      console.warn('GlassSurface refraction is disabled when radius is provided as a string.');
    }
  }, [radius]);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) {
      return;
    }

    const computedStyle = getComputedStyle(element);
    if (radius === undefined) {
      const parsedRadius = Number.parseFloat(computedStyle.borderTopLeftRadius);
      if (Number.isFinite(parsedRadius)) {
        setDefaultRadius((current) => (current === parsedRadius ? current : parsedRadius));
      }
    }

    const parsedRefraction = Number.parseFloat(
      computedStyle.getPropertyValue('--lg-refraction').trim(),
    );
    if (Number.isFinite(parsedRefraction)) {
      setRefractionBase((current) =>
        current === parsedRefraction ? current : parsedRefraction,
      );
    }
  });

  useEffect(() => {
    if (size.width === 0 || size.height === 0) {
      setStableSize((current) => (sizesMatch(current, size) ? current : size));
      return undefined;
    }

    if (stableSize.width === 0 || stableSize.height === 0) {
      setStableSize(size);
      return undefined;
    }

    if (sizesMatch(stableSize, size)) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setStableSize((current) => (sizesMatch(current, size) ? current : size));
    }, RESIZE_SETTLE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [size.height, size.width, stableSize.height, stableSize.width]);

  const numericRadius =
    typeof radius === 'number' ? radius : radius === undefined ? defaultRadius : null;
  const canUseRefraction =
    refraction === 'auto' &&
    glassSupport.refraction &&
    !context.insideGlass &&
    numericRadius !== null &&
    refractionBase !== null &&
    Number.isFinite(depth * refractionBase);

  useEffect(() => {
    if (
      !canUseRefraction ||
      numericRadius === null ||
      refractionBase === null ||
      stableSize.width === 0 ||
      stableSize.height === 0
    ) {
      setActiveFilter(null);
      return undefined;
    }

    const shape: FilterShape = {
      w: stableSize.width,
      h: stableSize.height,
      r: numericRadius,
      bezel,
      scale: depth * refractionBase,
    };
    let acquired = false;
    let cancelled = false;
    const animationFrame = requestAnimationFrame(() => {
      const id = filterRegistry.acquire(shape);
      acquired = true;

      if (cancelled) {
        filterRegistry.release(shape);
        return;
      }

      setActiveFilter({ id });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      if (acquired) {
        filterRegistry.release(shape);
      }
    };
  }, [
    bezel,
    canUseRefraction,
    depth,
    numericRadius,
    refractionBase,
    stableSize.height,
    stableSize.width,
  ]);

  const shouldRenderFilterDefs = useFilterDefsHost(
    canUseRefraction && stableSize.width > 0 && stableSize.height > 0,
  );
  const nestedContext = useMemo<LiquidGlassContextValue>(
    () => ({
      forceFallback: context.forceFallback,
      forceReducedTransparency: context.forceReducedTransparency,
      insideGlass: true,
      locale: context.locale,
    }),
    [context.forceFallback, context.forceReducedTransparency, context.locale],
  );
  const radiusValue =
    typeof radius === 'number'
      ? `${radius}px`
      : radius === undefined
        ? 'var(--lg-radius-md)'
        : radius;
  const surfaceStyle: GlassSurfaceStyle = {
    '--lg-r': radiusValue,
    '--lg-tint': tint,
    '--lg-surface-tint': tint,
    '--lg-filter-url': activeFilter ? `url(#${activeFilter.id})` : undefined,
    ...style,
  };
  const isRefractionActive = canUseRefraction && activeFilter !== null;
  const requestsRefraction =
    refraction === 'auto' &&
    !context.insideGlass &&
    typeof radius !== 'string' &&
    !context.forceFallback &&
    !context.forceReducedTransparency;
  const isRefractionPending =
    requestsRefraction &&
    (!hasResolvedClientSupport || (glassSupport.refraction && !isRefractionActive));

  return (
    <>
      {shouldRenderFilterDefs ? <GlassFilterDefs /> : null}
      <Component
        {...rest}
        ref={setHostRef}
        className={cx('lg-surface', className)}
        style={surfaceStyle}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        data-refraction={isRefractionActive ? 'on' : 'off'}
        data-refraction-pending={isRefractionPending ? '' : undefined}
        data-interactive={interactive ? '' : undefined}
        data-material={material}
        data-nested={context.insideGlass ? '' : undefined}
        data-transparency={glassSupport.reducedTransparency ? 'reduced' : undefined}
      >
        <LiquidGlassContext.Provider value={nestedContext}>
          <div className="lg-surface__content">{children}</div>
        </LiquidGlassContext.Provider>
      </Component>
    </>
  );
});
