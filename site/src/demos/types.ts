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

export interface ComponentDoc {
  slug: string;
  name: string;
  title: Bilingual;
  category: Bilingual;
  description: Bilingual;
  renderPreview: () => ReactNode;
  demos: DemoSpec[];
  api: ApiSection[];
}
