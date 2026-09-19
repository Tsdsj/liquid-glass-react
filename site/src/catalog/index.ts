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

/** What a search result points at. */
export interface DocHit {
  doc: ComponentDoc;
  kind: 'component' | 'example' | 'prop' | 'section';
  /** What matched, shown as the result's own line. */
  label: string;
  /** Where it is, shown underneath. */
  detail: string;
  /** Element id to scroll to after navigating. Absent for a whole-page hit. */
  anchor?: string;
}

/** The fixed sections every component page has, so they are findable by name too. */
const SECTIONS = [
  { id: 'api', label: 'API' },
  { id: 'a11y', label: '键盘与辅助功能' },
] as const;

/**
 * Substring match over everything a reader might remember.
 *
 * Component names alone were not enough: what people actually recall is a property name
 * (`marks`), an example's title (「刻度」) or a section (「键盘与辅助功能」) — and searching for
 * any of those used to return nothing, which reads as "this library does not have that".
 * Ordered by kind so the page itself always outranks something inside it.
 */
export function searchDocs(query: string): DocHit[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  const has = (value: string | undefined) => !!value && value.toLocaleLowerCase().includes(needle);

  const pages: DocHit[] = [], examples: DocHit[] = [], props: DocHit[] = [], sections: DocHit[] = [];
  for (const doc of componentDocs) {
    if (has(doc.name) || has(doc.title) || has(doc.slug) || has(doc.summary) || has(doc.group)) {
      pages.push({ doc, kind: 'component', label: docLabel(doc), detail: doc.summary });
    }
    for (const example of doc.examples) {
      if (has(example.title) || has(example.description)) {
        examples.push({ doc, kind: 'example', label: example.title, detail: `示例 · ${docLabel(doc)}`, anchor: example.id });
      }
    }
    for (const row of doc.props) {
      if (has(row.name) || has(row.description)) {
        props.push({ doc, kind: 'prop', label: row.name, detail: `属性 · ${docLabel(doc)}`, anchor: 'api' });
      }
    }
    for (const section of SECTIONS) {
      if (has(section.label)) {
        sections.push({ doc, kind: 'section', label: section.label, detail: docLabel(doc), anchor: section.id });
      }
    }
  }
  return [...pages, ...examples, ...props, ...sections];
}
