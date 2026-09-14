import { contentDocs } from './content.js';
import { controlDocs } from './controls.js';
import { fieldDocs } from './fields.js';
import { navigationDocs } from './navigation.js';
import { overlayDocs } from './overlays.js';
import type { ComponentDoc, ComponentGroup } from './types.js';

export type { ComponentDoc, ComponentGroup } from './types.js';

/** Ordered by layer: content first, then the floating control and navigation layer. */
export const componentDocs: ComponentDoc[] = [
  ...contentDocs, ...controlDocs, ...fieldDocs, ...navigationDocs, ...overlayDocs,
];

export const groupOrder: ComponentGroup[] = ['内容层', '控件', '输入', '导航', '浮层'];

export const groupedDocs = groupOrder
  .map(group => ({ group, docs: componentDocs.filter(doc => doc.group === group) }))
  .filter(entry => entry.docs.length > 0);

export const findDoc = (slug: string) => componentDocs.find(doc => doc.slug === slug);

/** Substring match over name, slug and summary — enough for a catalogue this size. */
export function searchDocs(query: string): ComponentDoc[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  return componentDocs.filter(doc =>
    doc.name.toLocaleLowerCase().includes(needle)
    || doc.slug.includes(needle)
    || doc.summary.toLocaleLowerCase().includes(needle)
    || doc.group.includes(needle));
}
