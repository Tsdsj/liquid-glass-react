import { access, mkdir } from 'node:fs/promises';import { spawnSync } from 'node:child_process';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'artifacts');
for(const pkg of ['tokens','core','react'])for(const file of ['index.js','index.d.ts'])await access(path.join(root,'packages',pkg,'dist',file)).catch(()=>{throw Error('Run npm run build:packages before packing.');});
await mkdir(out,{recursive:true});
for(const pkg of ['tokens','core','react']){const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['pack','--ignore-scripts','--pack-destination',out],{cwd:path.join(root,'packages',pkg),stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
console.log('Local tarballs only. Nothing was published. Install all three tarballs together in a consuming project.');
