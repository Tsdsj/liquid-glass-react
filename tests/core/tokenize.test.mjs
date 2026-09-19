import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../../site/src/site/tokenize.ts';

/**
 * The documentation site highlights its own code rather than pulling in a library, because it
 * is held to zero external requests. That makes correctness this file's problem.
 *
 * The property that matters most is the boring one: highlighting must not change the code.
 * A tokenizer that drops or duplicates a character produces something that reads fine and does
 * not run, which is worse than no colour at all.
 *
 * Imported straight as TypeScript — the file has no imports of its own, so Node's type
 * stripping is enough and there is nothing to compile first.
 */

const join = source => tokenize(source).map(token => token.text).join('');
const kinds = source => Object.fromEntries(
  tokenize(source).reduce((map, token) => map.set(token.kind, (map.get(token.kind) ?? 0) + token.text.length), new Map()));

const SAMPLES = [
  `import { GlassButton } from '@ttqtt/liquid-glass-react';`,
  `<GlassButton variant="glassProminent" onClick={() => save()}>导出</GlassButton>`,
  `const items = [{ key: 'a', label: '打开', shortcut: '⌘O' }];\n// a comment\n/* and a block */`,
  `<GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} min={0} max={100} />`,
  'const template = `a ${b} c`; const n = 1_000.5; const e = 1e-3;',
  `if (a > b && c < d) return <>{a}</>;`,
  '',
  '<',
  '`unterminated',
];

test('tokenizing never changes the text', () => {
  for (const sample of SAMPLES) {
    assert.equal(join(sample), sample, `round trip failed for: ${JSON.stringify(sample)}`);
  }
});

test('JSX attributes are told apart from ordinary identifiers', () => {
  const jsx = kinds(`<GlassButton variant="glass">x</GlassButton>`);
  assert.ok(jsx.attr > 0, 'variant was not marked as an attribute');
  const code = kinds(`const variant = 1;`);
  assert.equal(code.attr, undefined, 'a plain identifier was marked as an attribute');
});

test('an expression inside a tag is code again, not attributes', () => {
  // `remove` is a value being passed, not a prop name; only `onSelect` is the prop.
  const tokens = tokenize(`<GlassMenu onSelect={remove} />`);
  const attrs = tokens.filter(token => token.kind === 'attr').map(token => token.text.trim());
  assert.deepEqual(attrs, ['onSelect']);
});

test('keywords, strings, numbers and comments are recognised', () => {
  const counts = kinds(`const a = 'text'; // note\nconst b = 42;`);
  assert.ok(counts.keyword > 0);
  assert.ok(counts.string >= `'text'`.length);
  assert.ok(counts.number >= 2);
  assert.ok(counts.comment > 0);
});

test('unterminated input terminates', () => {
  // A regex that could match nothing would hang the page rather than mis-colour it.
  for (const sample of ['`', "'", '/*', '<Glass', '{']) {
    assert.equal(join(sample), sample);
  }
});
