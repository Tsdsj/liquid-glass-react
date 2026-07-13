import { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { filterRegistry, type FilterEntry } from './filter-registry';

const EMPTY_FILTERS: readonly FilterEntry[] = [];
const hostIds = new Set<number>();
const hostListeners = new Set<() => void>();
let nextHostId = 0;
let currentHostId: number | null = null;

function updateCurrentHost(): void {
  const nextHost = hostIds.values().next().value ?? null;
  if (nextHost === currentHostId) {
    return;
  }

  currentHostId = nextHost;
  hostListeners.forEach((listener) => listener());
}

function subscribeToHost(callback: () => void): () => void {
  hostListeners.add(callback);
  return () => hostListeners.delete(callback);
}

function getHostSnapshot(): number | null {
  return currentHostId;
}

function getServerHostSnapshot(): null {
  return null;
}

export function useFilterDefsHost(enabled: boolean): boolean {
  const hostId = useRef<number | null>(null);
  if (hostId.current === null) {
    nextHostId += 1;
    hostId.current = nextHostId;
  }

  useEffect(() => {
    if (!enabled || hostId.current === null) {
      return undefined;
    }

    const id = hostId.current;
    hostIds.add(id);
    updateCurrentHost();

    return () => {
      hostIds.delete(id);
      updateCurrentHost();
    };
  }, [enabled]);

  const activeHostId = useSyncExternalStore(
    subscribeToHost,
    getHostSnapshot,
    getServerHostSnapshot,
  );

  return enabled && activeHostId === hostId.current;
}

export function GlassFilterDefs() {
  const filters = useSyncExternalStore(
    filterRegistry.subscribe,
    filterRegistry.getSnapshot,
    () => EMPTY_FILTERS,
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'fixed', pointerEvents: 'none' }}
    >
      <defs>
        {filters.map((filter) => (
          <filter
            key={filter.id}
            id={filter.id}
            x="0"
            y="0"
            width={filter.w}
            height={filter.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={filter.mapURI}
              x="0"
              y="0"
              width={filter.w}
              height={filter.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={filter.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>,
    document.body,
  );
}
