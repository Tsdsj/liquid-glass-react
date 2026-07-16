import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

function readCss(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

function parseDeclarations(body: string): Record<string, string> {
  const declarations: Record<string, string> = {};
  for (const match of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    declarations[match[1]] = match[2].trim();
  }
  return declarations;
}

describe('registered custom properties consumed by pseudo-elements', () => {
  // A pseudo-element cannot inherit a registered property declared on its host
  // unless the property registration opts into inheritance; otherwise it falls
  // back to initial-value. Every @property in glass-surface.css is declared on
  // .lg-surface and consumed in ::before/::after, so all must inherit.
  const css = readCss('../core/GlassSurface/glass-surface.css');
  const blocks = [...css.matchAll(/@property\s+(--[\w-]+)\s*\{([^}]*)\}/g)];

  it('registers the three expected properties', () => {
    expect(blocks.map((block) => block[1])).toEqual(
      expect.arrayContaining(['--lg-pointer-x', '--lg-pointer-y', '--lg-surface-tint-active']),
    );
  });

  it('marks every registered property as inheriting', () => {
    expect(blocks.length).toBeGreaterThan(0);
    for (const [, name, body] of blocks) {
      expect(body, `${name} must be registered with inherits: true`).toMatch(
        /inherits:\s*true/,
      );
    }
  });
});

describe('content box does not round-clip its glyphs (M6e/H1)', () => {
  // contain: paint clips descendants along the element's own border-radius. The
  // content box is inset within the host padding yet inherited the host's full
  // radius, so on pill hosts the corner arc bit into first/last glyphs. The
  // visual rounding lives on the host (::before/::after/backdrop-filter), so the
  // content box must clip as a rectangle. Paint containment itself is kept.
  const css = readCss('../core/GlassSurface/glass-surface.css');
  const block = /\.lg-surface__content\s*\{([^}]*)\}/.exec(css);

  it('defines the content block', () => {
    expect(block).not.toBeNull();
  });

  it('keeps paint containment', () => {
    expect(block?.[1]).toMatch(/contain:\s*layout\s+paint/);
  });

  it('does not inherit the host border-radius', () => {
    expect(block?.[1]).not.toMatch(/border-radius:\s*inherit/);
  });
});

describe('scroll-edge overlay height is clamped to the viewport (M6e/H2)', () => {
  // A fixed 32px overlay blankets a whole row on short panels. Clamp it so it
  // never covers more than a fraction of the visible area.
  const css = readCss('../core/scroll-edge/scroll-edge.css');
  const block = /(?:^|\n)\.lg-scroll-edge__overlay\s*\{([^}]*)\}/.exec(css);

  it('clamps the overlay height with min()', () => {
    expect(block?.[1]).toMatch(/height:\s*min\(\s*var\(--lg-scroll-edge-size\)/);
  });
});

describe('tooltip fades on the glass layer, not its ancestor (M6f/1)', () => {
  // An ancestor with opacity < 1 forms a backdrop root, so fading the tooltip
  // host would blank the panel's backdrop blur for the whole animation — the
  // same root cause fixed for Popover/Modal/Select/Toast in 19d1ace.
  const css = readCss('../components/Tooltip/tooltip.css');
  const host = /(?:^|\n)\.lg-tooltip\s*\{([^}]*)\}/.exec(css);
  const panel = /(?:^|\n)\.lg-tooltip__panel\s*\{([^}]*)\}/.exec(css);
  const arrow = /(?:^|\n)\.lg-tooltip__arrow\s*\{([^}]*)\}/.exec(css);

  it('keeps the host free of opacity declarations and opacity transitions', () => {
    expect(host).not.toBeNull();
    expect(host?.[1]).not.toMatch(/(?:^|;|\s)opacity:/);
    expect(host?.[1]).not.toMatch(/transition:[^;]*opacity/);
  });

  it('fades the glass panel and the arrow via their own opacity', () => {
    expect(panel?.[1]).toMatch(/(?:^|;|\s)opacity:/);
    expect(panel?.[1]).toMatch(/transition:[^;]*opacity/);
    expect(arrow?.[1]).toMatch(/(?:^|;|\s)opacity:/);
    expect(arrow?.[1]).toMatch(/transition:[^;]*opacity/);
  });
});

describe('overlay entrances use the bounce ease on transform only (M6f/3)', () => {
  // The open-state rule carries the enter transition (a transition reads the
  // destination state's `transition` value), so entrances overshoot while exits
  // fall back to the base rule's plain ease. Opacity never uses the bounce, and
  // every reduced-motion block must re-override the open-state rule (its
  // specificity beats the media block's base selector).
  const cases = [
    { file: '../components/Popover/popover.css', openMarker: ".lg-popover[data-status='open']" },
    {
      file: '../components/Select/select.css',
      openMarker: ".lg-select__panel[data-status='open']",
    },
    { file: '../components/Modal/modal.css', openMarker: ".lg-modal__panel[data-status='open']" },
    { file: '../components/Tooltip/tooltip.css', openMarker: ".lg-tooltip[data-status='open']" },
  ];

  function splitByMedia(css: string): { base: string; reduced: string } {
    const match = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}/.exec(css);
    expect(match, 'reduced-motion block missing').not.toBeNull();
    return { base: css.slice(0, match?.index ?? 0), reduced: match?.[1] ?? '' };
  }

  function openRuleBodies(source: string, marker: string): string[] {
    const bodies: string[] = [];
    let start = source.indexOf(marker);
    while (start !== -1) {
      const body = /\{([^}]*)\}/.exec(source.slice(start));
      if (body) {
        bodies.push(body[1]);
      }
      start = source.indexOf(marker, start + marker.length);
    }
    return bodies;
  }

  it.each(cases)('bounces the enter transform in $file', ({ file, openMarker }) => {
    const { base } = splitByMedia(readCss(file));
    const bodies = openRuleBodies(base, openMarker);
    expect(bodies.length, `open-state rule missing in ${file}`).toBeGreaterThan(0);
    expect(
      bodies.some((body) =>
        /transition:[^;]*transform[^;]*var\(--lg-ease-bounce\)/.test(body),
      ),
      `${file} open state must transition transform with --lg-ease-bounce`,
    ).toBe(true);
    for (const body of bodies) {
      expect(body).not.toMatch(/opacity[^;,]*var\(--lg-ease-bounce\)/);
    }
  });

  it.each(cases)('mirrors a reduced-motion override for the open state in $file', ({
    file,
    openMarker,
  }) => {
    const { reduced } = splitByMedia(readCss(file));
    expect(
      reduced.includes(openMarker),
      `${file} reduced-motion block must re-override the open-state rule`,
    ).toBe(true);
    expect(reduced).not.toMatch(/var\(--lg-ease-bounce\)/);
  });

  it('bounces the toast enter animation and restores plain ease under reduced motion', () => {
    const css = readCss('../toast/toast.css');
    const { base, reduced } = splitByMedia(css);
    const toast = /(?:^|\n)\.lg-toast\s*\{([^}]*)\}/.exec(base);
    expect(toast?.[1]).toMatch(/animation:[^;]*lg-toast-enter[^;]*var\(--lg-ease-bounce\)/);
    expect(reduced).toMatch(/animation-timing-function:\s*var\(--lg-ease\)/);
  });
});

describe('interactive surfaces lift on hover and settle instantly under reduced motion (M20)', () => {
  const css = readCss('../core/GlassSurface/glass-surface.css');
  const reducedStart = css.search(/@media \(prefers-reduced-motion: reduce\)/);
  const base = css.slice(0, reducedStart);
  const reduced = css.slice(reducedStart);

  function bodiesOf(source: string, selector: string): string[] {
    const bodies: string[] = [];
    let start = source.indexOf(selector);
    while (start !== -1) {
      const body = /\{([^}]*)\}/.exec(source.slice(start));
      if (body) {
        bodies.push(body[1]);
      }
      start = source.indexOf(selector, start + selector.length);
    }
    return bodies;
  }

  it('lifts interactive surfaces via translateY(var(--lg-hover-lift)) on hover', () => {
    const bodies = bodiesOf(base, '.lg-surface[data-interactive]:hover');
    expect(bodies.length).toBeGreaterThan(0);
    expect(
      bodies.some((body) => /transform:[^;]*translateY\(\s*var\(--lg-hover-lift\)/.test(body)),
    ).toBe(true);
  });

  it('drives the transform transition from the press-speed token on interactive surfaces', () => {
    const bodies = bodiesOf(base, '.lg-surface[data-interactive]');
    expect(
      bodies.some((body) =>
        /--lg-surface-transform-duration:\s*var\(--lg-duration-press\)/.test(body),
      ),
    ).toBe(true);
  });

  it('cancels the hover lift under reduced motion', () => {
    const bodies = bodiesOf(reduced, '.lg-surface[data-interactive]:hover');
    expect(bodies.length).toBeGreaterThan(0);
    expect(bodies.some((body) => /transform:\s*none/.test(body))).toBe(true);
  });
});

describe('dark theme token parity', () => {
  const themes = readCss('./themes.css');
  const dataThemeMatch = /\[data-theme='dark'\]\s*\{([\s\S]*?)\}/.exec(themes);
  const mediaRootMatch = /:root:not\(\[data-theme\]\)\s*\{([\s\S]*?)\}/.exec(themes);

  it('defines both dark blocks', () => {
    expect(dataThemeMatch).not.toBeNull();
    expect(mediaRootMatch).not.toBeNull();
  });

  it('declares identical tokens in the attribute and media-query dark blocks', () => {
    const attributeTokens = parseDeclarations(dataThemeMatch?.[1] ?? '');
    const mediaTokens = parseDeclarations(mediaRootMatch?.[1] ?? '');
    expect(mediaTokens).toEqual(attributeTokens);
  });
});
