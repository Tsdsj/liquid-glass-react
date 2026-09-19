import { useEffect, useState } from 'react';
import { Card, GlassButton, GlassMenu, LibraryIcon, Text } from '@ttqtt/liquid-glass-react';
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
  const hasMediaExample = doc.examples.some(example => example.backdrop === 'both');

  /** One list of destinations, used by both the sidebar outline and the compact menu. */
  const sections = [
    ...doc.examples.map(example => ({ id: example.id, label: example.title })),
    { id: 'api', label: 'API' },
    { id: 'a11y', label: '键盘与辅助功能' },
    ...(related.length ? [{ id: 'related', label: '相关组件' }] : []),
  ];
  const active = useActiveAnchor(sections.map(section => section.id));
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  /**
   * The compact control names the section you are in, the way a pop-up button names the current
   * selection, rather than marking it with a checkmark inside the menu. A checkmark renders as
   * `role="menuitemcheckbox"`, which announces a toggle — and these items are destinations, not
   * attributes. Naming it in the button also means the visible text is the accessible name, so
   * Voice Control can say it.
   */
  const current = sections.find(section => section.id === active)?.label ?? '本页内容';


  return <div className="component-layout">
    {/*
      Under 1280px there is no room for the outline column, and a long component page then has
      no way to move around inside itself. The menu is the same destinations in the form that
      fits — and it is this library's own menu, which is the right way to find out what using it
      feels like. The current section is the checked item, so the menu also says where you are.
    */}
    <div className="outline-compact">
      <GlassMenu aria-label="本页内容" align="end"
        trigger={<GlassButton variant="gray" controlSize="small" className="outline-trigger">
          <span className="outline-trigger-label">{current}</span><LibraryIcon name="chevronDown" size={15} />
        </GlassButton>}
        items={sections.map(section => ({
          key: section.id, label: section.label,
          onSelect: () => jumpTo(section.id),
        }))} /></div>

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
            {doc.examples.map(example => <DemoCard key={example.id} {...example} />)}
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
      {sections.map(section => <a key={section.id} href={`#${section.id}`}
        className="outline-link" aria-current={active === section.id ? 'location' : undefined}
        onClick={event => { event.preventDefault(); jumpTo(section.id); }}>
        {section.label}
      </a>)}
    </nav>
  </div>;
}
