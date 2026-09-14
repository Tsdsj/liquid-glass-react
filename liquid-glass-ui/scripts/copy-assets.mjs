import { copyFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
for (const [pkg,name] of [['tokens','tokens.css'],['react','styles.css']]) await copyFile(path.join(root,'packages',pkg,'src',name),path.join(root,'packages',pkg,'dist',name));
console.log('Styles copied to package dist directories.');

await copyFile(path.join(root,'packages/tokens/src/tokens.css'),path.join(root,'packages/react/dist/tokens.css'));
for (const pkg of ['tokens','core','react']) await copyFile(path.join(root,'LICENSE'),path.join(root,'packages',pkg,'LICENSE'));
