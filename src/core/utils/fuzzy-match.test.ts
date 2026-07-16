import { describe, expect, it } from 'vitest';
import { commandMatches, fuzzyMatch } from './fuzzy-match';

describe('fuzzyMatch', () => {
  it('matches any text on an empty query', () => {
    expect(fuzzyMatch('', 'anything')).toBe(true);
    expect(fuzzyMatch('   ', 'anything')).toBe(true);
  });

  it('matches an in-order subsequence, case-insensitively', () => {
    expect(fuzzyMatch('ab', 'a x b')).toBe(true);
    expect(fuzzyMatch('NG', 'New Group')).toBe(true);
  });

  it('rejects out-of-order or missing characters', () => {
    expect(fuzzyMatch('ba', 'abc')).toBe(false);
    expect(fuzzyMatch('abz', 'abc')).toBe(false);
  });
});

describe('commandMatches', () => {
  it('matches the label or any keyword', () => {
    expect(commandMatches('cpy', 'Copy link', [])).toBe(true);
    expect(commandMatches('dup', 'Copy link', ['duplicate'])).toBe(true);
  });

  it('returns false when nothing matches', () => {
    expect(commandMatches('zzz', 'Copy link', ['duplicate'])).toBe(false);
  });

  it('matches everything on an empty query', () => {
    expect(commandMatches('', 'Copy link')).toBe(true);
  });
});
