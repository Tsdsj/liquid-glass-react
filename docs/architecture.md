# 架构总览

## 模块分层与依赖规则

```
┌─────────────────────────────────────────────┐
│  src/components/*  src/toast/               │  ← 组件层
├─────────────────────────────────────────────┤
│  src/core/GlassSurface                      │  ← 玻璃原语层
├─────────────────────────────────────────────┤
│  src/core/filter/*  src/core/hooks/*        │  ← 引擎/工具层
│  src/core/utils/*                           │
├─────────────────────────────────────────────┤
│  src/styles/*  (tokens.css / themes.css)    │  ← Token 层（纯 CSS）
└─────────────────────────────────────────────┘
```

**依赖只允许向下**：

- 组件层可以依赖 GlassSurface、hooks、utils，**组件之间禁止互相 import**（唯一例外：Select 可复用 Popover 导出的内部原语，M4 时抽取）。
- GlassSurface 依赖 filter/hooks/utils，不依赖任何组件。
- filter/hooks/utils 不依赖 React 组件（hooks 依赖 React 本身当然可以）。
- CSS 同理：组件 CSS 只消费 token 变量，不 @import 其他组件的 CSS。

## 目录结构（定稿）

```
liquid-glass-react/
├─ AGENTS.md / PLAN.md / README.md / .gitignore / .npmrc
├─ package.json / tsconfig.json / vite.config.ts
├─ .storybook/
│  ├─ main.ts                    # framework: @storybook/react-vite
│  ├─ preview.tsx                # 壁纸 decorator + theme/wallpaper toolbar
│  └─ assets/                    # 壁纸图（渐变 CSS 生成为主，照片可选）
├─ docs/                          # 规范文档（本目录）与任务卡
├─ src/
│  ├─ index.ts                   # 唯一 JS 入口，全部 named export
│  ├─ styles/
│  │  ├─ index.css               # @import 所有 css，构建产出单份 style.css
│  │  ├─ tokens.css              # :root 全局 token（light 默认值）
│  │  └─ themes.css              # dark 覆盖 + prefers-color-scheme 兜底
│  ├─ core/
│  │  ├─ GlassSurface/{GlassSurface.tsx, glass-surface.css, index.ts}
│  │  ├─ filter/{displacement-map.ts, filter-registry.ts, GlassFilterDefs.tsx}
│  │  ├─ hooks/{useGlassSupport.ts, useControllableState.ts, useElementSize.ts}
│  │  ├─ config/LiquidGlassConfig.tsx   # context: forceFallback / 嵌套检测
│  │  └─ utils/cx.ts
│  ├─ components/<Name>/{<Name>.tsx, <name>.css, <Name>.stories.tsx, <Name>.test.tsx, index.ts}
│  └─ toast/{toast-store.ts, toast.ts, Toaster.tsx, Toaster.stories.tsx, toast-store.test.ts, toast.css}
└─ dist/                          # 构建产物（git 忽略）
```

## 公共导出（src/index.ts）

只从 `src/index.ts` 导出公共 API。全部 named export，禁止 default export。最终导出清单：

```ts
// 原语与配置
export { GlassSurface } from './core/GlassSurface';
export type { GlassSurfaceProps } from './core/GlassSurface';
export { LiquidGlassConfig } from './core/config/LiquidGlassConfig';
// 批次 1
export { Button } from './components/Button';
export { Switch } from './components/Switch';
export { Slider } from './components/Slider';
export { Checkbox } from './components/Checkbox';
// 批次 2
export { Input } from './components/Input';
export { Textarea } from './components/Textarea';
export { Select } from './components/Select';
// 批次 3
export { Modal } from './components/Modal';
export { Popover } from './components/Popover';
export { Tooltip } from './components/Tooltip';
// Toast
export { toast } from './toast/toast';
export { Toaster } from './toast/Toaster';
// 每个组件同时导出 Props 类型：export type { ButtonProps } ...
```

内部模块（filter registry、hooks）**不导出**，它们是实现细节。

## 构建管线

- Vite lib mode：entry `src/index.ts`，formats `['es','cjs']`，external：`react`、`react-dom`、`react/jsx-runtime`。
- `build.cssCodeSplit: false` → 单份 `dist/style.css`（CSS 入口是 `src/styles/index.css`，由 `src/index.ts` 顶部 `import './styles/index.css'` 引入——这是**唯一**允许 import CSS 的 ts 文件，Vite 构建时抽出）。
- `vite-plugin-dts`（`rollupTypes: true`）→ 单份 `dist/index.d.ts`。
- `package.json` exports map 与 sideEffects 见 PLAN.md §2。

## 运行时数据流（玻璃渲染路径）

```
GlassSurface mount
  → useGlassSupport() 判定 refraction 能力（模块级缓存）
  → 降级路径：data-refraction="off"，CSS 默认 blur+saturate 生效，结束
  → 折射路径：useElementSize 测量 → filterRegistry.acquire({w,h,radius,bezel})
      → registry 若无此 key：makeDisplacementMap() 生成 dataURI（LRU 缓存）→ 通知 GlassFilterDefs 渲染新 <filter>
      → 返回 filterId → GlassSurface 设置 style="--lg-filter-url: url(#id)" + data-refraction="on"
  → resize → release 旧 key + acquire 新 key（150ms 防抖换精确贴图）
  → unmount → release（引用计数归零延迟 2s 移除 filter）
```

## SSR/水合约定

- 服务端与首帧客户端渲染**一律输出降级形态**（`data-refraction="off"`），`useEffect` 后按检测结果升级。保证无 hydration mismatch。
- `toast-store` 的 API 在无 DOM 环境下调用只入队不报错。
- 所有 `window`/`document`/`navigator` 访问必须在 effect 或事件回调中，或有 `typeof window === 'undefined'` 守卫。
