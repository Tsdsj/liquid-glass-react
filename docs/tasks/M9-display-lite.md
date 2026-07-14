---
status: todo
depends: [M8]
---

# M9 — 二阶段·轻量展示批:Tag、Badge、Progress、Spin、Skeleton

> 优先于 M5 执行。五个组件全部无复杂交互,总量约等于一个中型组件;
> 组件相互独立,一组件一提交,超时可标 in-progress 跨会话续做。

## 玻璃使用决策(定稿,理由随卡存档)

**本批五个组件全部不用 GlassSurface**:

- Tag/Badge/Progress/Spin 均为小面积元素,按 `docs/component-guide.md` 玻璃
  使用原则(小面积看不出折射且浪费合成层),直接纯 CSS tint。
- Skeleton 额外理由:占位符不属于"悬浮材质层级"的语义;骨架屏常 N 个并存,
  N × backdrop-filter 是纯浪费;且会与首帧 pending 门控产生概念纠缠。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`;本卡 props 表即 API 定稿。
- 服务器无浏览器:视觉验证留用户本地目检。

## API 定稿

### Tag

```ts
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'default' | 'accent' | 'success' | 'warning' | 'danger'; // 映射既有色 token
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';                  // 标签不需要 lg
}
```

- close 为真 `<button>` + i18n `aria-label`(中文默认"移除"/英文 "Remove",
  走 `LiquidGlassConfig locale`);受控关闭由使用方处理(onClose 后自行卸载)。

### Badge

```ts
export interface BadgeProps {
  count?: number;
  max?: number;                        // 默认 99,超出显示 `${max}+`
  dot?: boolean;
  showZero?: boolean;                  // 默认 false
  children?: React.ReactNode;          // 包裹式;无 children 时独立显示
}
```

- a11y:数字配 sr-only i18n 文案("{n} 条通知" / "{n} notifications");
  纯 dot `aria-hidden="true"`。

### Progress

```ts
export interface ProgressProps {
  value?: number;                      // 0–100,内部 clamp
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;                 // 尾部显示百分比文本
  'aria-label'?: string;
}
```

- 轨道纯 tint 凹槽,填充 `--lg-accent`;`role="progressbar"` +
  `aria-valuenow/min/max`(indeterminate 时省略 valuenow);
  indeterminate 流动动画 reduced-motion 时降级为静态。

### Spin

```ts
export interface SpinProps {
  spinning?: boolean;                  // 默认 true
  size?: 'sm' | 'md' | 'lg';
  tip?: React.ReactNode;
  children?: React.ReactNode;          // 有 children 为包裹模式 + 半透明遮罩
}
```

- **内部重构(允许)**:把 Button 的 `.lg-button__spinner` 环形样式提取为共享
  `.lg-spin__ring`,Button 内部改用;不动 Button 公共 API。顺序:先给 Button
  loading 现状补类名/结构断言(RED 保护),再重构。
- a11y:`role="status"` + `aria-live="polite"` + 默认 sr-only 文案
  ("加载中" / "Loading");遮罩层拦截交互但不抢焦点。

### Skeleton

```ts
export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect'; // 默认 'text'
  width?: number | string;
  height?: number | string;
  lines?: number;                      // 仅 text,默认 1,末行 60% 宽
  animated?: boolean;                  // 默认 true,shimmer;reduced-motion 静止
}
```

- 纯 tint 弱化底色 + shimmer 渐变动画;`aria-hidden="true"`(纯装饰,
  busy 状态由使用方声明)。

## 实现步骤

1. Button loading 保护断言 → 提取 spinner 共享样式 → Spin。
2. Tag → Badge → Progress → Skeleton(任意序,互相独立)。
3. site:新增 `site/src/demos/display.demos.tsx`,五条 ComponentDoc 进 registry。
4. 全量验证 + 提交。

## 测试要求

- Tag 关闭按钮回调与 i18n aria-label;Badge max/showZero/dot 分支与 sr-only
  文案;Progress clamp 与 aria-value* / indeterminate 分支;Spin 包裹/独立
  两模式与 role=status;Skeleton lines 渲染与 aria-hidden。
- Button 既有测试全绿且新增保护断言不删。
- site 冒烟同 M8 惯例。

## 验收标准

- [ ] 五组件 API 与定稿一致并导出;全部无 backdrop-filter(源码断言可选)。
- [ ] Button spinner 重构无回归(保护断言先 RED 后 GREEN 的记录)。
- [ ] reduced-motion 下 Progress/Skeleton/Spin 动画降级(CSS 断言)。
- [ ] site 五张新卡片 + 详情页完整,中英双语。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。

## 明确非目标

- Tag 自定义任意色值(仅预设语义色);Badge 独立数字动画;Progress 环形;
  Spin 自定义指示器;Skeleton 组合预设(头像+段落模板)。
