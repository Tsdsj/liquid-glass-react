# 已知边界

本版本只承诺交付代码、可运行检查预览与已记录的测试证据。没有逐像素复刻 Apple 的承诺，没有原生私有着色器、真实物理液滴融合，也没有"任意背景自动取色并保证对比度合格"的能力。

只设计 Chrome 路线。84 项 Playwright 用例在正式 Google Chrome 上通过，另有 16 项在 WebKit 与 Firefox 上跑退化路径；两套都在 macOS 本机与 CI 的 Ubuntu runner 上各跑过一遍。**两个操作系统不等于矩阵**——Windows、多个 Chrome 版本、关掉硬件加速的情况都没测。移动视口截图不代表 Android Chrome、移动 GPU 或触控真机验证。Safari 与 Firefox 的退化观感有自动用例守着（模糊、着色、边线、投影俱在，布局与键盘不依赖折射分支），但**没有人用眼睛在真机 Safari 上看过**。

**背景色调是声明的，不是采样的。** 小玻璃随背景翻转明暗依赖调用方用 `GlassBackdrop` 声明 tone；没有声明时保持 `mixed`，即保守的应用外观并把 `clear` 降级为 `regular`。本库不做 DOM 截屏或跨源像素读取，因此不存在"自动适配任意背景"这项能力。

**Dynamic Type 是单一倍率近似。** Apple 在无障碍字号下会对大标题做额外压缩，本实现对整套比例用一个倍率。AX5 下的回流已有自动用例，但视觉节奏与原生不完全一致。

**SF 字体与 SF Symbols 都没有捆绑**，因为许可不覆盖网页分发。`-apple-system` 只在 Apple 设备解析为 SF，其他平台落到 Segoe UI / Roboto，字形度量不同；字号用 px 定死并在这些平台复核过行长，但排版观感必然有差异。图标为 24×24 / 1.8 描边自绘。

typecheck、Vite 构建、65 项核心测试、3 项 SSR 测试与浏览器回归，本机与 CI 上各完整跑过一遍（CI 用锁文件安装，3m42s 全绿）。`pnpm audit` 无已知漏洞。打出来的 tarball 已经装进一个空的 Vite + React 19 项目验证过：关掉 `skipLibCheck` 的类型检查通过，打包通过。**未完成**：React 完整 SSR / hydration 流程与开发 Strict Mode 的运行时验证。依赖版本按 `save-exact` 单列，不应当成"生产依赖矩阵已验证"的证据。

菜单只支持单层动作，Toolbar 的 roving focus 只覆盖按钮型子控件。没有 Combobox、Tree、DatePicker、富文本、数据表格、嵌套子菜单、拖放或完整命令面板。`GlassSheet` 只支持 medium / large 两个停靠高度，不支持自定义比例或自由高度。Popover 的顶层显示走原生 `popover`，不是 React Portal，不能照搬 Portal 容器 API。

祖先的 opacity / filter / mask 可能改变背景采样边界。压力夹具可操作不等于所有图像效果一致。SVG 使用受限的圆角矩形 / 胶囊几何；极端尺寸拒绝增强并保留 CSS 回退。色散（`chroma`）成本约为三倍，只适合少量非固定元素。

regular / mixed 的底色有意保守，clear 需要已知背景。颜色 token 的理论对比度不能证明复杂媒体上的最终合成对比度——玻璃的实际颜色取决于它背后是什么。真实屏幕阅读器、语音控制、切换控制、200% 缩放与人工可读性门槛仍然保留，详见 `accessibility.md` 第 8 节。

本地预览 CSP 允许 style 属性与几何 PNG 的 data URL；完全禁止这些能力的应用需要额外适配。预览服务器只面向本机检查，不是已审计的生产 Web 服务。

性能报告的 rAF 间隔与 Long Tasks 不是 GPU 时间、掉帧率、INP 或低端设备保证。"单视图折射元素 ≤20" 是一条按经验设的预算，尚未在低端设备上实测。LRU 预算只计 JS 持有的字符串，不等同于显存或整页内存。

rdev、Liqui Design 的同条件对照与目标开发者试用未完成；因此不声称自研路线优于候选库，也不声称产品定位已经得到用户验证。
