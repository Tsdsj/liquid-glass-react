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
/**
 * Comments out, newlines kept.
 *
 * Prose is not a rule, and a checker that reads it as one teaches people to write worse
 * comments to keep it quiet. This was a real failure: a comment explaining why a `:hover` rule
 * had to move was reported as an ungated `:hover` rule. The filter it replaces only skipped
 * lines that *began* with `/*`, so it caught a one-line comment and missed the second line of
 * a block one. Removing them first also keeps a commented-out `@media` from opening a context
 * the scan below would then try to match a brace for.
 */
const withoutComments = source => source.replace(/\/\*[\s\S]*?\*\//g,
  comment => comment.replace(/[^\n]/g, ''));

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
  const stray = topLevelLines(withoutComments(css)).filter(line => line.includes(':hover'));
  assert.deepEqual(stray, [], `ungated hover rules:\n${stray.join('\n')}`);
});

test('colour comes from tokens, not from literals', () => {
  // #fff and #000 are the two legitimate absolutes (a knob, a scrim). Anything else is a colour
  // that has no dark, increase-contrast or forced-colors counterpart.
  const literals = (css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).filter(value => !/^#(fff|000)$/i.test(value));
  assert.deepEqual([...new Set(literals)], [], 'hard-coded colours bypass the palette');
});

/**
 * The two Increase Contrast palettes are the same palette.
 *
 * One arrives from the OS as `prefers-contrast: more`, the other from an application's own
 * settings screen as `contrast="more"` on GlassProvider, and the second is the step the HIG
 * lets a below-4.5:1 default stand on. It used to swap three label alphas and leave all twelve
 * system colours alone, so the opt-in was a visibly weaker setting than the one it claims to
 * layer over. CSS cannot share declarations between a media query and a selector, so the
 * duplication is deliberate and this is what keeps it honest.
 */
test('the opt-in increase-contrast palette matches the media-query one', () => {
  const tokens = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  /** Every `--name: value` inside a block, as a sorted comparable set. */
  const declarations = source => [...source.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)]
    .map(([, name, value]) => `${name}: ${value.trim()}`).sort();
  const block = selector => {
    const at = tokens.indexOf(selector);
    assert.notEqual(at, -1, `no block for ${selector}`);
    const open = tokens.indexOf('{', at);
    return declarations(tokens.slice(open + 1, tokens.indexOf('}', open)));
  };
  for (const [fromMedia, fromAttribute] of [
    ['[data-lg-theme="light"] {\n    --lg-red', '[data-lg-contrast="more"],'],
    ['[data-lg-theme="dark"] {\n    --lg-red', '[data-lg-contrast="more"][data-lg-theme="dark"],'],
  ]) {
    assert.deepEqual(block(fromAttribute), block(fromMedia),
      `the ${fromAttribute} palette has drifted from the media query's`);
  }
});

test('nothing claims a compositing layer up front', () => {
  // A blanket will-change on glass promotes every surface whether or not it ever animates.
  assert.equal(/will-change/.test(css), false);
});

/**
 * The exit duration exists twice, and the two copies have to agree.
 *
 * CSS animates the element out; JavaScript is what takes it out of the tree afterwards, and
 * nothing in CSS can tell it when. If the number in `leave.ts` is the smaller of the two, a
 * toast is removed part-way through fading and blinks out; if it is the larger, the element
 * sits finished and invisible for the difference. Neither is visible in a test that only
 * checks that *something* animated, which is why this is checked here instead.
 */
test('the duration tokens and their JavaScript copies are the same numbers', () => {
  const tokens = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  const leave = readFileSync(new URL('../../src/react/system/leave.ts', import.meta.url), 'utf8');
  for (const [token, constant] of [['exit', 'EXIT_MS'], ['layout', 'LAYOUT_MS']]) {
    const fromCss = tokens.match(new RegExp(`--lg-duration-${token}:\\s*(\\d+)ms`));
    const fromJs = leave.match(new RegExp(`export const ${constant} = (\\d+)`));
    assert.ok(fromCss, `--lg-duration-${token} is not declared in tokens.css`);
    assert.ok(fromJs, `${constant} is not exported from leave.ts`);
    assert.equal(Number(fromJs[1]), Number(fromCss[1]),
      `leave.ts waits ${fromJs[1]}ms for something the stylesheet plays over ${fromCss[1]}ms`);
  }
});

/**
 * The two desktop metric tables are the same table.
 *
 * Exactly the Increase Contrast situation, one level up: the media query answers a machine
 * with a mouse, the attribute answers `platform="desktop"` from an application, and CSS has no
 * way to share the declarations between them. Drift here would mean a control that is 36px
 * tall when the browser decides and 44px when the application asks for the same thing.
 */
test('the opt-in desktop metrics match the media-query ones', () => {
  const tokens = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  const declarations = source => [...source.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)]
    .map(([, name, value]) => `${name}: ${value.trim()}`).sort();
  const block = selector => {
    const at = tokens.indexOf(selector);
    assert.notEqual(at, -1, `no block for ${selector}`);
    const open = tokens.indexOf('{', at);
    return declarations(tokens.slice(open + 1, tokens.indexOf('}', open)));
  };
  const fromMedia = block(':root:not([data-lg-platform="touch"])');
  const fromAttribute = block(':root[data-lg-platform="desktop"]');
  assert.ok(fromMedia.length > 8, `the desktop table has only ${fromMedia.length} declarations`);
  assert.deepEqual(fromAttribute, fromMedia, 'the desktop metrics have drifted apart');
});

/**
 * There is one type scale, and a pointer does not get its own.
 *
 * This block used to hold the AppKit text table — Body 13/16, Large Title 26/32 — and it was
 * the wrong table for a page in a browser: the browser's own default body size is 16px, Apple
 * draws 17/25 on developer.apple.com, and nine of eleven component-library documentation sites
 * measured at 1600px draw 16. A pointer is more precise than a fingertip, which is a fact
 * about the *hand*; the control heights above are the whole of what follows from it.
 *
 * Asserted rather than left as a comment because the tempting fix for "this desktop layout
 * feels loose" is to shave two points off the type, and that is how the 13px came back.
 */
test('the desktop metrics size the controls and leave the type alone', () => {
  const tokens = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  const at = tokens.indexOf(':root[data-lg-platform="desktop"]');
  const block = tokens.slice(at, tokens.indexOf('}', at));
  const text = [...block.matchAll(/(--lg-text-[\w-]+)\s*:/g)].map(([, name]) => name);
  assert.deepEqual(text, [], `the desktop block re-declares ${text.join(', ')}`);
  const heights = [...block.matchAll(/--lg-height-[\w-]+:\s*(\d+)px/g)].map(([, px]) => Number(px));
  assert.ok(heights.length >= 7, `only ${heights.length} control heights on desktop`);
  for (const height of heights) {
    assert.ok(height >= 24, `a ${height}px control is under the 24px pointer target floor`);
  }
});
