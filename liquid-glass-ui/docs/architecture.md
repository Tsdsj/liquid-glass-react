# 架构与实现

## 四层边界

`tokens` 提供类型、设计常量、主题变量；`core` 只处理几何、缓存、弹簧积分与同心圆角等纯函数及客户端编码；`react` 将材质与原生 DOM 行为组合；`playground` 是文档站，同时承担真实场景和压力验证。无须 Canvas 重画整页 DOM，也不会读取任意页面合成结果或跨来源图片像素。

`react` 内部再按层分目录，这个划分本身就是设计约束的体现：

```text
system/     Provider · useGlassSurface · GlassBackdrop · pull · fusion
content/    Text · Card · List · MaterialView · Divider      ← 不含 backdrop-filter 玻璃
controls/   Button · Segmented · Switch · Slider · Stepper · Progress · Badge
fields/     TextField · SearchField
navigation/ Toolbar · TabBar · Sidebar · NavigationBar · Tabs · ScrollEdge
overlays/   Popover · Menu · Sheet · Alert · ActionSheet · Dialog · Toast
```

`content/` 里出现 Liquid Glass 就是一个需要修的 bug，而不是风格选择。

## 背景色调：声明而非采样

小玻璃要随背景翻转明暗，就得知道背后是深是浅。真正去"读"页面意味着 DOM 截图或跨源像素读取，这是 `AGENTS.md` 明令禁止的，也是隐私与性能上都不划算的做法。因此本库要求区域用 `GlassBackdrop tone="dark|light|mixed"` 显式声明，后代小玻璃继承它。

代价是调用方要多写一行；收益是行为完全可预期，并且 `mixed`（未知）有一个明确的保守回退：保持应用外观，并把 `clear` 降级为 `regular`。

## 材质管线

```text
尺寸 + 圆角 + 边缘带
  → 圆角矩形 SDF 与法线差分
  → RG 位移图，中心 128 / 128
  → Canvas 编码几何 PNG（不是截图 DOM）
  → SVG feImage + feDisplacementMap
  → 仅在装饰背景层使用 backdrop-filter
  → 底色 / 轮廓 / 高光
  → 独立真实 DOM 前景
```

有符号距离在形状内部为负。只有距离边界不超过 edge 的内侧区域写入位移；外部与中心保持中性。法线由 SDF 的小步长差分近似。平方衰减把最大变化集中在边缘。本实现是可调的视觉模型，不是基于 Apple 私有光学参数的物理重建。

位移 scale 被限制在 0–64。SVG 明确指定用户空间坐标、扩展区域、输入名称和 sRGB 插值，避免数值编码被非预期色彩转换改变。8 位中性值 128 近似 0.5，不应被理解为无限精度浮点中性值。

## 资源上限

几何输入正数且不超过 16,384 CSS px；不合法输入拒绝生成。贴图最长边最多 512，默认 balanced 为 256；总像素不超过 131,072。LRU 最多 24 个条目、估算 8 MiB 的 data URL 字符串预算。

该预算只计算 JS 持有的编码字符串，不是 GPU/浏览器总内存预算。浏览器中间表面、颜色缓冲和纹理释放时机不在此计数内。

尺寸观察通过 ResizeObserver 合并到 rAF；尺寸和几何才改变贴图键。pointermove 只更新 CSS 高光位置变量。观察器、事件和 rAF 在卸载时清理；路由反复挂卸载后活跃材质观察数量回到相同水平的证据在 reports。

## React 与 SSR

客户端材质采用 `useId` 生成 filter ID，初次无尺寸时输出可读 CSS 背景，挂载测量后才 SVG 增强。模块载入阶段没有 document、Canvas、尺寸读取；核心的无 DOM 导入已经在 Node 中验证。

多个独立 React 根必须给服务端与客户端相同且彼此不同的 `identifierPrefix`，建议只使用字母、数字和连字符。Provider 用 useSyncExternalStore 处理系统查询，服务端快照不读取 window。

React 完整 SSR / hydration 与开发模式 Strict Mode 的测试入口已写，但当前环境没有对应 npm 服务端/开发运行时，不能声称已经通过。

## 交互与顶层显示

Popover/Menu 使用原生 `popover="auto"` 顶层机制；Dialog 使用 `showModal()`，不是靠把 z-index 设为极大值。控件依然保留在原 DOM/React 树中，**没有 ReactDOM Portal**。锚点由测量触发器位置计算，尺寸/窗口/滚动变化合并更新，并做视口避让。

真实顶层弹层不等于所有祖先 filter/opacity/mask 场景的背景采样都相同；压力页必须观察效果。模态 dialog 管理关闭与焦点返回；工具栏限制为按钮型子控件，菜单仅支持单层动作项。

## 渲染策略

`auto → CSS` 为默认。`svg` 或 `enableSvgAuto` 仍须满足语法与资源可用性，否则回退 CSS。减少透明度或强制颜色会覆盖上述选择为不透明。

语法能力检测不等于像素验证。固定夹具中已经实测 scale 改变仅显著影响边缘、前景不变；该结果只支持这个环境和夹具，不授权库把所有 Chrome 都视为已验证。
