import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path'; import { gzipSync } from 'node:zlib';
const root=path.resolve(import.meta.dirname,'..'), files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true}).catch(()=>[])){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(/\.(js|css)$/.test(e.name)){const b=await readFile(f);files.push({file:path.relative(root,f),bytes:b.length,gzipBytes:gzipSync(b).length});}}}
for(const pkg of ['tokens','core','react'])await walk(path.join(root,'packages',pkg,'dist'));
for(const f of ['preview/bundle.js','preview/tokens.css','preview/styles.css','preview/app.css']){const b=await readFile(path.join(root,f));files.push({file:f,bytes:b.length,gzipBytes:gzipSync(b).length});}
const report={note:'Per-file emitted size, NOT tree-shaken application import cost. Preview bundles React 19.1.1. Individual gzip totals are not a network-transfer prediction.',files};
await mkdir(path.join(root,'reports'),{recursive:true});await writeFile(path.join(root,'reports/size.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
