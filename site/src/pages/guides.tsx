import { Card, Text } from '@ttqtt/liquid-glass-react';
import { Page, Section, Rule } from '../site/page.js';
import { CodeBlock } from '../site/code-block.js';

export function InstallGuide() {
  return <Page eyebrow="指南" title="接入组件" lede="三个本地工作区包，尚未发布到 npm。">
    <Section title="开发源码">
      <CodeBlock code={`npm install
npm run dev
# http://127.0.0.1:5173`} />
    </Section>
    <Section title="在应用里使用">
      <CodeBlock code={`import {
  GlassProvider, GlassToolbar, ToolbarGroup, GlassButton, ToastProvider,
} from '@ttqtt/liquid-glass-react';
import '@liquid-glass-ui/react/tokens.css';
import '@liquid-glass-ui/react/styles.css';

<GlassProvider theme="system">
  <ToastProvider>
    <GlassToolbar aria-label="图片操作">
      <ToolbarGroup>
        <GlassButton>查看原图</GlassButton>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup prominent>
        <GlassButton variant="glassProminent">导出</GlassButton>
      </ToolbarGroup>
    </GlassToolbar>
  </ToastProvider>
</GlassProvider>`} />
      <Text variant="subhead" tone="secondary">
        <code>tokens.css</code> 必须在 <code>styles.css</code> 之前引入一次。组件 CSS 全部在 <code>.lg-*</code> 命名空间下，不依赖 Tailwind。
      </Text>
    </Section>
    <Section title="离线预览">
      <CodeBlock code={`node scripts/serve-preview.mjs
# http://127.0.0.1:4173`} />
      <Text variant="subhead" tone="secondary">
        只用 Node 标准库，默认只监听本机。<code>preview/</code> 是由同一份组件源码转译出来的检查版，运行时版本与 npm 开发依赖分开记录；源码改动后需要重新执行 <code>npm run preview:rebuild</code>。
      </Text>
    </Section>
  </Page>;
}

export function RendererGuide() {
  return <Page eyebrow="指南" title="渲染策略" lede="CSS 基线、SVG 折射增强，以及不透明回退。">
    <Rule>语法支持检测不能证明折射在视觉上是正确的。<code>auto</code> 默认走保守的 CSS 路径，只有在你自己的 Chrome / GPU 矩阵上验证过之后，才应该显式开启 SVG。</Rule>
    <Section title="三条路径">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead"><code>renderer="css"</code> — 背景模糊、底色、行进高光。所有浏览器都能跑。</Text></li>
          <li><Text as="span" variant="subhead"><code>renderer="svg"</code> — 额外叠加几何位移贴图，让边缘真正折射背景。前景文字永远不进滤镜。</Text></li>
          <li><Text as="span" variant="subhead"><code>transparency="opaque"</code> — 关闭全部背景滤镜，优先保证稳定可读。</Text></li>
        </ul>
      </Card>
      <CodeBlock code={`<GlassProvider renderer="auto" enableSvgAuto={false}>…</GlassProvider>

// 验证过目标环境之后
<GlassProvider renderer="svg">…</GlassProvider>`} />
    </Section>
    <Section title="性能预算">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">单个视图里的折射元素控制在 20 个以内。<code>backdrop-filter</code> 会强制合成层，并在背景变化时重算。</Text></li>
          <li><Text as="span" variant="subhead">不要给所有玻璃加 <code>will-change: transform</code>。只提升正在运动的那一个，全量提升反而更慢。</Text></li>
          <li><Text as="span" variant="subhead">色散（<code>chroma</code>）成本约三倍，只用于少量非固定元素——固定栏每帧都在重绘。</Text></li>
          <li><Text as="span" variant="subhead">不要在 <code>pointermove</code> 里读布局。手势开始时测一次，写入合并到一个 rAF。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function ThemingGuide() {
  return <Page eyebrow="指南" title="主题与 token" lede="换品牌色只需要改一对 token，其余不编码任何颜色。">
    <Section title="换 accent">
      <CodeBlock code={`:root, [data-lg-theme="light"] { --lg-accent: #6d28d9; }
[data-lg-theme="dark"]        { --lg-accent: #8b5cf6; }
/* 标签色保持白色即可；开关打开态按 HIG 固定为系统绿。 */`} />
    </Section>
    <Section title="主题是按元素声明的">
      <Text variant="subhead" tone="secondary">
        provider 会在每个表面上写 <code>data-lg-theme</code>，所以浅色页面里可以放一条深色工具栏。这也是为什么 token 用显式的属性选择器分组，而不是 <code>light-dark()</code>。
      </Text>
      <CodeBlock code={`<GlassProvider theme="system">
  <GlassBackdrop tone="dark">
    {/* 小玻璃在这里会翻转为深色外观 */}
    <GlassToolbar aria-label="播放控制">…</GlassToolbar>
  </GlassBackdrop>
</GlassProvider>`} />
    </Section>
    <Section title="首屏不闪烁">
      <Text variant="subhead" tone="secondary">
        主题必须在首次绘制之前应用。在 <code>&lt;head&gt;</code> 里放一段内联脚本读取偏好并写到 <code>&lt;html&gt;</code> 上——等到 React 挂载后再读，就会先闪一下错误的主题，系统深色模式的用户还会先看到浅色。
      </Text>
      <CodeBlock code={`<script>
  var stored = localStorage.getItem('theme') || 'system';
  var dark = stored === 'dark' ||
    (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-lg-theme', dark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
</script>`} />
    </Section>
    <Section title="Dynamic Type">
      <CodeBlock code={`document.documentElement.dataset.lgTextSize = 'ax3';
// xs | s | m | l | xl | xxl | xxxl | ax1 … ax5`} />
    </Section>
  </Page>;
}

export function SsrGuide() {
  return <Page eyebrow="指南" title="SSR 与 CSP" lede="几何内核在导入时不碰任何浏览器全局对象。">
    <Section title="服务端渲染">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">模块初始化不访问 <code>document</code> / <code>window</code> / <code>canvas</code>；贴图生成只发生在客户端效果里。</Text></li>
          <li><Text as="span" variant="subhead"><code>theme="system"</code> 服务端先输出稳定的浅色标记，客户端再响应系统查询。真正要求首屏无闪烁的应用，应从 cookie 或服务端设置传入确定的 theme。</Text></li>
          <li><Text as="span" variant="subhead">默认打开的 dialog 在服务端只输出安全标记；真正打开是客户端副作用。</Text></li>
        </ul>
      </Card>
      <CodeBlock code={`npm run test:ssr`} />
    </Section>
    <Section title="内容安全策略">
      <Text variant="subhead" tone="secondary">
        位移贴图通过 <code>canvas.toDataURL()</code> 生成并以 <code>data:</code> URL 喂给 <code>feImage</code>，不需要 <code>unsafe-eval</code>。附带的预览服务器就带着限制性 CSP 运行，并有对应的回归用例。
      </Text>
      <CodeBlock code={`npm run test:csp`} />
    </Section>
  </Page>;
}

export function MigrationGuide() {
  return <Page eyebrow="指南" title="从 0.1 迁移到 0.2" lede="这是一次破坏性重构：内容层与操作层被彻底分开。">
    <Section title="改名">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead"><code>variant="primary"</code> → <code>"glassProminent"</code>；<code>"ghost"</code> → <code>"plain"</code>；<code>"danger"</code> → <code>"destructive"</code>；<code>"default"</code> → <code>"glass"</code>。</Text></li>
          <li><Text as="span" variant="subhead"><code>GlassToolbarSeparator</code> → <code>ToolbarSpacer</code>。两块玻璃之间的间隙就是分隔符，不再画线。</Text></li>
          <li><Text as="span" variant="subhead"><code>GlassNavBar</code> → <code>TabBar</code>（宽屏自动变形为侧边栏）。</Text></li>
        </ul>
      </Card>
    </Section>
    <Section title="结构变化">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead"><code>GlassToolbar</code> 自己不再是玻璃。把子项包进一个或多个 <code>ToolbarGroup</code>，材质相关的 props 移到分组上。</Text></li>
          <li><Text as="span" variant="subhead">内容层容器换成 <code>Card</code> / <code>List</code> / <code>MaterialView</code>。<code>GlassSurface</code> 仍然存在，但它表示的是浮动的操作面。</Text></li>
          <li><Text as="span" variant="subhead">新增 <code>size="large"</code> 用于侧边栏、菜单、sheet 与提示框；浮层组件已经自动使用它。</Text></li>
        </ul>
      </Card>
      <CodeBlock code={`// 0.1
<GlassToolbar aria-label="操作" material="clear" backdropTone="dark">
  <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  <GlassToolbarSeparator/>
  <GlassButton>保存</GlassButton>
</GlassToolbar>

// 0.2 —— 图标与文字不共享同一块背景
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
    <Section title="新增能力">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">完整语义色与 iOS 文本样式 token，配 Dynamic Type 缩放（<code>data-lg-text-size</code>）。</Text></li>
          <li><Text as="span" variant="subhead"><code>prefers-contrast: more</code> 支持，以及 provider 上的 <code>contrast</code> 选项。</Text></li>
          <li><Text as="span" variant="subhead">同心圆角：<code>Card</code> + <code>Concentric</code>，或 <code>concentricRadius()</code>。</Text></li>
          <li><Text as="span" variant="subhead">新组件：TabBar、Sidebar、NavigationBar、Sheet、Alert、ActionSheet、Toast、List、TextField、SearchField、Stepper、Progress、Badge。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}
