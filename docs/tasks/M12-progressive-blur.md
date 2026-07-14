---
status: todo
depends: [M11]
---

# M12 — 二阶段·引擎实验:渐进模糊(Progressive Blur)

> 优先于 M5 执行。三个引擎实验(M12–M14)共同纪律:全部 opt-in、内部化、
> 不改任何现有默认行为;每卡有明确退出条件,实验失败以"结论 + 复现路径"
> 收卡,不硬撑。本卡是三者中风险最低、且唯一全浏览器可用的(不依赖 SVG
> 折射),先做建立信心。

## 目标

Apple 的 progressive blur:模糊强度沿一个方向渐进衰减(顶栏下方、hero 底部
等),而非单层均匀模糊 + mask 渐隐(现 ScrollEdge 的近似)。

## 技术路线(定稿)

N 层(默认 5)绝对定位子层堆叠:第 i 层 `backdrop-filter: blur(r_i)`,半径
几何递增(如 1/2/4/8/16 × 基准);每层 `mask-image: linear-gradient` 分段
遮罩,使其只在自己的"深度带"可见,相邻带少量重叠消除跳变。

限制(卡内注释与文档如实写):每层一个合成层,只适合局部区域(顶栏/hero),
禁止整页;层间 mask 配比不当会有带状伪影;jsdom 无法验证真实渲染。

## 产出(定稿)

```ts
// src/core/progressive-blur/ProgressiveBlur.tsx —— 内部原语,不公开导出
// (完全照 ScrollEdge 先例:仅库内与 site/storybook 消费)
export interface ProgressiveBlurProps {
  direction?: 'to-top' | 'to-bottom';  // 模糊由哪一侧最强,默认 'to-bottom'
  size?: number | string;              // 作用区高度,默认 token 计算值
  maxBlur?: number;                    // 最强层半径 px,默认 16
  layers?: number;                     // 层数,默认 5(3–8 之间 clamp)
  className?: string;
}
```

- 每层 blur 半径与 mask 端点由**纯函数**计算
  (`computeBlurLayers(maxBlur, layers) → { blur, maskStart, maskEnd }[]`),
  可全量单测。
- ScrollEdge 增加 opt-in `progressive?: boolean`(内部 props,默认 false,
  现有调用零变化):开启后 overlay 渲染为 ProgressiveBlur 层组。
- 降级:`data-transparency='reduced'` / `forced-colors` 下整体退化为单层
  不透明渐变(沿用 ScrollEdge 现有降级样式);`prefers-reduced-motion`
  仅影响出现过渡。
- 消费者:site 首页 hero 底部 + Storybook 对比 story(单层 vs 3/5/8 层)。

## 测试要求(无浏览器环境的验收面)

- 纯函数:层数 clamp、半径几何单调递增、mask 端点覆盖 [0,1] 且相邻重叠、
  direction 翻转对称。
- 组件:渲染层数正确、各层 inline style 的 blur 与 mask 与纯函数一致、
  aria-hidden + pointer-events none、降级分支只渲染一层无 blur。
- ScrollEdge:progressive 关闭时 DOM 与现状完全一致(回归断言);既有
  ScrollEdge/Modal/Select 测试零改动全绿。

## 验收标准

- [ ] 纯函数 + 组件 + ScrollEdge opt-in 测试先 RED 后 GREEN。
- [ ] 不新增公共导出(src/index.ts 无变化)。
- [ ] site hero 演示 + Storybook 层数对比 story(中英文案)。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明本地目检点:3/5/8 层带状伪影对比、滚动流畅度。

## 退出条件

用户目检 5–8 层仍有不可接受的带状伪影,或滚动明显掉帧 → ScrollEdge 的
progressive 开关不合入(保留 story 级实验),结论写入完成记录。

## 明确非目标

- 公开导出 ProgressiveBlur;整页背景渐进模糊;与折射滤镜串联。
