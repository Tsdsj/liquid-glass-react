/**
 * The one manifest out of `npm pack --json`, whichever shape this npm speaks.
 *
 * npm 11 answers with an **array** of manifests. npm 12 answers with an **object keyed by
 * package name**. The release job runs `npm install -g npm@latest` — trusted publishing needs
 * an npm newer than the one Node ships — so the shape of this output can change under a
 * release without a line of this repository moving, and it did: reading `[0]` threw
 * `Cannot read properties of undefined` in the publish job, after the whole suite had passed
 * and the environment had been approved by hand.
 *
 * So this does not index. It takes whichever container it was given, and finds the entry that
 * has a file list — which is the thing actually being asked for, and the part of the shape
 * that has been stable across both.
 */
export function packedManifest(raw) {
  const entries = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' ? Object.values(raw) : [];
  return entries.find(entry => Array.isArray(entry?.files)) ?? null;
}
