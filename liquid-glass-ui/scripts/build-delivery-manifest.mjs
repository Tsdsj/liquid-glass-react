/** Regenerate delivery-manifest.json: a byte-size + sha256 inventory of the shipped tree.
 * Generated artefacts that are themselves derived (dist, node_modules, reports/playwright data,
 * test-results) are excluded, as is the manifest itself. This is an inventory, not a signature.
 */
import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const SKIP = new Set(['node_modules', 'dist', '.git', 'test-results', '.DS_Store', 'delivery-manifest.json', '.tsbuildinfo']);
const files = [];
async function walk(dir) {
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (SKIP.has(entry.name) || entry.name.endsWith('.tsbuildinfo')) continue;
    const from = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(from); continue; }
    const relative = path.relative(root, from).split(path.sep).join('/');
    const content = await readFile(from);
    files.push({ path: relative, bytes: (await stat(from)).size, sha256: createHash('sha256').update(content).digest('hex') });
  }
}
await walk(root);
const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
await writeFile(path.join(root, 'delivery-manifest.json'), JSON.stringify({ version, files }, null, 2) + '\n');
console.log(`Delivery manifest: ${files.length} files.`);
