import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),port=process.env.TEST_PORT||'4197';
const child=spawn(process.execPath,['scripts/serve-preview.mjs'],{cwd:root,env:{...process.env,PORT:port},stdio:['ignore','pipe','pipe']});
let output='';child.stdout.on('data',x=>output+=x);child.stderr.on('data',x=>output+=x);
const checks=[];
try{
 for(let i=0;i<60&&!output.includes('preview:');i++)await new Promise(r=>setTimeout(r,50));
 const get=async(p,init)=>fetch(`http://127.0.0.1:${port}${p}`,init);
 const res=await get('/');assert.equal(res.status,200);assert.match(await res.text(),/bundle.js/);checks.push('HTML entry and bundle reference');
 assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);assert.equal(res.headers.get('x-content-type-options'),'nosniff');checks.push('CSP and nosniff headers');
 assert.equal((await get('/bundle.js')).status,200);assert.equal((await get('/styles.css')).status,200);checks.push('Local JS/CSS assets');
 assert.equal((await get('/.env')).status,403);checks.push('Hidden path denied');
 const traversal=await get('/%2e%2e%2fpackage.json');assert.equal(traversal.status,403);checks.push('Encoded parent traversal denied');
 assert.equal((await get('/',{method:'POST'})).status,405);checks.push('POST denied');
 const head=await get('/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');checks.push('HEAD body empty');
 assert.equal((await get('/missing')).status,404);checks.push('Missing file 404');
 await writeFile(path.join(root,'reports/preview-server.json'),JSON.stringify({kind:'Node HTTP client checks, NOT browser navigation',checks,status:'passed'},null,2)+'\n');
 console.log(`Preview HTTP server: ${checks.length} checks passed.`);
} finally{child.kill('SIGTERM');}
