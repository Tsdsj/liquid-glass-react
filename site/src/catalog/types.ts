import type { FC } from 'react';
import type { DemoBackdrop } from '../site/demo.js';
import type { PropRow } from '../site/props-table.js';

export type ComponentGroup = '内容层' | '控件' | '输入' | '导航' | '浮层';

export interface ComponentDoc {
  /** URL segment under `#/components/`. */
  slug: string;
  name: string;
  group: ComponentGroup;
  /** One sentence: what it is and when to reach for it. */
  summary: string;
  /** The design rule this component encodes, in the guidance's own terms. */
  rule?: string;
  backdrop?: DemoBackdrop;
  demoHeight?: number;
  example: FC;
  code: string;
  props: PropRow[];
  /** Keyboard model, roles and anything a screen-reader user depends on. */
  a11y: string[];
}
