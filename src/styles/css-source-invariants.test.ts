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
