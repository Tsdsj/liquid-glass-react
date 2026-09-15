import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * Rules the stylesheet has to keep that no runtime test can see, because they are about the
 * states a desktop browser never enters.
 */
const css = readFileSync(new URL('../../src/styles/components.css', import.meta.url), 'utf8');

/** Top-level rules only: anything already inside an at-rule block is its own context. */
function topLevelLines(source) {
  const lines = source.split('\n');
  const out = [];
  let depth = 0;
  for (const line of lines) {
    if (depth === 0) out.push(line);
    depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
    if (depth < 0) depth = 0;
  }
  return out;
}

test('every hover rule is gated on a pointer that can hover', () => {
  // A touch screen has no hover, so the last control tapped keeps the state until something else
  // is tapped — a highlight stuck on the button you just pressed.
  const stray = topLevelLines(css).filter(line => line.includes(':hover') && !line.trim().startsWith('/*'));
  assert.deepEqual(stray, [], `ungated hover rules:\n${stray.join('\n')}`);
});

test('colour comes from tokens, not from literals', () => {
  // #fff and #000 are the two legitimate absolutes (a knob, a scrim). Anything else is a colour
  // that has no dark, increase-contrast or forced-colors counterpart.
  const literals = (css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).filter(value => !/^#(fff|000)$/i.test(value));
  assert.deepEqual([...new Set(literals)], [], 'hard-coded colours bypass the palette');
});

test('nothing claims a compositing layer up front', () => {
  // A blanket will-change on glass promotes every surface whether or not it ever animates.
  assert.equal(/will-change/.test(css), false);
});
