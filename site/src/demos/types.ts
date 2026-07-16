import type { ReactNode } from 'react';
import type { PropRow } from '../components/PropsTable';
import type { Bilingual } from '../site-i18n';

export interface DemoSpec {
  id: string;
  title: Bilingual;
  description: Bilingual;
  code: string;
  render: () => ReactNode;
}

export interface ApiSection {
  title: string;
  rows: PropRow[];
}

export type PlaygroundControl =
  | { key: string; type: 'select'; label: Bilingual; options: { value: string; label: string }[]; default: string }
  | { key: string; type: 'boolean'; label: Bilingual; default: boolean }
  | { key: string; type: 'text'; label: Bilingual; default: string };

export type PlaygroundProps = Record<string, string | boolean>;

export interface PlaygroundSpec {
  controls: PlaygroundControl[];
  render: (props: PlaygroundProps) => ReactNode;
  code: (props: PlaygroundProps) => string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  title: Bilingual;
  category: Bilingual;
  description: Bilingual;
  renderPreview: () => ReactNode;
  demos: DemoSpec[];
  api: ApiSection[];
  /** Optional interactive props playground (progressive — high-frequency components only). */
  playground?: PlaygroundSpec;
}
