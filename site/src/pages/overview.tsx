import { useState } from 'react';
import { Card, GlassButton, GlassProvider, GlassSwitch, LibraryIcon, Text, supportsSvgBackdrop } from '@ttqtt/liquid-glass-react';
import { Section } from '../site/page.js';
import { MediaViewer } from '../media-viewer.js';
import { DesktopWindow } from '../desktop-window.js';
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
    body: '分段控件、开关、滑块都跟手，松开会回弹。只能点的实现，是一套界面「差那么一点」最明显的地方。',
  },
];

/** The numbers worth putting on the first screen, because they are what the reader is sizing up. */
const FACTS = [
  { value: String(componentDocs.length), label: '个组件页' },
  { value: '0', label: '个运行时依赖' },
  { value: '4', label: '项系统偏好自动生效' },
];

/**
 * The switch that turns edge refraction on.
 *
 * It is off by default here for the same reason it is off by default in the library: it costs
 * a generated displacement map per surface and only Chromium reads the filter at all. The
 * switch exists because "默认是磨砂玻璃，折射要自己打开" was written on this page for months
 * with no way to see the difference — a boundary you state but cannot demonstrate reads as an
 * excuse.
 *
 * Where the browser cannot do it, the switch is disabled and says so. Offering a control that
 * changes nothing is worse than not offering one.
 */
function RefractionDemo() {
  const [on, setOn] = useState(false);
  /* Read once, in a lazy initialiser: it is a static capability, and calling `CSS.supports`
     during render on every keystroke elsewhere on the page would be work for no answer.
     `false` on the server, which is right — there is no backdrop filter there either. */
  const [capable] = useState(() => typeof window !== 'undefined' && supportsSvgBackdrop());
  return <div className="refraction-demo">
    {/* A control bar over the thing it controls, aligned to it — not a filled card of its own
        width sitting above something narrower, which reads as two unrelated blocks. */}
    <div className="refraction-switch">
      <GlassSwitch aria-label="边缘折射" label="边缘折射" checked={on && capable} disabled={!capable}
        onCheckedChange={setOn} />
      <Text variant="footnote" tone="secondary" className="refraction-note">
        {capable
          ? '打开后，玻璃边缘会把背后的内容折弯，而不只是磨砂。开销大约三倍，所以默认关着。'
          : '这个浏览器不支持折射，所以这个开关是关着的——Safari 和 Firefox 读不了 backdrop-filter 里的 SVG 滤镜，玻璃在这里是磨砂的。'}
      </Text>
    </div>
    {/* Only this demo, not the whole site: the switch is about what refraction looks like, and
        turning it on for every surface on the page would be a different claim. */}
    <GlassProvider renderer={on && capable ? 'svg' : 'css'}><MediaViewer /></GlassProvider>
  </div>;
}

export function OverviewPage({ go }: { go: (path: string) => void }) {
  return <article className="page overview">
    {/*
      The hero is its own element rather than the shared `Page` header: this page opens with a
      claim and two ways in, and the shared header's eyebrow-title-lede stack has no room for
      either. Everything below it still uses `Section`.
    */}
    <header className="overview-hero">
      <Text as="h1" variant="largeTitle" emphasized className="overview-title">轻盈有形，清晰如初。</Text>
      <Text variant="callout" tone="secondary" className="overview-lede">
        一套 React 组件库。内容和操作分开，材质只用在该用的地方，交互细节做到位。
      </Text>
      <div className="hero-actions">
        <GlassButton variant="glassProminent" controlSize="large"
          trailingIcon={<LibraryIcon name="chevronForward" size={17} />}
          onClick={() => go('components')}>浏览 {componentDocs.length} 个组件</GlassButton>
        <GlassButton variant="gray" controlSize="large" onClick={() => go('guides/install')}>安装与使用</GlassButton>
      </div>
      <dl className="overview-facts">
        {FACTS.map(fact => <div key={fact.label} className="overview-fact">
          <Text as="dt" variant="title2" emphasized tabular>{fact.value}</Text>
          <Text as="dd" variant="footnote" tone="secondary">{fact.label}</Text>
        </div>)}
      </dl>
    </header>

    <Section title="先看一眼" description="玻璃承载操作，照片保持清晰。按住工具栏上的按钮，感受它从玻璃里浮起来再落回去。">
      <RefractionDemo />
    </Section>

    {/* The composite goes above the principles: it is the argument, and the three principles
        are the reasons. Reading it the other way round asks someone to take three claims on
        trust before they have seen anything made out of them. */}
    <Section title="一扇窗口"
      description="菜单栏、工具栏、分栏、大纲视图、检查器、路径栏和一块浮动面板——七个组件拼在一起才是一个应用的样子。左边的树和下面的路径栏是同一个层级的两头。把窗口拖窄，分栏会折成一摞页面，菜单栏退场。">
      <DesktopWindow />
    </Section>

    <Section title="三条原则">
      <div className="principles">
        {PRINCIPLES.map(item => <Card key={item.title} radius={20} padding={20} className="principle">
          <span className="principle-icon" aria-hidden="true"><Icon name={item.icon} size={22} /></span>
          <Text as="h3" variant="headline">{item.title}</Text>
          <Text variant="subhead" tone="secondary">{item.body}</Text>
        </Card>)}
      </div>
    </Section>

    <Section title="先说清楚边界" description="把做不到的事写在前面，比把演示做得更炫有用。">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">这是一个独立项目，不是 Apple 官方产品，也不包含 Apple 的字体和图标素材。所有图标都是自己画的。</Text></li>
          <li><Text as="span" variant="subhead">玻璃需要你告诉它背后是深是浅，它不会去截屏猜测——这样行为可预期，也不碰用户的画面内容。</Text></li>
          <li><Text as="span" variant="subhead">默认是磨砂玻璃，所有浏览器一致。边缘折射要自己打开，而且只有 Chrome 和 Edge 能跑——上面那个开关就是它，在别的浏览器里会告诉你为什么按不了。</Text></li>
          <li><Text as="span" variant="subhead">屏幕阅读器的实机验证还没做完，这一条写在这里，不藏着。</Text></li>
        </ul>
      </Card>
    </Section>
  </article>;
}
