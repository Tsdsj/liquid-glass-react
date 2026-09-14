import { Card, List, ListRow, ListSection, Text } from '@ttqtt/liquid-glass-react';
import { Page, Section } from '../site/page.js';
import { componentDocs, docLabel, groupedDocs } from '../catalog/index.js';

export function ComponentsIndex({ go }: { go: (path: string) => void }) {
  return <Page eyebrow="组件" title="组件目录"
    lede={`共 ${componentDocs.length} 个组件。先是构成页面内容的部分，然后才是浮在内容之上的操作与导航。`}>
    <Section title="按用途浏览">
      <div className="catalog-groups">
        {groupedDocs.map(({ group, docs }) => <Card key={group} radius={20} padding={0} className="catalog-card">
          <div className="catalog-card-head">
            <Text as="h3" variant="headline">{group}</Text>
            <Text variant="caption1" tone="tertiary">{docs.length} 个</Text>
          </div>
          <List variant="plain">
            <ListSection>
              {docs.map(doc => <ListRow key={doc.slug} label={docLabel(doc)} secondaryLabel={doc.summary}
                onSelect={() => go(`components/${doc.slug}`)} />)}
            </ListSection>
          </List>
        </Card>)}
      </div>
    </Section>
  </Page>;
}
