import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Standalone docs-site config: the library keeps its own root vite.config.ts
// (lib mode); this one serves/builds the site from `site/` and resolves the
// published package name to the local source, so demo code matches real usage.
//
// `base` only applies to production builds, so assets resolve under the GitHub
// Pages project subpath (https://tsdsj.github.io/liquid-glass-react/). Dev keeps
// '/' so the local server stays at the root. The site is hash-routed, so client
// navigation works under any base without server rewrites.
export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: command === 'build' ? '/liquid-glass-react/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@ttqtt/liquid-glass-react': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 6007,
  },
}));
