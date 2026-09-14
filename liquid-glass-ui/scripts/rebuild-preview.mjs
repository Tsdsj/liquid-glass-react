/** Rebuild the offline inspection preview while retaining its explicit React 19.1.1 runtime.
 * For npm React + production optimization, use npm run build instead.
 */
import { spawnSync } from 'node:child_process';
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
function run(file) {const p=spawnSync(process.execPath,[path.join(root,'scripts',file)],{cwd:root,env:process.env,stdio:'inherit'});if(p.status!==0)process.exit(p.status||1);}
run('transpile.mjs');
for(const [from,to] of [['packages/tokens/src/tokens.css','preview/tokens.css'],['packages/react/src/styles.css','preview/styles.css'],['apps/playground/src/app.css','preview/app.css']]) await copyFile(path.join(root,from),path.join(root,to));
run('bundle-preview.mjs');
