import type { ReactNode } from 'react';
import { Text } from '@ttqtt/liquid-glass-react';

/** Page chrome. The heading is a real `h1`; `Text` never infers heading levels on its own. */
export function Page({ eyebrow, title, lede, children }: {
  eyebrow?: string; title: string; lede?: ReactNode; children: ReactNode;
}) {
  return <article className="page">
    <header className="page-head">
      {/* Title-style capitalization, not ALL CAPS: the uppercase eyebrow was retired in iOS 26. */}
      {eyebrow && <Text variant="subhead" emphasized tone="accent" className="page-eyebrow">{eyebrow}</Text>}
      <Text as="h1" variant="largeTitle" emphasized>{title}</Text>
      {lede && <Text variant="callout" tone="secondary" className="page-lede">{lede}</Text>}
    </header>
    {children}
  </article>;
}

export function Section({ title, description, children, id }: {
  title: string; description?: ReactNode; children: ReactNode; id?: string;
}) {
  return <section className="page-section" id={id}>
    <Text as="h2" variant="title2" emphasized>{title}</Text>
    {description && <Text variant="subhead" tone="secondary" className="section-lede">{description}</Text>}
    {children}
  </section>;
}

/** A short rule quoted from the guidance, so the "why" sits next to the example. */
export function Rule({ children }: { children: ReactNode }) {
  return <aside className="rule-note">
    <Text variant="footnote" tone="secondary">{children}</Text>
  </aside>;
}
