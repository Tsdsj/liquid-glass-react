import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Standalone docs-site config: the library keeps its own root vite.config.ts
// (lib mode); this one serves/builds the site from `site/` and resolves the
// published package name to the local source, so demo code matches real usage.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      '@ttq/liquid-glass-react': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 6007,
  },
});
