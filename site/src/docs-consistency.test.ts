import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMPONENT_DOCS } from './demos/registry';

// M29 drift guards: user-facing docs must not fall out of sync with the actual
// component catalog. The site derives its count from COMPONENT_DOCS directly;
// README and CHANGELOG carry literals, so pin them here.

describe('docs consistency', () => {
  it('README component count matches the catalog', () => {
    const readme = readFileSync('README.md', 'utf8');
    const match = /(\d+) 个组件/.exec(readme);
    expect(match, 'README must state the component count').not.toBeNull();
    expect(Number(match![1])).toBe(COMPONENT_DOCS.length);
  });

  it('CHANGELOG Unreleased states the current total', () => {
    const changelog = readFileSync('CHANGELOG.md', 'utf8');
    const unreleased = changelog.split('## [0.1.0]')[0];
    expect(unreleased).toContain(`→ ${COMPONENT_DOCS.length}`);
  });
});
