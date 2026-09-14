/** Build an offline inspection bundle from already-transpiled preview ESM.
 * Not a replacement for Vite's production tree-shaking or a semantic typecheck.
 */
import { createRequire } from 'node:module';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url);
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript');
const root = path.resolve(import.meta.dirname, '../preview');
const definitions = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await collect(file); continue; }
    if (!entry.name.endsWith('.js') || entry.name === 'bundle.js') continue;
    let code = await readFile(file, 'utf8');
    code = code.split('\n').filter(line => !(line.startsWith('import ') && line.includes('.css'))).join('\n');
    const result = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } });
    definitions.push(`${JSON.stringify(path.relative(root,file).split(path.sep).join('/'))}: function(module,exports,require){\n${result.outputText}\n}`);
  }
}
await collect(root);
const aliases = { react: 'vendor/react.js', 'react-dom': 'vendor/react-dom.js', 'react-dom/client': 'vendor/react-dom-client.js', 'react/jsx-runtime': 'vendor/jsx-runtime.js', '@liquid-glass-ui/react': 'packages/react/index.js', '@liquid-glass-ui/core': 'packages/core/index.js', '@liquid-glass-ui/tokens': 'packages/tokens/index.js' };
const bootstrap = `\nconst aliases=${JSON.stringify(aliases)},cache={};function resolve(from,spec){if(aliases[spec])return aliases[spec];if(!spec.startsWith('.'))throw Error('Unknown module '+spec);const p=from.split('/');p.pop();for(const bit of spec.split('/')){if(bit==='..')p.pop();else if(bit!=='.')p.push(bit)}return p.join('/')}function load(id){if(cache[id])return cache[id].exports;if(!modules[id])throw Error('Missing module '+id);const mod={exports:{}};cache[id]=mod;modules[id](mod,mod.exports,s=>load(resolve(id,s)));return mod.exports}window.__glassPreview={reactVersion:load('vendor/react.js').version,diagnostics:()=>load('packages/core/index.js').getGlassDiagnostics()};load('app/main.js');`;
await writeFile(path.join(root, 'bundle.js'), `/* Offline preview. React / ReactDOM 19.1.1: MIT, see vendor/LICENSE-React.txt. */\n(()=>{'use strict';const modules={\n${definitions.join(',\n')}\n};${bootstrap}\n})();`);
let html = await readFile(path.join(root,'index.html'),'utf8');
html = html.replace(/<script type="importmap"[\s\S]*?<\/script>/,'').replace('<script type="module" src="./app/main.js"></script>','<script src="./bundle.js"></script>');
await writeFile(path.join(root,'index.html'),html);
console.log(`Offline bundle: ${definitions.length} modules. React runtime metadata retained.`);
