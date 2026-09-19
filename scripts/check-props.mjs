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
      const slug = read('slug'), name = read('name'), props = read('props');
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
        documented.set(name.initializer.text, { slug: slug.initializer.text, rows, file });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

/* ---------------------------------------------------------------------------------------
 * 3. Compare.
 * ------------------------------------------------------------------------------------- */

const problems = [];
for (const [component, page] of documented) {
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
  console.error('\nProperty tables are out of step with the interfaces:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`\n${problems.length} page${problems.length === 1 ? '' : 's'}. Add the row, or — if the prop is`);
  console.error('deliberately undocumented — say so in the table rather than leaving it silent.\n');
  console.error(`Checked ${documented.size} pages against ${declared.size} exported prop interfaces.`);
  process.exit(1);
}

console.log(`props: ${documented.size} pages agree with their interfaces`);
