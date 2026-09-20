# 0.0.2 第三阶段：转向桌面，动效补全，动效可打断

写于 2026-09-20，当时编号 0.0.3。前一阶段见 [`phase-2-plan.md`](phase-2-plan.md)。

> **2026-09-20 改编号。** 这份计划原本放在 `docs/roadmap/0.0.3/plan.md`，理由是它自己第 12 行写的那句「如果开工时 0.0.2 还没发，这些就并进 0.0.2」——开工了，0.0.2 仍未发布，所以并了。文件移到这里，更新日志里这些条目一直写在 0.0.2 下面，没有动过。

所有者定了三条方向，第四条交给这份文档：

1. **组件往 PC 网页端靠。** 现在的库偏手机；初心是桌面网页 UI。后续新增的组件都以桌面为先。
2. **现有组件全部有动效。**
3. **一个 bug：快速连点可拖动的选项时动画被跳过，直接闪到目标。** 不止一个组件。
4. 剩下的由这份计划补。

版本号按 [`../README.md`](../README.md) 的规则：这里没有一条会让现有代码改——修复、纯新增、新组件、新的可选策略——所以是 0.0.x。0.0.2 至今**未发布**，所以这些就是 0.0.2 的内容，号只决定写进更新日志的哪一节。

判据不变：**Apple-Style**（`~/.claude/skills/Apple-Style`），先分层再找数字；每条先写证据，再写要做什么；没有证据的只列疑点。

## 门槛

和 0.0.2 相同：`pnpm check` 全绿是提交前提；改过的组件合入前过 Apple-Style-Review；颜色只来自 token、hover 带指针门、用户偏好优先、不做 DOM 截屏、不加 `will-change`（`AGENTS.md`）。新组件另加：HIG 规则写在文档页顶、层归属写明、键盘模型有用例、四项偏好各有断言、命中区按平台（见二 A）、压在媒体上的示例过对比度用例、进 `refs.spec.ts` 的探针表。

本版新增一条：**每一个状态变化都有对应的动效用例**（见三），没有的不算完成。

---

## 一、Bug：动效不可打断（第 3 条，已复现）

### 证据（2026-09-20，真实 Chrome，`#segmented-basic`，逐帧读 `transform` 的 translate-x）

| 操作 | 逐帧位置 | 读法 |
| --- | --- | --- |
| 单击第三段 | `45, 45, 48, 55, 64, 73, 80, 85, 89, 91, 93, 93, 92, … 90` | 有滑行，弹簧过冲到 93 再落回 90。**但起点是 45**——它从半路开始，见下 |
| 第三段滑到一半（`73, 80`）时点第一段 | `90, 90, 84, 69, 51, 34, 20, 9, 2, −2, −5, … 0` | 前两帧是 **90**：上一段滑行在一帧内被拉到终点，第二段才从 90 出发。快速连点时每一下都这么闪 |
| 滑到一半（`85, 89`）时只按下不松手 | `0, 0, 0, 0, 0, 0` | 光按下，透镜就**瞬移到手指底下**，没有任何过渡 |
| 文档站左栏（`TabBar` 侧边栏形态），滑行中点另一项 | `138, 129, 106, …` | 同一件事，纵向 |

### 根因

`pull.ts:118`：`pointerdown` 一发生就给透镜盖 `data-pulling="true"`，而 `components.css:192` 在这个属性下把 `transition` 换成只剩 `width` 和 `box-shadow`——**正在进行的 `transform` 过渡被取消，元素跳到终值**。这是第二行那个「前两帧 90」。

同一帧里 `tick()` 已经在跑：`dx = 指针 − 透镜中心`，按在未选中段上时这个差值落在 `trackSpan` 给的自由区间内，于是 `--lg-shift-x` 直接写成整段距离，透镜瞬移到手指下（第三行）。松手时 `clear()` 删掉偏移、`click` 换槽位，两个目标在一两帧内先后到达，滑行从两者中间某处开始——这就是第一行的 45。`segmented.tsx:143` 的注释以为「只在移动时选」就避开了瞬移，但瞬移不是选择造成的，是偏移造成的。

`GlassTabs`、`TabBar`（胶囊与侧边栏两种形态）、`PageControl` 用同一套 `usePull` + `useSelectionLens`，全中。`GlassSwitch` 的旋钮同理（按下即写偏移），只是行程短看不太出来。

HIG motion：「**Let people cancel motion.** 不要让人等动画播完才能做下一件事」；Apple-Style-Review 清单的原话是「springs, **interruptible**」。可打断的意思是新输入让运动**从当前位置改道**，不是把它砍到终点再重来。

### 要做什么

1. **按下不再取消过渡。** `data-pulling` 只在指针真的移动超过阈值（≈4px）之后才盖；一次点击从头到尾不碰 `transition`。
2. **按下不再搬透镜。** 按在**未选中**项上是点击，透镜不动，松手后滑过去；只有按在**当前选中**项上（或移动超过阈值后）才进入「手指带着走」。这正是系统分段控件的行为：按住选中段滑动。
3. **滑行中开始拖动，从当前插值位置接管**，不从终点接管：读 `getComputedStyle(lens).transform` 的矩阵作为 `lensOrigin` 的起点，偏移从那里量。
4. **松手与换槽位在同一帧提交**，避免「先弹回旧槽位再改道」的中间目标。
5. 所有用 `useSelectionLens` 的控件与开关一并修——修在 `pull.ts` / `useSelectionLens` 这一层，不逐个组件打补丁。

> 第 4 条**最后没有做，也不需要做**：按下不再写偏移之后，松手时就没有「弹回旧槽位」这个中间目标了，`clear()` 删的是一个从来没写过的值。

### 已完成（2026-09-20，第 1 周）

`tests/browser/interruptible.spec.ts`，8 条，全部先写成红的再修。落点全在 `pull.ts` 一层：

- `pointerdown` 不再盖 `data-pulling`、不再写任何偏移，直到指针移动超过 `THRESHOLD = 4`。
- 新增 `grab?: (event) => boolean`，由控件说明「这次按下算不算抓住了它」。三个透镜控件都要求 press 落在当前选中项上。
- 接管的那一帧在盖属性的前后各量一次位置，把差值当成起始偏移交回去（`takeOver`）——元素从它看起来所在的位置继续。
- 识别阈值吃掉的那几像素在 `CATCH_UP = 50ms` 内还清，既不留永久滞后也不在一帧里跳完。

顺带修掉 `rubber()` 在 `limit: 0`（页码点）时算出 `NaN` 写进 CSS。

两处既有用例跟着改，都是因为它们从**未选中**的分段起手——而「按下不属于自己的那一项，胶囊就飞过来」正是这次要删掉的行为：`gesture.spec.ts` 的「1:1 跟手」和「顺着走几乎不变形」现在先点选再拖。前者的 2px 容差**一个字没改**，因为还清机制把阈值的代价抹平了。

**还差一口气**：改道之后弹簧从零速度重新起步——位置连续，速度不连续。真正的速度接管要把透镜的位移换成 JS 弹簧，不在这一周。

### 守住它的用例（`tests/browser/interruptible.spec.ts`）

两种量法，有意分开。**过渡这一层是精确的**：直接读 `getAnimations()` 里那条 `transform` 过渡的 `currentTime`——被取消的过渡会从列表里消失，而这正是要排除的事件，所以不依赖抓住某一帧。**逐帧那一层是读者的原话**，用像素说：连点两下，全程相邻帧的最大步长不得超过**同一个控件自己跑一次完整滑行**的最高速度（自校准，不是拍一个数）。

计划里写的是「按下未选中项 6 帧内位置不变」；实际写成了 12 帧内位移 < 2px，并另加一条——按下未选中项**再拖动**时，胶囊必须留在选中项上而不是被带走。后面这条是撤掉 `grab` 之后唯一会红的用例：前七条在没有 `grab` 的情况下全绿，因为阈值本身已经挡掉了静止按下的瞬移。**没有它，`grab` 就是一段没有证据的代码。**

---

## 二、转向桌面（第 1 条）

### 现状证据

库里按 iPhone 写的地方，逐条：

| 位置 | 现在 | HIG 在 macOS 上怎么说 |
| --- | --- | --- |
| 密度 `comfortable` 默认 44px 控件高、命中区 44 | 触摸的数 | macOS 的按钮是 regular 22pt / small 19 / mini 16；pointing-devices：「只在带来价值时才区分指针与手指」——细指针下把每个控件撑到 44 是把桌面界面画成了手机界面 |
| 字号：body 17 / subhead 15 / footnote 13 | iOS 表 | typography「macOS built-in text styles」：**body 13 / 16**、headline 13 bold、title2 17、largeTitle 26。macOS 不支持 Dynamic Type |
| `GlassSheet` 是底部面板、可拖停靠 | iPhone 的 sheet | sheets · macOS：「悬浮在父窗口之上的卡片，父窗口压暗，**从窗口顶部落下**」，没有停靠点、不拖 |
| `GlassActionSheet` | iPhone 专属形态 | action-sheets 只列 iOS / iPadOS / tvOS / watchOS；桌面用 popover 或 alert |
| `TabBar` 胶囊、`PageControl`、`Banner`、`NavigationStack`、上滑关闭 | iOS 惯用语 | 桌面对应物是侧边栏、分栏、面板、菜单栏。`TabBar` 已在 ≥1024 变侧边栏，其余没有桌面形态 |
| 键盘快捷键 | `Kbd` 只**显示**，没有绑定机制；菜单项不显示快捷键 | the-menu-bar：「支持标准菜单项定义的快捷键」「命令要列进菜单栏，这样才能给它们分配快捷键」 |
| 工具栏 | 窄时溢出 | toolbars：「系统在 macOS / iPadOS 上会自动加溢出菜单」 |
| 复选框、单选按钮 | 没有 | toggles · macOS：「除了开关，macOS 支持复选框样式，并定义了单选按钮」 |

### A. 桌面度量（第 4 周）

`GlassProvider` 新增策略 `platform?: 'auto' | 'desktop' | 'touch'`，默认 `auto` = `(pointer: fine)` 且尺寸类别 regular。它决定：

- **控件度量**：`densityTokens` 加一套 `desktop`（regular 22 / small 19 / mini 16，间距按 4pt 网格），`--lg-control-height` 随之；命中区下限从 44 改为 **24**（WCAG 2.2 的指针下限）并保留触摸下的 44。
- **文字表**：`--lg-text-*` 加 macOS 那套 11 档，`Text` 不改 API。
- **材质响应**：motion 页原文「Liquid Glass 对直接触摸的响应更强调，用触控板时更收敛」——`--lg-press-scale`、`usePull` 的 `stretch`、光晕强度按平台分档。
- `data-lg-platform` 写到 `<html>`，样式表用它选规则，和主题、偏好同一套机制（0.0.2 刚为偏好铺好的路）。

**这会改变桌面上的默认外观**，但不改任何调用方代码。0.0.2 没发，正是改默认值的时候。矩阵加两行：`desktop` × 浅深。

### B. 桌面组件（第 5–8 周，按价值排序）

| 组件 | 为什么是它 | HIG |
| --- | --- | --- |
| `Checkbox`（含 mixed）、`RadioGroup` | 表单的基础件，桌面没有它们等于没有表单；`Form` 已就位 | toggles · macOS |
| `useShortcut` + `GlassMenuItem.shortcut` | 快捷键从「能显示」变成「能用」；菜单项右侧显示 `Kbd`；冲突与作用域（对话框打开时外层失效）有规则 | keyboards「Standard keyboard shortcuts」 |
| `MenuBar` | 桌面应用的命令面；已有 `GlassMenu` 的键盘模型，缺的是横向一排、悬停时在已打开的菜单间滑动、⌥ 显示替代项 | the-menu-bar |
| `CommandPalette`（⌘K） | 桌面网页的通用惯用语；文档站 `search.tsx` 已经是一个，抽成组件而不是让每个应用重写。a11y 模型是 combobox + listbox 的虚拟焦点——正是 0.4.0 判「Combobox 做半截比不做差」的那一套，**做完这个就顺手有了 Combobox 的骨架** | searching |
| `PathBar`（面包屑） | 0.4.0 顺延项；桌面导航层级的标准表示 | path-controls |
| `GroupBox` | 0.4.0 顺延项（`Box`） | boxes |
| `Panel`（浮动面板） | 「悬浮在其他窗口之上的补充控件」，有标题栏可拖、非模态、可收起；`Inspector` 可以住进去 | panels |
| `GlassSheet` 的桌面形态 | 同一个 API，在 `desktop` 下从容器顶部落下、居中、不可拖、父级压暗；停靠点无效 | sheets · macOS |
| `GlassToolbar` 溢出菜单 | 量宽度，放不下的项自动进「更多」；不让调用方手动做 | toolbars |
| `OutlineView`（树） | 0.4.0 记为「值得单独一期」；桌面方向下它就是那一期。`role="tree"` 的键盘模型：← → 折叠展开、↑ ↓ 行、Home/End、打字跳转；第一列露层级 | outline-views |

**明确仍不做**：表格（体量是整个库一半）、日期选择（原生更诚实）。`Combobox` 从「不做」改为「`CommandPalette` 之后评估」——理由变了：桌面方向下它是最常被要的控件，而 palette 已经付掉了那套 a11y 模型的成本。

### C. 已有组件的桌面行为（穿插在各周）

- 列表行与侧边栏行：悬停显示行内操作、双击打开、打字跳转（菜单已有）。
- 分栏视图：侧栏折叠/展开有动画，检查器切换有动画；分隔线双击复位宽度。
- 溢出的文字带 `title` 提示。
- 文档站首页加一个**桌面组合演示**：菜单栏 + 工具栏 + 分栏 + 检查器 + 面板拼成一个窗口——库最想证明的东西现在没有一页在证明。

---

## 三、动效补全（第 2 条）

### 现状证据

用脚本按类名前缀数 `components.css` 里带 `transition` / `animation` 的规则（粗略，只看前缀，`switch-track` 这类子元素没算进去）：`badge` 0、`color-well` 0、`card` 0、`sidebar` 0、`toolbar` 0、`inspector` 0、`split` 0、`page-control` 0、`tooltip` 1、`toast` 1、`banner` 1（只有进场）。这不是清单，是**说明需要一份清单**。

读代码确认的缺口：

| 组件 | 缺什么 | HIG / 清单 |
| --- | --- | --- |
| `Toast`、`Banner` | 有进场，**没有退场**——一帧消失 | 「materialize, not fade」：来去都要有 |
| `GlassBadge` | 数字变化直接换 | 数值变化要能看出来变了 |
| `SplitView`、`Inspector` | 侧栏折叠、检查器显隐无过渡 | 布局变化用动效解释「东西去哪了」 |
| `ColorWell` | 选中环直接出现 | 选择态变化 |
| `GlassMenuButton`、`GlassPopover` | 出现是缩放淡入，**不是从触发它的控件长出来** | 「menus / sheets / dialogs **morph out of the control** that opened them」——0.3.0 把它排在菜单结构定稿之后，但 morph 本身不依赖子菜单，可以先做单层 |
| `Sidebar` 行、`ListRow` | 悬停/按下有底色过渡，无按压形变 | 「press state on every button」 |
| `GlassTabs` 面板切换 | 只有进场淡入 | 进出成对 |
| 所有透镜控件 | 不可打断（见一） | 「interruptible」 |

### 方法：先量，再补

第 1 周做一个 `tests/browser/motion-inventory.spec.ts`（`pnpm test:motion`，产出 `reports/motion.json`，不进 `pnpm check`）：对每个组件页，逐个触发它的状态变化——按下、悬停、聚焦、打开、关闭、选中、切换值、展开、数量变化、布局切换——在变化后的一帧读 `element.getAnimations()`（含过渡），**有状态变化而没有动画的就是一条发现**。它和 440 格矩阵是同一种东西：机器负责问「有没有」，人负责看「好不好」。

补完之后每一条变成 `pnpm check` 里的一条具名用例。同时守住反面：`prefers-reduced-motion` 与 `motion="reduced"` 下这些动画**全部**归零（0.0.2 刚修好的属性路径正好用上）。

### 动效的统一口径

- 只动 `transform` / `opacity`（布局类除外，用 `interpolate-size` 那条路）；弹簧用 token 里的 `--lg-spring*`。
- 成对：有进必有出。
- 可打断：新输入改道，不砍到终点。
- 触摸比指针强调（motion 页原文），按平台分档。

---

## 四、剩下的（第 4 条）

### 排期

| 周 | 库 | 站点与验证 |
| --- | --- | --- |
| 1 | 一：可打断（`pull.ts` / `useSelectionLens` 一层修完五个控件） | `interruptible.spec.ts`；`motion-inventory` 脚本跑第一轮 |
| 2 | 三：退场（toast / banner / tabs 面板）、徽标数字、分栏与检查器 | 每条一个具名用例 |
| 3 | 三：morph（菜单按钮、气泡、右键菜单从触发点长出）、行按压、颜色井 | 减少动效反向断言；`motion.json` 清零 |
| 4 | 二 A：`platform` 策略、桌面度量与文字表、命中区按平台 | 矩阵加 desktop 行；对比度用例在 13px 正文上重跑 |
| 5 | `Checkbox`、`RadioGroup`、`useShortcut` + 菜单快捷键 | 三个组件页 |
| 6 | `MenuBar`、`CommandPalette` | 站点 ⌘K 改用库组件 |
| 7 | `PathBar`、`GroupBox`、`Panel`、`GlassSheet` 桌面形态、工具栏溢出 | 首页桌面组合演示 |
| 8 | `OutlineView`；全库 Apple-Style-Review 复审（桌面度量下重看一遍）；发布 | `reports/hig-review.md` 新一节；发版清单 |

### 顺延与不变的

- 工具栏 roving focus 进分段控件：仍在 0.3.0（改既有键盘行为）。`suspicions.spec.ts` 那条反向断言不动。
- `GlassSlider` 双滑块：仍在 0.4.0。
- 人做的事不变：VoiceOver 走查（R1）、iPhone 实机、**Windows Chrome**——转向桌面之后这一条从「有机器再说」变成**发版门槛**：Windows 上的经典滚动条（0.0.2 的 P7）、Segoe UI 下 13px 正文的可读性、关硬件加速的 `backdrop-filter`，三样都只在 Windows 上能看。
- 性能预算：桌面组合里玻璃面会多（菜单栏 + 工具栏 + 面板 + 检查器同屏），`measure-performance.mjs` 在首页桌面演示上再量一次，≤20 个折射面的预算写进指南。

### 疑点（有人看见但没量，不排期）

- 深色下透镜的行进高光在侧边栏纵向形态里是否还对着指针方向——只在浅色量过。
- `Tooltip` 600ms 延迟在指针平台是否偏长（macOS 系统约 1s 但同组内后续为 0）。
- `TabBar` 胶囊形态在桌面浏览器 < 1024 宽的窗口里出现，是否应该在 `desktop` 下改为顶部标签而不是底部胶囊。
