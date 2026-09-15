# 归档：2026-09-10 离线检查

**这一份已经过时。当前的验证记录在 [`../../verification.md`](../../verification.md)。**

这里的所有文件出自 0.1.0-alpha.1 那一轮，跑在一个**装不了 npm 依赖、也不允许浏览器导航**的容器里：

| | 那一轮 | 现在 |
| --- | --- | --- |
| 依赖安装 | 失败（`EAI_AGAIN`，见 `npm-connectivity.json`） | `--frozen-lockfile` 在 CI 上正常 |
| 类型检查 | 只做了语法转译，语义检查被缺失依赖挡住 | `tsc --noEmit` 完整通过 |
| 构建 | 未执行 Vite 生产构建 | `pnpm build` 出 `dist/` |
| 浏览器 | Chromium 144 headless，无物理 GPU，用自编夹具加载 `about:blank` | 正式 Google Chrome 渠道，伺服真实站点 |
| 用例 | 35 核心 + 31 组浏览器检查 | 65 核心 + 3 SSR + 84 Chrome + 16 WebKit/Firefox |
| 组件 | 16 个 | 41 个 |

截图同样是那一轮的，其中 `materials-*`、`layout-stress`、`performance-*` 拍的是三个实验室页面——它们在 0.2 里已经从站点移除。

留着不删，是因为它们是当时确实跑过的原始数据；移到这里，是因为放在 `reports/` 根上会被当成现状读。两件事都不该含糊。

光学对照那一组（`optics-and-policy.json` 与 `optical-*.png`）是唯一仍被正文引用的结论——边缘像素变化 15.15、中心与不透明前景区域 0.0000，证明位移发生在边缘、文字没有被送进扭曲滤镜。几何管线此后没有换过，所以结论仍然成立；但它是在无 GPU 的 headless Chromium 上量的，只能当作管线行为的证据，不能当作真机观感的证据。
