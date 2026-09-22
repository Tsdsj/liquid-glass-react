import test from 'node:test';
import assert from 'node:assert/strict';
import { packedManifest } from '../../scripts/lib/packed-manifest.mjs';

/**
 * The release gate reads `npm pack --json`, and the release job installs `npm@latest` — so the
 * shape of that output is outside this repository's control and changed under it once already.
 *
 * npm 11 returns an array; npm 12 returns an object keyed by package name. The publish job for
 * 0.0.2 died on `packed[0].files` with a `TypeError`, after the full suite had passed and the
 * npm environment had been approved by hand. These are the two real shapes, recorded from
 * `npm@11.16.0` and `npm@12.0.2`.
 */

const entry = {
  id: '@ttqtt/liquid-glass-react@0.0.2',
  name: '@ttqtt/liquid-glass-react',
  size: 390113,
  unpackedSize: 1366567,
  files: [{ path: 'package.json', size: 1200 }, { path: 'dist/index.js', size: 176972 }],
};

test('npm 11 answers with an array', () => {
  const manifest = packedManifest([entry]);
  assert.equal(manifest?.files.length, 2);
  assert.equal(manifest.size, 390113);
});

test('npm 12 answers with an object keyed by package name', () => {
  const manifest = packedManifest({ '@ttqtt/liquid-glass-react': entry });
  assert.equal(manifest?.files.length, 2);
  assert.equal(manifest.size, 390113);
});

test('a workspace answer picks the entry that has the files', () => {
  const manifest = packedManifest({ other: { name: 'other' }, mine: entry });
  assert.equal(manifest?.name, '@ttqtt/liquid-glass-react');
});

/**
 * `null` rather than a throw, so the caller can say which npm produced it and what was
 * expected. A `TypeError` in a publish job tells whoever is reading the log nothing about what
 * to fix, which is exactly how the first attempt at 0.0.2 ended.
 */
for (const [what, raw] of [
  ['a bare string', 'not json-shaped'],
  ['an empty array', []],
  ['an empty object', {}],
  ['null', null],
  ['an entry with no file list', [{ name: 'x' }]],
]) {
  test(`an unrecognised shape is reported, not thrown — ${what}`, () => {
    assert.equal(packedManifest(raw), null);
  });
}
