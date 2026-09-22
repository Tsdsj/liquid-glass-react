/**
 * The gate that runs before anything is published.
 *
 * `pnpm pack` decides what ships from the `files` field, and a mistake there is only visible
 * after the tarball is on the registry — where it cannot be taken back. So this asks the packer
 * itself what it would include, rather than trusting the glob to mean what it looks like it means.
 *
 * Wired into `prepublishOnly`, so `pnpm publish` cannot skip it.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { packedManifest } from './lib/packed-manifest.mjs';

const root = path.resolve(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

/* What the packer would actually put in the tarball. */
const raw = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: root, encoding: 'utf8' }));
const packed = packedManifest(raw);
if (!packed) {
  /* Said out loud rather than thrown, because the next shape change will happen too, and a
     `TypeError` in a publish job tells whoever is reading it nothing about what to fix. */
  const npmVersion = execFileSync('npm', ['--version'], { cwd: root, encoding: 'utf8' }).trim();
  console.error(`\nnpm ${npmVersion} answered \`npm pack --json\` in a shape this script does not know:\n`);
  console.error(`  ${JSON.stringify(raw).slice(0, 400)}\n`);
  console.error('  Expected an array of manifests (npm 11) or an object keyed by package name (npm 12),');
  console.error('  with a `files` array on the entry. See scripts/lib/packed-manifest.mjs.');
  process.exit(1);
}
const shipped = packed.files.map(entry => entry.path);

const required = [
  'package.json', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md',
  'dist/index.js', 'dist/index.d.ts', 'dist/style.css', 'dist/tokens.css', 'dist/components.css',
];
for (const file of required) check(shipped.includes(file), `missing from the tarball: ${file}`);

/* Source, the site and the test rig must never leave the repository. */
const leaked = shipped.filter(file => /^(src|site|tests|scripts|reports|registry|docs|examples)\//.test(file));
check(leaked.length === 0, `these would ship but should not: ${leaked.join(', ')}`);

/**
 * Without this first line the package throws the moment it is imported from a React Server
 * Component — which is the default in the Next.js App Router. It has been lost to a bundler
 * config once already, so it is checked on the built file rather than on the source banner.
 */
const bundle = readFileSync(path.join(root, 'dist/index.js'), 'utf8');
check(bundle.startsWith('"use client";'), 'dist/index.js does not start with "use client";');

/* Every export the manifest promises has to resolve to a file that was packed. */
for (const [entry, target] of Object.entries(pkg.exports)) {
  const paths = typeof target === 'string' ? [target] : Object.values(target);
  for (const file of paths) {
    check(shipped.includes(file.replace(/^\.\//, '')), `exports["${entry}"] points at ${file}, which is not in the tarball`);
  }
}

/* A tag that disagrees with the manifest publishes the wrong version under the right name. */
const expected = process.env.RELEASE_TAG?.replace(/^v/, '');
if (expected) check(expected === pkg.version, `tag ${process.env.RELEASE_TAG} does not match package version ${pkg.version}`);

if (failures.length) {
  console.error(`\n${pkg.name}@${pkg.version} is not publishable:\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const bytes = packed.size, unpacked = packed.unpackedSize;
console.log(`${pkg.name}@${pkg.version}: ${shipped.length} files, ${(bytes / 1024).toFixed(1)} KB packed / ${(unpacked / 1024).toFixed(1)} KB unpacked`);
