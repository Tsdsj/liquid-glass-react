import { makeDisplacementMap } from './displacement-map';

export interface FilterShape {
  w: number;
  h: number;
  r: number;
  bezel: number;
  scale: number;
}

export interface FilterEntry {
  id: string;
  w: number;
  h: number;
  mapURI: string;
  scale: number;
}

export interface FilterRegistry {
  acquire(shape: FilterShape): string;
  release(shape: FilterShape): void;
  subscribe(callback: () => void): () => void;
  getSnapshot(): readonly FilterEntry[];
}

interface RegistryRecord {
  entry: FilterEntry;
  references: number;
  removalTimer: ReturnType<typeof setTimeout> | null;
}

type MapFactory = (w: number, h: number, r: number, bezel: number) => string;

const REMOVE_DELAY = 2000;

function normalizeShape(shape: FilterShape): FilterShape {
  return {
    ...shape,
    w: Math.max(0, Math.round(shape.w)),
    h: Math.max(0, Math.round(shape.h)),
  };
}

function shapeKey(shape: FilterShape): string {
  return `${shape.w}x${shape.h}r${shape.r}b${shape.bezel}s${shape.scale}`;
}

export function createFilterRegistry(mapFactory: MapFactory = makeDisplacementMap): FilterRegistry {
  const records = new Map<string, RegistryRecord>();
  const listeners = new Set<() => void>();
  let snapshot: readonly FilterEntry[] = [];
  let nextId = 0;

  const publish = () => {
    snapshot = Array.from(records.values(), ({ entry }) => entry);
    listeners.forEach((listener) => listener());
  };

  return {
    acquire(inputShape) {
      const shape = normalizeShape(inputShape);
      const key = shapeKey(shape);
      const existing = records.get(key);

      if (existing) {
        existing.references += 1;
        if (existing.removalTimer !== null) {
          clearTimeout(existing.removalTimer);
          existing.removalTimer = null;
        }
        return existing.entry.id;
      }

      nextId += 1;
      const entry: FilterEntry = {
        id: `lg-f-${nextId}`,
        w: shape.w,
        h: shape.h,
        mapURI: mapFactory(shape.w, shape.h, shape.r, shape.bezel),
        scale: shape.scale,
      };

      records.set(key, {
        entry,
        references: 1,
        removalTimer: null,
      });
      publish();
      return entry.id;
    },

    release(inputShape) {
      const shape = normalizeShape(inputShape);
      const key = shapeKey(shape);
      const record = records.get(key);
      if (!record || record.references === 0) {
        return;
      }

      record.references -= 1;
      if (record.references > 0 || record.removalTimer !== null) {
        return;
      }

      record.removalTimer = setTimeout(() => {
        const current = records.get(key);
        if (!current || current.references > 0) {
          return;
        }

        records.delete(key);
        publish();
      }, REMOVE_DELAY);
    },

    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },

    getSnapshot() {
      return snapshot;
    },
  };
}

export const filterRegistry = createFilterRegistry();
