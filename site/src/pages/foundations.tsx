import { Card, Concentric, GlassButton, GlassSegmentedControl, GlassSurface, Text } from '@ttqtt/liquid-glass-react';
import { Page, Section, Rule } from '../site/page.js';
import { Demo, DemoSettings } from '../site/demo.js';
import { CodeBlock } from '../site/code-block.js';

const SYSTEM_COLORS = ['red', 'orange', 'yellow', 'green', 'mint', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink', 'brown'];
const SEMANTIC = [
  ['--lg-label', '主要文字'], ['--lg-label-secondary', '次要文字'], ['--lg-label-tertiary', '更次要的文字'],
  ['--lg-separator', '分隔线'], ['--lg-fill', '填充块'], ['--lg-bg-grouped-2', '卡片底色'],
];
const TEXT_STYLES = [
  ['largeTitle', 34, 41], ['title1', 28, 34], ['title2', 22, 28], ['title3', 20, 25],
  ['headline', 17, 22], ['body', 17, 22], ['callout', 16, 21], ['subhead', 15, 20],
  ['footnote', 13, 18], ['caption1', 12, 16], ['caption2', 11, 13],
] as const;

export function MaterialsFoundation() {
  return <Page eyebrow="基础" title="材质"
    lede="玻璃是一层会弯折光线的材质，用来做浮在内容之上的操作和导航。它自己没有颜色，颜色来自它背后的东西。">
    <Rule>玻璃只用在浮起来的那一层：工具栏、标签栏、侧边栏、弹出面板。内容本身——文字、列表、卡片、页面底色——保持不透明。如果满屏都是半透明的，就没有东西真的浮起来了。</Rule>

    <Section title="大小不只是尺寸">
      <Text variant="subhead" tone="secondary">
        小块玻璃（按钮、标签栏）会跟着背后的深浅翻转自己的明暗，这样压在照片上也读得清。
        大块玻璃（侧边栏、面板）更厚、影子更深，并且不翻转——那么大一块跟着内容忽明忽暗会没法看。
      </Text>
      <DemoSettings showSurface>
        <Demo backdrop="both" height={230}>
          <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
            <GlassButton>小块：跟着背景翻转</GlassButton>
            <GlassSurface size="large" radius={20} style={{ width: 260, padding: 16 }}>
              <Text variant="subhead" emphasized>大块</Text>
              <Text variant="caption1" tone="secondary">更厚、影子更深，明暗保持稳定</Text>
            </GlassSurface>
          </div>
        </Demo>
      </DemoSettings>
      <CodeBlock code={`<GlassButton>小块玻璃</GlassButton>
<GlassSurface size="large" radius={20}>大块玻璃</GlassSurface>`} />
    </Section>

    <Section title="光是折出来的，不是画上去的">
      <Text variant="subhead" tone="secondary">
        高光是一条沿着边缘游走的细线，跟着你的指针转。整面扫过去的白色渐变、两层斜面、又粗又亮的描边，
        会把它变成十几年前那种塑料按钮——尤其是在纯色背景上，那里本来就没有东西可以折射。
      </Text>
      <DemoSettings showSurface={false}>
        <Demo height={180}>
          <GlassButton controlSize="large">把指针移过来看边缘</GlassButton>
        </Demo>
      </DemoSettings>
    </Section>

    <Section title="告诉它背后是什么">
      <Text variant="subhead" tone="secondary">
        小块玻璃要知道背后是深是浅才能翻转。这个库不会去「看」页面——那意味着截屏和读取像素。
        改成由你直接说明，里面的玻璃自动继承。不确定时保持默认，它会走保守路线。
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
    lede="一套系统色，加一套按用途命名的颜色。主题色只有一个，留给最重要的那个操作。">
    <Rule>颜色用来帮助理解，不是用来装饰。同一个颜色不要既表示「可以点」又表示「不能点」。也不要让颜色成为唯一的信息——色觉不同的人会看不到你想表达的区别。</Rule>

    <Section title="系统色">
      <Text variant="subhead" tone="secondary">每个颜色都有浅色、深色和高对比度三套值，会自动切换。</Text>
      <div className="swatch-grid">
        {SYSTEM_COLORS.map(name => <div key={name} className="swatch-cell">
          <span className="swatch-chip" style={{ background: `var(--lg-${name})` }} />
          <Text variant="caption1" tone="secondary">{name}</Text>
        </div>)}
      </div>
    </Section>

    <Section title="按用途命名的颜色" description="用这些，不要自己写死灰度值。它们在浅色和深色下是不同的具体颜色，但用途始终一致。">
      <Card fill="secondary" radius={20} padding={16}>
        <ul className="plain-list">
          {SEMANTIC.map(([token, label]) => <li key={token}>
            <Text as="span" variant="subhead"><code>{token}</code> — {label}</Text>
          </li>)}
        </ul>
      </Card>
    </Section>

    <Section title="玻璃上的颜色" description="一屏里只给一个按钮上色，而且是给它的底色上色、文字保持白色。如果每个按钮都有颜色，就没有哪个按钮是重点。">
      <DemoSettings showSurface>
        <Demo backdrop="both" height={180}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <GlassButton>取消</GlassButton>
            <GlassButton>存为副本</GlassButton>
            <GlassButton variant="glassProminent">完成</GlassButton>
          </div>
        </Demo>
      </DemoSettings>
    </Section>
  </Page>;
}

export function TypographyFoundation() {
  return <Page eyebrow="基础" title="文字"
    lede="一整套排版样式。每一档的字号、行高和字距是一起定好的，并且跟随系统的文字大小设置。">
    <Rule>用字重、字号和颜色建立层级，不要靠加边框和背景。最小的一档已经是可读的下限，再小就不要了。分区标题用正常大小写，不用全大写。</Rule>

    <Section title="十一档样式" description="用右上角的显示偏好把文字调大到 AX3，看这一页是不是还排得开。">
      <Card radius={20} padding={20}>
        <div className="type-specimens">
          {TEXT_STYLES.map(([style, size, leading]) => <div key={style} className="type-row">
            <Text as="span" variant={style} className="type-sample">{style}</Text>
            <Text as="span" variant="caption1" tone="secondary" tabular>{size} / {leading}</Text>
          </div>)}
        </div>
      </Card>
    </Section>

    <Section title="两件和网页有关的事">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">苹果的系统字体不能打包进网站。在苹果设备上会自动用上，其它平台会退到该系统自己的字体，字形宽度并不相同——所以字号按像素定死，也在这些平台上核对过一行能放多少字。</Text></li>
          <li><Text as="span" variant="subhead">为拉丁字母设计的紧缩字距不适合中日韩文字，组件会自动关掉。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function LayoutFoundation() {
  return <Page eyebrow="基础" title="布局与形状"
    lede="4 的倍数的间距、44 的点击范围，以及三种圆角：固定、胶囊、同心。">
    <Rule>嵌在圆角容器里的形状，圆角要等于外框圆角减去内边距。算大了角会「被掐住」，算小了会「喇叭口」。两种都很显眼。</Rule>

    <Section title="同心圆角">
      <DemoSettings showSurface={false}>
        <Demo height={250}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Card radius={26} padding={12} style={{ width: 150 }}>
              <Concentric minimum={8} style={{ height: 90, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
                <Text variant="caption1" tone="secondary">26 − 12 = 14</Text>
              </Concentric>
              <Text variant="caption1" tone="secondary" style={{ marginBlockStart: 8 }}>算对了</Text>
            </Card>
            <Card radius={26} padding={12} style={{ width: 150 }}>
              <div style={{ height: 90, borderRadius: 4, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
                <Text variant="caption1" tone="secondary">固定 4px</Text>
              </div>
              <Text variant="caption1" tone="destructive" style={{ marginBlockStart: 8 }}>喇叭口</Text>
            </Card>
          </div>
        </Demo>
      </DemoSettings>
      <CodeBlock code={`<Card radius={26} padding={12}>
  <Concentric minimum={8}>…</Concentric>
</Card>

// 也可以在代码里直接算
concentricRadius(26, 12, { minimum: 8 }); // 14`} />
    </Section>

    <Section title="尺寸与间距">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">能点的地方不小于 44×44，控件之间至少留 8。看起来可以更小，能点到的范围不行——触摸屏上组件会自动把范围补回来。</Text></li>
          <li><Text as="span" variant="subhead">页面左右留白：窄屏 16，宽屏 20。一行正文不要超过大约 672 宽，太长会看不住行。</Text></li>
          <li><Text as="span" variant="subhead">布局按窗口宽度变化，不要按设备型号判断。标签栏和侧边栏是同一个东西的两种形态。</Text></li>
          <li><Text as="span" variant="subhead">全屏高度要考虑手机浏览器地址栏会收起，底部的栏也要避开 home 指示条。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}

export function MotionFoundation() {
  return <Page eyebrow="基础" title="动效"
    lede="动效要说明白一件事：状态、反馈、位置关系，或者刚才那一下的结果。说不清它在讲什么，就不该有。">
    <Rule>在手指按下时就给反馈，不要等松开。拖动过程中一直跟手。任何动画都可以被中途抓住并改变方向——用户不该等它播完。</Rule>

    <Section title="控件是可以拖的" description="分段控件、开关、滑块都能拖。只能点的实现，是一套界面「不像那么回事」最明显的地方。">
      <DemoSettings showSurface={false}>
        <Demo height={210}>
          <div style={{ display: 'grid', gap: 18, width: 300 }}>
            <GlassSegmentedControl aria-label="拖动演示" defaultValue="b"
              items={[{ value: 'a', label: '按住' }, { value: 'b', label: '当前项' }, { value: 'c', label: '滑动' }]} />
            <Text variant="caption1" tone="secondary">按住中间那一格左右拖：它跟着你走，经过哪一格就切到哪一格。</Text>
          </div>
        </Demo>
      </DemoSettings>
    </Section>

    <Section title="可以调的参数">
      <CodeBlock code={`--lg-duration-press: 90ms;    /* 按下：几乎立刻 */
--lg-duration-release: 220ms; /* 松开 */
--lg-duration-spring: 520ms;  /* 回弹总时长 */
--lg-press-scale: 1.06;       /* 按下时朝指针方向放大多少 */`} />
      <Text variant="subhead" tone="secondary" style={{ marginBlockStart: 12 }}>
        用户开启「减少动效」后，弹性、位移和拖动形变都会关掉，只保留状态本身的变化。
      </Text>
    </Section>
  </Page>;
}

export function AccessibilityFoundation() {
  return <Page eyebrow="基础" title="无障碍"
    lede="这些不是额外功能，是组件默认就带的。右上角的显示偏好可以逐条打开看效果。">
    <Section title="四项系统设置" description="这些是操作系统层面的开关，用户一旦打开，界面就应该跟着变——而不是继续按你的审美来。">
      <Card fill="secondary" radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead"><strong>减少透明度</strong>——材质变实，不再透出背后的内容。</Text></li>
          <li><Text as="span" variant="subhead"><strong>增强对比度</strong>——材质接近黑白，并加一条明确的边。折射和高光让位于看得清。</Text></li>
          <li><Text as="span" variant="subhead"><strong>减少动效</strong>——关掉弹性、位移和拖动形变，进度条也停下来。</Text></li>
          <li><Text as="span" variant="subhead"><strong>高对比度主题</strong>——完全交给系统的配色，装饰层全部隐藏。</Text></li>
        </ul>
      </Card>
    </Section>

    <Section title="其余的底线">
      <Card radius={20} padding={20}>
        <ul className="plain-list">
          <li><Text as="span" variant="subhead">每个能操作的东西都有名字、有正确的类型、有不小于 44×44 的点击范围。只有图标的按钮必须自己给名字。</Text></li>
          <li><Text as="span" variant="subhead">颜色不是唯一信号；正文对比度不低于 4.5 比 1。</Text></li>
          <li><Text as="span" variant="subhead">键盘焦点永远看得见，而且只在用键盘时出现——鼠标点一下不会留下一圈框。</Text></li>
          <li><Text as="span" variant="subhead">文字放到最大时，布局要重新排开，不能截断或溢出。</Text></li>
          <li><Text as="span" variant="subhead">从右到左的语言里整体镜像，但媒体控制和时钟不镜像——那两类的方向有固定含义。</Text></li>
        </ul>
      </Card>
    </Section>
  </Page>;
}
