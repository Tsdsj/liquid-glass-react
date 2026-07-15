// Bundle budget + tree-shaking guard (M16). No browser needed.
//   1. dist/index.js and dist/style.css stay under a gzip ceiling.
//   2. `import { Button }` tree-shakes the overlay components away.
//
// Run: pnpm check:bundle
import { execSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { rollup } from 'rollup';

const root = process.cwd();
const dist = join(root, 'dist');

// Gzip ceilings (KB). Set ~15% above the 0.1.0 baseline; bump deliberately when
// real growth is intended so accidental bloat trips the check.
const BUDGET = { 'index.js': 60, 'style.css': 14 };
// A Button-only bundle must stay small and free of overlay code.
const BUTTON_ONLY_MAX_KB = 40;
const MUST_SHAKE = ['lg-modal', 'lg-drawer', 'lg-tabs', 'lg-select', 'FloatingPortal'];

function ok(m) {
  console.log(`✓ ${m}`);
}
function fail(m) {
  console.error(`✗ ${m}`);
  process.exit(1);
}
function gzipKb(file) {
  return gzipSync(readFileSync(file)).length / 1024;
}

if (!existsSync(join(dist, 'index.js'))) {
  console.log('· building…');
  execSync('pnpm build', { stdio: 'inherit', cwd: root });
}

// 1. Full-bundle gzip budget.
for (const [file, maxKb] of Object.entries(BUDGET)) {
  const kb = gzipKb(join(dist, file));
  if (kb > maxKb) {
    fail(`dist/${file} gzip ${kb.toFixed(1)}KB exceeds budget ${maxKb}KB`);
  }
  ok(`dist/${file} gzip ${kb.toFixed(1)}KB ≤ ${maxKb}KB`);
}

// 2. Tree-shaking: a Button-only bundle drops the overlays.
const entry = join(dist, 'index.js');
const bundle = await rollup({
  input: '__entry',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  onwarn() {},
  plugins: [
    {
      name: 'virtual-entry',
      resolveId: (id) => (id === '__entry' ? id : null),
      load: (id) =>
        id === '__entry'
          ? `import { Button } from ${JSON.stringify(entry)};\nexport { Button };`
          : null,
    },
  ],
});
const { output } = await bundle.generate({ format: 'esm' });
const code = output[0].code;
const buttonKb = Buffer.byteLength(code) / 1024;
for (const marker of MUST_SHAKE) {
  if (code.includes(marker)) {
    fail(`tree-shaking leak: "${marker}" present in a Button-only bundle`);
  }
}
if (buttonKb > BUTTON_ONLY_MAX_KB) {
  fail(`Button-only bundle ${buttonKb.toFixed(1)}KB exceeds ${BUTTON_ONLY_MAX_KB}KB (tree-shaking regressed?)`);
}
ok(`Button-only bundle ${buttonKb.toFixed(1)}KB, overlays shaken out`);

console.log('\n✓ check-bundle passed');
