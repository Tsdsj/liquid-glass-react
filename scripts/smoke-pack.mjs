// Release smoke test (no browser needed): builds, packs, and verifies the
// published tarball resolves as ESM + CJS with types + style.css.
//
// Tree-shaking is verified separately in M16 (bundle budget) — the single-file
// bundle currently does not tree-shake, and the fix (preserveModules) lives there.
//
// Run: pnpm smoke:pack
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// 1. Build.
console.log('· building…');
execSync('pnpm build', { stdio: 'inherit', cwd: root });

// 2. Required dist outputs exist.
for (const file of ['index.js', 'index.cjs', 'index.d.ts', 'style.css']) {
  if (!existsSync(join(dist, file))) {
    fail(`dist/${file} is missing`);
  }
}
ok('dist has index.js / index.cjs / index.d.ts / style.css');

// 3. exports map points at real files.
const exp = pkg.exports?.['.'];
for (const [cond, rel] of Object.entries({
  types: exp?.types,
  import: exp?.import,
  require: exp?.require,
  style: pkg.exports?.['./style.css'],
})) {
  if (!rel || !existsSync(join(root, rel))) {
    fail(`exports "${cond}" -> ${rel ?? '(missing)'} does not resolve`);
  }
}
ok('package exports (types/import/require/style.css) all resolve');

// 4. pnpm pack and check tarball contents.
console.log('· packing…');
const tarball = `${pkg.name.replace('@', '').replace('/', '-')}-${pkg.version}.tgz`;
execSync('pnpm pack', { stdio: 'inherit', cwd: root });
if (!existsSync(join(root, tarball))) {
  fail(`expected tarball ${tarball} not produced`);
}
const listing = execSync(`tar -tzf ${tarball}`, { encoding: 'utf8', cwd: root });
for (const entry of [
  'package/dist/index.js',
  'package/dist/index.cjs',
  'package/dist/index.d.ts',
  'package/dist/style.css',
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
]) {
  if (!listing.includes(entry)) {
    fail(`tarball is missing ${entry}`);
  }
}
ok(`tarball ${tarball} contains dist + package.json + README + LICENSE`);

// 5. ESM import resolves (deps come from the repo node_modules).
const esm = await import(pathToFileURL(join(dist, 'index.js')).href);
for (const name of ['Button', 'GlassSurface', 'Modal', 'toast', 'Card', 'Drawer']) {
  if (esm[name] == null) {
    fail(`ESM export "${name}" missing`);
  }
}
ok('ESM import resolves (Button / GlassSurface / Modal / toast / …)');

// 6. CJS require resolves.
const require = createRequire(import.meta.url);
const cjs = require(join(dist, 'index.cjs'));
for (const name of ['Button', 'toast', 'Modal']) {
  if (cjs[name] == null) {
    fail(`CJS export "${name}" missing`);
  }
}
ok('CJS require resolves');

// Cleanup.
rmSync(join(root, tarball), { force: true });
console.log('\n✓ smoke-pack passed');
