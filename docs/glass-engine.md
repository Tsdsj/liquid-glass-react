# 玻璃引擎规格（核心）

本文档是 `src/core/` 的实现规格。实现必须与本文一致；发现矛盾在任务卡记录，不擅自改动。

## 1. 原理

Apple Liquid Glass 的核心是**边缘折射**：玻璃中心区域清晰（轻微模糊），边缘一圈（bezel）像透镜一样把背景向内弯折。浏览器实现路径：

- **Chromium**：`backdrop-filter: url(#filter)` 引用 SVG `feDisplacementMap`，位移贴图控制背景采样偏移。`url()` 滤镜可与 `blur()`/`saturate()` 串联在同一条 backdrop-filter 声明。
- **Safari / Firefox**：不支持 backdrop-filter 引用 SVG 滤镜（解析通过但渲染无效果）。降级为 `blur + saturate` + 强化的高光/描边。

## 2. GlassSurface 组件

### 2.1 API（定稿）

```ts
export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;        // 默认 'div'
  radius?: number | string;      // 圆角。number → px；默认 var(--lg-radius-md)
  refraction?: 'auto' | 'off';   // 默认 'auto'：支持则开折射
  depth?: number;                // 折射强度系数，默认 1；乘到 scale = depth * --lg-refraction
  bezel?: number;                // 边缘折射带宽度 px，默认 12
  tint?: string;                 // 覆盖 --lg-tint（写入 inline style 变量）
  interactive?: boolean;         // true 时 hover/active 有高光/缩放反馈
}
```

### 2.2 DOM 与分层

```html
<div class="lg-surface" data-refraction="on|off" style="--lg-r: 14px; --lg-filter-url: url(#lg-f-3)">
  <!-- 宿主自身: 折射/模糊层 (backdrop-filter) -->
  <!-- ::before: tint 染色层 -->
  <!-- ::after:  specular 高光层 -->
  <div class="lg-surface__content"><!-- children --></div>
</div>
```

### 2.3 基础 CSS（glass-surface.css，定稿骨架）

```css
.lg-surface {
  position: relative;
  border-radius: var(--lg-r, var(--lg-radius-md));
  isolation: isolate;
  border: none;
  /* 降级/首帧默认 */
  -webkit-backdrop-filter: blur(var(--lg-fallback-blur)) saturate(var(--lg-saturation));
  backdrop-filter: blur(var(--lg-fallback-blur)) saturate(var(--lg-saturation));
}
.lg-surface[data-refraction="on"] {
  backdrop-filter: var(--lg-filter-url) blur(var(--lg-blur)) saturate(var(--lg-saturation));
}
.lg-surface::before { /* tint */
  content: ""; position: absolute; inset: 0; z-index: -1;
  border-radius: inherit; background: var(--lg-tint);
}
.lg-surface::after { /* specular：高光 rim + 暗缘 + 投影 + 1px 渐变描边 */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  border-radius: inherit;
  box-shadow:
    inset 1px 1px 1px var(--lg-highlight),
    inset -1px -1px 1px var(--lg-shade),
    0 8px 24px var(--lg-drop-shadow);
  /* 1px 渐变描边：双背景 + mask 裁边技法 */
  background: linear-gradient(135deg, var(--lg-highlight), transparent 40%, transparent 60%, var(--lg-shade)) border-box;
  border: 1px solid transparent;
  mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0) border-box;
}
.lg-surface__content {
  position: relative; z-index: 1;
  contain: layout paint;
  border-radius: inherit;
}
.lg-surface:focus-visible { outline: 2px solid var(--lg-accent); outline-offset: 2px; }
.lg-surface[data-interactive]:hover::before { background: var(--lg-tint-hover); }
.lg-surface[data-interactive]:active { transform: scale(0.98); }
.lg-surface { transition: transform var(--lg-duration) var(--lg-ease); }
@media (prefers-reduced-motion: reduce) {
  .lg-surface { transition: none; }
}
```

（降级模式下 tint/specular 完全复用；`[data-refraction="off"]` 可略增 `--lg-shade` 强度补偿质感，由 token 控制。）

### 2.4 行为契约

- 首帧（含 SSR）渲染 `data-refraction="off"`；`useEffect` 中若 `refraction === 'auto'` 且 `useGlassSupport().refraction === true` 且未被 context 强制降级且不在嵌套玻璃内 → 测量尺寸、acquire filter、切到 `on`。
- `radius` 传 number 时同时用于 CSS 变量（`${n}px`）与贴图生成参数；传 string（如 `'50%'`）时折射自动降级为 off（贴图无法可靠计算非像素圆角），控制台 dev 环境 warn 一次。
- 尺寸为 0（display:none 等）时不 acquire。
- unmount 时 release。

## 3. 位移贴图（displacement-map.ts）

### 3.1 算法（定稿）

贴图尺寸 = 元素尺寸 × 0.5（`MAP_SCALE = 0.5`，所有几何参数同乘）。像素编码：R = X 位移，G = Y 位移，128 中性，B=128，A=255。

```
对每个像素 (x, y)：
  d  = roundedRectSDF(x+0.5, y+0.5, w, h, r)     // <0 内部，绝对值≈到边距离
  t  = clamp01(1 + d / bezel)                    // 0=内部深处 … 1=贴边
  k  = 1 - sqrt(max(0, 1 - t*t))                 // 圆形透镜剖面，边缘陡峭
  (nx, ny) = 边缘法线（指向外）
  R = round(128 - nx * k * 127)                  // 负号：向内折射（背景被"吸入"）
  G = round(128 - ny * k * 127)
```

圆角矩形 SDF（标准公式，中心为原点坐标系）：

```ts
function roundedRectSDF(px: number, py: number, w: number, h: number, r: number): number {
  const qx = Math.abs(px - w / 2) - (w / 2 - r);
  const qy = Math.abs(py - h / 2) - (h / 2 - r);
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
}
```

法线：用 SDF 的数值梯度（中心差分，步长 1px）归一化得到。梯度为零向量（正中心等）时法线取 (0,0)（位移为 0，k 也为 0，无影响）。

导出签名（纯函数部分与 canvas 部分分离，便于单测）：

```ts
/** 纯计算：返回 RGBA 像素数组，可在无 DOM 环境测试 */
export function computeDisplacementPixels(w: number, h: number, r: number, bezel: number): Uint8ClampedArray;
/** 封装 canvas：优先 OffscreenCanvas，回退 document.createElement('canvas')，返回 PNG dataURI */
export function makeDisplacementMap(w: number, h: number, r: number, bezel: number): string;
```

### 3.2 缓存

模块级 LRU（自写，Map 实现，上限 50 条）：key = `"w,h,r,bezel"`（缩放后的整数），value = dataURI。`makeDisplacementMap` 先查缓存。

## 4. Filter 注册表（filter-registry.ts）

模块级单例。职责：同形状 filter 共享、生命周期管理、向 GlassFilterDefs 提供快照。

```ts
export interface FilterEntry { id: string; w: number; h: number; mapURI: string; scaleVar: true }
export interface FilterRegistry {
  acquire(shape: { w: number; h: number; r: number; bezel: number }): string; // 返回 filterId
  release(shape: { ... }): void;
  subscribe(cb: () => void): () => void;       // useSyncExternalStore 用
  getSnapshot(): readonly FilterEntry[];        // 引用稳定：无变化时返回同一数组
}
```

- key：`w`、`h` 四舍五入到整数像素后 `"${w}x${h}r${r}b${bezel}"`。
- `acquire`：无则创建（id = `lg-f-${自增}`，生成贴图），引用计数 +1，若有 pending 移除则取消。
- `release`：计数 -1；归零后 `setTimeout(2000)` 再真正移除并通知订阅者（防 mount/unmount 抖动）。
- 测试需覆盖：同 key 复用同 id、计数归零延迟移除、移除前再 acquire 取消移除。测试中 timer 用 vi.useFakeTimers。

## 5. GlassFilterDefs.tsx

- `createPortal` 到 `document.body`：`<svg width="0" height="0" style={{position:'fixed'}} aria-hidden="true">`。
- `useSyncExternalStore(registry.subscribe, registry.getSnapshot, () => EMPTY)` 渲染所有 filter：

```tsx
<filter id={f.id} x="0" y="0" width={f.w} height={f.h}
        filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
  <feImage href={f.mapURI} x="0" y="0" width={f.w} height={f.h} preserveAspectRatio="none" result="map" />
  <feDisplacementMap in="SourceGraphic" in2="map" scale={f.scale} xChannelSelector="R" yChannelSelector="G" />
</filter>
```

- scale = `depth * refractionBase`（refractionBase 读 token `--lg-refraction` 的数值，实现上由 acquire 时传入并入 shape key 的一部分——**注意**：depth 不同的实例形状相同也不能共享 filter，key 须包含 scale。修正后的 key：`"${w}x${h}r${r}b${bezel}s${scale}"`）。
- 挂载策略：GlassSurface 内部维护模块级挂载计数，第一个需要折射的实例渲染 `<GlassFilterDefs/>`（通过极简的内部 context 或直接在每个 GlassSurface 渲染、组件内部用模块级布尔去重——实现取后者需保证 StrictMode 双挂载安全，推荐用一个专门的 `<FilterDefsHost/>` 单例组件 + 引用计数）。

## 6. useGlassSupport（降级检测）

**已知坑（不要踩）**：`CSS.supports('backdrop-filter','url(#f)')` 在 Safari/Firefox 误报 true；computed style 读回不可靠；无法像素级验证 backdrop-filter。因此：能力预检 + 引擎判定（UA-CH 优先，UA regex 回退）。

```ts
let cached: boolean | null = null;
export function detectGlassSupport(): boolean {
  if (cached !== null) return cached;
  if (typeof window === 'undefined') return false;   // SSR 不缓存 false！直接 return
  const hasBF = CSS.supports('backdrop-filter', 'blur(1px)')
             || CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
  if (!hasBF) return (cached = false);
  const brands = (navigator as { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  if (brands?.some(b => b.brand === 'Chromium')) return (cached = true);
  const ua = navigator.userAgent;
  const isChromium = /Chrome\/\d+|Edg\//.test(ua) && !/Firefox|FxiOS/.test(ua)
    && !(/Version\/\d+.*Safari/.test(ua));           // 真 Safari 特征
  return (cached = isChromium);
}
export function useGlassSupport(): { refraction: boolean } // 内部含 LiquidGlassConfig.forceFallback 与 prefers-reduced-transparency 判定
```

- `prefers-reduced-transparency: reduce` 命中时 `refraction: false`（matchMedia 监听变化）。
- 单测：mock `navigator.userAgent` / `userAgentData` 覆盖 Chrome、Edge、Safari、Firefox、SSR 五个分支（注意重置 cached，导出 `__resetGlassSupportCache` 仅测试用）。

## 7. LiquidGlassConfig（context）

```tsx
export interface LiquidGlassConfigProps {
  forceFallback?: boolean;   // 强制全部降级
  children: React.ReactNode;
}
```

同一 context 内部还承载**嵌套检测**：GlassSurface 渲染 children 时提供 `insideGlass: true`；子 GlassSurface 检测到 `insideGlass` 时强制 `refraction: off` 且不再应用 backdrop-filter（纯 tint + specular），避免嵌套合成开销。

## 8. useElementSize

`ResizeObserver` + rAF 合并；返回 `{ width, height }`（CSS 像素，四舍五入整数）。GlassSurface 中对尺寸变化做 150ms 防抖后才切换 filter（变化期间沿用旧 filter，feImage 拉伸导致的轻微失真可接受）。

## 9. 性能规则（对所有组件生效）

1. 嵌套玻璃自动禁用（§7）。
2. 不默认 `will-change`；浮层进出场动画期间临时加 `will-change: opacity, transform`，动画结束移除。
3. `contain: layout paint` 在 `.lg-surface__content` 上。
4. filter 数 = 不同形状数（registry 保证），禁止任何 per-instance 无脑建 filter 的实现。
5. 贴图生成在 rAF 中执行；单个典型控件（≤400×100px，0.5x 采样）生成时间应 <2ms。
