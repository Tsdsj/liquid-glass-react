import { readFile, readdir, mkdir, writeFile, copyFile } from 'node:fs/promises';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'), arg=process.argv[2];
if(!arg||arg.startsWith('-')){console.error('Usage: npm run source:copy -- ./src/vendor/liquid-glass');process.exit(2);}
const target=path.resolve(arg);
if(target===root||root.startsWith(target+path.sep))throw Error('Refusing to copy into the workspace root or its ancestor.');
const existing=await readdir(target).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
if(existing.length)throw Error('Destination must be empty; existing files are never overwritten.');
await mkdir(target,{recursive:true});
for(const pkg of ['tokens','core','react']){await mkdir(path.join(target,pkg),{recursive:true});for(const file of await readdir(path.join(root,'packages',pkg,'src'))){let text=await readFile(path.join(root,'packages',pkg,'src',file),'utf8');text=text.replaceAll("'@liquid-glass-ui/core'","'../core/index.js'").replaceAll("'@liquid-glass-ui/tokens'","'../tokens/index.js'");await writeFile(path.join(target,pkg,file),text);}}
await copyFile(path.join(root,'LICENSE'),path.join(target,'LICENSE'));
await writeFile(path.join(target,'README.md'),'# Local source copy\n\nRequires React 19 and a TypeScript/JSX bundler (moduleResolution: bundler). Import components from ./react/index, then ./tokens/tokens.css and ./react/styles.css. Keep LICENSE. No npm scoped package imports remain. This is a snapshot: updates are manual.\n');
console.log(`Source copied to ${target}`);
