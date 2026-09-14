# 测试与验收

## 两条不混淆的验证路径

标准项目路径是在联网安装后执行 TypeScript、Vite、Node 单元测试、React SSR 和 Playwright Chrome channel。当前交付环境执行的是核心真实 TS 编译、Node 测试，以及通过 Python Playwright 注入本地编写页面的 Chromium 检查。

```bash
npm run typecheck
npm run build
npm test
npm run test:ssr
npx playwright install --with-deps chrome
npm run test:chrome
```

Chrome 项目默认服务 **标准构建** `apps/playground/dist`，不是附带的旧运行时预览。为避免误连同端口旧服务器，执行正式回归前关闭 `npm run preview`。也可通过 TEST_URL 指定已部署的标准构建。

```bash
# 只作为额外 Chromium 回归，不冒充 Chrome 产品测试
npx playwright install chromium
npm run test:e2e -- --project=chromium
```

## 当前实际执行的本地脚本

`tests/local/` 保存生成 reports 的 Python Playwright 脚本。依赖 Python、Playwright、Pillow、NumPy，以及 CHROMIUM_PATH 指定的浏览器；这些不是运行组件库所需的生产依赖。

```bash
pip install -r tests/local/requirements.txt
# 安装本机 Chromium 或设置 CHROMIUM_PATH
python tests/local/test-interactions.py
python tests/local/test-optics.py
python tests/local/test-quality.py
```

它们使用同一套离线 preview 代码，载入自己创建的页面，不访问外部服务，也不修改浏览器管理策略。测试失败时会输出失败条目并以非零退出，截图仅作证据，不自动认定为正确基线。

## 证据口径

**62 项**核心检查（`tests/core/`）覆盖 SDF / 方向 / 中性值、输入拒绝、尺寸预算、LRU、字节估算、无 DOM 导入，以及新增的弹簧积分器（收敛、过冲、dt 钳制、非有限输入拒绝）与同心圆角（含掐角 / 喇叭口的边界条件）。

**60 项**浏览器检查（`tests/browser/`，真实 Google Chrome）分为：组件语义 12、导航与站壳 7、浮层 8、拖拽手势 6、无障碍 10、材质 6、液滴融合 4、响应式与视觉证据 5、CSP 与外部请求 2。其中响应式一项内部又包含 6 页面 × 4 宽度；不要把内部组合数与用例数相加包装成更大的覆盖率。

3 项 SSR 检查验证无 DOM 导入、稳定 ID 与默认打开的 dialog 的服务端标记。

SVG 光学对照在固定细线背景中仅修改 scale=0/64，比较同一个矩形区域，检查边缘变化、中心与不透明前景不变。它证明该配置发生了真实背景位移，不代表复杂媒体的全部视觉正确性。

rAF 采样报告只代表当前容器的 180 次回调间隔，既不是 GPU 帧时间，也不是真实掉帧率、INP 或低端设备性能保证。物理 GPU 未识别，不能据此宣称硬件加速。

## 发布前人工矩阵

| 维度 | 必测项 | 当前状态 |
| --- | --- | --- |
| 正式浏览器 | Chrome 完整版本、OS、硬件加速设置 | 未执行 |
| 设备 | 至少真实集显设备、Apple GPU 设备；仅声明实测平台 | 未执行 |
| 显示 | DPR 1/2、100%/125%/200% 浏览器缩放与 OS 缩放 | 当前仅 DPR1、4 个视口；Dynamic Type 已覆盖到 AX5 |
| 输入 | 鼠标、键盘、触控（如纳入支持） | 当前鼠标/键盘 |
| 可读性 | 白/黑/明暗交界、真实照片/视频、正文、密集网格 | 页面已提供；人工对比度未完成 |
| 辅助技术 | 屏幕阅读器、系统减少透明度/动效/增强对比度、forced-colors | 已自动覆盖 motion / contrast / forced-colors / 应用级减少透明度；**真实屏幕阅读器与语音控制未执行** |
| 生命周期 | Strict Mode、SSR hydration、多根、路由、弹层 | 当前生产预览路由/卸载；其余待测 |
| 性能 | DevTools 主线程/绘制/合成 trace、温度/能耗、拖动与滚动 | 当前仅诊断 rAF/Long Tasks |

对比度检查要看实际合成背景，不能只把两个 CSS token 填入计算器。原报告列出了相关 WCAG 条款；当前结果不是可访问性认证。
