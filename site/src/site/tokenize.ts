/**
 * A tokenizer for the TSX in the examples, and only that.
 *
 * Not a parser and not trying to be: the site is held to zero external requests and no runtime
 * dependencies, and a highlighting library is a dependency plus a stylesheet plus a theme to
 * keep in step with this one's colours. What the examples contain is JSX, strings, numbers,
 * comments and a small set of keywords, so that is what this recognises. Anything it does not
 * recognise comes out as plain text, which is the right way to be wrong — unhighlighted code
 * still reads; mangled code does not.
 *
 * The state is whether the scanner is inside a JSX tag, and how deep into `{}` it is there.
 * The first tells `variant` in `<GlassButton variant="glass">` apart from `variant` in
 * `const variant = 1`; the second stops `onSelect={remove}` from colouring `remove` as an
 * attribute, because inside the braces it is ordinary code again.
 */

export type TokenKind = 'keyword' | 'string' | 'comment' | 'number' | 'tag' | 'attr' | 'plain';
export interface Token { kind: TokenKind; text: string }

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'for', 'while', 'of', 'in', 'new', 'class', 'extends', 'typeof', 'instanceof',
  'async', 'await', 'try', 'catch', 'finally', 'throw', 'switch', 'case', 'break', 'continue',
  'interface', 'type', 'enum', 'implements', 'as', 'satisfies', 'declare', 'readonly',
  'true', 'false', 'null', 'undefined', 'void', 'this', 'super',
]);

/** Ordered: the first pattern that matches at the cursor wins. */
const RULES: Array<[TokenKind | 'jsx-open' | 'jsx-close', RegExp]> = [
  ['comment', /\/\/[^\n]*/y],
  ['comment', /\/\*[\s\S]*?\*\//y],
  ['string', /'(?:[^'\\\n]|\\.)*'/y],
  ['string', /"(?:[^"\\\n]|\\.)*"/y],
  ['string', /`(?:[^`\\]|\\.)*`/y],
  // `<Name`, `</Name` and `<>` open a tag context; `>` and `/>` close it.
  ['jsx-open', /<\/?[A-Za-z][\w.]*|<>|<\//y],
  ['jsx-close', /\/?>/y],
  ['number', /\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b/iy],
  ['plain', /[A-Za-z_$][\w$]*/y],
  ['plain', /\s+/y],
  ['plain', /[\s\S]/y],
];

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  /** The element name is part of the opening token, so every bare word after it is an attribute. */
  let inTag = false;
  let braces = 0;

  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ kind, text });
  };

  while (index < source.length) {
    let matched = false;
    for (const [kind, pattern] of RULES) {
      pattern.lastIndex = index;
      const found = pattern.exec(source);
      if (!found || found.index !== index) continue;
      const text = found[0];

      if (kind === 'jsx-open') {
        inTag = true; braces = 0;
        push('tag', text);
      } else if (kind === 'jsx-close') {
        // A `>` inside braces is a comparison or an arrow body, not the end of the tag.
        const closesTag = inTag && braces === 0;
        if (closesTag) inTag = false;
        push(closesTag ? 'tag' : 'plain', text);
      } else if (kind === 'plain' && /^[A-Za-z_$]/.test(text)) {
        if (KEYWORDS.has(text)) push('keyword', text);
        else if (inTag && braces === 0) push('attr', text);
        else push('plain', text);
      } else {
        if (inTag) { if (text === '{') braces++; else if (text === '}') braces = Math.max(0, braces - 1); }
        push(kind as TokenKind, text);
      }

      index += text.length;
      matched = true;
      break;
    }
    // The last rule matches any single character, so this cannot loop — but a regex edited
    // into a zero-length match would hang the page, and a hang is worse than a wrong colour.
    if (!matched) { push('plain', source[index]); index += 1; }
  }
  return tokens;
}
