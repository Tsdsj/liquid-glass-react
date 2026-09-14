import { createRequire } from 'node:module';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url), ts = require(process.env.TYPESCRIPT_PATH || 'typescript');
const root = path.resolve(import.meta.dirname, '..'); let count=0, errors=0;
async function walk(dir) {
 for (const e of await readdir(dir,{withFileTypes:true})) {
  const file=path.join(dir,e.name);
  if(e.isDirectory()) { if(!['dist','node_modules','preview','.local'].includes(e.name)) await walk(file); continue; }
  if(!/\.tsx?$/.test(file)||file.endsWith('.d.ts'))continue;
  const result=ts.transpileModule(await readFile(file,'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}});
  count++; for(const d of result.diagnostics||[]) {if(d.category===ts.DiagnosticCategory.Error) {errors++;console.error(ts.flattenDiagnosticMessageText(d.messageText,'\n'));}}
 }
}
await walk(root); console.log(JSON.stringify({kind:'syntax-only-not-semantic-typecheck',typescript:ts.version,files:count,errors}));process.exitCode=errors?1:0;
