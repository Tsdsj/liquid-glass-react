---
status: done
depends: [M6d]
---

# M6e — 容器内文字被遮挡 / 字形缺角修复

## 现象(用户报告,2026-07-14)

部分容器内的文字显示异常:整段被遮挡,或单个字形缺一个角。

## 执行前提

- 仅当 `M6d` 为 `status: done` 后开始(F1 染色层修复会改变叠层观感,
  必须先落地,避免两个视觉问题互相干扰定位)。
- **先复现、后归因、再修复**:必须先在本地浏览器按下方矩阵复现并把截图/
  场景清单记入本卡完成记录,禁止未复现就改代码。服务器环境只能做源码级
  断言,视觉判定一律以本地浏览器为准。
- 遵守 `AGENTS.md`。本卡涉及的两条规则是 `docs/glass-engine.md` 定稿内容
  (§2.3 `.lg-surface__content` 的 `border-radius: inherit`、§9.3
  `contain: layout paint`),按 AGENTS §10 不改规范文件,以本卡定义为实现
  依据,并在卡底"规范矛盾记录"注明偏离及理由。

## 复现矩阵(第一步,结果记入完成记录)

- 组件:Toast(pill,`--lg-radius-full`,首要嫌疑)、Button sm/md(含 pill
  形)、Modal 关闭按钮、Select 选项与面板首尾行、Modal 标题/正文首尾行。
- 变量:亮/暗主题 × 折射 on/off(Chromium 与 Firefox 各跑一遍)×
  浏览器缩放 100% / 125% / 150%(非整数 DPR 会放大圆角裁剪与亚像素问题)。
- 区分两种症状分别记录:
  A. **字形缺角**(单字符角部被切,多出现在行首/行尾/行高很紧处);
  B. **文字被遮挡**(整行变糊或被覆盖,多出现在可滚动区域上下边缘)。

## 假设清单(按嫌疑度排序,逐条证实/证伪)

### H1(症状 A 首要嫌疑)`.lg-surface__content` 的圆角 paint 裁剪

`glass-surface.css`:

```css
.lg-surface__content { contain: layout paint; border-radius: inherit; }
```

`contain: paint` 将子孙绘制**沿元素自身圆角**裁剪到 padding edge;而
content 盒位于宿主 padding 之内、比宿主小一圈,却继承了宿主的完整圆角。
宿主圆角越大、内边距越小,圆角裁剪就越咬进内容——pill 形(Toast、胶囊
Button)最严重:行首/行尾字形的角会被弧线切掉;行高紧凑时 descender/
ascender 也可能被上下边裁掉。这与"字体缺少一个角"高度吻合。

**修复方向(证实后按顺序取最小方案)**:

1. 移除 content 的 `border-radius: inherit`(改为直角裁剪)。视觉圆角本就
   由宿主的 backdrop-filter/::before/::after 承担,content 直角裁剪只在
   "内容真的顶满到圆角区域"时才可能露出角落,而这被组件 padding 天然避免。
2. 若 1 在某组件仍裁字(descender 溢出 content 盒),该组件调整行高/内边距,
   不放宽 containment。
3. 仅当 1+2 仍不成立时才考虑 `contain: layout paint` → `contain: layout`,
   此为最后手段,必须在规范矛盾记录中写明性能权衡(§9.3 的目的与替代)。

### H2(症状 B 首要嫌疑)scroll-edge overlay 在小面板上遮挡首尾行

M6c 的 overlay 高 `--lg-scroll-edge-size`(32px)带 blur:在高度较小的
Select 面板/Modal 上,32px 可能盖住整整一行选项文字,读感是"文字被糊掉/
遮挡"。按 HIG 该效果本意是遮蔽**滚出边缘**的内容,不应显著侵入可读区。

**修复方向**:overlay 高度对视口钳制,如
`height: min(var(--lg-scroll-edge-size), 25%)`(以 `.lg-scroll-edge` 为
定位父级,百分比可用);并复查 mask 衰减曲线,确保 50% 高度处模糊已基本
衰减。token 语义不变,只加钳制。

### H3(症状 A 放大器)非整数缩放下的亚像素圆角

100% 下勉强擦边的圆角裁剪,在 125%/150% 缩放会因取整进一步咬字。不单独
修,作为 H1 修复的验证维度(修复后三档缩放都必须干净)。

### H4(排除项)`::after` 高光/描边层压字

`.lg-surface__content` 有 `z-index: 1`,`::after` 为 auto,内容应在其上;
若复现发现某容器文字被高光层压住,先查该容器是否意外创建了新层叠上下文,
再对症处理。预期此项证伪,记录即可。

## 测试要求

- H1:源码断言 `.lg-surface__content` 块不再含 `border-radius: inherit`
  (或按最终方案断言其最终形态);受影响组件若调整行高/内边距,补对应快照
  或样式断言。
- H2:`ScrollEdge` 行为测试——overlay 高度表达式含钳制;小视口(mock 尺寸)
  下 overlay 不超过视口的既定比例。
- 复现矩阵的结论(含证伪项)全部写入完成记录;修复前后对照截图存
  `docs/assets/`(不入 npm 包,仅仓库留档)。
- 既有测试(154+)全部保持通过,不降低断言强度;视觉基线若因染色/裁剪变化
  需要更新,单独 commit 并在信息中说明原因。

## 验收标准

- [ ] 复现矩阵完成,两类症状各至少一个可复现场景被记录并归因。
- [ ] 修复后:矩阵内所有组件 × 主题 × 折射 × 三档缩放,无字形缺角、
      无非预期文字遮挡(本地浏览器人工确认,记录在完成记录)。
- [ ] Toast pill 与胶囊 Button 的行首/行尾字形完整。
- [ ] Select 小面板打开时首行选项文字清晰可读,overlay 只影响贴边内容。
- [ ] 玻璃圆角外观(宿主染色/高光/折射的圆角)无回归。
- [ ] 规范矛盾记录完整(§2.3/§9.3 的偏离点、理由、性能影响评估)。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过。

## 明确非目标

- 更换字体或全局排版调整。
- 放弃 paint containment 之外的性能规则(filter 复用、嵌套禁用等不动)。
- 重做 scroll-edge 的渐进模糊实现(只做尺寸钳制与衰减曲线微调)。

## 复现与流程记录（2026-07-14）

**环境限制**：本会话服务器环境无法渲染任何页面——Playwright 的 Chromium 二进制在
（`~/.cache/ms-playwright/chromium-1228`），但缺系统库 `libatk-1.0.so.0` 等 GTK 依赖，
且无免密 sudo、无法 `playwright install-deps`。因此本卡要求的「本地浏览器按矩阵复现 +
截图」这一步在本会话**无法执行**，`docs/assets/` 对照截图未产出。

**决策**：已就此询问用户，用户明确授权（选项「授权我按源码推理直接修」）按 CSS 语义 +
代码几何做源码级归因并落地最小修复，视觉判定改为**待用户本地目检**。此授权覆盖本卡
「先复现后改」的硬约束，记录在案。

## 假设结论

- **H1（症状 A 字形缺角）— 证实（源码级）并已修**。机制确定性成立：`contain: paint`
  会把子孙绘制**沿元素自身 `border-radius` 裁剪**；`.lg-surface__content` 位于宿主
  padding 内、比宿主小一圈，却 `border-radius: inherit` 拿到宿主完整圆角，pill 宿主
  （Toast `--lg-radius-full`、胶囊 Button）上内容盒即成胶囊，其圆角弧线咬掉行首/行尾
  字形的角。**修复**：移除 `.lg-surface__content` 的 `border-radius: inherit`（改矩形
  paint 裁剪），保留 `contain: layout paint`；视觉圆角本就由宿主 `::before`/`::after`/
  backdrop-filter 承担，矩形裁剪落在宿主 padding 之内、不接触圆角边，故不露直角。
- **H2（症状 B 文字被遮挡）— 证实（几何级）并已修**。overlay 固定高 `--lg-scroll-edge-size`
  (32px)，小面板上足以盖住整行。**修复**：`height: min(var(--lg-scroll-edge-size), 25%)`
  钳制（以 `.lg-scroll-edge` 为定位父级，百分比相对视口高）；并把 mask/tint 衰减止点从
  `transparent` 提前到 `transparent 60%`，使模糊在 60% 高度前基本衰减、内侧半区清晰。
- **H3（非整数缩放放大器）— 待本地目检**。不单独修，作为 H1 的验证维度：修复后
  100%/125%/150% 三档都应无咬字（本会话无法渲染，留待本地确认）。
- **H4（`::after` 压字）— 证伪（源码级）**。`.lg-surface__content` 为 `z-index: 1`，
  `::after` 为 auto，内容恒在高光层之上；未发现异常层叠上下文，无需改动。

## 规范矛盾记录

- `docs/glass-engine.md` §2.3 定稿骨架里 `.lg-surface__content { border-radius: inherit; }`。
  本卡 H1 移除该声明，**偏离该规范**。理由：它是 §9.3 `contain: paint` 圆角裁剪咬字的
  直接成因；圆角观感由宿主层承担，content 无需自带圆角。**性能影响**：§9.3 的
  `contain: layout paint` **完整保留**（仅去掉圆角，未放宽 containment），布局/绘制隔离
  与 filter 复用等性能规则不受影响。按 AGENTS §10 未改规范文件，以本卡为实现依据。

## 完成记录（2026-07-14）

测试先行（源码断言，RED→GREEN）：

- `src/core/GlassSurface/glass-surface.css`：`.lg-surface__content` 去掉
  `border-radius: inherit`，保留 `contain: layout paint`（附注释说明）。
- `src/core/scroll-edge/scroll-edge.css`：overlay `height: min(var(--lg-scroll-edge-size), 25%)`；
  top/bottom 的 background 与 mask 衰减止点改 `transparent 60%`。
- `src/styles/css-source-invariants.test.ts`：新增 H1 断言（content 块保留
  `contain: layout paint`、不含 `border-radius: inherit`）与 H2 断言（overlay height
  含 `min(var(--lg-scroll-edge-size)` 钳制）。修复前两断言均失败。

验证结果：`pnpm typecheck && pnpm build && pnpm test` 通过（163 tests，新增 4 条）。
注：`Modal > keeps Tab focus inside the dialog` 为既有偶发焦点测试（与本卡无关，本卡仅改
CSS + 测试文件，jsdom 不加载组件 CSS、焦点陷阱为 floating-ui JS 逻辑；多次重跑可复现其
间歇性通过/失败）。

**待本地目检 / 补做（本会话无浏览器）**：
1. 按复现矩阵（组件 × 亮暗 × 折射 × 100/125/150% × Chromium/Firefox）目检修复后无字形
   缺角、无非预期遮挡，Toast/胶囊 Button 行首尾字形完整、Select 小面板首行清晰。
2. 修复前后对照截图存 `docs/assets/`（仓库留档）。
3. Playwright 视觉基线：M6d 染色恢复 + 本卡裁剪/overlay 变化会改动渲染，`toHaveScreenshot`
   基线需在有浏览器环境重新生成，单独 commit。
