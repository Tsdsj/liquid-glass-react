import { Card, Divider, Text } from '@liquid-glass-ui/react';
import { Demo } from '../site/demo.js';
import { CodeBlock } from '../site/code-block.js';
import { PropsTable } from '../site/props-table.js';
import { Page, Section } from '../site/page.js';
import type { ComponentDoc } from '../catalog/index.js';

/**
 * One renderer for every component page. The pages are data, not thirty near-identical
 * files — which also means the sections cannot quietly drift apart from each other.
 */
export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const Example = doc.example;
  return <Page eyebrow={doc.group} title={doc.name} lede={doc.summary}>
    {doc.rule && <Card fill="secondary" radius={20} padding={16} className="doc-rule">
      <Text variant="footnote" emphasized tone="accent">设计规则</Text>
      <Text variant="subhead" style={{ marginBlockStart: 6 }}>{doc.rule}</Text>
    </Card>}

    <Section title="示例">
      <Demo backdrop={doc.backdrop} height={doc.demoHeight} label={`${doc.name} · 实时示例`}>
        <Example />
      </Demo>
    </Section>

    <Section title="用法">
      <CodeBlock code={doc.code} />
    </Section>

    <Section title="属性">
      <PropsTable rows={doc.props} />
    </Section>

    <Section title="无障碍与键盘">
      <ul className="doc-a11y">
        {doc.a11y.map(item => <li key={item}><Text as="span" variant="subhead">{item}</Text></li>)}
      </ul>
    </Section>

    <Divider style={{ marginBlock: 24 }} />
    <Text variant="footnote" tone="tertiary">
      本组件属于{doc.group}。玻璃只用于浮动的操作与导航层；内容层使用实色或标准材质。
    </Text>
  </Page>;
}
