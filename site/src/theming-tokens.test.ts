import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TOKEN_REFERENCE } from './theming-tokens';

// vitest runs from the repo root; read the source of truth directly (same
// cwd-relative pattern as the other CSS-source invariant tests).
const tokensCss = readFileSync('src/styles/tokens.css', 'utf8');

// Declaration names only: `--lg-foo:` matches, `var(--lg-foo)` usages don't
// (no colon follows), so references inside calc()/color-mix() are excluded.
function declaredTokens(css: string): string[] {
  return (css.match(/--lg-[a-z0-9-]+(?=\s*:)/g) ?? []).sort();
}

describe('theming token reference', () => {
  it('documents exactly the tokens declared in tokens.css (no drift)', () => {
    const declared = declaredTokens(tokensCss);
    const documented = TOKEN_REFERENCE.map((t) => t.name).sort();

    expect(documented).toEqual(declared);
  });

  it('has no duplicate entries', () => {
    const names = TOKEN_REFERENCE.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
