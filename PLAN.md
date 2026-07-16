# Liquid Glass React 组件库 — 实施计划

> 本文档是项目的总体实施计划，由规划阶段与用户逐项确认后产出。
> 日期：2026-07-13

## 1. 背景与目标

开发一个复刻 Apple Liquid Glass（液态玻璃，WWDC 2025 设计语言）风格的 React 组件库，类似 antd 的使用体验，但主题聚焦玻璃质感。

### 已确认的决策

| 决策点 | 结论 |
|---|---|
| 定位 | 小范围使用（自己/朋友），发 npm 私有包；组件按最常用优先、逐步补充 |
| 视觉技术路线 | SVG 折射（`backdrop-filter: url()` + `feDisplacementMap`，Chromium）+ CSS 降级（blur+saturate+高光，Safari/Firefox） |
| 首批组件 | 基础交互：Button、Switch、Slider、Checkbox；输入类：Input、Textarea、Select；浮层反馈：Modal、Popover、Tooltip、Toast |
| 样式方案 | 纯 CSS + CSS 变量 token（打包一份 style.css，支持亮/暗模式） |
| 开发调试 | Storybook（配置壁纸背景 decorator 烘托玻璃效果） |

## 2. 技术选型

| 项 | 选择 | 理由 |
|---|---|---|
| 包管理 | pnpm（corepack 启用；Node v24 已可用） | |
| 构建 | Vite lib mode + vite-plugin-dts（不用 tsup） | `build.cssCodeSplit: false` 原生产出单份 `style.css`，`@import` 链、postcss、资源处理零配置；与 Storybook 的 react-vite framework 共用同一 Vite 管线，调试/构建行为一致。formats: `['es','cjs']`，external: react / react-dom / react/jsx-runtime |
| TypeScript | ~5.8+，strict，`moduleResolution: "bundler"`，`jsx: react-jsx` | d.ts 由 vite-plugin-dts 生成 |
| React peer | `^18.0.0 \|\| ^19.0.0` | 用到 `useId`、`useSyncExternalStore`，不支持 17 |
| 定位库 | @floating-ui/react（唯一运行时依赖） | 浮层类最难写对的部分（flip/shift/offset/arrow、焦点管理、外点关闭、a11y）全覆盖，headless 无样式，与纯 CSS 方案零冲突，~10kb 值得 |
| Storybook | v9.x，`@storybook/react-vite` | |
| 测试 | vitest + @testing-library/react + user-event + jsdom | 只测交互逻辑；视觉靠 Storybook 人工验收 |

### package.json 关键字段

```jsonc
{
  "name": "@yourscope/liquid-glass-react",
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "peerDependencies": { "react": "^18.0.0 || ^19.0.0", "react-dom": "^18.0.0 || ^19.0.0" },
  "dependencies": { "@floating-ui/react": "^0.27.x" },
  "packageManager": "pnpm@10.x"
}
```

## 3. 仓库结构（单包）

```
liquid-glass-react/
├─ package.json                  # type: module；exports map；sideEffects
├─ tsconfig.json                 # strict、moduleResolution: bundler、jsx: react-jsx
├─ vite.config.ts                # lib mode + vite-plugin-dts + vitest 配置（同文件）
├─ .npmrc                        # 私有 registry / npm scope 配置
├─ .storybook/
│  ├─ main.ts                    # framework: @storybook/react-vite
│  ├─ preview.tsx                # 壁纸背景 decorator + 主题/壁纸 toolbar
│  └─ assets/                    # 3~4 张壁纸图（照片、渐变、纯色深浅各一）
├─ src/
│  ├─ index.ts                   # 唯一 JS 入口，全部 named export
│  ├─ styles/
│  │  ├─ index.css               # CSS 入口：@import tokens/themes/各组件 css
│  │  ├─ tokens.css              # 全局 --lg-* 变量（light 默认值）
│  │  └─ themes.css              # [data-theme="dark"] 覆盖 + prefers-color-scheme 兜底
│  ├─ core/
│  │  ├─ GlassSurface/
│  │  │  ├─ GlassSurface.tsx     # 玻璃原语组件（最关键文件）
│  │  │  ├─ glass-surface.css    # 分层样式：refraction/tint/specular/content
│  │  │  └─ index.ts
│  │  ├─ filter/
│  │  │  ├─ displacement-map.ts  # canvas 生成位移贴图 dataURI（纯函数 + LRU 缓存）
│  │  │  ├─ filter-registry.ts   # 全局 filter 注册表（引用计数 + 尺寸去重）
│  │  │  └─ GlassFilterDefs.tsx  # portal 到 body 的隐藏 <svg><defs>，订阅 registry
│  │  ├─ hooks/
│  │  │  ├─ useGlassSupport.ts   # 降级检测
│  │  │  ├─ useControllableState.ts
│  │  │  └─ useElementSize.ts    # ResizeObserver + rAF 节流
│  │  └─ utils/cx.ts             # className 拼接（10 行自写，不引 clsx）
│  ├─ components/                # 每组件一目录：.tsx + .css + .stories.tsx + .test.tsx + index.ts
│  │  ├─ Button/ Switch/ Slider/ Checkbox/     # 批次 1
│  │  ├─ Input/ Textarea/ Select/              # 批次 2
│  │  └─ Modal/ Popover/ Tooltip/              # 批次 3
│  └─ toast/
│     ├─ toast-store.ts          # 外部 store（useSyncExternalStore）
│     ├─ toast.ts                # 命令式 API：toast.show/success/...
│     ├─ Toaster.tsx             # 宿主组件
│     └─ toast.css
└─ dist/                         # index.js(ESM) index.cjs index.d.ts style.css
```

组织原则：

- 组件 CSS **不由组件 import**（避免构建期 CSS 注入 JS），统一由 `src/styles/index.css` `@import`，打包出单份 `style.css`。
- Tree-shaking：全部 named export + 纯 ESM 输出 + `"sideEffects": ["**/*.css"]`。单入口即可，无需 preserveModules。

## 4. 核心玻璃引擎设计（最关键部分）

### 4.1 GlassSurface 分层模型

所有组件共享的玻璃容器。宿主元素 + 两个伪元素 + 内容层，避免多余 DOM：

```
<div class="lg-surface" style="--lg-r: 16px; --lg-filter-url: url(#lg-f-3)">
  ├─ 折射层：宿主自身 backdrop-filter（Chromium: url(#filter) 串联 blur/saturate；降级: blur+saturate）
  ├─ ::before  tint 层：半透明染色 background
  ├─ ::after   specular 层：inset 高光/暗缘 box-shadow + 1px 渐变描边
  └─ <div class="lg-surface__content">  内容层（isolation: isolate; contain: layout paint）
```

```css
.lg-surface {
  position: relative;
  border-radius: var(--lg-r);
  isolation: isolate;
  /* 降级默认值 */
  backdrop-filter: blur(var(--lg-fallback-blur)) saturate(var(--lg-saturation));
}
.lg-surface[data-refraction="on"] {
  /* Chromium：url() 滤镜与 blur/saturate 可串联在一条声明 */
  backdrop-filter: var(--lg-filter-url) blur(var(--lg-blur)) saturate(var(--lg-saturation));
}
.lg-surface::after { /* specular */
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow:
    inset 1px 1px 1px var(--lg-highlight),   /* 左上高光 rim */
    inset -1px -1px 1px var(--lg-shade),     /* 右下暗缘 */
    0 8px 24px var(--lg-drop-shadow);
}
```

圆角一致性由 `--lg-r` 变量贯穿宿主/伪元素/位移贴图生成参数。

GlassSurface API：

```ts
interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: ElementType;              // 默认 'div'，Button 用 'button'
  radius?: number | string;      // 默认 token --lg-radius-md
  refraction?: 'auto' | 'off';   // 'auto'=支持则开；大量实例场景手动 off
  depth?: number;                // 折射强度系数（乘到 feDisplacementMap scale）
  tint?: string;                 // 覆盖 --lg-tint
  interactive?: boolean;         // hover/active 高光位移过渡
}
```

### 4.2 位移贴图生成（displacement-map.ts）

折射本质：贴图 R 通道编码 X 位移、G 通道编码 Y 位移，128 为中性。中心区域保持中性（内容不畸变），只在边缘一圈 bezel 内沿法线方向位移，位移量按透镜剖面曲线（circular profile：`1 - sqrt(1 - t²)`）随到边距离衰减——这就是 Apple 效果的"边缘折射"。

```ts
export function makeDisplacementMap(w: number, h: number, radius: number, bezel: number): string {
  const canvas = new OffscreenCanvas(w, h);      // 兜底 document.createElement('canvas')
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // 圆角矩形 SDF：d < 0 在内部，|d| 为到边缘距离
      const d = roundedRectSDF(x + 0.5, y + 0.5, w, h, radius);
      const t = clamp01(1 + d / bezel);          // 0(内部深处) → 1(贴边)
      const k = lensProfile(t);                  // 1 - sqrt(1 - t*t)
      const [nx, ny] = edgeNormal(x, y, w, h, radius); // 指向外的法线
      const i = (y * w + x) * 4;
      img.data[i]     = 128 + nx * k * 127;      // R = X 位移
      img.data[i + 1] = 128 + ny * k * 127;      // G = Y 位移
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvasToDataURL(canvas);
}
```

对应 SVG filter（userSpaceOnUse，按元素实际像素尺寸）：

```tsx
<filter id={id} x="0" y="0" width={w} height={h}
        filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
  <feImage href={mapDataURI} x="0" y="0" width={w} height={h} result="map"
           preserveAspectRatio="none" />
  <feDisplacementMap in="SourceGraphic" in2="map" scale={strength}
                     xChannelSelector="R" yChannelSelector="G" />
</filter>
```

优化：贴图按 0.5x 分辨率生成再由 feImage 拉伸（`preserveAspectRatio="none"`），像素循环成本减 4 倍，视觉几乎无损；生成放在 rAF 里。

### 4.3 Filter 复用与 defs 管理

贴图形状由 `(w, h, radius, bezel)` 决定，**同尺寸实例必须共享**（一页 20 个同尺寸按钮只需 1 个 filter）：

- `filter-registry.ts`：模块级单例。`acquire(key) → filterId`（key = 量化后的 `${w}x${h}r${radius}b${bezel}`，w/h 四舍五入到整数像素），内部引用计数；`release(key)` 归零后延迟 ~2s 移除（避免快速 mount/unmount 抖动）。dataURI 生成结果另有 LRU 缓存（上限 ~50 条）。
- `GlassFilterDefs.tsx`：`createPortal` 到 body 的 `<svg width="0" height="0" aria-hidden>`，`useSyncExternalStore` 订阅 registry，渲染当前所有 `<filter>`。由第一个挂载的 GlassSurface 惰性挂载（模块级挂载计数），零配置。
- filter id 不用 useId（id 属于共享 filter 而非实例），registry 自增生成 `lg-f-<n>`；GlassSurface 拿到 id 后写入 `--lg-filter-url`。
- resize：`useElementSize`（ResizeObserver + rAF 合并）变化 → release 旧 key / acquire 新 key。连续变化期间沿用旧 filter（feImage 按新尺寸拉伸，短暂轻微失真可接受），停止 150ms 后换精确贴图。

### 4.4 useGlassSupport 降级检测

关键坑：`CSS.supports('backdrop-filter', 'url(#f)')` 在 Safari/Firefox 返回 true（解析通过但渲染无效）；computed style 读回同样不可靠；backdrop-filter 无法程序化像素读回验证。因此采用「能力预检 + 引擎判定」：

```ts
// 结果模块级缓存，只算一次
function detectGlassSupport(): boolean {
  if (typeof window === 'undefined') return false;   // SSR → 降级
  if (!CSS.supports('backdrop-filter', 'blur(1px)') &&
      !CSS.supports('-webkit-backdrop-filter', 'blur(1px)')) return false;
  // Blink 判定：优先 UA-CH
  const uaData = (navigator as any).userAgentData;
  if (uaData?.brands?.some((b: any) => b.brand === 'Chromium')) return true;
  // 回退 UA regex：Chromium 系（Chrome/Edge/Opera）且排除 Safari/Firefox
  const ua = navigator.userAgent;
  return /Chrome\/\d+/.test(ua) && !/Firefox|FxiOS|CriOS|Version\/\d+.*Safari/.test(ua);
}
```

配套机制：

- Hook 返回 `{ refraction: boolean }`；首帧（含 SSR/hydration）一律降级渲染，`useEffect` 后升级——两条路线共享 tint/specular 层，升级只替换 backdrop-filter 声明，无布局跳动、无 hydration mismatch。
- 逃生舱：`refraction="off"` per-instance + `<LiquidGlassConfig forceFallback>` context；尊重 `prefers-reduced-transparency` 自动关折射（贴合 Apple 的 Reduce Transparency 行为）。
- 降级方案本身做精：`blur + saturate(1.6)` + 更强 inset 高光 + 1px 渐变描边，Safari 上仍是合格毛玻璃。

### 4.5 性能

- 每个 backdrop-filter 元素触发一次 backdrop root 合成，成本 ∝ 面积。**禁止嵌套玻璃**：context 检测嵌套，内层自动 `refraction: off` + 纯 tint。
- 不默认 `will-change`；仅 Modal/Popover 进出场动画期间临时加，动画结束移除。
- `contain: layout paint` 加在 `.lg-surface__content` 上。
- 长列表指导：列表项用 `refraction="off"` 或 flat 变体（纯 tint）；玻璃只用于浮在内容之上的 chrome 层（工具栏、浮层、控件）——与 Apple 用法一致。
- filter registry 保证 filter 数 = 不同尺寸数，而非实例数。

## 5. Design Token 体系

命名规范 `--lg-<域>[-<细分>]`，两层：

### 全局 token（tokens.css，:root）

```css
:root {
  /* 玻璃材质 */
  --lg-blur: 4px;                 /* 折射模式下的辅助模糊 */
  --lg-fallback-blur: 16px;       /* 降级模式主模糊 */
  --lg-saturation: 1.5;
  --lg-refraction: 40;            /* feDisplacementMap scale 基准 */
  --lg-tint: rgb(255 255 255 / 0.25);
  --lg-highlight: rgb(255 255 255 / 0.75);
  --lg-shade: rgb(0 0 0 / 0.08);
  --lg-drop-shadow: rgb(0 0 0 / 0.15);
  /* 几何 */
  --lg-radius-sm: 8px; --lg-radius-md: 14px; --lg-radius-lg: 22px; --lg-radius-full: 999px;
  --lg-control-h-sm: 28px; --lg-control-h-md: 36px; --lg-control-h-lg: 44px;
  /* 颜色 */
  --lg-accent: #0a84ff; --lg-text: rgb(0 0 0 / 0.85); --lg-text-secondary: rgb(0 0 0 / 0.5);
  --lg-danger: #ff453a;
  /* 动效 */
  --lg-ease: cubic-bezier(0.32, 0.72, 0, 1); --lg-duration: 200ms;
}
```

### 组件级 token

各组件 css 顶部声明，默认引用全局（如 `--lg-button-bg: var(--lg-tint)`、`--lg-modal-radius: var(--lg-radius-lg)`），使用者可只覆盖某组件。

### 亮暗模式

`data-theme` 属性为主、系统偏好兜底：

```css
[data-theme="dark"] { --lg-tint: rgb(40 40 40 / 0.35); --lg-text: rgb(255 255 255 / 0.9); /* … */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { /* 同一组 dark 值 */ }
}
```

`data-theme` 让应用可控（手动切换、局部主题岛 `<div data-theme="dark">`），`:not([data-theme])` 兜底跟随系统。

## 6. 组件 API 设计

通用约定：受控/非受控双支持（`value`/`defaultValue` + `onChange`，经 `useControllableState`）；`size?: 'sm'|'md'|'lg'`（默认 md）；`disabled`；全部 `forwardRef`；原生属性透传。

### 批次 1：基础交互

- **Button**：`variant?: 'glass'|'accent'|'ghost'|'danger'`、`size`、`loading`、`icon`；GlassSurface `as="button"`。
- **Switch**：`checked/defaultChecked/onCheckedChange`；原生 `<input type=checkbox role=switch>` 隐藏 + 视觉层；thumb 是小 GlassSurface（拖动"液滴"感），轨道用 tint。
- **Slider**：`value/defaultValue/onChange/onChangeEnd`、`min/max/step`；原生 range 隐藏 + 自绘轨道（跨浏览器一致），thumb 玻璃圆珠。
- **Checkbox**：`checked/defaultChecked/onCheckedChange`、`indeterminate`；原生 input + 视觉层。

### 批次 2：输入类

- **Input**：`prefix/suffix`、`invalid`；容器 GlassSurface 默认 `refraction="off"`（输入区折射晃眼，只用 tint+高光），focus 态 accent 描边。
- **Textarea**：同 Input，`autoResize?: boolean`。
- **Select**：单选，`options: {label, value, disabled?}[]` 数组 API（小库不做 compound component）；触发器 GlassSurface，面板复用 Popover 内核；`role="listbox"` 自实现，键盘导航必须做。

### 批次 3：浮层与反馈（基于 @floating-ui/react）

- **Modal**：`open/onOpenChange`、`title`、`footer`、`size`、`closeOnOverlayClick`；FloatingPortal + FloatingFocusManager + FloatingOverlay；面板是大圆角 GlassSurface，overlay 用轻度 blur 暗化层。
- **Popover**：`open/defaultOpen/onOpenChange`、`placement`、`content`；trigger 为 children（cloneElement + ref 合并）。
- **Tooltip**：`content`、`placement`、`delay`；hover/focus 触发；`role="tooltip"`。
- **Toast**：命令式 API，见下。

### Toast 命令式 API

```ts
import { toast, Toaster } from '@yourscope/liquid-glass-react';

<Toaster position="top-center" />          // App 根部放一次
const id = toast.show('已保存', { duration: 3000, icon: <Check/> });
toast.success('...'); toast.error('...'); toast.dismiss(id); toast.dismiss();
```

实现：`toast-store.ts` 模块级外部 store（数组 + listeners + getSnapshot）；`Toaster.tsx` 用 `useSyncExternalStore` 订阅并渲染玻璃胶囊堆叠；进出场 CSS transition + `exiting` 标记延迟真删；Toaster 未挂载时调用只入队不报错；duration 默认 3s，`Infinity` 常驻；SSR 安全。

## 7. 里程碑与验收标准

### M0 脚手架（~0.5 天）

任务：`corepack enable pnpm`；pnpm init；安装依赖（react/react-dom、typescript、vite、vite-plugin-dts、@vitejs/plugin-react、storybook@9、vitest、@testing-library/react、jsdom、@floating-ui/react）；tsconfig / vite.config（lib mode：entry src/index.ts，formats es+cjs，cssCodeSplit:false，external react 系）；Storybook 跑通壁纸 decorator + 主题 toolbar；空的 src/index.ts 与 styles 入口。

验收：`pnpm build` 产出 `dist/{index.js,index.cjs,index.d.ts,style.css}`；`pnpm storybook` 显示带壁纸背景的空 story；`pnpm test` 通过。

### M1 玻璃引擎 + Token（~1-2 天，核心）

任务：tokens.css/themes.css；displacement-map.ts（SDF、透镜剖面、LRU）；filter-registry.ts + GlassFilterDefs；useGlassSupport；useElementSize；GlassSurface 全套分层 CSS；Storybook "Glass Playground" story（调参滑杆 + 强制降级开关 + resize 测试）。

验收：Chromium 上 GlassSurface 叠照片壁纸有明显边缘折射；模拟 Safari UA 走降级且观感合格；同尺寸 20 个实例 defs 里只有 1 个 filter；拖拽 resize 无闪烁报错；暗色主题切换生效。

### M2 批次 1 组件（~1-2 天）

Button/Switch/Checkbox/Slider + stories + 交互测试。

验收：受控/非受控测试通过；键盘可操作（Space/Enter/方向键）；disabled 态正确；Storybook 双主题双壁纸人工验收。

### M3 批次 2 组件（~1-2 天）

Input/Textarea/Select（Select 直接用 floating-ui 原语，M4 再抽 Popover）。

验收：Select 键盘导航（上下/Enter/Esc）+ 外点关闭；Input focus 态、prefix/suffix 布局正确。

### M4 批次 3 浮层（~2 天）

Popover/Tooltip/Modal/Toast。

验收：Modal 焦点圈闭 + Esc 关闭 + 滚动锁定；Tooltip hover/focus 触发且有 delay；toast 命令式 API 全链路测试通过；浮层视口边缘自动翻转。

### M5 构建发布（~0.5 天）

任务：README（安装、style.css 引入、token 覆盖表、降级说明）；.npmrc 私有 registry；`prepublishOnly: pnpm build && pnpm test`；在临时 vite 项目安装 tarball（`pnpm pack`）烟测（ESM/CJS/types/css + tree-shaking 验证：只 import Button 时 bundle 不含 Modal）。

验收：他人 `pnpm add` 后按 README 三行代码跑出玻璃按钮。

## 8. 测试策略

- **vitest (jsdom) + testing-library + user-event**：只测交互逻辑与状态机——受控/非受控、键盘、open/close、toast store、useControllableState。每组件 5~10 case。
- **玻璃引擎单测**：SDF/透镜剖面纯函数数值断言（中心像素 128/128、边缘位移方向）、filter-registry 引用计数与去重、useGlassSupport mock UA 分支。jsdom 无 canvas 渲染，贴图生成用依赖注入的假实现只测像素数组计算。
- **视觉**：Storybook 人工验收，双主题 × 多壁纸矩阵。不上截图对比（小范围库维护成本大于收益）。

## 9. 执行策略（Codex harness）

- 实现由 Codex 执行，本仓库以文档 harness 约束其工作：
  - **`AGENTS.md`**：Codex 工作入口——文档索引、工作流程、命令、硬性约束、提交规范。
  - **`docs/architecture.md`**：模块分层、依赖规则、导出清单、构建管线、SSR 约定。
  - **`docs/conventions.md`**：TS/React/CSS/Storybook/命名规范。
  - **`docs/glass-engine.md`**：玻璃引擎完整规格（算法公式、API 签名、行为契约）。
  - **`docs/tokens.md`**：token 定义表（light/dark 全值，单一事实源）。
  - **`docs/component-guide.md`**：组件开发 checklist 与通用约定。
  - **`docs/testing.md`**：测试范围与环境补丁。
  - **`docs/tasks/M0..M5.md`**：可逐个执行的任务卡（frontmatter 状态标记 + 步骤 + 验收标准 + 完成记录），Codex 每次取编号最小的未完成任务卡开工。
- 里程碑严格串行 M0→M5；里程碑内组件可并行。每个任务完成必须通过 `pnpm typecheck && pnpm build && pnpm test` 并更新任务卡状态后提交 git。

## 10. 二/三/四阶段路线（M8 起）

> 一阶段（M0–M4 + M6a–M6f 打磨 + M7 文档站）已完成，产出玻璃引擎 + 12 个核心组件 +
> 重设计文档站。M5（原发布卡）由用户单独触发。

### 二阶段 — 组件扩容 + 引擎实验（M8–M14，已完成）

- 组件扩容（M8–M11）：Radio/Segmented/Tabs、Tag/Badge/Progress/Spin/Skeleton、
  Card/Avatar/Breadcrumb/Pagination/SideNav、Drawer/Menu。累计 **27 个组件**。
- 引擎进阶实验（M12–M14）：渐进模糊 ProgressiveBlur、液态融合 morph（分级验证）、
  环境色自动取样。三者全 opt-in / 内部化 / 不新增公共导出 / 不改现有默认行为。

### 三阶段 — 发布与硬化（M15–M18，本阶段）

主题：把功能完整但**未发布**的库做成公众可 `pnpm add` 的**公开 npm 包**（scope
`@ttqtt`）+ **GitHub Pages 文档站**，并补齐生产可信度。共识决策：

| 决策 | 结论 |
|---|---|
| 发布目标 | 公开 npm 包 + 公开文档站（GitHub Pages，免费） |
| 包名 | `@ttqtt/liquid-glass-react`（npm 账号 `ttqtt` 的个人 scope；由 `@ttq` 全仓重命名而来） |
| License | MIT |
| CI / 部署 | 可移植 CI（Gitea/Forgejo Actions 与 GitHub Actions 通用一份 YAML）；站点部署 GitHub Pages |
| 硬化支柱 | CI+发布自动化、无障碍(axe)+SSR 校验、质量债(修 Modal flaky)+体积预算 |
| 明确排除 | 视觉回归（截图基线，需浏览器/CI，本阶段不做） |
| 发布触发 | 实际 `npm publish` 与 Pages 部署凭据由用户持有，打 tag / 手动触发 |

里程碑（串行 M15→M16→M17→M18）：

- **M15 公开发布准备**：LICENSE(MIT)、正式 README、CHANGELOG(0.1.0)、`@ttq`→`@ttqtt`
  全仓重命名、package.json 转公开（repo/homepage/keywords/`publishConfig.access:public`/
  `prepublishOnly`/版本 0.1.0）、`pnpm pack` + 临时项目装包烟测（ESM/CJS/types/css +
  tree-shaking）。
- **M16 质量债与体积预算**：修掉 Modal 焦点测试并行 flake（本阶段目标即硬化，可动该测试）；
  bundle 体积上限 + tree-shaking 校验（Node 脚本/测试）。
- **M17 无障碍与 SSR 校验**：axe-core（devDep）在 jsdom 逐组件冒烟；`renderToString` SSR
  冒烟（不崩、服务端走降级、模块顶层无 window）；Next.js App Router 使用指南。
- **M18 CI 与发布/部署自动化**：可移植 CI（typecheck/build/test）；GitHub Pages 部署站点
  （Vite `base` 子路径 + 现有 hash 路由）；`v*` tag → `npm publish --access public`；
  `RELEASING.md` 发版流程。

每卡沿用既有约定：`pnpm typecheck && pnpm build && pnpm test` 通过、更新任务卡状态、
一卡一或多提交、存量断言不削弱。

### 四阶段 — 扩容·产品化·生态（M19–M26，已完成）

主题：三阶段已把库做成 release-ready 的公开包。四阶段在稳定地基上做三件事——**补齐重型
组件、把二阶段的引擎实验特性产品化转正、提升接入体验（DX）**。三条线共识决策：

| 决策 | 结论 |
|---|---|
| 无新运行时依赖 | 延续 AGENTS 硬约束。DatePicker 日期算法、Form 校验逻辑一律**自写**在 `src/core/utils/`，不引 dayjs/zod/yup |
| 排序策略 | 先铺地基（主题/动效 token）→ 引擎产品化 → 重型组件 → 文档站增强收尾；新组件天然吃到新 token 与动效 |
| 公共 API | 新增导出（`createTheme`、`ProgressiveBlur` 等转正、新组件）一律先在任务卡定稿（AGENTS §6），不加不减 |
| 明确排除 | 视觉回归截图基线（同前阶段，需浏览器/CI）；富文本/图表/上传等超范围重组件；服务端数据请求封装 |

里程碑（串行 M19→M26；里程碑内可并行）：

- **M19 主题定制 API**：`createTheme` 工具（类型安全的 `--lg-*` 覆盖）+ 2–3 套预设主题
  + 全量 token 参考文档，降低定制门槛。地基卡，后续组件/文档均引用。
- **M20 交互动效打磨**：按压回弹 / 高光随指针 / hover 升起统一为**动效 token**，增强
  `GlassSurface` `interactive`。地基卡，新组件挂载即吃到统一动效。
- **M21 实验特性产品化**：M12–M14 的 ProgressiveBlur / 液态 morph / 环境取样从内部
  opt-in **转正为公共导出** + 文档，不改既有默认行为。
- **M22 Form 表单**：表单容器 + 自写校验 + 字段布局 + 错误提示，把现有输入组件编排成受控表单。
- **M23 Table 表格**：列定义 / 排序 / 选中 / 分页联动 + 玻璃表头行悬浮（本阶段最大一卡）。
- **M24 DatePicker 日期**：日历面板 + 键盘导航 + a11y，基于已有 Popover，日期算法自写。
- **M25 轻型组件补齐**：Alert/Banner、Accordion/Collapse、Command、Empty、Steps 五个小组件合一卡。
- **M26 文档站增强**：props playground（交互调参）+ 站内搜索 + 代码复制 + 更多真实示例
  （每组件 API 表已存在，本卡补缺口）。收尾卡，一次性覆盖全部新组件/主题/引擎特性。

每卡沿用既有约定：`pnpm typecheck && pnpm build && pnpm test` 通过、更新任务卡状态、
一卡一或多提交、存量断言不削弱。
