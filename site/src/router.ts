import { useEffect, useState } from 'react';

export type Route =
  | { page: 'home' }
  | { page: 'components'; slug?: string }
  | { page: 'guide' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (path === 'guide') {
    return { page: 'guide' };
  }
  if (path === 'components') {
    return { page: 'components' };
  }
  const detail = /^components\/([\w-]+)$/.exec(path);
  if (detail) {
    return { page: 'components', slug: detail[1] };
  }
  return { page: 'home' };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { page: 'home' } : parseHash(window.location.hash),
  );

  useEffect(() => {
    const applyHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', applyHash);
    applyHash();
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  return route;
}

export function routeHref(route: Route): string {
  if (route.page === 'guide') {
    return '#/guide';
  }
  if (route.page === 'components') {
    return route.slug ? `#/components/${route.slug}` : '#/components';
  }
  return '#/';
}
