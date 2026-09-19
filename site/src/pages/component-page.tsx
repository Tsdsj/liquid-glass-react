import { useEffect, useState } from 'react';
import { Card, LibraryIcon, Text } from '@ttqtt/liquid-glass-react';
import { DemoCard, DemoSettings } from '../site/demo.js';
import { CodeBlock } from '../site/code-block.js';
import { PropsTable } from '../site/props-table.js';
import { Page, Section } from '../site/page.js';
import { docLabel, importLine, relatedDocs, type ComponentDoc } from '../catalog/index.js';

const REPO = 'https://github.com/Tsdsj/liquid-glass-react';

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
/** Which catalogue file a component's page is written in, for the "view source" link. */
const sourceFile = (doc: ComponentDoc) => ({
  内容: 'content.tsx', 控件: 'controls.tsx', 输入: 'fields.tsx', 导航: 'navigation.tsx', 浮层: 'overlays.tsx',
}[doc.group]);

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const related = relatedDocs(doc);
  const anchors = [...doc.examples.map(example => example.id), 'api', 'a11y', ...(related.length ? ['related'] : [])];
  const active = useActiveAnchor(anchors);
  const hasMediaExample = doc.examples.some(example => example.backdrop === 'both');

  return <div className="component-layout">
    <Page eyebrow={doc.group} title={`${doc.title} ${doc.name}`} lede={doc.summary}>
      {/* The first thing anyone needs from a component page, and the thing it never had. */}
      <div className="doc-import"><CodeBlock code={importLine(doc)} label="复制 import" /></div>

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

      {related.length > 0 && <Section title="相关组件" id="related">
        <div className="doc-related">
          {related.map(entry => <a key={entry.slug} className="doc-related-link" href={`#/components/${entry.slug}`}>
            <Text as="span" variant="subhead" emphasized>{docLabel(entry)}</Text>
            <Text as="span" variant="footnote" tone="secondary">{entry.summary}</Text>
          </a>)}
        </div>
      </Section>}

      <div className="doc-source">
        <a className="doc-source-link" href={`${REPO}/blob/main/site/src/catalog/${sourceFile(doc)}`} rel="noreferrer noopener">
          <LibraryIcon name="chevronForward" size={14} /><Text as="span" variant="footnote">查看这一页的源码</Text>
        </a>
        <a className="doc-source-link" href={`${REPO}/issues/new?title=${encodeURIComponent(`[${doc.name}] `)}`} rel="noreferrer noopener">
          <LibraryIcon name="chevronForward" size={14} /><Text as="span" variant="footnote">报告问题</Text>
        </a>
      </div>
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
      {related.length > 0 && <a href="#related" className="outline-link" aria-current={active === 'related' ? 'location' : undefined}
        onClick={event => { event.preventDefault(); document.getElementById('related')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>相关组件</a>}
    </nav>
  </div>;
}
