---
status: done
depends: [M7]
---

# M8 — 二阶段·选择型控件批:Radio/RadioGroup、Segmented、Tabs

> 二阶段任务卡(M8–M14)优先于 M5 执行,M5(发布)由用户单独触发。
> 二阶段总纲:组件扩容(M8–M11)+ 玻璃引擎进阶实验(M12–M14)。

三个组件共享"roving-tabindex 键盘模型"与"滑动玻璃指示器",一次会话完成最省。
本卡同时产出内部 hook `useSlidingIndicator`,它也是 M13 morph L0 的技术打样。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md` 全部约定(五件套、size/disabled/
  受控约定、`src/styles/index.css` 追加 @import、`src/index.ts` 导出)。
- 本卡的 props 表即公共 API 定稿(AGENTS §6),不加不减。
- 服务器无浏览器:视觉与动效验证注明留用户本地目检。

## 共享内核:useSlidingIndicator(内部 hook,不公开导出)

`src/core/hooks/useSlidingIndicator.ts`:

```ts
interface SlidingIndicatorStyle { transform: string; width: string; height: string }
/** 纯函数:容器 rect + 选中项 rect → 指示器样式(便于 jsdom 直接测) */
export function computeIndicatorStyle(container: DOMRect, item: DOMRect): SlidingIndicatorStyle;
/** 测量选中项并返回应用到指示器元素的 style;resize/选中变化时重算(rAF 合并) */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  activeItemRef: RefObject<HTMLElement | null>,
): SlidingIndicatorStyle | null;
```

- 指示器移动用 CSS transition(`--lg-duration` + `--lg-ease-bounce` 对 transform,
  与浮层进场惯例一致);`prefers-reduced-motion` 下瞬移(CSS 侧处理)。
- 指示器是 GlassSurface 时,移动期间**不得触发 filter 重建**(transform 不改变
  offsetWidth/Height,天然满足;卡内测试须断言移动前后 filter registry 无新条目)。
- jsdom rect 全为 0:单测以纯函数 `computeIndicatorStyle` 为主,hook 用 mock 测量。

## API 定稿

### RadioGroup / Radio

```ts
export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;                       // 缺省用 useId
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical'; // 默认 'horizontal'
  children: React.ReactNode;           // 若干 <Radio/>
  'aria-label'?: string;
}
export interface RadioProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;          // 标签文案
}
```

- 无玻璃:圆框纯 tint(同 Checkbox"框不用 backdrop-filter"规则),选中 dot
  `--lg-accent`;隐藏原生 `input[type=radio]` 复用 Checkbox 的视觉层模式。
- Context 下发 value/name/size/disabled/onChange。
- a11y:group `role="radiogroup"`;箭头键(横向左右、纵向上下,循环)移动并
  **选中**(roving tabindex,Tab 只停当前项);disabled 项跳过。

### Segmented

```ts
export interface SegmentedOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}
export interface SegmentedProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;               // 缺省取第一个可用项
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;                     // 撑满容器宽
  disabled?: boolean;
  'aria-label'?: string;
}
```

- 语义即单选:`role="radiogroup"` + 每项 `role="radio"` + `aria-checked`,
  键盘同 RadioGroup(箭头移动即选中)。
- 玻璃:轨道纯 tint 凹槽;滑动 thumb = GlassSurface `interactive`
  (refraction 交给引擎自动判定),由 `useSlidingIndicator` 驱动。

### Tabs

```ts
export interface TabItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
  content?: React.ReactNode;
}
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;               // 缺省取第一个可用项
  onChange?: (key: string) => void;
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}
```

- 玻璃:tab list 轨道纯 tint,活动指示器同 Segmented(共享 hook);
  **tabpanel 不用玻璃**(内容层)。
- a11y:`role="tablist"/"tab"/"tabpanel"`,`aria-selected`/`aria-controls`/
  `aria-labelledby`;左右箭头 + Home/End,**自动激活**(focus 即选中);
  未选中 panel 不渲染 DOM(同浮层"不 keepMounted"惯例)。
- 与 Segmented 的关系:视觉近似、语义不同(Tabs 切面板),共享指示器 hook,
  互不包装。

## 实现步骤

1. `useSlidingIndicator`(纯函数 + hook)+ 单测(RED→GREEN)。
2. RadioGroup/Radio → Segmented → Tabs,逐个走 component-guide checklist。
3. site:`site/src/demos/navigation.demos.tsx` 新增三条 ComponentDoc 进
   registry(演示 + API 表,中英文案);总览计数相关文案同步。
4. 全量验证 + 提交(可多提交,一组件一提交)。

## 测试要求

- 受控/非受控双模式;全部键盘路径逐键断言(焦点位置 + aria 状态);
  disabled 项跳过;Tabs 未选中 panel 不在 DOM;i18n(如有内置文案)。
- 指示器:纯函数数值断言;选中切换后 filter registry 无新增条目。
- site 冒烟:App.test 增加新组件卡片与详情页可渲染断言。

## 验收标准

- [ ] 三组件 API 与本卡定稿一致,`src/index.ts` 导出组件 + Props 类型。
- [ ] 键盘走查断言全绿;roving tabindex 正确(Tab 只停一次)。
- [ ] 指示器移动不触发滤镜重建(测试证明)。
- [ ] site 总览出现三张新卡片,详情页演示与 API 表完整,中英双语。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:指示器动效与玻璃观感留本地目检。

## 明确非目标

- Tabs 的可关闭页签/新增按钮/超宽滚动;Segmented 图标模式;Radio 按钮组样式。
- `useSlidingIndicator` 公开导出。

## 完成记录

- 共享内核 `src/core/hooks/useSlidingIndicator.{ts,test.tsx}`:纯函数 `computeIndicatorStyle`
  + rAF 合并的测量 hook(内部,未导出)。
- `src/components/RadioGroup/`(RadioGroup + Radio + Context):role=radiogroup、隐藏原生
  radio 复用 Checkbox 视觉层、方向键循环选中、roving tabindex(选中项或首个可用项为 tab 停点)、
  disabled 跳过、横纵向。
- `src/components/Segmented/`:role=radiogroup + role=radio 项,滑动 thumb = GlassSurface
  `interactive`(pointer-events:none,由 `useSlidingIndicator` 驱动),轨道纯 tint;block/size。
- `src/components/Tabs/`:tablist/tab/tabpanel,左右方向键 + Home/End 自动激活,未选中面板不入
  DOM,活动指示器为滑动玻璃 pill(同 Segmented,共享 hook)。
- 三者各五件套 + `src/styles/index.css` 追加 @import;`src/index.ts` 导出组件与 Props 类型
  (RadioGroup/Radio/RadioGroupProps/RadioProps、Segmented/SegmentedProps/SegmentedOption、
  Tabs/TabsProps/TabItem)。
- site:`site/src/demos/navigation.demos.tsx` 新增三条 ComponentDoc 进 registry(演示 + API 表,
  中英双语),总览计数 12 → 15 同步;`site/src/App.test.tsx` 新增三详情页可渲染断言。
- 指示器移动不触发滤镜重建:Segmented/Tabs 测试断言选中切换前后 `filterRegistry` 快照长度不变。
- 验证:`pnpm typecheck && pnpm build && pnpm test` 全通过(28 文件 / 222 用例,存量断言不变)。
- **留本地目检**:指示器 `--lg-ease-bounce` 滑动动效、玻璃 thumb/pill 折射观感、圆点/凹槽的亮暗
  与壁纸对比(服务器无浏览器)。

