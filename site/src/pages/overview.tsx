import { Card, GlassButton, LibraryIcon, Text } from '@ttqtt/liquid-glass-react';
import { Page, Section } from '../site/page.js';
import { MediaViewer } from '../media-viewer.js';
import { componentDocs } from '../catalog/index.js';
import { Icon } from '../icons.js';

const PRINCIPLES = [
  {
    icon: 'layer' as const,
    title: '只有该浮起来的才浮起来',
    body: '玻璃留给工具栏、标签栏和弹出面板。正文、列表、卡片保持不透明——满屏半透明的结果是什么都不突出。',
  },
  {
    icon: 'shield' as const,
    title: '看得清排在好看前面',
    body: '用户在系统里开了减少透明度、增强对比度或减少动效，界面立刻跟着变，不需要你写一行代码。',
  },
  {
    icon: 'code' as const,
    title: '控件是可以拖的',
    body: '分段控件、开关、滑块都跟手，松开会回弹。只能点的实现，是一套界面"差那么一点"最明显的地方。',
  },
];

export function OverviewPage({ go }: { go: (path: string) => void }) {
  return <Page title="轻盈有形，清晰如初。"
    lede="一套 React 组件库。内容和操作分开，材质只用在该用的地方，交互细节做到位。">
    <div className="hero-actions">
      <GlassButton variant="glassProminent" controlSize="large" onClick={() => go('components')}>
        浏览 {componentDocs.length} 个组件<LibraryIcon name="chevronForward" size={17} />
      </GlassButton>
      <GlassButton variant="gray" controlSize="large" onClick={() => go('guides/install')}>安装与使用</GlassButton>
    </div>

    <Section title="先看一眼" description="玻璃承载操作，照片保持清晰。按住工具栏上的按钮，感受它从玻璃里浮起来再落回去。">
      <MediaViewer />
    </Section>

    <Section title="三条原则">
      <div className="principles">
        {PRINCIPLES.map(item => <Card key={item.title} radius={20} padding={20} className="principle">
          <Icon name={item.icon} size={24} />
          <Text as="h3" variant="headline" style={{ marginBlockStart: 12 }}>{item.title}</Text>
          <Text variant="subhead" tone="secondary" style={{ marginBlockStart: 8 }}>{item.body}</Text>
        </Card>)}
      </div>
    </Section>

    <Section title="先说清楚边界" description="把做不到的事写在前面，比把演示做得更炫有用。">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">这是一个独立项目，不是 Apple 官方产品，也不包含 Apple 的字体和图标素材。所有图标都是自己画的。</Text></li>
          <li><Text as="span" variant="subhead">玻璃需要你告诉它背后是深是浅，它不会去截屏猜测——这样行为可预期，也不碰用户的画面内容。</Text></li>
          <li><Text as="span" variant="subhead">默认是磨砂玻璃，所有浏览器一致。边缘折射要自己打开，而且只有 Chrome 和 Edge 能跑。</Text></li>
          <li><Text as="span" variant="subhead">屏幕阅读器的实机验证还没做完，这一条写在这里，不藏着。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}
