import { Card, Text } from '@ttqtt/liquid-glass-react';
import { Page, Section, Rule } from '../site/page.js';
import { CodeBlock } from '../site/code-block.js';

export function InstallGuide() {
  return <Page eyebrow="指南" title="安装与使用" lede="一个包，一份样式表，剩下的就是正常的 React 组件。">
    <Section title="安装">
      <CodeBlock code={`pnpm add @ttqtt/liquid-glass-react
# 或 npm install @ttqtt/liquid-glass-react`} />
      <Text variant="subhead" tone="secondary">需要 React 19。除此之外没有别的依赖。</Text>
    </Section>

    <Section title="引入样式" description="在应用入口引一次就行，不用在每个组件里重复。">
      <CodeBlock code={`import '@ttqtt/liquid-glass-react/style.css';`} />
    </Section>

    <Section title="包一层 Provider" description="它负责主题、以及把系统的无障碍设置传给所有组件。想用轻提示的话再包一层 ToastProvider。">
      <CodeBlock code={`import {
  GlassProvider, ToastProvider,
  GlassToolbar, ToolbarGroup, ToolbarSpacer, GlassButton,
} from '@ttqtt/liquid-glass-react';
import '@ttqtt/liquid-glass-react/style.css';

export function App() {
  return (
    <GlassProvider theme="system">
      <ToastProvider>
        <GlassToolbar aria-label="图片操作">
          <ToolbarGroup>
            <GlassButton>查看原图</GlassButton>
          </ToolbarGroup>
          <ToolbarSpacer variant="flexible" />
          <ToolbarGroup prominent>
            <GlassButton variant="glassProminent">导出</GlassButton>
          </ToolbarGroup>
        </GlassToolbar>
      </ToastProvider>
    </GlassProvider>
  );
}`} />
    </Section>

    <Section title="浏览器支持">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">默认到处都是磨砂玻璃：模糊、提色、高光。这是所有浏览器都能跑的那一档。</Text></li>
          <li><Text as="span" variant="subhead">边缘折射要自己打开，而且目前只有 Chrome 和 Edge 能跑；Safari 和 Firefox 会退回磨砂。见「效果与性能」。</Text></li>
          <li><Text as="span" variant="subhead">用户开了减少透明度、增强对比度或减少动效，会在此基础上进一步退化到实色和简单淡入淡出。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function ThemingGuide() {
  return <Page eyebrow="指南" title="换主题色" lede="换成你自己的品牌色，只需要改一对变量。">
    <Section title="主题色">
      <CodeBlock code={`:root, [data-lg-theme="light"] { --lg-accent: #6d28d9; }
[data-lg-theme="dark"]        { --lg-accent: #8b5cf6; }`} />
      <Text variant="subhead" tone="secondary">
        按钮文字会保持白色，所以主题色需要足够深。主题色被当成**文字**用的时候（扁平按钮的标签、`tone="accent"` 的文字）会自动压暗一档再画，否则浅色页面上读不清。开关打开时的绿色不跟着变——那个绿色本身就是「已打开」的意思。
      </Text>
    </Section>

    <Section title="浅色和深色" description="主题是写在每个表面上的，所以浅色页面里可以放一条深色工具栏，不用把整页翻过去。">
      <CodeBlock code={`<GlassProvider theme="system">   {/* 或 "light" / "dark" */}
  <GlassBackdrop tone="dark">
    {/* 这里面的小块玻璃会自动用深色外观 */}
    <GlassToolbar aria-label="播放控制">…</GlassToolbar>
  </GlassBackdrop>
</GlassProvider>`} />
    </Section>

    <Section title="不要让主题闪一下">
      <Rule>主题必须在页面画出来之前就定好。等 React 跑起来再设置，用户会先看到错误的主题闪一下；开了系统深色模式的人还会先看到白屏。</Rule>
      <CodeBlock code={`<!-- 放在 <head> 里，在其它脚本之前 -->
<script>
  var stored = localStorage.getItem('theme') || 'system';
  var dark = stored === 'dark' ||
    (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-lg-theme', dark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
</script>`} />
    </Section>

    <Section title="文字大小" description="跟随系统文字大小设置的网页版。调到最大时，布局需要能重新排开。">
      <CodeBlock code={`document.documentElement.dataset.lgTextSize = 'ax3';
// xs | s | m | l | xl | xxl | xxxl | ax1 … ax5`} />
    </Section>

    <Section title="鼠标和手指用的不是同一套尺寸"
      description="有光标的宽窗口下，控件更紧凑、命中区更小。字号不变。默认自动判断，不用配置。">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">标准控件 <strong>44 → 36</strong>，紧凑 <strong>36 → 32</strong>，小 <strong>32 → 28</strong>，大 <strong>50 → 44</strong>。</Text></li>
          <li><Text as="span" variant="subhead">命中区下限 <strong>44 → 24</strong>：手指的数来自 Apple，光标的数来自 WCAG 2.2。控件画得比这小没关系，能点到的范围不会小。</Text></li>
          <li><Text as="span" variant="subhead"><strong>字号一张表，两个平台通用。</strong>指针比手指准，这是关于手的事；插上鼠标眼睛不会变好，所以正文还是 17。</Text></li>
        </ul>
      </Card>
      <CodeBlock code={`{/* 默认：有光标且窗口宽于 768px 就用桌面那套 */}
<GlassProvider platform="auto">…</GlassProvider>

{/* 你比浏览器更清楚的时候，两个方向都能压过去 */}
<GlassProvider platform="touch">…</GlassProvider>`} />
      <Text variant="subhead" tone="secondary">
        带触控板的平板在手机宽度下也会报「有光标」，所以还要看窗口宽度：36px 的控件放在 390px 的屏幕上，是对的问题给了错的答案。
      </Text>
    </Section>
  </Page>;
}

export function RendererGuide() {
  return <Page eyebrow="指南" title="效果与性能" lede="折射好看，但它不是免费的。这一页说明什么时候该省着用。">
    <Section title="三种呈现方式">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead"><code>renderer=&quot;css&quot;</code>——模糊、提色、高光。所有浏览器都能跑，也是默认。</Text></li>
          <li><Text as="span" variant="subhead"><code>renderer=&quot;svg&quot;</code>——额外加上边缘折射。需要你自己在目标浏览器上确认效果之后再开。</Text></li>
          <li><Text as="span" variant="subhead"><code>transparency=&quot;opaque&quot;</code>——全部关掉，优先保证看得清。</Text></li>
        </ul>
      </Card>
      <CodeBlock code={`<GlassProvider renderer="auto">…</GlassProvider>

// 在你的目标环境上验证过之后
<GlassProvider renderer="svg">…</GlassProvider>`} />
    </Section>

    <Section title="省着点用">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">一屏里的玻璃控制在二十个以内。每一块都要在背后内容变化时重新算一次。</Text></li>
          <li><Text as="span" variant="subhead">色散效果开销大约三倍，只给一两个重点元素用，不要给一直挂在屏幕上的固定栏用。</Text></li>
          <li><Text as="span" variant="subhead">玻璃属于浮起来的那一层。把它用到列表行和卡片上，既不好看也很慢。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function SsrGuide() {
  return <Page eyebrow="指南" title="服务端渲染" lede="服务端先出磨砂效果，到了浏览器再升级成折射，中间不会闪。">
    <Section title="能直接用">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">组件在服务端不会去碰浏览器才有的东西，直接渲染就行。</Text></li>
          <li><Text as="span" variant="subhead">主题设成跟随系统时，服务端会先输出浅色，到浏览器再按真实设置切换。要求首屏就正确的话，从 cookie 读出来传进去。</Text></li>
        </ul>
      </Card>
    </Section>

    <Section title="Next.js App Router">
      <Text variant="subhead" tone="secondary">
        在根布局里引一次样式表即可。整个包已经标成客户端组件，你不需要再为它单独加标记。
      </Text>
      <CodeBlock code={`// app/layout.tsx
import '@ttqtt/liquid-glass-react/style.css';

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}`} />
    </Section>

    <Section title="多个渲染根">
      <Text variant="subhead" tone="secondary">
        同一个页面上挂了好几个独立的 React 根时，给每个根一个不同的 id 前缀，否则自动生成的 id 会撞车。
      </Text>
      <CodeBlock code={`renderToString(<App />, { identifierPrefix: 'sidebar-' });
hydrateRoot(container, <App />, { identifierPrefix: 'sidebar-' });`} />
    </Section>
  </Page>;
}

export function MigrationGuide() {
  return <Page eyebrow="指南" title="从 0.1 升级" lede="这一版有破坏性改动，主要是把「内容」和「浮在内容之上的操作」彻底分开了。">
    <Section title="改名">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">按钮样式：<code>primary</code> → <code>glassProminent</code>，<code>ghost</code> → <code>plain</code>，<code>danger</code> → <code>destructive</code>，<code>default</code> → <code>glass</code>。</Text></li>
          <li><Text as="span" variant="subhead"><code>GlassToolbarSeparator</code> → <code>ToolbarSpacer</code>。两块玻璃之间的空隙本身就是分隔，不再画线。</Text></li>
          <li><Text as="span" variant="subhead"><code>GlassNavBar</code> → <code>TabBar</code>，宽屏时会自动变成侧边栏。</Text></li>
        </ul>
      </Card>
    </Section>

    <Section title="工具栏结构变了" description="工具栏本身不再是玻璃，里面的每一组才是。材质相关的属性也跟着移到组上。">
      <CodeBlock code={`// 0.1
<GlassToolbar aria-label="操作" material="clear" backdropTone="dark">
  <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  <GlassToolbarSeparator/>
  <GlassButton>保存</GlassButton>
</GlassToolbar>

// 0.2 —— 图标和文字不再共用一块背景
<GlassToolbar aria-label="操作">
  <ToolbarGroup material="clear" backdropTone="dark">
    <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  </ToolbarGroup>
  <ToolbarSpacer/>
  <ToolbarGroup prominent>
    <GlassButton variant="glassProminent">保存</GlassButton>
  </ToolbarGroup>
</GlassToolbar>`} />
    </Section>

    <Section title="内容容器">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">用玻璃当卡片、当列表外框、当页面区块的地方，换成 <code>Card</code>、<code>List</code> 或 <code>MaterialView</code>。</Text></li>
          <li><Text as="span" variant="subhead"><code>GlassSurface</code> 还在，但它表示的是浮起来的那一层。</Text></li>
        </ul>
      </Card>
    </Section>

    <Section title="不用改的部分">
      <Text variant="subhead" tone="secondary">
        Provider、分段控件、开关、滑块、标签页、气泡面板、菜单、对话框的用法保持不变。
        拖动手感、液滴融合和折射本身也都照旧。
      </Text>
    </Section>

    <Section title="看起来会变的地方">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">玻璃从偏绿变成中性，主题色从墨绿换成系统蓝。</Text></li>
          <li><Text as="span" variant="subhead">整面的白色高光没有了，改成一条跟着指针走的细边。</Text></li>
          <li><Text as="span" variant="subhead">滑块的旋钮平时不再是玻璃，只有拖动时才是。</Text></li>
          <li><Text as="span" variant="subhead">开关打开时是系统绿，不再跟随主题色。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}
