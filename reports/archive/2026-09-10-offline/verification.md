# 交付验证记录

## 总体结论

这是 **0.1.0-alpha.1 工程预览**：实际组件与场景可运行，当前环境可执行的核心与浏览器检查通过。未完成的标准构建和真实设备门槛仍然是阻塞项，没有因为附带 ZIP 而被标成发布通过。

## 环境

| 项目 | 实际情况 |
| --- | --- |
| 日期 | 2026-09-10 |
| OS | Debian Linux 容器 |
| Node | 22.16.0 |
| TypeScript | 5.8.3 |
| 测试浏览器 | Chromium 144.0.7559.96，headless |
| 已运行 React | 19.1.1 production 离线检查运行时 |
| 源码声明 React | 19.2.7，当前未安装验证 |
| 物理 GPU / 硬件加速 | 未确认；WebGL renderer 查询为 null |
| DPR | 1 |
| 浏览器导航 | 容器管理策略禁止 URL 导航；没有修改策略。用自编 HTML 与编译代码加载 about:blank 做运行检查 |
| HTTP 检查 | 独立 Node HTTP 客户端验证本地静态服务器，不冒充浏览器 HTTP 导航 |

## 已执行

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| tokens/core 真实 TypeScript 编译 | 通过 | 随包 core/tokens dist 与 core tests |
| TypeScript/TSX 语法转译 | 31 个文件，0 语法错误；不是语义类型检查 | syntax-check.json |
| 核心几何、缓存与无 DOM 导入 | 35/35 通过 | core-tests.tap |
| 浏览器交互 | 14/14 组通过 | browser-interactions.json |
| 光学、策略与 ref 清理 | 9/9 组通过 | optics-and-policy.json |
| 质量场景 | 8/8 组通过 | browser-quality.json |
| 响应式子矩阵 | 6 页 × 3 宽度（390/768/1440），没有水平溢出 | responsive.json |
| HTTP 服务器 | 8 项通过：页面/资源、CSP、隐藏路径、父路径、POST、HEAD、404 | preview-server.json |
| 源码复制 | 已实际复制并校验引用重写和 LICENSE | source-distribution.json |
| 本地 registry | 已生成版本化文件内容与 hash 清单 | ../registry/registry.json |
| 文件大小 | 实际文件原始/gzip 统计；非 tree-shaken 单组件导入成本 | size.json |

浏览器 31 组是 14 + 9 + 8 的计数。18 个视口/路由组合是其中一组的内部检查，不额外相加成夸大的独立测试总数。没有页面 JavaScript error。UI 截图在 screenshots/，静态截图不是自动批准的黄金基线。

交互覆盖实际按钮计数与禁用/loading、工具栏 roving focus、原生 radio/range/checkbox、Tabs、Popover 外部关闭与焦点返回、Menu 箭头/禁用跳过/键入选择、Dialog 模态焦点与滚动锁、ScrollEdge、主题、保守偏好、本地媒体流、路由重复卸载、callback-ref cleanup。顶层弹层在 6 个布局压力夹具中实际打开/关闭；这不代表采样图像都相同。

## 光学对照

使用同一张密集细线背景、同一个 360×160 CSS px 表面、同一个 SVG 管线，只改变 scale=0 与 scale=64。结果：

| 指标 | 结果 |
| --- | --- |
| 边缘区域 RGB 平均绝对差（0–255 单位） | 15.1462 |
| 中心区域平均绝对差 | 0.0000 |
| 不透明前景文本区域平均差 | 0.0000 |
| 前景几何是否改变 | 未改变 |
| 前景本身的 CSS filter | none |

证据支持“这个场景中实际背景位移发生在边缘，文字没有被送入扭曲滤镜”，不支持“所有背景可读”或“原生还原度百分比”。文件为 optical-zero.png / optical-64.png / optical-grid.png。

## 诊断性帧回调记录

当前无头环境、1440×1000、DPR1、8 个独立 SVG 表面，完成 180 个 rAF 时间间隔。p50=16.7ms，p95=33.4ms。原始数据在 headless-raf-observation.json。

**这不是 GPU 性能基准、实际掉帧统计、INP 或发布预算通过证明。** 没有确认物理 GPU；这一次主线程回调结果不能外推到用户设备。不能因看到约 16.7ms 就宣传“所有设备稳定 60FPS”。

## 明确未完成

| 门槛 | 状态 / 原因 |
| --- | --- |
| npm 依赖安装与 lockfile | 未完成；npm registry 连通请求失败，见 npm-connectivity.json |
| React 全量语义类型检查 | 已尝试命令，因缺少安装依赖而阻塞，见 standard-typecheck.json |
| Vite 标准生产构建 | 未执行；不以 preview 转译冒充 npm run build |
| React SSR / hydration | 测试源码、示例已写，未执行服务端 React 测试 |
| 开发模式 Strict Mode | 未执行；production React 包裹 StrictMode 不等于开发重复 effect 检查 |
| 正式 Google Chrome | 配置与测试已写，当前只有 Chromium，没有 Chrome channel 运行证据 |
| Windows/macOS / 真实 GPU / 能耗 | 未执行 |
| 辅助技术、200% 缩放、真实动态媒体对比度 | 未完成完整人工与真机矩阵 |
| rdev / Liqui Design 对照 | 未安装实测；不作优劣排名 |
| 公共 npm / shadcn registry 发布 | 未执行；只交付 private workspace 和本地源码清单 |

CSP 检查使用 nonce 内联等效夹具，HTTP 响应头另测；正式 HTTP 浏览器用例仍需在正常允许访问本地服务的 Chrome 中运行。导出用例在当前容器截获下载触发以验证 SVG Blob 与命名，实际 Chrome download 事件由正式测试补验。

## 复现

离线检查预览：`node scripts/serve-preview.mjs`。Node 核心测试：`npm test`。本次浏览器脚本位于 tests/local/，详见 docs/testing.md。

标准工程门槛：`npm install` → `npm run typecheck` → `npm run build` → `npm test` → `npm run test:ssr` → 安装正式 Chrome → `npm run test:chrome`。成功后提交真实 lockfile，再使用 npm ci。执行路径与截图、源代码哈希应一起记录。
