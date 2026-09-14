import { useEffect, useState } from 'react';
import { Card, Text } from '@ttqtt/liquid-glass-react';
import { DemoCard, DemoSettings } from '../site/demo.js';
import { PropsTable } from '../site/props-table.js';
import { Page, Section } from '../site/page.js';
import type { ComponentDoc } from '../catalog/index.js';

/** Highlights whichever section is currently in view, so the outline tells you where you are. */
function useActiveAnchor(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const targets = ids.map(id => document.getElementById(id)).filter((node): node is HTMLElement => !!node);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-96px 0px -60% 0px' });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [ids.join()]);
  return active;
}

/**
 * One renderer for every component page. The pages are data rather than thirty near-identical
 * files, which also means the sections cannot quietly drift apart from one another.
 */
export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const anchors = [...doc.examples.map(example => example.id), 'api', 'a11y'];
  const active = useActiveAnchor(anchors);
  const hasMediaExample = doc.examples.some(example => example.backdrop === 'both');

  return <div className="component-layout">
    <Page eyebrow={doc.group} title={`${doc.title} ${doc.name}`} lede={doc.summary}>
      {doc.when.length > 0 && <Card fill="secondary" radius={20} padding={18} className="when-card">
        <Text variant="footnote" emphasized tone="accent">何时使用</Text>
        <ul className="plain-list" style={{ marginBlockStart: 8 }}>
          {doc.when.map(item => <li key={item}><Text as="span" variant="subhead">{item}</Text></li>)}
        </ul>
      </Card>}

      <Section title="代码演示">
        <DemoSettings showSurface={hasMediaExample}>
          <div className="demo-grid">
            {doc.examples.map(example => {
              const Render = example.render;
              return <DemoCard key={example.id} id={example.id} title={example.title}
                description={example.description} code={example.code}
                backdrop={example.backdrop} height={example.height}>
                <Render />
              </DemoCard>;
            })}
          </div>
        </DemoSettings>
      </Section>

      <Section title="API" id="api">
        <PropsTable rows={doc.props} />
      </Section>

      <Section title="键盘与辅助功能" id="a11y">
        <ul className="doc-a11y">
          {doc.notes.map(note => <li key={note}><Text as="span" variant="subhead">{note}</Text></li>)}
        </ul>
      </Section>
    </Page>

    <nav className="outline" aria-label="本页目录">
      <Text variant="caption1" emphasized tone="tertiary" className="outline-title">本页内容</Text>
      {doc.examples.map(example => <a key={example.id} href={`#${example.id}`}
        className="outline-link" aria-current={active === example.id ? 'location' : undefined}
        onClick={event => { event.preventDefault(); document.getElementById(example.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
        {example.title}
      </a>)}
      <a href="#api" className="outline-link" aria-current={active === 'api' ? 'location' : undefined}
        onClick={event => { event.preventDefault(); document.getElementById('api')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>API</a>
      <a href="#a11y" className="outline-link" aria-current={active === 'a11y' ? 'location' : undefined}
        onClick={event => { event.preventDefault(); document.getElementById('a11y')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>键盘与辅助功能</a>
    </nav>
  </div>;
}
