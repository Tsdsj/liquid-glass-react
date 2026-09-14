import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),items=[];
/** Package sources are nested by layer (system / content / controls / fields / navigation / overlays), so walk the tree. */
async function collect(dir,prefix){
  for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    const from=path.join(dir,entry.name),to=`${prefix}/${entry.name}`;
    if(entry.isDirectory()){await collect(from,to);continue;}
    const content=await readFile(from,'utf8');
    items.push({path:to,sha256:createHash('sha256').update(content).digest('hex'),content});
  }
}
for(const pkg of ['tokens','core','react'])await collect(path.join(root,'packages',pkg,'src'),`packages/${pkg}/src`);
const manifest={schema:'liquid-glass-ui/local-source-registry/v1',version:'0.2.0-alpha.1',license:'MIT',note:'Local source-copy manifest. NOT a shadcn registry and NOT a published service.',items};
await mkdir(path.join(root,'registry'),{recursive:true});await writeFile(path.join(root,'registry/registry.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`Registry: ${items.length} source files.`);
