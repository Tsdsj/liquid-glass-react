#!/usr/bin/env node
/**
 * The property tables on the documentation site are hand-written, and nothing made them agree
 * with the interfaces they describe. A prop added to a component is a prop the site silently
 * does not mention, and a prop removed from one is a row that silently describes nothing.
 *
 * So: ask TypeScript what each `*Props` interface actually declares, ask the catalog what each
 * page actually lists, and compare. Runs as part of `pnpm build:site`, because a table that is
 * wrong is worse than no table and should not be publishable.
 *
 * **Only a component's own properties.** Everything inherited — `HTMLAttributes`,
 * `RefAttributes`, `GlassSurfaceOptions` — is documented once in `docs/api.md` under "what
 * every component accepts", and repeating three hundred DOM attributes on every page would
 * bury the six that matter. Ownership is decided by where the declaration is: inside `src/`
 * and not in one of the shared shapes.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = resolve(import.meta.dirname, '..');

/**
 * Shapes many components mix in, whose members belong to the shared contract rather than to
 * any one page. `OpenProps` is the overlay opening protocol — `trigger`, `open`, `defaultOpen`,
 * `onOpenChange` — which every overlay has identically and `docs/api.md` states once.
 */
const SHARED = new Set(['GlassSurfaceOptions', 'FieldShape', 'OpenProps']);

/**
 * `children` is what goes inside. Every container has it, it means the same thing every time,
 * and a row saying so on thirty pages is thirty rows of noise between the reader and the six
 * properties that are actually about this component.
 */
const UNIVERSAL = new Set(['children']);

/* ---------------------------------------------------------------------------------------
 * 1. What the interfaces declare.
 * ------------------------------------------------------------------------------------- */

const configPath = ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json');
const parsed = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, root,
);
const program = ts.createProgram([resolve(root, 'src/index.ts')], parsed.options);
const checker = program.getTypeChecker();

const entry = program.getSourceFile(resolve(root, 'src/index.ts'));
const moduleSymbol = checker.getSymbolAtLocation(entry);
const exported = checker.getExportsOfModule(moduleSymbol);

/** Component name → the props it declares itself. */
const declared = new Map();
for (const symbol of exported) {
  if (!symbol.name.endsWith('Props')) continue;
  const component = symbol.name.replace(/Props$/, '');
  const type = checker.getDeclaredTypeOfSymbol(symbol);
  const own = new Set();
  for (const property of checker.getPropertiesOfType(type)) {
    const declaration = property.declarations?.[0];
    if (!declaration) continue;
    const file = declaration.getSourceFile().fileName;
    // Inherited from React or the DOM: documented once, centrally.
    if (!file.startsWith(resolve(root, 'src'))) continue;
    // Inherited from a shape every component mixes in: same.
    const owner = declaration.parent;
    if (ts.isInterfaceDeclaration(owner) && SHARED.has(owner.name.text)) continue;
    if (UNIVERSAL.has(property.name)) continue;
    own.add(property.name);
  }
  // A union of two shapes (TextField) reports the intersection; take the union instead.
  if (type.isUnion?.()) {
    for (const member of type.types) {
      for (const property of checker.getPropertiesOfType(member)) {
        const declaration = property.declarations?.[0];
        if (!declaration) continue;
        if (!declaration.getSourceFile().fileName.startsWith(resolve(root, 'src'))) continue;
        const owner = declaration.parent;
        if (ts.isInterfaceDeclaration(owner) && SHARED.has(owner.name.text)) continue;
        if (UNIVERSAL.has(property.name)) continue;
        own.add(property.name);
      }
    }
  }
  declared.set(component, own);
}

/* ---------------------------------------------------------------------------------------
 * 2. What the catalog lists.
 *
 * Parsed as syntax, with no type checker: the catalog is a set of object literals and the
 * shape being looked for — `slug`, `name`, `props: [{ name: '…' }]` — is right there in the
 * tree. A regular expression over the same text would find `name:` inside every demo as well.
 * ------------------------------------------------------------------------------------- */

const CATALOG = ['content', 'controls', 'fields', 'navigation', 'overlays']
  .map(file => resolve(root, `site/src/catalog/${file}.tsx`));

/** Component name → { slug, rows: Set<string> }. */
const documented = new Map();
for (const file of CATALOG) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = node => {
    if (ts.isObjectLiteralExpression(node)) {
      const read = key => node.properties.find(property =>
        ts.isPropertyAssignment(property) && property.name.getText() === key);
      const slug = read('slug'), name = read('name'), props = read('props'), examples = read('examples');
      const group = read('group'), related = read('related');
      if (slug && name && props && ts.isArrayLiteralExpression(props.initializer)) {
        const rows = new Set();
        for (const row of props.initializer.elements) {
          if (!ts.isObjectLiteralExpression(row)) continue;
          const rowName = row.properties.find(property =>
            ts.isPropertyAssignment(property) && property.name.getText() === 'name');
          if (!rowName || !ts.isStringLiteralLike(rowName.initializer)) continue;
          /* One row often covers a pair — "value / defaultValue", "icon / trailingIcon" —
             because they are one idea with two spellings. Both count as documented. */
          for (const part of rowName.initializer.text.split('/')) {
            const trimmed = part.trim().replace(/^`|`$/g, '');
            if (trimmed) rows.add(trimmed);
          }
        }
        /* How many examples the page carries, and how many of them are adjustable. Counted from
           the same tree rather than at runtime, because the point is to fail the build before
           the page is published, not to notice afterwards. */
        const entries = examples && ts.isArrayLiteralExpression(examples.initializer)
          ? examples.initializer.elements.filter(ts.isObjectLiteralExpression) : [];
        const adjustable = entries.filter(entry => entry.properties.some(property =>
          ts.isPropertyAssignment(property) && property.name.getText() === 'knobs')).length;
        /* Which examples can be seen over a photograph. A glass surface's whole claim is that
           it takes its colour from what is behind it, and a page that only ever shows it on a
           flat panel never makes that claim testable by the reader. */
        const overMedia = entries.filter(entry => entry.properties.some(property =>
          ts.isPropertyAssignment(property) && property.name.getText() === 'backdrop'
          && ts.isStringLiteralLike(property.initializer)
          && (property.initializer.text === 'both' || property.initializer.text === 'media'))).length;
        documented.set(name.initializer.text, {
          slug: slug.initializer.text, rows, file, examples: entries.length, adjustable, overMedia,
          group: group && ts.isStringLiteralLike(group.initializer) ? group.initializer.text : '',
          related: related && ts.isArrayLiteralExpression(related.initializer)
            ? related.initializer.elements.filter(ts.isStringLiteralLike).map(node => node.text) : [],
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/* ---------------------------------------------------------------------------------------
 * 3. Compare.
 * ------------------------------------------------------------------------------------- */

/**
 * Three examples per page, and exactly one of them adjustable.
 *
 * Three because one example answers one question, and a reader arrives with at least three:
 * what the states are, how it behaves at other sizes or densities, and what it looks like over
 * something. One adjustable example because a page where everything has knobs is a control
 * panel with some components in it, and a page where none does cannot answer "what does this
 * property actually do" without a copy-paste round trip.
 */
const MIN_EXAMPLES = 3;

/**
 * The groups whose components exist to float above something. For these, at least one example
 * has to be viewable over a photograph.
 *
 * Of roughly 120 examples, 13 could be seen on anything but a flat panel, and the overlay group
 * — popover, menu, sheet, alert, action sheet, dialog, toast, banner — had none at all. Those
 * are the components for which "floats above content" is the entire description, so a
 * documentation site that never shows them above any content is arguing against itself.
 */
const MUST_SHOW_MEDIA = new Set(['浮层']);

const slugs = new Set([...documented.values()].map(page => page.slug));

const problems = [];
for (const [component, page] of documented) {
  if (MUST_SHOW_MEDIA.has(page.group) && page.overMedia === 0) {
    problems.push(`${page.slug} is in 浮层 and no example can be seen over a photograph; give one backdrop: 'both'`);
  }
  /* A dead cross-reference used to be a `console.warn` in the browser and a link that quietly
     vanished from the page — two ways of not being noticed. */
  for (const slug of page.related) {
    if (!slugs.has(slug)) problems.push(`${page.slug}.related names "${slug}", which is not a component page`);
  }
  if (page.examples < MIN_EXAMPLES) {
    problems.push(`${page.slug} has ${page.examples} example${page.examples === 1 ? '' : 's'}; a page needs at least ${MIN_EXAMPLES}`);
  }
  if (page.adjustable !== 1) {
    problems.push(`${page.slug} has ${page.adjustable} example${page.adjustable === 1 ? '' : 's'} with knobs; exactly one should be adjustable`);
  }
  const own = declared.get(component);
  if (!own) {
    problems.push(`${page.slug}: no ${component}Props is exported, so its table describes nothing`);
    continue;
  }
  const missing = [...own].filter(name => !page.rows.has(name)).sort();
  if (missing.length) {
    problems.push(`${page.slug} (${component}Props) does not document: ${missing.join(', ')}`);
  }
}

if (problems.length) {
  console.error('\nThe component pages do not hold up:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`\n${problems.length} page${problems.length === 1 ? '' : 's'}. Add the row, or — if the prop is`);
  console.error('deliberately undocumented — say so in the table rather than leaving it silent.\n');
  console.error(`Checked ${documented.size} pages against ${declared.size} exported prop interfaces.`);
  process.exit(1);
}

const overMedia = [...documented.values()].filter(page => page.overMedia > 0).length;
console.log(`catalog: ${documented.size} pages agree with their interfaces, each with ${MIN_EXAMPLES}+ examples and one adjustable; ${overMedia} can be seen over a photograph`);
