# Liquid Glass React

[![CI](https://github.com/Tsdsj/liquid-glass-react/actions/workflows/ci.yml/badge.svg)](https://github.com/Tsdsj/liquid-glass-react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@ttqtt/liquid-glass-react.svg)](https://www.npmjs.com/package/@ttqtt/liquid-glass-react)

按 Apple 的设计语言做的一套 React 组件库：会折射背景的玻璃材质、完整的语义色与文字体系、可以拖动的原生控件。

**文档站：https://tsdsj.github.io/liquid-glass-react/**

独立项目，不是 Apple 官方产品，也不包含 Apple 的字体或图标素材。

---

## 安装

```bash
pnpm add @ttqtt/liquid-glass-react
```

需要 React 19。除此之外没有其它运行时依赖。

## 使用

```tsx
import {
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
}
```

样式表在应用入口引一次就够了。

## 有什么

41 个组件，分成两层——这个分层本身就是这套设计的核心：

| 层 | 组件 |
| --- | --- |
| **内容**（实色，不透明） | Text、Card、Concentric、List、MaterialView、Divider |
| **控件** | GlassButton、GlassSegmentedControl、GlassSwitch、GlassSlider、GlassStepper、GlassProgress、GlassBadge |
| **输入** | TextField、SearchField |
| **导航** | GlassToolbar、TabBar、Sidebar、NavigationBar、GlassTabs、ScrollEdge |
| **浮层** | GlassPopover、GlassMenu、GlassSheet、GlassAlert、GlassActionSheet、GlassDialog、ToastProvider |

玻璃只用在浮起来的那一层。正文、列表、卡片保持不透明——如果满屏都是半透明的，就没有东西真的浮起来了。

## 几件值得知道的事

- **控件是可以拖的。** 分段控件按住当前项就能滑着换，开关可以甩过去，滑块跟手。这是它和"长得像"的实现之间最明显的区别。
- **系统设置会被尊重。** 用户开了减少透明度、增强对比度或减少动效，界面立刻跟着变，你不用写任何代码。
- **背景色调由你声明，不靠猜。** 用 `GlassBackdrop` 告诉它背后是深是浅，库不会去读取页面像素。

## 浏览器支持

Chrome 和 Edge 上有完整的边缘折射。Safari 和 Firefox 退化成磨砂玻璃——模糊、提色、高光都在，布局和交互完全一致。

## 换主题色

```css
:root, [data-lg-theme="light"] { --lg-accent: #6d28d9; }
[data-lg-theme="dark"]        { --lg-accent: #8b5cf6; }
```

更多在[主题指南](https://tsdsj.github.io/liquid-glass-react/#/guides/theming)里。

## 服务端渲染

服务端先出磨砂效果，到浏览器再升级成折射，中间不会闪。Next.js App Router 只需在根布局里引一次样式表；整个包已经标成客户端组件。

## 本地开发

```bash
pnpm install
pnpm dev            # 文档站 http://127.0.0.1:5173
pnpm check          # 类型检查 → 构建 → 单元测试 → SSR → 站点构建 → 真实 Chrome
```

```text
src/
  tokens/    颜色、文字、间距、形状、动效的取值
  core/      不依赖浏览器的几何计算、弹簧、缓存
  react/     组件，按 内容 / 控件 / 输入 / 导航 / 浮层 分目录
  styles/    tokens.css + components.css
site/        文档站
tests/       core 单元测试、SSR 测试、Playwright 浏览器测试
docs/        设计系统、API、无障碍、迁移、架构、测试口径
```

## 还没做完的

- 屏幕阅读器的实机验证还没做完。自动化测试覆盖了角色、键盘路径和四项系统设置，但代替不了真人用 VoiceOver 走一遍。
- 玻璃在真实合成背景上的对比度还没实测过——玻璃的最终颜色取决于它背后是什么，把两个色值填进计算器不算数。
- 详细清单见 [`docs/known-limitations.md`](docs/known-limitations.md)。

## 许可

MIT，见 [LICENSE](LICENSE) 与 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
