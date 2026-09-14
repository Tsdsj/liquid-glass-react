import { Card, GlassButton, LibraryIcon, Text } from '@liquid-glass-ui/react';
import { Page, Section } from '../site/page.js';
import { MediaViewer } from '../media-viewer.js';
import { componentDocs } from '../catalog/index.js';
import { Icon } from '../icons.js';

const PRINCIPLES = [
  {
    icon: 'layer' as const,
    title: '材质有边界',
    body: '玻璃属于浮动的操作与导航层。正文、列表、卡片与页面背景使用实色或标准材质——如果所有东西都半透明，就没有东西在“浮起来”。',
  },
  {
    icon: 'shield' as const,
    title: '清晰是默认值',
    body: 'Regular 优先保证可读，Clear 只用于受控的媒体背景。减少透明度、增强对比度、减少动效三项系统偏好永远优先于视觉效果。',
  },
  {
    icon: 'code' as const,
    title: '控件是可以拖的',
    body: '分段控件、开关、滑块都 1:1 跟随指针、随拖动拉伸、松手弹簧归位。只能点击的实现，是一套界面“不像 Apple”的最明显特征。',
  },
];

export function OverviewPage({ go }: { go: (path: string) => void }) {
  return <Page title="轻盈有形，清晰如初。"
    lede="一套遵循 Apple 设计语言的 React 组件系统：内容层与操作层分开，材质只用在该用的地方，交互细节按 HIG 实现到位。">
    <div className="hero-actions">
      <GlassButton variant="glassProminent" controlSize="large" onClick={() => go('components')}>
        浏览 {componentDocs.length} 个组件<LibraryIcon name="chevronForward" size={17} />
      </GlassButton>
      <GlassButton variant="gray" controlSize="large" onClick={() => go('guides/install')}>接入指南</GlassButton>
    </div>

    <Section title="一个真实场景" description="玻璃承载操作，内容保持清晰。按住工具栏按钮，感受它从玻璃中浮起再回弹。">
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

    <Section title="这套系统不承诺什么" description="把边界写清楚，比把演示做得更炫更有价值。">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">不是 Apple 官方产品，不包含 Apple 字体、SF Symbols 或壁纸素材。图标全部按 24×24 / 1.8 描边自绘。</Text></li>
          <li><Text as="span" variant="subhead">背景色调由 <code>GlassBackdrop</code> 显式声明，不做 DOM 截屏或跨源像素采样。</Text></li>
          <li><Text as="span" variant="subhead">性能页记录的是 rAF 回调间隔，不是合成器帧时间、掉帧率或 INP。</Text></li>
          <li><Text as="span" variant="subhead">真机 Chrome 矩阵与屏幕阅读器人工验证仍是发布前门槛，没有因为组件变多而降低。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}
