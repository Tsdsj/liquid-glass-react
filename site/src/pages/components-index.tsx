import { Card, List, ListRow, ListSection, Text } from '@ttqtt/liquid-glass-react';
import { Page, Section } from '../site/page.js';
import { componentDocs, groupedDocs } from '../catalog/index.js';

export function ComponentsIndex({ go }: { go: (path: string) => void }) {
  return <Page eyebrow="组件" title="组件目录"
    lede={`${componentDocs.length} 个组件，按所属的层分组。内容层在前，浮动的操作与导航层在后——这个顺序本身就是规则的一部分。`}>
    <Section title="按层浏览">
      <div className="catalog-groups">
        {groupedDocs.map(({ group, docs }) => <Card key={group} radius={20} padding={0} className="catalog-card">
          <div className="catalog-card-head">
            <Text as="h3" variant="headline">{group}</Text>
            <Text variant="caption1" tone="tertiary">{docs.length} 个</Text>
          </div>
          <List variant="plain">
            <ListSection>
              {docs.map(doc => <ListRow key={doc.slug} label={doc.name} secondaryLabel={doc.summary}
                onSelect={() => go(`components/${doc.slug}`)} />)}
            </ListSection>
          </List>
        </Card>)}
      </div>
    </Section>
  </Page>;
}
