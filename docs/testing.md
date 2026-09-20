# 测试与验收

## 命令

```bash
pnpm install
pnpm check      # typecheck → build → 单元 → SSR → 站点 → 真实 Chrome → 开发模式 → WebKit/Firefox
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
pnpm test:warnings  # 开发模式那三个文件，跑在 Vite dev server 上
pnpm exec playwright install webkit firefox
pnpm test:fallback  # 只跑退化路径那一个文件
pnpm test:matrix    # 审计扫描，不在 check 里，见下
```

Chrome 项目伺服的是 `site/dist`，所以跑之前站点必须先构建。也可以用 `TEST_URL` 指向一个已经部署好的地址。

两个测试服务器用的是 **41730（静态）与 41731（dev）**，不是 Vite 默认的 4173 / 5173，而且**不复用已有服务器**。默认端口上很可能坐着另一个项目的 dev server，而 `reuseExistingServer` 会让 Playwright 直接把它当成自己的——整套用例跑在别人的应用上，还全绿。

```bash
# 额外的 Chromium 回归。它不能代替正式 Chrome：折射路径依赖后者。
pnpm exec playwright install chromium
pnpm test:e2e --project=chromium
```

## 各层测什么

**核心（`tests/core/`，71 项）** —— 不碰浏览器的那部分：有符号距离场的方向与中性值、非法输入的拒绝、贴图尺寸预算、LRU 的字节记账、弹簧积分器（收敛、过冲幅度、大 dt 钳制、非有限输入）、同心圆角（含掐角与喇叭口的边界）。另有四项是对样式表本身的静态检查：hover 规则必须带指针门、颜色必须来自 token、不得有 will-change，以及两份「增强对比度」调色板——媒体查询那份和 `data-lg-contrast` 那份——声明逐字相同。CSS 没法让一个媒体查询和一个选择器共用声明，所以重复是有意的，这一项是让它不腐烂的那半。

**SSR（`tests/ssr.test.mjs`，3 项）** —— 服务端导入不需要 DOM，多个渲染根的 id 不冲突，默认打开的对话框在服务端输出安全标记。它导入的是 `dist/`，因此测的是真正发布的产物。

**浏览器（`tests/browser/`，307 项，真实 Google Chrome）**：

| 文件 | 覆盖 |
| --- | --- |
| `catalog.spec.ts` | 每个组件页都完整、无控制台报错、代码可展开；焦点环只有一层（按钮点击不出现，输入框任何方式聚焦都出现，但永远只画在容器上）；深色下浮层是深色；演示链接不改路由；左栏高亮跟随 |
| `gesture.spec.ts` | 透镜在轨道内 1:1 跟手、出界才变沉；顺着走时几乎不变形；融合层交还画笔时是交叉淡出（任意时刻不透明度之和恒为一）；首帧不回弹；拖动导航链接不触发原生拖拽；共享表面上的主操作有底色；高光角度连续；浅色页面比卡片暗一档；按住不动十帧位置不变；拖动侧边栏高亮块会换页；跨段那一帧透镜不出框；浮层上的控件不叠第二层玻璃 |
| `components.spec.ts` | 各组件的语义与键盘路径 |
| `navigation.spec.ts` | 标签栏与侧边栏的变形、⌘K 搜索、跳过链接、导航栏没有自己的背景 |
| `overlays.spec.ts` | 面板停靠高度与拖拽、警告框焦点、操作表排序、撤销 |
| `scrub.spec.ts` | 三个可拖动控件的 1:1 跟随、拉伸、方向判定 |
| `a11y.spec.ts` | 四项系统设置、最大字号回流、从右到左、字号下限、表单错误关联 |
| `materials.spec.ts` | 大小玻璃的行为差异、内容层不采样背景 |
| `fusion.spec.ts` | 共享表面上的液滴融合 |
| `contrast.spec.ts` | 玻璃压在真实场景上，文字对比度从合成后的像素上量，最差的一块不得低于 4.5 |
| `touch.spec.ts` | 真实 touch 事件：拖动轴的归属、手指 1:1 带动透镜、点完不留 hover、命中区 44；分段与标签以控件中心 ±21px 做命中测试，**必须命中控件本身**——接受它所在的轨道，等于在完全没有命中区时也判绿 |
| `visual.spec.ts` | 四个宽度下的布局与截图证据 |
| `csp.spec.ts` | 限制性 CSP 下无违规、零外部请求 |
| `refs.spec.ts` | 每个导出的组件都交还它渲染的那个元素，并透传 `id` / `style` / `data-*`；探针表必须覆盖整个公开面 |
| `routing.spec.ts` | 切页会设标题、把焦点移进新页面；跳过链接；更新日志页就是仓库里那个文件 |
| `docs.spec.ts` | 每页都说了该 import 什么、指向了别处、没有死链；页面印出来的尺寸就是它渲染的尺寸；浮层页都能切到照片背景；旋钮可以复位；站内没有 label 套 label；文字大小能调到 AX5 且不横向溢出；示例里的标题低于示例自己的标题；代码高亮的颜色来自 token，且显示的和复制的一致；旋钮同时改示例和代码块、旋钮面板在示例之外；⌘K 能搜到属性名、示例标题与章节并跳到位；折射开关在做得到的浏览器上真的打开折射，做不到的浏览器上禁用并说明 |
| `second-batch.spec.ts` | `Picker` 的形态随尺寸类别切换而选择不变、标签只念一遍；`ColorWell` 是真 `<input type="color">`、色值可读、快捷色有名字；`Banner` 客气播报、关闭按钮 44、上滑关闭 |
| `appearance.spec.ts` | 两种外观各自欠读者的东西：深色下的光晕强度远低于浅色、浅色没有一个满亮度纯白的表面、次级文字压在它真正所在的面板上过 4.5:1、折叠区展开有中间帧、选中胶囊与轨道的亮度差 ≥ 12/255、首页演示铺满整列、`tinted` 按钮的标签压在自己的淡底上过 4.5:1 |
| `layout-matrix.spec.ts` | 布局容器 × 四个宽度 × LTR/RTL × 默认/AX5：页面不横向滚动、容器不溢出自己、不塌成零；分栏视图在 RTL 下是镜像；AX5 下标签不被挤成一列一个字 |
| `interruptible.spec.ts` | 动效可以被打断：按下不移动透镜、不取消正在跑的过渡（直接读 `getAnimations()` 的 `currentTime`，被取消的过渡会从列表里消失）、连点两下改道而不是从终点重来（逐帧比对一次顺畅滑行自己的最高速度）、没落在胶囊上的拖动只改选中项不搬胶囊 |
| `outline.spec.ts` | 窄屏目录菜单：滚动后不被工具栏吞掉、是跳转项不是复选框、按钮名就是可见文字 |

**开发模式（`tests/browser/{warnings,strict-mode,hydration}.spec.ts`，13 项）** —— 这三件只存在于开发构建里，所以跑的是 Vite dev server 而不是 `site/dist`：三条设计规则的告警（生产构建里必须一条都没有）、Strict Mode 下闲置页面不排帧、八棵树 `renderToString` 之后 `hydrateRoot` 没有不匹配。用 `pnpm test:warnings` 跑（project 名为 `dev`）。

**跨引擎（`tests/browser/fallback.spec.ts`，WebKit 与 Firefox 各 9 项）** —— 没有 SVG 折射时剩下的东西还算不算材质：模糊、着色、边线、投影都在；布局、语义、键盘路径都不依赖折射分支；浮层没有入场动画也要能开能关；系统偏好照样生效。用 `pnpm test:fallback` 跑。

**审计矩阵（`tests/browser/matrix.spec.ts`，`pnpm test:matrix`）** —— 把上一次人眼过 27 页的全面审计变成机器跑的东西，产出 `reports/matrix.json`。

每个组件页 × 11 种变体（基线、触摸、深色、减少透明度、增强对比度、减少动效、强制颜色、RTL、AX5，外加 RTL+AX5 与深色+AX5 两个组合）。**不是**截图比对——截图只能告诉你「变了」，不能告诉你「错了」，而且每次合理的改版都会红。问的是答案与审美无关的问题：有没有横向溢出、每个目标手指够不够得着、图标按钮有没有名字、有没有文字低于 11px 的可读下限、有没有元素塌成 0、控制台有没有报错。

**为什么是单因子。** 全组合是三千多格，没人会跑，也就没人会修。所以每项设置各自对着基线变一次，另加两个真的会互相影响的组合：最大字号是压垮布局的那一项，而它在镜像之后垮的方式不一样。

它**不在 `pnpm check` 里**：慢，而且它的职责是找新东西，不是守旧东西。它找到什么，什么就变成一条有名有姓的用例进 `pnpm check`——`a11y.spec.ts` 里那条「最长的组件名在最大字号下仍然会换行」就是这么来的。

> 项目名要锚定到路径分隔符。`matrix\.spec\.ts` 没锚定的时候，`layout-matrix.spec.ts` 一建出来就被划进这个慢速项目，于是 `pnpm check` 里的每个项目都忽略它，它哪儿都不跑。**一个被静默跳过的用例比一个失败的用例更糟。**

**布局适配矩阵（`tests/browser/layout-matrix.spec.ts`）在 `pnpm check` 里**，和上面那张不同：它**断言**而不是报告。一个容器的全部工作就是把东西摆好，所以「它还放得下吗」不是对它的观察，是它的承诺。5 个容器 × 4 个宽度（390 / 767 / 768 / 1440）× LTR/RTL × 默认/AX5。

44 的规则只在触摸变体里跑，而且是**命中测试**不是量尺寸。第一版量 `getBoundingClientRect`，报了六千多条，几乎全是错的：控件常常画得比它可触区小（输入框 38px 躺在 44px 的玻璃盒里，按钮用 `::after` 撑开命中区，两者都不在元素自己的盒子里），而且 44 本来就是**手指**的要求，在指针平台上报一个 34px 的行只会把真问题埋掉。现在的做法是以控件中心取一个 42px 方块的四角，问文档那里是什么——手指问的就是这个问题，而且它不关心这块区域是怎么造出来的。

`visual.spec.ts` 内部还有 6 页面 × 4 宽度的组合。不要把内部组合数和用例数相加，那不是覆盖率。

截图是证据，不是自动通过的基线——没有人看过就不算验证过。

## 发布前还需要人做的事

| 维度 | 需要什么 | 现状 |
| --- | --- | --- |
| 浏览器矩阵 | 多个 Chrome 版本、多个操作系统、开关硬件加速 | macOS 本机与 CI 的 Ubuntu 各跑过一遍全套；Windows、多版本、关硬件加速未测 |
| 设备 | 集显机器与 Apple 芯片机器各一台 | 未执行 |
| 显示 | 1x / 2x 像素比，浏览器与系统缩放 100% / 125% / 200% | 只覆盖了 1x 与四个视口宽度 |
| 输入 | 触摸屏实机 | 已有 4 项模拟 touch 用例；**真机未试**——遮挡、甩动惯性、系统手势冲突都不是模拟能答的 |
| 可读性 | 玻璃压在真实照片、视频、密集内容上的实际对比度 | **已测**（`scripts/measure-contrast.mjs`，三引擎，从合成后的像素上量；最差一块 7.83:1）。密集文字与真实视频背景仍未覆盖 |
| 辅助技术 | VoiceOver / NVDA 的朗读顺序，语音控制的名称匹配 | **未执行**。自动化只能证明角色和键盘路径是对的 |
| 生命周期 | Strict Mode、hydration、多根 | 部分覆盖 |
| 性能 | DevTools 录制、能耗、低端设备 | 已有 `scripts/measure-performance.mjs`：11 块玻璃在 6× CPU 节流下仍满帧。**能耗与真实低端 GPU 未测**——节流不动 GPU，而模糊花的就是填充率 |

这些没有因为组件数量增加而放宽。状态同步记录在 `action-items.md`。

## CI 跑的是什么

`.github/workflows/ci.yml` 跑的就是上面这一串，一条不少，用 `--frozen-lockfile` 安装。推 `main`、开 PR、打标签时各跑一次——标签走的是同一个 job（`workflow_call` 复用，不是复制一份），所以发版的检查不可能比 PR 的松。

`scripts/check-props.mjs`（在 `pnpm build:site` 里）除了属性表，还守着三条结构规则：每页至少三个示例且恰好一个可调、`related` 不许指向不存在的页、浮层组每页至少有一个示例能在照片背景上看。它们都是**构建失败**而不是控制台告警——死链此前在浏览器里 `console.warn` 了很久，链接静默消失，两种都是不会被看见的方式。

最后两步是打包前的闸门：`pnpm verify:package` 问打包器"你到底会装哪些文件进去"，核对源码没泄漏、每个 `exports` 入口都落到真实文件、`"use client"` 还在第一行、标签号与 `package.json` 一致。发版流程见 `../RELEASING.md`。
