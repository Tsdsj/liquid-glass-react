import type { FC } from 'react';
import type { DemoBackdrop } from '../site/demo.js';
import type { PropRow } from '../site/props-table.js';

export type ComponentGroup = '内容' | '控件' | '输入' | '导航' | '浮层';

export interface DemoEntry {
  /** Anchor id, also used by the outline on the right. */
  id: string;
  title: string;
  description?: string;
  render: FC;
  code: string;
  backdrop?: DemoBackdrop;
  height?: number;
}

export interface ComponentDoc {
  /** URL segment under `#/components/`. */
  slug: string;
  /** The export name, e.g. GlassButton. */
  name: string;
  /** The Chinese name shown first everywhere: 「按钮 GlassButton」. */
  title: string;
  group: ComponentGroup;
  /** One sentence: what it is. */
  summary: string;
  /** When to reach for it, and when not to. */
  when: string[];
  examples: DemoEntry[];
  props: PropRow[];
  /** What keyboard and screen-reader users get. */
  notes: string[];
  /**
   * Slugs of components a reader landing here is likely to want next — the one this pairs
   * with, or the one they should have used instead. Unknown slugs are dropped rather than
   * rendered as dead links; `catalog/index.ts` checks them.
   */
  related?: string[];
  /**
   * Everything this component needs imported, when it is more than the component itself.
   * Defaults to the component's own name.
   */
  imports?: string[];
}
