---
status: todo
depends: [M6c]
---

# M6d — 二阶段审查修复（F1 染色层失效 / F2 暗色 dim 遗漏 / F3 滚动边缘失更）

二阶段(M6a/b/c)代码审查发现的三个缺陷,均已定位到具体行,本卡只修这三处,
不做任何顺手重构。

## 执行前提

- 仅当 `M6c` 为 `status: done` 后开始(已满足)。
- 遵守根目录 `AGENTS.md`。无公共 API 变更,无新 token。
- 每个修复先补能失败的回归测试,再改代码(测试先行)。

## F1(高)`--lg-surface-tint-active` 注册为非继承,染色层在现代浏览器整体失效

**位置**:`src/core/GlassSurface/glass-surface.css` 的
`@property --lg-surface-tint-active { inherits: false; ... }`。

**机制**:该属性声明在宿主 `.lg-surface` 上,消费在 `.lg-surface::before` 的
背景渐变里。注册为 `inherits: false` 后,伪元素不从宿主继承注册属性,拿到
`initial-value: transparent`——所有支持 `@property` 的浏览器(现代
Chromium/Safari/Firefox)中 tint 层变透明,hover 色调过渡同时失效。
jsdom 不渲染 CSS,现有单测无法拦截。

**修复**:`inherits: false` → `inherits: true`,与仓库既有先例
`--lg-pointer-x/y`(同为"宿主声明 + 伪元素消费 + 参与过渡")保持一致。

**回归测试**:新增/扩展源码断言测试(参照 `src/styles/concentric-radius.test.ts`
的手法):`glass-surface.css` 中每个被伪元素消费的 `@property` 块必须包含
`inherits: true`(当前应命中 `--lg-pointer-x`、`--lg-pointer-y`、
`--lg-surface-tint-active` 三个)。

**人工确认**:本地 Storybook 对照修复前后——修复前玻璃应缺少奶白/深灰染色
(若肉眼确认修复前确实丢失,请在完成记录里注明,作为该机制的实证)。

## F2(中)`--lg-dim-layer` 暗色覆盖漏了系统暗色分支

**位置**:`src/styles/themes.css`。`[data-theme='dark']` 块已有
`--lg-dim-layer: rgb(0 0 0 / 0.5)`,但 `@media (prefers-color-scheme: dark)`
的 `:root:not([data-theme])` 块没有——跟随系统暗色且未显式设主题的用户拿到
亮色的 0.35。M6b 完成记录声称"两处都改",与实际不符,完成记录一并勘误。

**修复**:在媒体查询块中补 `--lg-dim-layer: rgb(0 0 0 / 0.5);`。

**回归测试**:源码断言——`themes.css` 两个暗色块的 token 集合必须一致
(至少断言 `--lg-dim-layer` 同时出现在两个块中,值相同)。

## F3(低)useScrollEdges 感知不到"视口不变、内容变化"

**位置**:`src/core/scroll-edge/useScrollEdges.ts`。ResizeObserver 观察的是
viewport 自身盒子;当视口高度不变而**内部内容**增删(Select 打开期间 options
变化、Modal 异步加载内容)时 `scrollHeight` 变化不触发任何回调,overlay
状态陈旧到下一次 scroll/resize。M6c 验收项"内容变化重算"实际只覆盖了
"视口 resize 重算"。

**修复**(二选一,倾向前者):

1. 在既有 effect 中追加 `MutationObserver`(`childList: true, subtree: true`),
   回调走同一个 `scheduleMeasure`(rAF 合并),卸载时 `disconnect`。
2. `useScrollEdges(ref, contentKey)` 增加内部重测依赖,由 `ScrollEdge` 传
   `children`;hook 为内部 API,允许改签名。

**回归测试**:jsdom 中 mock `scrollHeight/clientHeight/scrollTop` getter——
打开状态下向已渲染列表追加子节点(或改变 mock 值并触发 mutation),断言
`data-edge-*` 在一个 rAF 内更新;卸载后 observer 断开、无泄漏。

## 验收标准

- [ ] 三个修复各自带有能在修复前失败的回归测试(F1/F2 为源码断言,F3 为行为测试)。
- [ ] `@property` 源码断言测试覆盖三个注册属性。
- [ ] M6b 完成记录中"暗色两处"的表述已勘误(仅改完成记录,不动卡片正文)。
- [ ] 既有 154 个测试全部保持通过,不降低任何断言强度。
- [ ] 首帧门控、按压折射、滚动边缘的既有行为无回归。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过。
- [ ] 完成记录注明:F1 无法在服务器端像素验证,需本地 Storybook 目检
      (玻璃染色恢复、hover 色调平滑过渡)。

## 明确非目标

- 键盘激活(Enter/Space)触发按压折射增强(审查中的观察项,另行立卡)。
- 删除根目录游离的 `package-lock.json`(与本卡无关,由用户决定)。
