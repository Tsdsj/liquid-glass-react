import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
const project = path.resolve(import.meta.dirname, '..');
const rootIndex = process.argv.indexOf('--root');
const root = rootIndex >= 0 ? path.resolve(project, process.argv[rootIndex + 1]) : path.join(project, 'preview');
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) { response.writeHead(405); response.end('Method not allowed'); return; }
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const requested = decodeURIComponent(url.pathname);
    const file = path.resolve(root, '.' + (requested.endsWith('/') ? requested + 'index.html' : requested));
    if (!file.startsWith(root + path.sep) || requested.split('/').some(part => part.startsWith('.'))) { response.writeHead(403); response.end('Forbidden'); return; }
    const info = await stat(file); if (!info.isFile()) throw new Error('Not a file');
    let data = await readFile(file); const ext = path.extname(file);
    response.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Cache-Control', 'no-store');
    if (ext === '.html') {
      const nonce = randomBytes(18).toString('base64');
      data = Buffer.from(data.toString().replaceAll('data-csp-nonce', `nonce="${nonce}"`));
      response.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`);
    }
    response.writeHead(200); response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Liquid Glass UI preview: http://127.0.0.1:${port}\nServing ${root}`));
process.on('SIGTERM', () => server.close()); process.on('SIGINT', () => server.close());
