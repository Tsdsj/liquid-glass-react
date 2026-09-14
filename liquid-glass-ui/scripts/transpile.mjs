// Dependency-light ESM build used by the preview pipeline; NOT a semantic typecheck.
import { createRequire } from 'node:module';
import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url);
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript');
const root = path.resolve(import.meta.dirname, '..');
async function compile(source, out) {
  await mkdir(out, { recursive: true });
  for (const item of await readdir(source, { withFileTypes: true })) {
    const from = path.join(source, item.name), to = path.join(out, item.name.replace(/\.tsx?$/, '.js'));
    if (item.isDirectory()) { await compile(from, to); continue; }
    if (!/\.tsx?$/.test(item.name) || /\.d\.ts$/.test(item.name)) continue;
    const result = ts.transpileModule(await readFile(from, 'utf8'), { fileName: from, reportDiagnostics: true,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, isolatedModules: true } });
    const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
    if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, { getCurrentDirectory: () => root, getCanonicalFileName: f => f, getNewLine: () => '\n' }));
    await writeFile(to, result.outputText);
  }
}
for (const pkg of ['tokens', 'core', 'react']) await compile(path.join(root, 'packages', pkg, 'src'), path.join(root, 'preview', 'packages', pkg));
await compile(path.join(root, 'apps/playground/src'), path.join(root, 'preview/app'));
console.log('ESM transpilation completed (syntax checked; use npm run typecheck for semantic checks).');
