// The tsconfig `types` allowlist (vite/client + vitest/globals) excludes Node
// types, but a few tests read source files at runtime under vitest/Node. This
// ambient shim types only the small surface those tests use.
declare module 'node:fs' {
  export function readFileSync(path: string, encoding: 'utf8'): string;
}

declare module 'node:url' {
  export function fileURLToPath(url: URL | string): string;
}
