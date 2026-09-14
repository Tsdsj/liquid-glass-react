# Liquid Glass UI

以 Apple 的设计语言（HIG + Liquid Glass）为参照的 **React + TypeScript 组件系统与文档站**。独立设计研究，非 Apple 官方产品，不包含 Apple 字体、SF Symbols、商标图形或壁纸素材。

**版本：0.2.0-alpha.1。定位：可运行、可继续开发的工程交付，不是已完成真机认证的正式发行版。**

核心立场只有一条：**玻璃属于浮动的操作与导航层，内容层保持实色或标准材质。** 如果所有东西都半透明，就没有东西在"浮起来"。

## 1. 立即运行：不用安装 npm 依赖

先安装 Node.js 22.12 或更高版本。解压后在项目目录执行：

```bash
cd liquid-glass-ui
node scripts/serve-preview.mjs
```

在 Google Chrome 中打开 **http://127.0.0.1:4173**。不要双击 HTML，也不要把 `file://` 行为当作支持范围。

该命令只使用 Node 标准库，默认只监听本机 `127.0.0.1`，并带一条限制性 CSP（`script-src 'self' 'nonce-…'`，无 `unsafe-eval`）。演示站不请求任何外部资源。可用 `PORT=4300 node scripts/serve-preview.mjs` 修改端口。

> `preview/` 是可离线运行的检查用预构建文件，运行时为 **React / ReactDOM 19.1.1**；源码工作区声明 19.2.7。两者明确分开：预览不能证明 npm 版本组合已经构建、测试或通过依赖安全审计。源码改动后必须执行 `npm run preview:rebuild` 才会同步。

## 2. 开发源码与标准构建

```bash
npm install
npm run dev
# http://127.0.0.1:5173

npm run typecheck
npm run build
npm test
npm run test:ssr
npx playwright install --with-deps chrome
npm run test:chrome
```

## 3. 工程结构

```text
liquid-glass-ui/
├── packages/
│   ├── tokens/       # 语义色、iOS 文本样式、间距、形状、动效 token
│   ├── core/         # 无 DOM 几何、位移图、LRU、弹簧积分器、同心圆角
│   └── react/
│       ├── system/       Provider · 材质 · 背景色调 · pull · fusion
│       ├── content/      Text · Card · List · MaterialView · Divider   ← 非玻璃
│       ├── controls/     Button · Segmented · Switch · Slider · Stepper · Progress · Badge
│       ├── fields/       TextField · SearchField
│       ├── navigation/   Toolbar · TabBar · Sidebar · NavigationBar · Tabs · ScrollEdge
│       └── overlays/     Popover · Menu · Sheet · Alert · ActionSheet · Dialog · Toast
├── apps/playground/  # 文档站：概览 / 基础 / 27 个组件页 / 实验室 / 指南
├── preview/          # 随包可运行的离线检查版
├── tests/
│   ├── core/         # Node test：几何、缓存、弹簧、同心圆角（62 项）
│   ├── browser/      # Playwright：正式 Chrome / Chromium 分项目（60 项）
│   └── local/        # 生成 reports 的 Python Playwright 脚本
└── docs/             # 设计系统、API、无障碍、迁移、架构、测试口径
```

公开 API 共 65 个导出：41 个组件与 Provider、10 个 Hook、14 个纯函数与诊断工具。

## 4. 最小接入

```tsx
import { GlassProvider, ToastProvider, GlassToolbar, ToolbarGroup, ToolbarSpacer, GlassButton } from '@liquid-glass-ui/react';
import '@liquid-glass-ui/react/tokens.css';
import '@liquid-glass-ui/react/styles.css';

<GlassProvider theme="system">
  <ToastProvider>
    <GlassToolbar aria-label="图片操作">
      <ToolbarGroup><GlassButton>查看原图</GlassButton></ToolbarGroup>
      <ToolbarSpacer variant="flexible" />
      <ToolbarGroup prominent><GlassButton variant="glassProminent">导出</GlassButton></ToolbarGroup>
    </GlassToolbar>
  </ToastProvider>
</GlassProvider>
```

`tokens.css` 必须在 `styles.css` 之前引入一次。组件 CSS 全部在 `.lg-*` 命名空间下，不要求 Tailwind、Turbo 或任何动画库。

## 5. 这套系统明确不承诺什么

- 不是 Apple 官方产品。图标按 24×24 / 1.8 描边自绘；SF 字体与 SF Symbols 的许可不覆盖网页分发，因此都没有捆绑。
- 背景色调由 `GlassBackdrop` **显式声明**，不做 DOM 截屏或跨源像素采样。这意味着"小玻璃随背景翻转"是可预期的，而不是自动猜测的。
- 性能页记录的是 `requestAnimationFrame` 回调间隔与 Long Tasks，**不是**合成器帧时间、掉帧率、INP 或设备 GPU 结论。
- 真机 Chrome 矩阵、屏幕阅读器人工验证、200% 缩放与能耗测量仍是发布前的人工门槛，没有因为组件数量增加而降低。详见 `docs/action-items.md`。

## 6. 文档

| 文档 | 内容 |
| --- | --- |
| `docs/design-system.md` | token 体系、三类形状、两类玻璃、内容层与操作层的分工 |
| `docs/api.md` | 全部公开 API |
| `docs/accessibility.md` | 四项系统偏好、键盘模型、RTL、Dynamic Type |
| `docs/migration-0.2.md` | 从 0.1 迁移 |
| `docs/architecture.md` | 材质管线、资源上限、SSR 与顶层显示 |
| `docs/testing.md` | 验证口径与发布前人工矩阵 |
| `docs/action-items.md` | 阶段状态与剩余条件 |
| `docs/known-limitations.md` | 已知限制 |

许可：MIT，见 `LICENSE` 与 `THIRD_PARTY_NOTICES.md`。
