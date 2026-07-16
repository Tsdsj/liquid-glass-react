// Consumer audit (M28): does the *packaged* library feel good to a real user?
//
// Builds + packs the tarball, unpacks it into a throwaway project whose only
// route to the library is node_modules/@ttqtt/liquid-glass-react (no repo
// paths/aliases), then verifies the versioned consumer cases on three layers:
//   1. types   — strict tsc compiles scripts/consumer-cases against the
//                package's own d.ts (also emits JS for the next two layers)
//   2. SSR     — bare-Node renderToString over every case
//   3. runtime — jsdom + createRoot render of every case, plus click smokes
// react/react-dom/@floating-ui/react/jsdom are symlinked from the repo's
// pnpm store (realpath), so no network is needed.
//
// Run: pnpm smoke:consumer
import { execSync, spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tarball = `${pkg.name.replace('@', '').replace('/', '-')}-${pkg.version}.tgz`;

function ok(msg) {
  console.log(`✓ ${msg}`);
}

let temp = null;
function cleanup() {
  if (temp) {
    rmSync(temp, { recursive: true, force: true });
  }
  rmSync(join(root, tarball), { force: true });
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  cleanup();
  process.exit(1);
}

// 1. Build + pack.
console.log('· building + packing…');
execSync('pnpm build', { stdio: 'inherit', cwd: root });
execSync('pnpm pack', { stdio: 'inherit', cwd: root });
if (!existsSync(join(root, tarball))) {
  fail(`tarball ${tarball} not produced`);
}

// 2. Throwaway consumer project.
temp = mkdtempSync(join(tmpdir(), 'lg-consumer-'));
const nm = join(temp, 'node_modules');
mkdirSync(nm, { recursive: true });
execSync(`tar -xzf ${JSON.stringify(join(root, tarball))} -C ${JSON.stringify(temp)}`);
mkdirSync(join(nm, '@ttqtt'), { recursive: true });
renameSync(join(temp, 'package'), join(nm, '@ttqtt', 'liquid-glass-react'));

// Peer/runtime/tooling deps come from the repo's pnpm store via realpath
// symlinks — transitive deps keep resolving through the .pnpm layout.
for (const dep of ['react', 'react-dom', '@floating-ui/react', '@types/react', '@types/react-dom', 'jsdom']) {
  const target = join(nm, dep);
  mkdirSync(dirname(target), { recursive: true });
  symlinkSync(realpathSync(join(root, 'node_modules', dep)), target, 'dir');
}

cpSync(join(root, 'scripts', 'consumer-cases'), join(temp, 'cases'), { recursive: true });
writeFileSync(join(temp, 'package.json'), JSON.stringify({ name: 'lg-consumer', private: true, type: 'module' }, null, 2));
writeFileSync(
  join(temp, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        types: [],
        rootDir: 'cases',
        outDir: 'compiled',
      },
      include: ['cases'],
    },
    null,
    2,
  ),
);
ok(`consumer project at ${temp} (package + realpath-linked deps, no repo paths)`);

// 3. TYPE layer — strict tsc against the package's own d.ts (and emit JS).
console.log('· type layer (tsc strict against packaged d.ts)…');
const tsc = spawnSync('pnpm', ['exec', 'tsc', '-p', join(temp, 'tsconfig.json')], {
  cwd: root,
  encoding: 'utf8',
});
if (tsc.status !== 0) {
  console.error(tsc.stdout || tsc.stderr);
  fail('consumer cases fail strict type-check against the packaged d.ts');
}
ok('type layer: strict tsc clean (types resolve from dist/index.d.ts)');

// 4. SSR layer — bare Node renderToString over every case.
writeFileSync(
  join(temp, 'ssr-runner.mjs'),
  [
    "import { renderToString } from 'react-dom/server';",
    "import { CASES } from './compiled/consumer.cases.js';",
    'const failures = [];',
    'for (const item of CASES) {',
    '  try {',
    '    const html = renderToString(item.render());',
    '    if (!item.allowEmpty && html.length === 0) failures.push(item.name + ": empty SSR output");',
    "    if (item.name === 'Button' && !html.includes('data-refraction=\"off\"')) failures.push('Button: server frame must be the frosted fallback');",
    '  } catch (error) {',
    '    failures.push(item.name + ": " + (error && error.message));',
    '  }',
    '}',
    'if (failures.length) { console.error(failures.join("\\n")); process.exit(1); }',
    'console.log("ssr cases:", CASES.length);',
  ].join('\n'),
);
console.log('· SSR layer (renderToString from packaged dist)…');
const ssr = spawnSync('node', ['ssr-runner.mjs'], { cwd: temp, encoding: 'utf8' });
if (ssr.status !== 0) {
  console.error(ssr.stdout || '', ssr.stderr || '');
  fail('SSR layer failed');
}
ok(`SSR layer: ${ssr.stdout.trim()}`);

// 5. RUNTIME layer — jsdom + createRoot, with the same browser-ish stubs the
// library's own test setup installs, plus two real interaction smokes.
writeFileSync(
  join(temp, 'dom-runner.mjs'),
  [
    "import { JSDOM } from 'jsdom';",
    "const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true, url: 'https://consumer.test/' });",
    'globalThis.window = dom.window;',
    'globalThis.document = dom.window.document;',
    "for (const key of ['HTMLElement', 'HTMLInputElement', 'Element', 'Node', 'SVGElement', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'CustomEvent', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'DOMRect', 'MutationObserver']) {",
    '  if (dom.window[key] !== undefined) globalThis[key] = dom.window[key];',
    '}',
    "Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });",
    'class ResizeObserverStub { observe() {} unobserve() {} disconnect() {} }',
    'globalThis.ResizeObserver = ResizeObserverStub;',
    'dom.window.ResizeObserver = ResizeObserverStub;',
    'const matchMediaStub = (media) => ({ matches: false, media, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });',
    'dom.window.matchMedia = matchMediaStub;',
    'globalThis.matchMedia = matchMediaStub;',
    'globalThis.IS_REACT_ACT_ENVIRONMENT = true;',
    '',
    "const { act, createElement } = await import('react');",
    "const { createRoot } = await import('react-dom/client');",
    "const { CASES } = await import('./compiled/consumer.cases.js');",
    "const pkgModule = await import('@ttqtt/liquid-glass-react');",
    'const failures = [];',
    '',
    'for (const item of CASES) {',
    '  const host = document.createElement("div");',
    '  document.body.appendChild(host);',
    '  const root = createRoot(host);',
    '  try {',
    '    await act(async () => { root.render(item.render()); });',
    '    if (!item.allowEmpty && host.childNodes.length === 0) failures.push(item.name + ": rendered nothing");',
    '  } catch (error) {',
    '    failures.push(item.name + ": " + (error && error.message));',
    '  } finally {',
    '    await act(async () => { root.unmount(); });',
    '    host.remove();',
    '  }',
    '}',
    '',
    '// Interaction smoke 1: Button click reaches the handler.',
    '{',
    '  const host = document.createElement("div");',
    '  document.body.appendChild(host);',
    '  const root = createRoot(host);',
    '  let clicked = false;',
    '  await act(async () => { root.render(createElement(pkgModule.Button, { onClick: () => { clicked = true; } }, "hit")); });',
    '  await act(async () => { host.querySelector("button").click(); });',
    '  if (!clicked) failures.push("Button: onClick did not fire");',
    '  await act(async () => { root.unmount(); });',
    '  host.remove();',
    '}',
    '',
    '// Interaction smoke 2: Accordion trigger toggles aria-expanded.',
    '{',
    '  const host = document.createElement("div");',
    '  document.body.appendChild(host);',
    '  const root = createRoot(host);',
    '  await act(async () => { root.render(createElement(pkgModule.Accordion, { items: [{ key: "a", title: "T", content: "C" }] })); });',
    '  const trigger = host.querySelector("button[aria-expanded]");',
    '  if (!trigger || trigger.getAttribute("aria-expanded") !== "false") failures.push("Accordion: trigger not found or not collapsed");',
    '  await act(async () => { trigger.click(); });',
    '  if (trigger.getAttribute("aria-expanded") !== "true") failures.push("Accordion: click did not expand");',
    '  await act(async () => { root.unmount(); });',
    '  host.remove();',
    '}',
    '',
    'if (failures.length) { console.error(failures.join("\\n")); process.exit(1); }',
    'console.log("runtime cases:", CASES.length, "+ 2 interaction smokes");',
  ].join('\n'),
);
console.log('· runtime layer (jsdom + createRoot from packaged dist)…');
const domRun = spawnSync('node', ['dom-runner.mjs'], { cwd: temp, encoding: 'utf8' });
if (domRun.status !== 0) {
  console.error(domRun.stdout || '', domRun.stderr || '');
  fail('runtime layer failed');
}
ok(`runtime layer: ${domRun.stdout.trim()}`);

// 6. CSS artifact sanity from inside the consumer project.
const consumerPkgDir = join(nm, '@ttqtt', 'liquid-glass-react');
const consumerPkg = JSON.parse(readFileSync(join(consumerPkgDir, 'package.json'), 'utf8'));
if (!consumerPkg.exports?.['./style.css']) {
  fail('package exports map lost ./style.css');
}
const css = readFileSync(join(consumerPkgDir, 'dist', 'style.css'), 'utf8');
for (const cls of ['.lg-surface', '.lg-button', '.lg-form-item', '.lg-calendar', '.lg-table']) {
  if (!css.includes(cls)) {
    fail(`packaged style.css is missing ${cls}`);
  }
}
ok('css layer: style.css export + key component classes present');

cleanup();
console.log('\n✓ smoke-consumer passed');
