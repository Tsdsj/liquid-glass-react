import { AmbientDemo } from '../components/AmbientDemo';
import { ThemingDemo } from '../components/ThemingDemo';
import { SITE_COPY, useT, type Bilingual } from '../site-i18n';

interface GuideSection {
  id: string;
  title: Bilingual;
  body: Bilingual;
  code?: string;
}

const SECTIONS: GuideSection[] = [
  {
    id: 'install',
    title: { 'zh-CN': '安装', 'en-US': 'Install' },
    body: {
      'zh-CN': '支持 React 18 与 19,依赖极少——只用到 @floating-ui/react。',
      'en-US': 'Works with React 18 and 19, with next to no dependencies — just @floating-ui/react.',
    },
    code: 'pnpm add @ttqtt/liquid-glass-react',
  },
  {
    id: 'quick-start',
    title: { 'zh-CN': '快速开始', 'en-US': 'Quick start' },
    body: {
      'zh-CN': '引入样式文件一次,挂载 <Toaster/>(如需全局提示),然后直接使用组件。',
      'en-US': 'Import the stylesheet once, mount <Toaster/> if you need notifications, then use the components.',
    },
    code: `import '@ttqtt/liquid-glass-react/style.css';
import { Button, Toaster, toast } from '@ttqtt/liquid-glass-react';

export function App() {
  return (
    <>
      <Toaster />
      <Button variant="accent" onClick={() => toast.success('你好,液态玻璃')}>
        点我
      </Button>
    </>
  );
}`,
  },
  {
    id: 'nextjs',
    title: { 'zh-CN': 'Next.js(App Router)', 'en-US': 'Next.js (App Router)' },
    body: {
      'zh-CN': '① 在根 app/layout 里引入一次 style.css;② 用到 toast、Modal、Drawer 等交互或命令式 API 的文件顶部加 "use client";③ 首帧自动走毛玻璃降级,挂载后才升级为边缘折射,服务端与客户端首帧一致,不会出现 hydration 不匹配。',
      'en-US': '(1) Import style.css once in the root app/layout. (2) Add "use client" to files that use interactive or imperative APIs (toast, Modal, Drawer, …). (3) The first frame renders the frosted fallback and upgrades to edge refraction only after mount, so the server and first client frame match — no hydration mismatch.',
    },
    code: `// app/layout.tsx — Server Component
import '@ttqtt/liquid-glass-react/style.css';

export default function RootLayout({ children }) {
  return (
    <html lang="zh" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}

// app/ui/Notify.tsx — needs the client runtime
'use client';
import { Button, Toaster, toast } from '@ttqtt/liquid-glass-react';

export function Notify() {
  return (
    <>
      <Toaster />
      <Button variant="accent" onClick={() => toast.success('已保存')}>
        保存
      </Button>
    </>
  );
}`,
  },
  {
    id: 'theming',
    title: { 'zh-CN': '主题与 Token', 'en-US': 'Theming and tokens' },
    body: {
      'zh-CN': '所有视觉参数都是 --lg-* CSS 变量:根元素设置 data-theme="dark" 切换暗色;在任意容器上覆盖变量即可局部定制(强调色、圆角、模糊度、环境色调 --lg-ambient 等)。也可以用 createTheme 生成类型安全的覆盖对象、或直接套用 presetThemes 预设——详见下方「定制主题」的交互演示与全量 token 参考表。',
      'en-US': 'Every visual knob is a --lg-* CSS variable: set data-theme="dark" on the root for dark mode, and override variables on any container for local customization (accent, radius, blur, the --lg-ambient wash, and more). You can also build a type-safe override object with createTheme or drop in a presetThemes preset — see the interactive “Custom themes” demo and full token reference below.',
    },
    code: `<html data-theme="dark">

.brand-area {
  --lg-accent: #7c3aed;
  --lg-radius-md: 18px;
  --lg-ambient: color-mix(in srgb, #7c3aed 16%, transparent);
}`,
  },
  {
    id: 'advanced',
    title: { 'zh-CN': '进阶引擎', 'en-US': 'Advanced engine' },
    body: {
      'zh-CN': '两个可选的进阶视觉 API,均自动降级、SSR 安全。ProgressiveBlur 沿一个方向叠加渐进模糊,用于顶栏或 hero 边缘的一条带(逐层合成,不要铺满整页);它是装饰元素(aria-hidden),需要一个定位祖先。useAmbientFromImage 从同源 / 允许 CORS 的图片取样主色,写入容器的 --lg-ambient 让玻璃带上环境色;取样失败(跨域污染 / 解码失败 / 服务端)静默返回 null,调用方保持手动值。下方即环境取样的实时演示。',
      'en-US': 'Two optional advanced visual APIs, both self-degrading and SSR-safe. ProgressiveBlur stacks a directional progressive blur for a top bar or hero edge (per-layer compositing — a bounded strip, never a full page); it is decorative (aria-hidden) and needs a positioned ancestor. useAmbientFromImage samples the dominant colour from a same-origin / CORS-enabled image into a container’s --lg-ambient so the glass picks up the surrounding hue; on failure (cross-origin taint / decode error / server) it silently returns null and the caller keeps its manual value. The live ambient-sampling demo is below.',
    },
    code: `import { ProgressiveBlur, useAmbientFromImage } from '@ttqtt/liquid-glass-react';

// Progressive blur along one edge — a bounded strip inside a positioned box
<div style={{ position: 'relative' }}>
  <Content />
  <ProgressiveBlur direction="to-bottom" size={96} />
</div>

// Sample a wallpaper's dominant colour into --lg-ambient
function Hero({ src }) {
  const ambient = useAmbientFromImage(src, { strategy: 'edge' });
  return <section style={{ '--lg-ambient': ambient ?? 'transparent' }}>…</section>;
}`,
  },
  {
    id: 'browsers',
    title: { 'zh-CN': '浏览器支持与降级', 'en-US': 'Browser support' },
    body: {
      'zh-CN': '边缘折射基于 backdrop-filter 引用 SVG 位移滤镜,仅 Chromium 内核(Chrome/Edge)支持;Safari 与 Firefox 自动降级为毛玻璃(模糊 + 饱和 + 高光),布局与交互完全一致。系统开启"减少透明度/增强对比度/减少动态"时进一步降级为不透明表面与纯淡入动画。',
      'en-US': 'Edge refraction relies on backdrop-filter referencing an SVG displacement filter, which only Chromium supports; Safari and Firefox fall back to frosted glass (blur + saturation + specular) with identical layout and interaction. Reduced-transparency, increased-contrast and reduced-motion settings degrade further to opaque surfaces and pure fades.',
    },
  },
  {
    id: 'i18n',
    title: { 'zh-CN': '国际化', 'en-US': 'Internationalization' },
    body: {
      'zh-CN': '组件内置文案默认中文,通过 LiquidGlassConfig 的 locale 切换为英文;也可用 forceFallback / forceReducedTransparency 全局强制降级。',
      'en-US': 'Built-in copy defaults to Chinese and switches to English via LiquidGlassConfig locale; forceFallback / forceReducedTransparency force degradation globally.',
    },
    code: `import { LiquidGlassConfig } from '@ttqtt/liquid-glass-react';

<LiquidGlassConfig locale="en-US">
  <App />
</LiquidGlassConfig>`,
  },
  {
    id: 'performance',
    title: { 'zh-CN': '性能建议', 'en-US': 'Performance tips' },
    body: {
      'zh-CN': '玻璃最适合浮层与控件;长列表项请使用 refraction="off"。相同形状的滤镜全局自动复用,嵌套玻璃会自动关闭内层折射,无需手动处理。',
      'en-US': 'Glass suits overlays and controls; use refraction="off" for long list items. Filters are shared per shape automatically, and nested glass disables inner refraction for you.',
    },
  },
  {
    id: 'tips',
    title: { 'zh-CN': '常见用法要点', 'en-US': 'Usage tips' },
    body: {
      'zh-CN': '来自真实装包审计的几个要点:① toast 需要先挂一次 <Toaster/>,否则不会显示(开发模式会警告);② Form 里的布尔控件(Checkbox/Switch)要声明 valuePropName/trigger;③ Modal/Drawer 是纯受控组件,open 与 onOpenChange 必传;④ Slider/Switch/Segmented 等无可见文本的控件请自备 aria-label;⑤ 在 TSX 里内联写 --lg-* 变量需要一次类型断言,主题场景直接用 createTheme 更顺。',
      'en-US': 'Field notes from the real-install audit: (1) toast needs a <Toaster/> mounted once, or nothing shows (dev mode warns); (2) boolean controls inside Form (Checkbox/Switch) need valuePropName/trigger; (3) Modal/Drawer are fully controlled — open and onOpenChange are required; (4) give text-less controls (Slider/Switch/Segmented, …) an aria-label; (5) inline --lg-* variables in TSX need a type assertion — reach for createTheme instead when theming.',
    },
    code: `// ① toast 前先挂宿主
<Toaster />
toast.success('已保存');

// ② Form 布尔控件声明受控 prop 名与事件名
<FormItem name="agree" valuePropName="checked" trigger="onCheckedChange" required>
  <Checkbox>同意条款</Checkbox>
</FormItem>

// ⑤ 内联 --lg-* 变量 vs createTheme
<div style={{ ['--lg-accent' as string]: '#7c3aed' }}>…</div>   // 需断言
<div style={createTheme({ accent: '#7c3aed' })}>…</div>          // 类型安全`,
  },
];

export function GuidePage() {
  const t = useT();

  return (
    <div className="site-container site-page site-guide-layout">
      <nav className="site-guide-nav" aria-label={t(SITE_COPY.onThisPage)}>
        <span className="site-guide-nav__title">{t(SITE_COPY.onThisPage)}</span>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className="site-guide-nav__link"
            type="button"
            onClick={() => {
              document.getElementById(`guide-${section.id}`)?.scrollIntoView({ block: 'start' });
            }}
          >
            {t(section.title)}
          </button>
        ))}
        <button
          className="site-guide-nav__link"
          type="button"
          onClick={() => {
            document.getElementById('guide-createTheme')?.scrollIntoView({ block: 'start' });
          }}
        >
          {t({ 'zh-CN': '定制主题', 'en-US': 'Custom themes' })}
        </button>
      </nav>

      <article className="site-guide">
        <header className="site-page-header">
          <span className="site-page-kicker">{t(SITE_COPY.brand)}</span>
          <h1 className="site-detail__title">{t(SITE_COPY.guideTitle)}</h1>
        </header>
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={`guide-${section.id}`}
            className="site-guide__section"
            data-testid={`guide-${section.id}`}
          >
            <h2 className="site-guide__section-title">{t(section.title)}</h2>
            <p className="site-guide__section-description">{t(section.body)}</p>
            {section.code ? (
              <pre className="site-code site-code--guide">{section.code}</pre>
            ) : null}
          </section>
        ))}
        <ThemingDemo />
        <AmbientDemo />
      </article>
    </div>
  );
}
