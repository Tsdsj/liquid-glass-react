/**
 * Emitted size of the published artefacts.
 *
 * These are whole-file sizes, not what an application actually ships: importing three
 * components pulls far less than the bundle total once your bundler tree-shakes, and gzip
 * figures for separate files do not add up to a transfer size.
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!/\.(js|css)$/.test(entry.name)) continue;
    const bytes = await readFile(file);
    files.push({ file: path.relative(root, file), bytes: bytes.length, gzipBytes: gzipSync(bytes).length });
  }
}

await walk(path.join(root, 'dist'));
await walk(path.join(root, 'site/dist/assets'));

const report = {
  note: 'Per-file emitted size, NOT tree-shaken application import cost. Per-file gzip totals are not a network-transfer prediction.',
  files: files.sort((a, b) => b.bytes - a.bytes),
};
await mkdir(path.join(root, 'reports'), { recursive: true });
await writeFile(path.join(root, 'reports/size.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Size report: ${files.length} files -> reports/size.json`);
