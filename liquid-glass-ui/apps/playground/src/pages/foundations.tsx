import { Card, Concentric, GlassButton, GlassSegmentedControl, GlassSurface, Text } from '@liquid-glass-ui/react';
import { Page, Section, Rule } from '../site/page.js';
import { Demo } from '../site/demo.js';
import { CodeBlock } from '../site/code-block.js';

const SYSTEM_COLORS = ['red', 'orange', 'yellow', 'green', 'mint', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink', 'brown'];
const SEMANTIC = [
  ['--lg-label', '主要文字'], ['--lg-label-secondary', '次要文字'], ['--lg-label-tertiary', '第三级文字'],
  ['--lg-separator', '分隔线'], ['--lg-fill', '填充'], ['--lg-bg-grouped-2', '分组背景'],
];
const TEXT_STYLES = [
  ['largeTitle', 34, 41], ['title1', 28, 34], ['title2', 22, 28], ['title3', 20, 25],
  ['headline', 17, 22], ['body', 17, 22], ['callout', 16, 21], ['subhead', 15, 20],
  ['footnote', 13, 18], ['caption1', 12, 16], ['caption2', 11, 13],
] as const;

export function MaterialsFoundation() {
  return <Page eyebrow="基础" title="材质"
    lede="Liquid Glass 是一种会弯折光线的材质，构成浮在内容之上的操作与导航层。它从背后取色，自己没有颜色。">
    <Rule>玻璃只属于导航与操作层，绝不进入内容层，绝不玻璃叠玻璃，也不要到处都是。默认用 Regular；Clear 只用于媒体背景，且要配一层变暗。两者不在同一界面里混用。</Rule>

    <Section title="小玻璃与大玻璃" description="尺寸会改变材质本身的行为，这不是同一个效果的两种大小。">
      <Demo backdrop="both" height={240} label="小玻璃随背景翻转，大玻璃不翻转">
        <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
          <GlassButton>小玻璃 · 随背景翻转明暗</GlassButton>
          <GlassSurface size="large" radius={20} style={{ width: 260, padding: 16 }}>
            <Text variant="subhead" emphasized>大玻璃</Text>
            <Text variant="caption1" tone="secondary">更厚、更不透明、阴影更深，并且不随内容翻转——那么大的表面翻来翻去会没法读。</Text>
          </GlassSurface>
        </div>
      </Demo>
      <CodeBlock code={`<GlassButton>小玻璃</GlassButton>
<GlassSurface size="large" radius={20}>大玻璃</GlassSurface>`} />
    </Section>

    <Section title="光是被折射的，不是画上去的"
      description="材质由折射加一条精确的发丝边定义，内部保持干净。整面扫过的渐变、第二层斜面、过粗的亮描边，会把它变成 2008 年的光泽塑料按钮——而且在纯色背景上最难看，因为那里根本没有东西可折射。">
      <Demo height={200} label="指针驱动的行进高光">
        <GlassButton controlSize="large">把指针移过来，看高光绕轮廓走</GlassButton>
      </Demo>
    </Section>

    <Section title="背景色调是声明的，不是采样的">
      <Text variant="subhead" tone="secondary">
        小玻璃需要知道背后是深是浅才能翻转。这个库不去读取页面像素——那意味着 DOM 截屏和跨源像素读取。改为由区域显式声明，内部的玻璃继承它。
      </Text>
      <CodeBlock code={`<GlassBackdrop tone="dark">
  <video … />
  <GlassToolbar aria-label="播放控制">…</GlassToolbar>
</GlassBackdrop>`} />
    </Section>
  </Page>;
}

export function ColorFoundation() {
  return <Page eyebrow="基础" title="色彩"
    lede="系统色加语义色阶。accent 只有一个，留给主操作与选中态；品牌色放在内容层。">
    <Rule>非游戏类应用要克制用色：颜色支持沟通，而不是装饰。不要用同一个颜色同时表示可交互和不可交互的元素，也不要让颜色成为唯一的信息载体。</Rule>

    <Section title="系统色" description="每个都有浅色、深色与增强对比度三套取值。">
      <div className="swatch-grid">
        {SYSTEM_COLORS.map(name => <div key={name} className="swatch-cell">
          <span className="swatch-chip" style={{ background: `var(--lg-${name})` }} />
          <Text variant="caption1" tone="secondary">{name}</Text>
        </div>)}
      </div>
    </Section>

    <Section title="语义色" description="永远用语义 token，不要写死灰度值，也不要改变一个语义色的含义。">
      <Card fill="secondary" radius={20} padding={16}>
        <ul className="plain-list">
          {SEMANTIC.map(([token, label]) => <li key={token}>
            <Text as="span" variant="subhead"><code>{token}</code> — {label}</Text>
          </li>)}
        </ul>
      </Card>
    </Section>

    <Section title="玻璃上的色彩" description="玻璃没有固有颜色。着色只加在唯一那个主操作的背景上，标签保持白色；栏上的符号与文字默认单色。">
      <Demo backdrop="both" height={180}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassButton>取消</GlassButton>
          <GlassButton>存储副本</GlassButton>
          <GlassButton variant="glassProminent">完成</GlassButton>
        </div>
      </Demo>
    </Section>
  </Page>;
}

export function TypographyFoundation() {
  return <Page eyebrow="基础" title="排版"
    lede="iOS 文本样式：字号、行高与字距一起由样式决定，并随 Dynamic Type 缩放。">
    <Rule>用内建文本样式建立层级，靠字重、字号与颜色区分，而不是靠装饰。11pt 是可读文本的下限。分区标题使用标题式大小写，不再用全大写。</Rule>

    <Section title="文本样式表" description="用右上角的显示偏好把文字大小切到 AX3，检查这一页是否还能正常回流。">
      <Card radius={20} padding={20}>
        <div className="type-specimens">
          {TEXT_STYLES.map(([style, size, leading]) => <div key={style} className="type-row">
            <Text as="span" variant={style} className="type-sample">{style}</Text>
            <Text as="span" variant="caption1" tone="tertiary" tabular>{size} / {leading}</Text>
          </div>)}
        </div>
      </Card>
    </Section>

    <Section title="两个 Web 端的硬约束">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">SF 字体不能自托管到网页上，许可只覆盖 Apple 平台应用。<code>-apple-system</code> 只在 Apple 设备上解析为 SF，其他平台会落到 Segoe UI / Roboto，字形度量不同——所以字号用 px 定死，并在 Windows / Android 上复核行长。</Text></li>
          <li><Text as="span" variant="subhead">负字距是为拉丁文设计的。CJK 语境下组件会自动关闭它。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function LayoutFoundation() {
  return <Page eyebrow="基础" title="布局与形状"
    lede="4pt 栅格、44pt 命中区，以及三类形状：固定、胶囊、同心。">
    <Rule>嵌套在圆角容器里的形状必须同心：内圆角 = 容器圆角 − 两者之间的内边距。内圆角过大会“掐角”，过小会“喇叭口”。也会同时独立出现的组件要给一个兜底最小圆角。</Rule>

    <Section title="同心圆角">
      <Demo height={240}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Card radius={26} padding={12} style={{ width: 150 }}>
            <Concentric minimum={8} style={{ height: 90, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
              <Text variant="caption1" tone="secondary">26 − 12 = 14</Text>
            </Concentric>
            <Text variant="caption1" tone="secondary" style={{ marginBlockStart: 8 }}>同心 ✓</Text>
          </Card>
          <Card radius={26} padding={12} style={{ width: 150 }}>
            <div style={{ height: 90, borderRadius: 4, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
              <Text variant="caption1" tone="secondary">固定 4px</Text>
            </div>
            <Text variant="caption1" tone="destructive" style={{ marginBlockStart: 8 }}>喇叭口 ✗</Text>
          </Card>
        </div>
      </Demo>
      <CodeBlock code={`<Card radius={26} padding={12}>
  <Concentric minimum={8}>…</Concentric>
</Card>

// 或者在 JS 里计算
concentricRadius(26, 12, { minimum: 8 }); // 14`} />
    </Section>

    <Section title="尺寸与间距">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">命中区不小于 44×44pt；控件之间至少 8pt。视觉可以更小，命中区不行——粗指针设备上组件会用伪元素把命中区补回来。</Text></li>
          <li><Text as="span" variant="subhead">页边距：紧凑宽度 16pt，常规宽度 20pt。可读正文宽度约 672pt。</Text></li>
          <li><Text as="span" variant="subhead">布局由尺寸类（断点）驱动，而不是设备型号或方向。标签栏与侧边栏是同一个导航元素的两种形态。</Text></li>
          <li><Text as="span" variant="subhead">全高布局用 <code>100dvh</code> 而不是 <code>100vh</code>，固定栏要加 <code>env(safe-area-inset-*)</code>。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function MotionFoundation() {
  return <Page eyebrow="基础" title="动效与交互"
    lede="动效必须传达信息：状态、反馈、空间关系或操作结果。说不清它告诉了用户什么，就应该删掉。">
    <Rule>在按下时响应，而不是抬起时；拖动过程中提供 1:1 的连续反馈；任何动画都可以被中途抓住并改变方向。菜单、sheet、对话框从打开它们的控件里长出来。</Rule>

    <Section title="可拖动的控件" description="这三个控件都是拖拽目标。只能点击的版本，是界面“不像 Apple”的最常见破绽。">
      <Demo height={220}>
        <div style={{ display: 'grid', gap: 18, width: 300 }}>
          <GlassSegmentedControl aria-label="拖动演示" defaultValue="b"
            items={[{ value: 'a', label: '按住' }, { value: 'b', label: '选中项' }, { value: 'c', label: '滑动' }]} />
          <Text variant="caption1" tone="secondary">按住选中分段左右拖动：透镜跟随指针、拉伸，并在跨过分段时即时切换。</Text>
        </div>
      </Demo>
    </Section>

    <Section title="曲线与时长">
      <CodeBlock code={`--lg-duration-press: 90ms;    /* 按下：立刻 */
--lg-duration-release: 220ms; /* 松开 */
--lg-duration-spring: 520ms;  /* 弹簧总时长 */
--lg-spring: linear(0, … 1.072 31.5%, … 1);  /* 阻尼振子采样 */
--lg-press-scale: 1.06;       /* 独立玻璃朝指针放大 */`} />
      <Text variant="subhead" tone="secondary" style={{ marginBlockStart: 12 }}>
        只动 <code>transform</code> 与 <code>opacity</code>。永远不要动画 <code>backdrop-filter</code>、<code>blur()</code>、<code>box-shadow</code> 或 <code>width</code>。
      </Text>
    </Section>
  </Page>;
}

export function AccessibilityFoundation() {
  return <Page eyebrow="基础" title="无障碍"
    lede="系统组件会自动处理这些；自定义玻璃必须自己实现同样的行为。">
    <Section title="四条必须支持的偏好" description="右上角的显示偏好可以逐条打开验证，它们叠加在系统设置之上而不是替代。">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead"><strong>减少透明度</strong> — 材质变得更实、遮挡更多；背景滤镜整体关闭。</Text></li>
          <li><Text as="span" variant="subhead"><strong>增强对比度</strong> — 材质变为接近黑白，并加上一条对比边框；折射与行进高光让位于可读性。</Text></li>
          <li><Text as="span" variant="subhead"><strong>减少动效</strong> — 关闭弹性、位移、变形与拖动拉伸；不确定进度条停止运动。</Text></li>
          <li><Text as="span" variant="subhead"><strong>强制颜色</strong> — 交给系统调色板，装饰层整体隐藏。</Text></li>
        </ul>
      </Card>
    </Section>

    <Section title="其余的底线">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">每个可交互元素都有 44×44 命中区、可访问名称与正确的角色；纯图标按钮的 aria-label 是必填类型。</Text></li>
          <li><Text as="span" variant="subhead">颜色不是唯一信号；正文对比度不低于 4.5:1，大字与控件不低于 3:1。</Text></li>
          <li><Text as="span" variant="subhead">焦点环用 <code>outline</code> + <code>outline-offset</code>，不用 <code>box-shadow</code>——那是玻璃自己的。没有替代就不要写 <code>outline: none</code>。</Text></li>
          <li><Text as="span" variant="subhead">Dynamic Type 要能回流到 AX5，不截断、不溢出。</Text></li>
          <li><Text as="span" variant="subhead">RTL 用逻辑属性；方向性图标镜像，媒体控件与时钟不镜像。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}
