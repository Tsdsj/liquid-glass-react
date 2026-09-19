import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * Rules the stylesheet has to keep that no runtime test can see, because they are about the
 * states a desktop browser never enters.
 */
const css = readFileSync(new URL('../../src/styles/components.css', import.meta.url), 'utf8');

/**
 * Top-level rules only: anything already inside an at-rule block is its own context.
 *
 * Counted per character rather than per line. The first version counted braces per line and
 * so decided what was nested from how the file happened to be wrapped — a complete
 * `@media (hover: hover) { … }` written on one line opened and closed within a line it had
 * already emitted, and was reported as ungated. That is a false positive about formatting,
 * which is the worst kind: the rule was right and the checker said it was wrong.
 */
function topLevelLines(source) {
  /* Cut out every at-rule block, braces matched, however it is wrapped. What is left is the
     top level, and it can then be read a line at a time without formatting mattering. */
  let out = '';
  for (let index = 0; index < source.length;) {
    if (source[index] !== '@') { out += source[index++]; continue; }
    const open = source.indexOf('{', index);
    // An at-rule with no block — `@import`, `@charset` — is a statement, not a context.
    if (open === -1 || source.slice(index, open).includes(';')) { out += source[index++]; continue; }
    let depth = 0, cursor = open;
    for (; cursor < source.length; cursor++) {
      if (source[cursor] === '{') depth++;
      else if (source[cursor] === '}' && --depth === 0) { cursor++; break; }
    }
    // Keep the newlines so reported line numbers still mean something.
    out += source.slice(index, cursor).replace(/[^\n]/g, '');
    index = cursor;
  }
  return out.split('\n');
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
