import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

/**
 * Library build. One ESM file plus declarations; React stays external so the consumer's
 * copy is the only one in the tree. The stylesheet is assembled separately by
 * `scripts/build-css.mjs` — no source file imports CSS, which is what keeps the JS bundle
 * free of style side effects and makes `sideEffects: ["**\/*.css"]` an honest claim.
 */
export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      output: {
        /*
         * Rollup drops per-module "use client" directives when it bundles. Every component
         * here is client-only (pointer events, native dialogs, matchMedia), so the whole
         * bundle carries one directive — without it, importing from a Next.js App Router
         * server component fails at build time.
         */
        banner: "'use client';",
      },
    },
  },
  esbuild: { jsx: 'automatic' },
});
