/** Bounded LRU, accounting an explicit approximate retained-byte budget. */
export class BoundedCache<T> {
  private entries = new Map<string, { value: T; bytes: number }>();
  private bytes = 0;
  constructor(readonly maxEntries = 24, readonly maxBytes = 8 * 1024 * 1024) {
    if (!Number.isFinite(maxEntries) || !Number.isFinite(maxBytes) || maxEntries < 1 || maxBytes < 1) throw new RangeError('Cache limits must be positive');
  }
  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    this.entries.delete(key); this.entries.set(key, entry); return entry.value;
  }
  set(key: string, value: T, bytes: number): void {
    if (!Number.isFinite(bytes) || bytes < 0) throw new RangeError('bytes must be finite and nonnegative');
    this.delete(key);
    if (bytes > this.maxBytes) return;
    this.entries.set(key, { value, bytes }); this.bytes += bytes;
    while (this.entries.size > this.maxEntries || this.bytes > this.maxBytes) this.delete(this.entries.keys().next().value!);
  }
  delete(key: string): void { const old = this.entries.get(key); if (old) this.bytes -= old.bytes; this.entries.delete(key); }
  clear(): void { this.entries.clear(); this.bytes = 0; }
  get stats(): { entries: number; bytes: number; maxEntries: number; maxBytes: number } {
    return { entries: this.entries.size, bytes: this.bytes, maxEntries: this.maxEntries, maxBytes: this.maxBytes };
  }
}
