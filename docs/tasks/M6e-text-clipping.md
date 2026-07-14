---
status: todo
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
