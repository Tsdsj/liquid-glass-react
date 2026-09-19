'use client';
/**
 * Development-mode diagnostics for the rules a person had to check by eye until now.
 *
 * Each of these was found by reading screens against the design rules and fixing them one at a
 * time — which does not scale and does not survive the next refactor. They are warnings, not
 * errors: the library still renders whatever it was asked to, because a component that refuses
 * to draw is worse than one that draws something the author did not intend.
 *
 * Silent in production — which requires writing `process.env.NODE_ENV` exactly like this, as a
 * literal a bundler can find and replace. Reaching the same value through `globalThis.process`
 * reads more defensively and is worse: nothing replaces it, `process` does not exist in a
 * browser, and the check therefore answers "development" in every production build. Computed
 * once at module load so the replaced constant folds away with the branches that use it.
 *
 * The `try` is for a browser loading this as raw ESM with no bundler and no `process` at all;
 * there, a reference error means nobody told us, and a development default is the useful guess.
 */
declare const process: { env: Record<string, string | undefined> };

let development = true;
try { development = process.env.NODE_ENV !== 'production'; } catch { /* no bundler, no process */ }

export function inDevelopment(): boolean { return development; }

/**
 * One warning per node per rule. Keyed weakly, so a page that mounts and unmounts a thousand
 * surfaces does not accumulate a thousand entries — the project takes no unbounded caches.
 */
const seen = new WeakMap<Element, Set<string>>();

export function warnOnce(node: Element, rule: string, message: string): void {
  let rules = seen.get(node);
  if (!rules) { rules = new Set(); seen.set(node, rules); }
  if (rules.has(rule)) return;
  rules.add(rule);
  console.warn(`[liquid-glass-ui] ${message}`, node);
}
