/**
 * Assembles the published stylesheet.
 *
 * `src/styles/index.css` only `@import`s its two siblings, and a relative @import would not
 * resolve from inside a consumer's bundle — so the parts are concatenated here instead.
 * Order is load-bearing: the tokens declare the custom properties everything else reads.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const parts = ['tokens.css', 'components.css'];

await mkdir(dist, { recursive: true });

const chunks = [];
for (const name of parts) {
  const css = await readFile(path.join(root, 'src/styles', name), 'utf8');
  await writeFile(path.join(dist, name), css);
  chunks.push(`/* ---- ${name} ---- */\n${css.trim()}\n`);
}

const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const banner = `/*! @ttqtt/liquid-glass-react ${version} | MIT */\n`;
await writeFile(path.join(dist, 'style.css'), banner + chunks.join('\n'));

console.log(`Stylesheet: dist/style.css (${parts.join(' + ')})`);
