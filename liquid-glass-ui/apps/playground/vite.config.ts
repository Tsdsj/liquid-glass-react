import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const source = (name: string, file = 'index.ts') => fileURLToPath(new URL(`../../packages/${name}/src/${file}`, import.meta.url));
export default defineConfig({
  root,
  resolve: { alias: [
    { find: '@liquid-glass-ui/react/styles.css', replacement: source('react', 'styles.css') },
    { find: '@liquid-glass-ui/react/tokens.css', replacement: source('tokens', 'tokens.css') },
    { find: '@liquid-glass-ui/react', replacement: source('react') },
    { find: '@liquid-glass-ui/core', replacement: source('core') },
    { find: '@liquid-glass-ui/tokens', replacement: source('tokens') },
  ] },
  esbuild: { jsx: 'automatic' },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: { target: 'chrome120', outDir: 'dist', sourcemap: true },
});
