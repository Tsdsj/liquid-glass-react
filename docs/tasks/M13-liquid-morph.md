---
status: todo
depends: [M8, M12]
---

# M13 — 二阶段·引擎实验:液态融合 morph(分级验证)

> 优先于 M5 执行。**M4-improve 的结论(不新增不稳定的 GlassGroup 公共 API)
> 继续有效**——本卡是刻意重启的技术验证,不是翻案:所有产出均为内部工具或
> 私有 Storybook story,不新增任何公共导出。风险最高,故置于组件批之后,
> 失败只留结论、不连坐其他卡。

## 背景

Apple GlassEffectContainer:相邻玻璃靠近时形状融合、过渡时相互形变。Web 的
backdrop-filter 合成模型与此存在根本冲突,本卡按可行性分级逐级验证并落地
能落地的部分。

## 分级方案(定稿)

### L0 共享形状 + FLIP(正式落地)

同一个 GlassSurface 实体在目标位置间过渡:transform 平移缩放 + border-radius
插值,叠加"液滴进出场"(scale 0.6→1 + filter blur 4px→0 + opacity,出场反向)。
M8 的 `useSlidingIndicator` 即最小实现;本卡泛化为内部工具:

```ts
// src/core/morph/morph.ts —— 纯函数,不公开导出
export interface MorphFrame { transform: string; borderRadius: string }
export function computeMorphFrames(
  from: DOMRect, to: DOMRect,
  fromRadius: number, toRadius: number,
  steps?: number,
): MorphFrame[];

// src/core/morph/useMorphTransition.ts —— 内部 hook
// 将 frames 应用为 Web Animations / CSS transition;reduced-motion 直接跳终态
```

**关键技术点(验收项)**:过渡期间必须**锁定 filter shape**——transform 不改
offsetWidth/Height 天然满足,但过渡终点若尺寸变化,须等过渡结束后一次性
settle(复用现有 resize 防抖路径),禁止逐帧触发 filter-registry 重建
(否则逐帧重建 displacement map 必然闪烁,并与首帧 pending 门控冲突)。

### L1 SVG goo 直接作用于真玻璃 —— 预判不可行,实证后记录

理由(须在卡内以最小 story 实证并存档):goo(feGaussianBlur + feColorMatrix
alpha 对比)作用于元素**自身已合成像素**,不改变 backdrop-filter 的采样形状
(由 border-box + border-radius 决定);更致命的是祖先 `filter` 会形成
backdrop root,后代的 backdrop-filter 只能采样容器内内容——真玻璃直接失效。
这是合成模型互斥,不是调参问题。

### L1.5 过渡期 snapshot 替身(仅 Storybook 技术验证)

morph 的 ~300ms 内把两块玻璃临时替换为不透明 tint + 高光的"假玻璃"副本放入
goo 容器融合,结束后换回真玻璃。唯一验证点:切换瞬间是否肉眼可见跳变。
不进任何 API、不进 site。

### L2 逐帧重建 displacement map —— 明确不做

与 filter-registry 复用模型冲突、每帧 feImage 编码成本、Chromium-only,
一句话记录,不实验。

## 测试要求(无浏览器环境的验收面)

- `computeMorphFrames` 全量单测:平移/缩放/radius 插值数值、steps 边界、
  from==to 恒等。
- hook:reduced-motion 直接终态;过渡期间 filter registry 无新增/删除条目
  (mock 计时驱动);卸载中断动画无泄漏。
- 现有 GlassSurface / 指示器测试零改动全绿。
- L1/L1.5:各一个私有 story(`GlassMorphLab.stories.tsx`,标注内部实验),
  结论与复现路径写入完成记录。

## 验收标准

- [ ] L0 纯函数 + hook 先 RED 后 GREEN;M8 指示器可选择性迁移到该工具
      (迁移则其测试不削弱)。
- [ ] 过渡期 filter 不重建的断言通过。
- [ ] L1 不可行结论以 story 实证并写入完成记录(含机制解释)。
- [ ] L1.5 跳变结论(可行/不可行)写入完成记录。
- [ ] 不新增公共导出;site 不展示未定稿能力。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:L0 液滴动效与 L1.5 跳变由用户本地 Storybook 目检。

## 退出条件

- L0 若锁 shape 后移动仍闪烁 → 退化为纯 opacity 交叉淡化,记录结论。
- L1.5 若切换跳变明显 → goo 线路整体关闭,记录结论。
- glass-engine.md 如需增补 morph 规范,按 AGENTS §10 在卡底记录建议,
  不改规范文件。

## 明确非目标

- GlassGroup / GlassEffectContainer 式公共 API;跨两个独立 GlassSurface
  实体的真实形状融合;morph 进入任何现有组件的默认行为。
