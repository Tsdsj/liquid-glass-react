import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readCss(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url).pathname, 'utf8');
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
