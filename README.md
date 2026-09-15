# Liquid Glass React

[![CI](https://github.com/Tsdsj/liquid-glass-react/actions/workflows/ci.yml/badge.svg)](https://github.com/Tsdsj/liquid-glass-react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@ttqtt/liquid-glass-react.svg)](https://www.npmjs.com/package/@ttqtt/liquid-glass-react)
[![license](https://img.shields.io/npm/l/@ttqtt/liquid-glass-react.svg)](LICENSE)

按 Apple 的设计语言做的一套 React 组件库：会折射背景的玻璃材质、完整的语义色与文字体系、可以拖动的原生控件。

**文档站：https://tsdsj.github.io/liquid-glass-react/**

独立项目，不是 Apple 官方产品，也不包含 Apple 的字体或图标素材。

---

## 安装

```bash
pnpm add @ttqtt/liquid-glass-react
```

需要 React 19。除此之外没有其它运行时依赖。

> 这个包名在 2026 年 7 月发过 0.1.0 / 0.2.0，那是另一套实现，现已从 registry 整包下架。本项目是完整重写，版本号从 **0.0.1** 重开。如果你的锁文件里还写着 `^0.2.0`，它现在解析不到任何东西，改成 `^0.0.1`。

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

默认是磨砂——模糊、提色、高光、边线，四个引擎上一样。边缘折射要自己打开：

```tsx
<GlassProvider enableSvgAuto>
```

打开之后，Chromium 系（Chrome、Edge）走 SVG 位移拿到真的折射；Safari 和 Firefox 拿不到，退回磨砂。**布局、语义、键盘路径都不依赖这条分支**，有 16 项 WebKit / Firefox 用例守着这一点。

模糊是 CSS 链里的第一个函数，滤镜只管位移——所以哪家引擎丢掉了 `url()`，剩下的仍然是真的磨砂，而不是一块透明的洞。

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
pnpm check          # 类型检查 → 构建 → 单元 → SSR → 站点 → 真实 Chrome → WebKit/Firefox
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

## 验证到什么程度

```text
65 单元 · 3 SSR · 84 真实 Google Chrome · 16 WebKit + Firefox
```

SSR 那三项跑的是 `dist/`，也就是真正发出去的那份。玻璃压在真实场景上的文字对比度是从**合成后的像素**上量的——把两个色值填进计算器不算数，因为玻璃的最终颜色取决于它背后是什么。三个引擎上最差的一块 7.83:1。

**还没做完的：**

- 屏幕阅读器的实机验证。自动化覆盖了角色、键盘路径和四项系统设置，代替不了真人用 VoiceOver 走一遍。这是最大的未知。
- 触摸真机。已有 4 项模拟 touch 用例，但遮挡、甩动惯性、与系统边缘手势的冲突只有上手才知道。
- 真实低端 GPU 的能耗。现有数据只节流了 CPU，而模糊花的是填充率。
- 浏览器矩阵只跑过一台机器——不是多平台、多版本、开关硬件加速都过了。

详细清单见 [`docs/known-limitations.md`](docs/known-limitations.md)。0.x 阶段仍可能有破坏性改动，每次都给改名对照表。

## 许可

MIT，见 [LICENSE](LICENSE) 与 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
