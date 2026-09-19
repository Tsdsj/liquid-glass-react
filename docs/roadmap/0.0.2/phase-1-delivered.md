# 0.0.2 第一阶段：已交付

> 证据写于 2026-09-16（原 `docs/roadmap-0.3.md`，标题「下一期开发计划：0.0.2 → 0.3.0」），交付于 2026-09-19。
> 这里只保留**属于 0.0.2 的那一半**；另一半在 [`../0.3.0/plan.md`](../0.3.0/plan.md)。
>
> **0.0.2 尚未发布。** `v0.0.2` 标签打过又删了，npm 上仍是 0.0.1。第二阶段见 [`phase-2-plan.md`](phase-2-plan.md)。

当时的起点：

```text
41 个组件 · 27 个文档页 · 41 个示例（内容 11 / 控件 13 / 输入 3 / 导航 7 / 浮层 7）
65 单元 · 3 SSR · 84 真实 Chrome · 16 WebKit + Firefox
公开运行时名字 69 · 一条开发模式告警（工具栏混排）
```

交付后：

```text
70 单元 · 3 SSR · 103 真实 Chrome · 10 开发模式 · 18 WebKit + Firefox
```

---

## 一、组件缺陷与 API

### A. 25 个组件不交还 `ref` ✅

当时写的是「29 个里 21 个」。实测下来数字更大：**会渲染元素的组件是 37 个，其中 25 个拿不到 `ref`**，另有 4 个纯 context 的 Provider 本来就不该有。

```text
原本有 forwardRef：GlassSurface、GlassButton、Card、MaterialView、TextField、SearchField、Sidebar、ToolbarGroup
```

后果是调用方拿不到节点：量不了尺寸、`ScrollEdge.targetRef` 指不到自己的 `List`、第三方库锚不上去。

**已完成**：每个组件都交还它渲染的那个元素。`TextField` 与 `SearchField` 的 `ref` 落在 `<input>` 上——那才是要聚焦、要读值的东西。十二个原有的 `forwardRef` 一并换成 React 19 的普通 `ref` prop：peer 只支持 19，与其再写 25 个 wrapper，不如让全库只有一种写法。

**守它的**：`site/src/pages/ref-probe.tsx` + `tests/browser/refs.spec.ts`，**运行时与类型两层都测**。类型那层不能省——JSX 展开会跳过多余属性检查，所以 `<X {...probe} />` 能编译不等于 `X` 类型上接受 `ref`。正是这一层抓出 `TabBar` 的 `ref` 落在内层 `div` 而不是 `<nav>`。

### B. 一批组件不透传 HTML 属性 ✅

`GlassProgress`、`GlassStepper`、`NavigationBar`、`ScrollEdge` 只收 `className`；`Segmented` / `Slider` / `Switch` / `Tabs` / `TabBar` 和所有浮层也是。写不了 `style`、`id`、`data-*`、`aria-describedby`。

**已完成**：统一 `extends Omit<HTMLAttributes<…>, 冲突键>`，冲突键在 `docs/api.md` 里逐个列出（`title`、`value`、`onSelect`、`htmlFor`、`open`、`defaultValue`、`onChange`）。`id` **不在**收回之列：浮层拿它当内部 `-title` / `-desc` 的前缀，所以调用方给的 id 会被用上而不是被忽略。

新增内部工具 `src/react/system/props.ts` 的 `splitSurface()`：按名字把玻璃选项和 HTML 属性分开，一处写死，而不是每个组件各自把 rest 当成其中一种。

### C. `placement` 有实现没接口 ✅

`anchor.tsx` 内部一直支持 `'below' | 'above' | 'auto'`，`GlassPopover` / `GlassMenu` 只暴露 `align`。

**已完成**：暴露出来，默认 `auto` 不变。用例 `overlays.spec.ts`「a popover opens on the side placement asks for」——它花了四次才写成不空转的：量坐标会受文档页滚动位置影响，而 Playwright 会把每个控件滚到刚好能点到的位置，两个按钮因此落在不同高度，`auto` 正好各自猜对。现在在页面里派发点击并读锚定代码自己记下的 `--lg-origin-y`，去掉 `placement` 就会失败。

### H. 三条开发模式告警 ✅

审查里靠人眼查的规则，改成代码守：同一表面上两个 `glassProminent`、小玻璃套小玻璃、`material="clear"` 用在没声明色调的地方（会静默降级成 `regular`，调用方不知道）。

**已完成**：`src/react/system/warn.ts`，每个节点每条规则只响一次（`WeakMap`，不留无界缓存）。「两个 `glassProminent`」按**表面**去重而不是按按钮——一个问题只说一次。`tests/browser/warnings.spec.ts` 在 dev server 上读控制台。

---

## 二、文档站

| # | 当时的证据 | 已完成 |
| --- | --- | --- |
| **D2** | `site/site/code-block.tsx` 是裸 `<pre>`，只有复制按钮，没有语法高亮 | `site/src/site/tokenize.ts`，五类 token，颜色来自语义 token；`tests/core/tokenize.test.mjs` 守住「高亮不改变代码」，浏览器用例比对「显示的」与「复制的」是否一致 |
| **D4** | 右侧目录只在 ≥1280px 显示，以下宽度没有页内导航 | 吸顶 `GlassMenu`，与目录栏共用同一份目的地。过了 Apple-Style-Review，五条发现修掉四条（见下） |
| **D6** | 每页缺三样常规的东西：`import` 语句、相关组件、「查看源码 / 报告问题」 | 都补上了，`related` 的 slug 会校验，写错不会变成死链 |
| **D9** | `router.ts` 切页只 `scrollTo(0)`，不改 `document.title`，不把焦点移到 `main` | `tests/browser/routing.spec.ts`。这是 R1 里能靠代码解决的那一小部分，不替代其余部分 |
| **D10** | 站内没有更新日志页 | `#/changelog`，构建期内联 `CHANGELOG.md`。标签上的发布说明本来就是这个文件的对应小节，再手写一份等于给同一个版本两种说法 |

### D4 的 Apple-Style-Review：五条发现

| # | 严重度 | 发现 | 处理 |
| --- | --- | --- | --- |
| 1 | Blocker | 吸顶按钮与吸顶工具栏都 sticky，工具栏 z-index 高得多，一滚动按钮就钻到它下面看不见——而那是唯一需要目录的时候。实测 scrollTop 2810：bar 0–80，outline 8–60 | 停在工具栏下沿，高度由外壳**测量**而非估算（我第一次估少了 12px，因为工具栏高度来自里面的 ToolbarGroup） |
| 2 | Major | 用 `checked` 标当前小节 → `role="menuitemcheckbox"` + `aria-checked`，读屏念成可切换的复选项。但这些是跳转目标 | 去掉勾号；按钮改为显示当前小节名（pop-up button 的做法），可见文字就是可访问名 |
| 3 | Major | **全站一个 `ScrollEdge` 都没有**，而吸顶栏浮在滚动内容之上 | **未做**，转入第二阶段（随 `Screen` 容器解决） |
| 4 | Minor | 展开箭头在前导边 | 挪到尾随边 |
| 5 | Minor | 尾随边触发器配 `align="start"` | 改 `align="end"` |

---

## 三、三条疑点的复现结果（2026-09-19）

三条都去查了。**一条都没复现**——但查的过程本身找出了三个别的缺陷。

| 疑点 | 结论 | 证据 |
| --- | --- | --- |
| Strict Mode 下 `usePull` / `useFusion` 的 rAF 循环重复启动 | **没复现** | `tests/browser/strict-mode.spec.ts`。文档站本来就跑在 `<StrictMode>` 里、dev server 又是 React 开发版，双调用是真的在生效。断言的是「闲置页面不排帧」：拖完松手、离开页面，600ms 内 rAF 调用 ≤2。故意让 `tick` 无条件重排后测到 36–37 帧，用例能抓 |
| `defaultOpen` 对话框的 hydration 不匹配 | **没复现** | `site/hydration-probe.html` + `tests/browser/hydration.spec.ts`。八棵树（含 dialog / sheet / alert / popover 四个 `defaultOpen`）在页面里 `renderToString` 再 `hydrateRoot`，React 开发版一条 mismatch 都没报。两侧故意用不同 `identifierPrefix` 时能抓到，说明检测有效 |
| Firefox < 129 没有 `@starting-style` | **无法在这里复现** | Playwright 装的是 Firefox 155，三家引擎实测 `@starting-style` 与 `transition-behavior: allow-discrete` 全部支持，装不到 128。改为守住真正的风险：没有入场动画时浮层仍然能开、有实际尺寸、能关 |
| Windows Chrome 关掉硬件加速时的 `backdrop-filter` | 仍未执行 | 需要一台 Windows 机器 |

### 顺带查出来的三个真缺陷（都已修，都有用例）

- **`inDevelopment()` 读 `globalThis.process?.env`**——打包器只替换字面量 `process.env.NODE_ENV`，所以浏览器产物里 `process` 是 undefined，判断永远是「开发模式」，**开发告警在生产环境里一直开着**。实测旧写法在站点生产构建上吐 6 条，改后 0 条。
- **`TabBar` 的 `ref` 落在内层 `div`** 而不是 `<nav>`：它混在被当成玻璃选项的 rest 里，被透传到第一个 `GlassSurface`。
- **`SearchField` 收了 `id` 又用自己生成的覆盖掉**，`<label for>` 和 `aria-controls` 指不过去。

### 测试配置本身的坑

`reuseExistingServer` 会让 Playwright 把别的项目占着 5173 / 4173 的 dev server 当成自己的——整套用例跑在别人的应用上，还全绿。已改成独占端口 **41730 / 41731** 且不复用。
