import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    // Lets site/ sources (and their vitest smoke tests) import the library by
    // its published name; the lib build itself never imports this alias.
    alias: {
      '@ttqtt/liquid-glass-react': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  plugins: [
    react(),
    dts({
      include: ['src'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.names.some((name) => name.endsWith('.css'))
            ? 'style.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'visual-tests/**'],
    setupFiles: ['src/test/setup.ts'],
    globals: true,
    passWithNoTests: true,
  },
});
