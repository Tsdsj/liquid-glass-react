import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('.', import.meta.url));
const src = (file: string) => fileURLToPath(new URL(`../src/${file}`, import.meta.url));

/**
 * The documentation site builds straight from `src/`, not from `dist/` — so what you see in
 * the browser is the source you are editing, and a broken component shows up immediately
 * rather than after a library rebuild.
 *
 * A relative `base` lets the same build serve from the domain root (local checks) and from
 * the /liquid-glass-react/ sub-path GitHub Pages uses, with no rebuild in between. Hash
 * routing means every route comes from the single index.html, so no server rewrites either.
 */
export default defineConfig({
  root: site,
  base: './',
  resolve: {
    alias: [
      { find: '@ttqtt/liquid-glass-react/style.css', replacement: src('styles/index.css') },
      { find: '@ttqtt/liquid-glass-react', replacement: src('index.ts') },
    ],
  },
  esbuild: { jsx: 'automatic' },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: { target: 'chrome120', outDir: 'dist', sourcemap: true, emptyOutDir: true },
});
