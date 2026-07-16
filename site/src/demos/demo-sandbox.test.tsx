import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoBlock } from '../components/DemoBlock';
import { COMPONENT_DOCS } from './registry';

// The sandbox hint fires toast without a mounted <Toaster/> here — that DEV
// warning is expected (and asserted in toast-store.test); keep output clean.
beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterEach(() => {
  vi.restoreAllMocks();
});

// M27 guard: demos render real components (Breadcrumb/SideNav carry genuine
// `#/…` hrefs), but clicking them inside a demo stage must never move the
// site's hash router. DemoBlock's stage is the sandbox; this sweep keeps every
// current and future demo honest.

function anchorsOf(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]'));
}

describe('demo sandbox', () => {
  it.each(COMPONENT_DOCS.map((doc) => [doc.slug, doc] as const))(
    '%s demos never navigate the site router',
    (_slug, doc) => {
      for (const demo of doc.demos) {
        const startHash = `#/components/${doc.slug}`;
        window.location.hash = startHash;
        const { container, unmount } = render(
          <DemoBlock title={demo.title} description={demo.description} code={demo.code}>
            {demo.render()}
          </DemoBlock>,
        );
        for (const anchor of anchorsOf(container)) {
          // fireEvent returns false when preventDefault was called.
          const defaultAllowed = fireEvent.click(anchor);
          expect(
            defaultAllowed,
            `${doc.slug}/${demo.id}: anchor ${anchor.getAttribute('href')} must be sandboxed`,
          ).toBe(false);
          expect(window.location.hash).toBe(startHash);
        }
        unmount();
      }
    },
  );

  it('actually exercises route anchors (sweep is not vacuous)', () => {
    let total = 0;
    for (const doc of COMPONENT_DOCS) {
      for (const demo of doc.demos) {
        const { container, unmount } = render(
          <DemoBlock title={demo.title} description={demo.description} code={demo.code}>
            {demo.render()}
          </DemoBlock>,
        );
        total += anchorsOf(container).length;
        unmount();
      }
    }
    // Breadcrumb + SideNav demos alone carry several.
    expect(total).toBeGreaterThanOrEqual(4);
  });
});
