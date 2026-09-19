import type { FC } from 'react';
import type { DemoBackdrop } from '../site/demo.js';
import type { PropRow } from '../site/props-table.js';

export type ComponentGroup = '内容' | '控件' | '输入' | '导航' | '浮层';

/**
 * One adjustable property on a demo.
 *
 * The values are the component's own property values, not a parallel vocabulary: a knob named
 * `variant` sets `variant`, and the code block underneath shows the call that produces what is
 * on screen. A panel that spoke in its own terms would be a fourth thing to learn.
 */
export type Knob =
  | { name: string; label: string; type: 'boolean'; value: boolean }
  | { name: string; label: string; type: 'select'; value: string; options: { value: string; label: string }[] }
  | { name: string; label: string; type: 'number'; value: number; min?: number; max?: number; step?: number }
  | { name: string; label: string; type: 'text'; value: string };

export type KnobValues = Record<string, string | number | boolean>;

/** What every demo's render function is handed. Demos without knobs simply ignore it. */
export interface DemoRenderProps { knobs: KnobValues }

export interface DemoEntry {
  /** Anchor id, also used by the outline on the right. */
  id: string;
  title: string;
  description?: string;
  render: FC<DemoRenderProps>;
  /** A fixed snippet, or one written from the current knob values. */
  code: string | ((knobs: KnobValues) => string);
  backdrop?: DemoBackdrop;
  height?: number;
  /**
   * Turns this demo into the page's adjustable one. At most one per page — a reader looking for
   * "the one I can play with" should not have to find it among five.
   */
  knobs?: Knob[];
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
