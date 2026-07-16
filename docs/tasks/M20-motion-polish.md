---
status: done
depends: [M19]
---

# M20 — 四阶段·交互动效打磨

> 四阶段地基卡之二。把散落在各组件的交互反馈统一成一套**动效 token + GlassSurface 交互增强**,
> 让新组件挂载即吃到一致的「按压回弹 / 高光随指针 / hover 升起」质感。串行 M19→M26。

本卡：不新增组件,只**收敛动效**——把按压、悬浮、指针高光的时长/曲线/位移抽成 token,
增强 `GlassSurface` 的 `interactive` 分支,并让现有组件复用同一套(不改各组件公共 API)。

## 执行前提

- 遵守 `AGENTS.md`:所有动效参数走 token(禁止组件 CSS 写死时长/曲线);玻璃质感只经
  `GlassSurface`;`prefers-reduced-motion` 必须降级为瞬变/无位移。
- 不改任何组件公共 API;视觉/动效以本地目检为准,jsdom 只断言可测的类/属性/reduced-motion 分支。

## 设计定稿

新增/规范动效 token（`src/styles/tokens.css`,沿用 `--lg-*` 命名）:

```css
--lg-press-scale: 0.97;          /* 按压回弹的缩放目标 */
--lg-hover-lift: -1px;           /* hover 升起的 translateY */
--lg-specular-follow: 0.12;      /* 高光随指针位移的强度系数 */
--lg-duration-press: 120ms;      /* 按压反馈时长(比通用 --lg-duration 更快) */
/* 复用已有:--lg-ease、--lg-ease-bounce、--lg-duration、--lg-duration-slow */
```

`GlassSurface` `interactive` 增强（不新增 prop,增强既有 `interactive` 行为）:

- **按压回弹**:`:active` 时 `transform: scale(var(--lg-press-scale))`,松开走
  `--lg-ease-bounce` 回弹;时长 `--lg-duration-press`。
- **hover 升起**:hover 时 `translateY(var(--lg-hover-lift))` + specular 增强。
- **高光随指针**:CSS 变量 `--lg-px/--lg-py`(0–1,指针在元素内归一化位置)驱动 specular
  层渐变焦点;由内部轻量 hook（`useSpecularPointer`,内部不导出,rAF 合并,
  仅 `interactive && refraction on` 时挂载)写入。指针离开归位。
- **reduced-motion**:全部降级——无 scale/lift/位移,specular 固定,transform 瞬变。
- **变换不触发滤镜重建**:transform/scale 不改 offsetWidth/Height,天然满足;卡内测试须断言
  按压/hover 前后 filter registry 无新增条目(沿用 M8 惯例)。

## 实现步骤

1. tokens.css 增动效 token（+ themes.css 如需暗色微调）。
2. `src/core/hooks/useSpecularPointer.ts`(内部,不导出)+ 纯函数测量部分单测。
3. 增强 `GlassSurface` `interactive` CSS 分支 + 接线 hook;确保 `interactive` 为 false 时零开销。
4. 抽查现有交互组件(Button/Segmented/Card 等)复用统一动效,消除各自写死的时长/曲线
   （只改 token 引用,不改结构/API）。
5. 文档:主题指南页(M19)补一节「动效 token」;或组件文档补充说明。
6. 全量验证 + 提交。

## 测试要求

- reduced-motion 分支:mock `matchMedia('(prefers-reduced-motion: reduce)')` 断言无 transform 动效
  类/变量(或对应降级标记)。
- `useSpecularPointer` 归一化位置纯函数逐条断言(0/0.5/1 边界、越界钳制)。
- 按压/hover 前后 filter registry 快照长度不变。
- 存量组件交互测试全绿(动效收敛不改行为)。

## 验收标准

- [ ] 动效 token 就位,现有交互组件改为引用统一 token(无写死时长/曲线残留,`grep` 佐证)。
- [ ] `GlassSurface interactive` 具备按压回弹 / hover 升起 / 高光随指针,reduced-motion 全降级。
- [ ] 动效不触发滤镜重建(测试证明);`interactive=false` 时无额外监听/开销。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:动效观感(回弹曲线、高光跟随)留本地目检。

## 明确非目标

- 新增组件;新增公共 prop;基于物理的弹簧引擎;逐组件定制动效参数(只提供全局 token)。

## 完成记录

**范围校正(实现前审阅代码后的诚实修订)**:本卡起草时未细读现有实现,提出的若干项**早已在前
阶段落地**,盲目照做会是重复造轮子,故未做:

- **高光随指针**:`GlassSurface` 已内建——`--lg-pointer-x/y`(`@property` 注册 + rAF 合并的
  JS 写入)驱动 `::after` 双 radial-gradient,`data-interactive` 才挂载,reduced-motion 下
  `transition:none`。**无需**新增 `useSpecularPointer` hook(会与既有逻辑重复),故未加。
- **按压回弹缩放**:已有 `[data-interactive][data-pressed] { transform: scale(var(--lg-interaction-scale)) }`
  + reduced-motion `transform:none` + 折射 press-boost(M6a)。故**复用 `--lg-interaction-scale`**,
  未新增重复的 `--lg-press-scale` token。
- **动效已全 token 化**:`grep` 全量组件 CSS,**无写死的时长/曲线**(均走 `--lg-duration*` /
  `--lg-ease*`)。「消除写死时长/曲线」验收项**在开工前即已满足**,无需收敛。
- 未采用 `--lg-specular-follow` token(指针高光的渐变 stop 用固定 38%/48% 已够,不值得再抽象)。

**本卡真正的增量(两处 token 驱动的动效增强,均刻意用平滑 `--lg-ease` 而非 bounce,避免过时手感)**:

- **hover 升起**:新增 `--lg-hover-lift: -1px`;`.lg-surface[data-interactive]:hover` 加
  `transform: translateY(var(--lg-hover-lift))` + 阴影加深(`--lg-surface-shadow-y/blur` 提升),
  reduced-motion 块内 `transform:none` 降级。press 规则(scale)在源码顺序后、同特异性下胜出,
  故按下时缩放覆盖升起(自然:按下回落)。
- **按压/悬浮更跟手**:新增 `--lg-duration-press: 140ms`;引入 `--lg-surface-transform-duration`
  变量(基础=`--lg-duration`,`[data-interactive]` 覆盖为 `--lg-duration-press`),transform 与
  box-shadow 过渡引用它——交互面板的形变更快,非交互面板不变。
- **不触发滤镜重建**:hover 的 translateY 不改测量尺寸;新增行为测试断言 hover enter/move/leave
  前后 `filterRegistry` 快照长度不变(=1)。
- **文档**:`site/src/theming-tokens.ts` 增 `--lg-duration-press` / `--lg-hover-lift` 两条(M19 的
  drift 测试强制其与 `tokens.css` 精确一致,已同步);`createTheme` 的 `LiquidGlassThemeTokens`
  增 `durationPress`/`hoverLift` 键。
- **测试**:`css-source-invariants.test.ts` 新增 M20 三条(hover translateY、interactive 用
  press 时长、reduced-motion 取消升起,CSS 源断言);`GlassSurface.test.tsx` 增 hover 不建滤镜 1 条。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **410/410 绿**(较 M19 的 406 +4)、
  `pnpm site:build` ✓。
- **留本地目检**(服务器无浏览器):hover 升起幅度与阴影、140ms 按压跟手感、指针高光跟随。
