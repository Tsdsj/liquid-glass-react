/** Case-insensitive in-order subsequence test; an empty query matches anything. */
export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  const t = text.toLowerCase();
  let index = 0;
  for (const char of t) {
    if (char === q[index]) {
      index += 1;
      if (index === q.length) {
        return true;
      }
    }
  }
  return false;
}

/** A command matches when its label or any of its keywords fuzzy-matches. */
export function commandMatches(query: string, label: string, keywords: string[] = []): boolean {
  return [label, ...keywords].some((candidate) => fuzzyMatch(query, candidate));
}
