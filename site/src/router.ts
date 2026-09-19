import { useEffect, useState } from 'react';

export interface Route {
  /** Path after the leading `#/`, e.g. `components/button`. */
  path: string;
  /** `changelog` belongs to no section, so nothing in the navigation lights up for it. */
  section: 'overview' | 'foundations' | 'components' | 'guides' | 'changelog';
  title: string;
}

export const normalize = (hash: string) => {
  const raw = hash.replace(/^#\/?/, '').trim();
  return raw === '' ? 'overview' : raw.replace(/\/+$/, '');
};

/** Minimal hash router. A real app would use its own; this keeps the demo dependency-free. */
export function useRoute(): [string, (path: string) => void] {
  const [path, setPath] = useState(() => (typeof location === 'undefined' ? 'overview' : normalize(location.hash)));
  useEffect(() => {
    const update = () => { setPath(normalize(location.hash)); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const go = (next: string) => { location.hash = `#/${next}`; };
  return [path, go];
}

export const sectionOf = (path: string): Route['section'] => {
  if (path.startsWith('components')) return 'components';
  if (path.startsWith('foundations')) return 'foundations';
  if (path.startsWith('guides')) return 'guides';
  if (path === 'changelog') return 'changelog';
  return 'overview';
};
