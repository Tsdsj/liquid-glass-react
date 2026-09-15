# 测试与验收

## 命令

```bash
pnpm install
pnpm check      # typecheck → build → 单元测试 → SSR → 站点构建 → 真实 Chrome
```

拆开看：

```bash
pnpm typecheck
pnpm build          # 包产物 dist/
pnpm test           # tests/core，先编译 src/core 再跑
pnpm test:ssr       # 针对 dist/，也就是真正会发出去的那份
pnpm build:site
pnpm exec playwright install --with-deps chrome
pnpm test:chrome
```

Chrome 项目伺服的是 `site/dist`，所以跑之前站点必须先构建。也可以用 `TEST_URL` 指向一个已经部署好的地址。

```bash
# 额外的 Chromium 回归。它不能代替正式 Chrome：折射路径依赖后者。
pnpm exec playwright install chromium
pnpm test:e2e --project=chromium
```

## 各层测什么

**核心（`tests/core/`，62 项）** —— 不碰浏览器的那部分：有符号距离场的方向与中性值、非法输入的拒绝、贴图尺寸预算、LRU 的字节记账、弹簧积分器（收敛、过冲幅度、大 dt 钳制、非有限输入）、同心圆角（含掐角与喇叭口的边界）。

**SSR（`tests/ssr.test.mjs`，3 项）** —— 服务端导入不需要 DOM，多个渲染根的 id 不冲突，默认打开的对话框在服务端输出安全标记。它导入的是 `dist/`，因此测的是真正发布的产物。

**浏览器（`tests/browser/`，77 项，真实 Google Chrome）**：

| 文件 | 覆盖 |
| --- | --- |
| `catalog.spec.ts` | 每个组件页都完整、无控制台报错、代码可展开；焦点环只在键盘时出现且只有一层；深色下浮层是深色；演示链接不改路由；左栏高亮跟随 |
| `gesture.spec.ts` | 透镜在轨道内 1:1 跟手、出界才变沉；顺着走时几乎不变形；融合层交还画笔时是交叉淡出（任意时刻不透明度之和恒为一）；首帧不回弹；拖动导航链接不触发原生拖拽；共享表面上的主操作有底色；高光角度连续；浅色页面比卡片暗一档；按住不动十帧位置不变；拖动侧边栏高亮块会换页 |
| `components.spec.ts` | 各组件的语义与键盘路径 |
| `navigation.spec.ts` | 标签栏与侧边栏的变形、⌘K 搜索、跳过链接、导航栏没有自己的背景 |
| `overlays.spec.ts` | 面板停靠高度与拖拽、警告框焦点、操作表排序、撤销 |
| `scrub.spec.ts` | 三个可拖动控件的 1:1 跟随、拉伸、方向判定 |
| `a11y.spec.ts` | 四项系统设置、最大字号回流、从右到左、字号下限、表单错误关联 |
| `materials.spec.ts` | 大小玻璃的行为差异、内容层不采样背景 |
| `fusion.spec.ts` | 共享表面上的液滴融合 |
| `visual.spec.ts` | 四个宽度下的布局与截图证据 |
| `csp.spec.ts` | 限制性 CSP 下无违规、零外部请求 |

`visual.spec.ts` 内部还有 6 页面 × 4 宽度的组合。不要把内部组合数和用例数相加，那不是覆盖率。

截图是证据，不是自动通过的基线——没有人看过就不算验证过。

## 发布前还需要人做的事

| 维度 | 需要什么 | 现状 |
| --- | --- | --- |
| 浏览器矩阵 | 多个 Chrome 版本、多个操作系统、开关硬件加速 | 只在一台机器上跑过 |
| 设备 | 集显机器与 Apple 芯片机器各一台 | 未执行 |
| 显示 | 1x / 2x 像素比，浏览器与系统缩放 100% / 125% / 200% | 只覆盖了 1x 与四个视口宽度 |
| 输入 | 触摸屏实机 | 只覆盖鼠标与键盘 |
| 可读性 | 玻璃压在真实照片、视频、密集内容上的实际对比度 | **未测**。把两个色值填进对比度计算器不算数，玻璃的最终颜色取决于背后是什么 |
| 辅助技术 | VoiceOver / NVDA 的朗读顺序，语音控制的名称匹配 | **未执行**。自动化只能证明角色和键盘路径是对的 |
| 生命周期 | Strict Mode、hydration、多根 | 部分覆盖 |
| 性能 | DevTools 录制、能耗、低端设备 | 未执行 |

这些没有因为组件数量增加而放宽。状态同步记录在 `action-items.md`。
