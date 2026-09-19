import { contentDocs } from './content.js';
import { controlDocs } from './controls.js';
import { fieldDocs } from './fields.js';
import { navigationDocs } from './navigation.js';
import { overlayDocs } from './overlays.js';
import type { ComponentDoc, ComponentGroup } from './types.js';

export type { ComponentDoc, ComponentGroup, DemoEntry } from './types.js';

/** Content first, then the things that float above it — the order is part of the rule. */
export const componentDocs: ComponentDoc[] = [
  ...contentDocs, ...controlDocs, ...fieldDocs, ...navigationDocs, ...overlayDocs,
];

export const groupOrder: ComponentGroup[] = ['内容', '控件', '输入', '导航', '浮层'];

export const groupedDocs = groupOrder
  .map(group => ({ group, docs: componentDocs.filter(doc => doc.group === group) }))
  .filter(entry => entry.docs.length > 0);

export const findDoc = (slug: string) => componentDocs.find(doc => doc.slug === slug);

/** The label used everywhere: Chinese first, then the export name. */
export const docLabel = (doc: ComponentDoc) => `${doc.title} ${doc.name}`;

/**
 * Related components, resolved. A slug that does not exist is dropped here rather than
 * rendered as a link that goes nowhere — and, in development, said out loud, because a typo
 * in a cross-reference is otherwise invisible until a reader clicks it.
 */
export function relatedDocs(doc: ComponentDoc): ComponentDoc[] {
  return (doc.related ?? []).map(slug => {
    const found = findDoc(slug);
    if (!found && import.meta.env.DEV) console.warn(`[docs] ${doc.slug}.related names "${slug}", which is not a component`);
    return found;
  }).filter((entry): entry is ComponentDoc => !!entry);
}

/** What a reader has to import to use this page's examples. */
export const importLine = (doc: ComponentDoc) =>
  `import { ${(doc.imports ?? [doc.name]).join(', ')} } from '@ttqtt/liquid-glass-react';`;

/** Substring match over both names, the summary and the group — enough for a catalogue this size. */
export function searchDocs(query: string): ComponentDoc[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  return componentDocs.filter(doc =>
    doc.name.toLocaleLowerCase().includes(needle)
    || doc.title.includes(needle)
    || doc.slug.includes(needle)
    || doc.summary.toLocaleLowerCase().includes(needle)
    || doc.group.includes(needle));
}
