---
status: done
depends: [M6e]
---

# M6f — 一阶段收尾:整体审计遗留项与 Apple 动效对齐

收尾审计(2026-07-15,核对 M6a–M6e 全部落地代码 + Apple 官方 Liquid Glass /
Adopting Liquid Glass / HIG Materials)确认三个可在无浏览器环境下安全落地的
改进,均有明确机制依据,不做凭感觉的视觉参数调整。

## 1. Tooltip 仍在祖先上做 opacity 淡入(一阶段根因的最后残留)

`.lg-tooltip`(玻璃面板的祖先)opacity 0→1 淡入。祖先 opacity < 1 形成
backdrop root,淡入全程内部 GlassSurface 的 backdrop-filter(fallback blur
16px)采样不到页面,动画结束瞬间模糊突现——与 19d1ace 修复的 Popover 同类
根因,当时因 Tooltip 底色近不透明(`--lg-text` 85%)症状轻微而未纳入。
收尾统一清理:

- opacity 淡入移到 `.lg-tooltip__panel`(玻璃自身)与 `.lg-tooltip__arrow`;
  `.lg-tooltip` 只保留 transform 动画。
- Tooltip `refraction="off"`、无 feImage,无需 0.01 预热,基础 opacity 用 0。
- reduced-motion 语义不变(transform 关、仅淡入)。

## 2. 键盘激活无按压反馈(M6d 遗留观察项,Apple 交互一致性)

指针按压有缩放/tint/折射增强,键盘 Space/Enter 激活完全无反馈,违背
"controls come to life when a person interacts with them" 的一致性。
GlassSurface(interactive)增加键盘按压等价:

- keydown(Space/Enter,`!event.repeat`,且 `event.target === currentTarget`
  ——防止玻璃容器内嵌套输入框打空格误触)→ 设 `data-pressed` +
  `isPressed`/`pressBoostRequested`(与 pointerdown 完全同路径);
- keyup(Space/Enter)与 blur(按压中失焦,如 Enter 触发跳转)→ 释放;
- 指针高光位置不动(键盘无坐标,维持静止位);
- 合并调用方传入的 onKeyDown/onKeyUp/onBlur,不覆盖(与 pointer 事件同约定)。

无新增 props(onKeyDown 等本就是 HTMLAttributes)。

## 3. 浮层进场使用弹性缓动(Apple "fluid" 动效)

`--lg-ease-bounce` token 已定稿并用于 Switch/Slider thumb,但浮层进场仍是
单调 `--lg-ease`,缺少官方材质"流入"的弹性感。对 Popover / Select 面板 /
Modal 面板 / Toast / Tooltip 的**进场 transform** 应用 `--lg-ease-bounce`
(scale 0.96→1 轻微过冲):

- 利用 transition 取"目标状态规则"的特性:仅在 `[data-status='open']`
  规则里声明 bounce 的 transform transition——进场弹性、退场维持原
  `--lg-ease`(Apple 退场不回弹);
- opacity 一律保持 `--lg-ease`,不参与过冲(即使参与,used value 也会被
  [0,1] 截断,但语义上分开);
- Toast 进场 keyframe 的 timing-function 改 `--lg-ease-bounce`
  (opacity 过冲被截断无害);
- 每个 reduced-motion 块补对应 open 态覆盖,保证 reduced-motion 下仍是
  纯 opacity 淡入、无弹性 transform(新增 open 态 transition 声明的
  specificity 高于媒体查询里的基础规则,必须显式镜像覆盖)。

不新增 token,不改任何时长/颜色字面量。

## 测试要求(先写、确认 RED 再改)

- `css-source-invariants.test.ts` 扩展:
  - `.lg-tooltip` 块不含 opacity 声明与 opacity transition;
    `.lg-tooltip__panel` / `.lg-tooltip__arrow` 含 opacity 淡入;
  - 五个浮层的 open 态规则 transform transition 使用 `--lg-ease-bounce`,
    对应 reduced-motion 块含镜像覆盖;
  - toast 进场 animation 使用 `--lg-ease-bounce`,reduced-motion 块回退
    `--lg-ease`。
- `GlassSurface.test.tsx` 新增键盘按压组:Space keydown → `data-pressed`
  且滤镜切到增强 id;keyup 释放;`event.repeat` 忽略;子元素触发的 keydown
  忽略;按压中 blur 释放;Enter 等价;非 interactive 不响应。
- 既有测试全部保持通过,不降低断言强度。

## 验收标准

- [ ] 上述测试全部先 RED 后 GREEN。
- [ ] Tooltip 打开/关闭行为(hover 延迟、focus、Esc)无回归。
- [ ] 键盘与指针按压走同一状态路径,降级链(fallback/reduced/嵌套)下
      键盘按压同样不触发 acquire。
- [ ] reduced-motion 下五个浮层仍为纯 opacity 淡入。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过。
- [ ] 完成记录注明:弹性动效与 Tooltip 模糊淡入需本地目检确认观感。

## 明确非目标

- 视觉 token 值调整(blur/tint/高光强度等,无浏览器不做盲调)。
- 折射贴图算法、首帧门控、scroll-edge 的任何再改动。
- M5 发布内容。

## 完成记录(2026-07-15)

测试先行:13 条新断言(css-source-invariants 11 条 + GlassSurface 键盘 2 条
失败用例组)先确认 RED,实现后全部 GREEN。

- `src/components/Tooltip/tooltip.css`:opacity 淡入从 `.lg-tooltip` 移到
  `.lg-tooltip__panel` 与 `.lg-tooltip__arrow`(基础 opacity 0,无 feImage
  无需预热);host 仅保留 transform;进场 transform 用 `--lg-ease-bounce`,
  退场回落基础 `--lg-ease`;reduced-motion 块镜像覆盖 open 态。
- `src/core/GlassSurface/GlassSurface.tsx`:interactive 表面新增键盘按压
  等价——Space/Enter keydown(`!repeat` 且 `target === currentTarget`,
  防嵌套输入误触)走与 pointerdown 相同路径(`data-pressed` + `isPressed` +
  `pressBoostRequested`);keyup 与 blur 释放;合并调用方 onKeyDown/onKeyUp/
  onBlur。指针高光维持静止位。无新增 props。
- `popover.css` / `select.css` / `modal.css`:open 态规则声明进场 transition,
  transform 用 `--lg-ease-bounce`、opacity 保持 `--lg-ease`;退场取基础规则
  的 `--lg-ease`;各 reduced-motion 块补 open 态镜像(specificity 高于媒体块
  基础规则,必须显式覆盖)。
- `toast.css`:进场 keyframe timing 改 `--lg-ease-bounce`(opacity 过冲被
  used-value 截断);reduced-motion 块补 `animation-timing-function:
  var(--lg-ease)`。
- 测试:`css-source-invariants.test.ts` 新增 Tooltip 淡入层归属、五浮层
  bounce-仅-transform、reduced-motion 镜像与 toast timing 断言;
  `GlassSurface.test.tsx` 新增键盘按压 3 组(等价路径、repeat/子元素/blur、
  非 interactive 不响应)。
- 设计钩子对 bounce easing 的提示按误报处理:`--lg-ease-bounce` 为约 6% 过冲
  的 backOut(M4 定稿 token,thumb 已用),非弹跳/弹性振荡曲线,本卡明确定义。

验证结果:`pnpm typecheck && pnpm build && pnpm test` 全部通过(177 tests,
新增 14 条,无削弱)。**待本地目检**:Tooltip 打开时模糊不再于动画结束瞬间
突现;浮层进场有轻微过冲弹性、退场平滑;键盘 Space/Enter 按压 Button 有与
指针一致的按压反馈;reduced-motion 下五浮层仍为纯淡入。
