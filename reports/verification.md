# 交付验证记录

**版本 0.0.1 · 记录日期 2026-09-15**

上一份记录（0.1.0-alpha.1，跑在一个装不了依赖的离线容器里）已移到 [`archive/2026-09-10-offline/`](archive/2026-09-10-offline/README.md)，那里面的数字不代表现状。

## 总体结论

可以发 0.0.1。构建、类型、测试、打包、站点部署全部在两台互不相干的机器上跑通，打出来的 tarball 已经装进真实项目验证过。

**没有验证**的是真人与真机那一类：屏幕阅读器、触摸设备、低端 GPU、Windows。这些没有自动化替代品，下面单列。

## 环境

| | 本机 | CI |
| --- | --- | --- |
| 系统 | macOS（Darwin 27.0.0） | Ubuntu 24.04，GitHub Actions runner 2.337.0 |
| Node | 24.18.0 | 22（取自 `.nvmrc`） |
| pnpm | 11.17.0（`packageManager` 字段固定） | 同左 |
| TypeScript | 5.8.3 | 同左 |
| Playwright | 1.63.0 | 同左 |
| 浏览器 | 正式 Google Chrome 153.0.8010.36，有头 | 同渠道，`playwright install chrome` |
| 依赖安装 | `pnpm install` | `pnpm install --frozen-lockfile` |

两边跑的是同一串命令（`pnpm check`），不是两套各自的脚本。

## 已执行

| 检查 | 结果 | 怎么跑的 |
| --- | --- | --- |
| 类型检查 | 通过 | `tsc -p tsconfig.check.json --noEmit`，完整语义检查 |
| 包构建 | 通过 | Vite library 模式单 ESM 产物 + `tsc --emitDeclarationOnly` + 合并样式表 |
| 核心单元 | 65/65 | 不碰浏览器：有符号距离场、贴图预算、LRU 字节记账、弹簧积分器、同心圆角，外加 3 项样式表静态检查 |
| SSR | 3/3 | 导入的是 `dist/`，测的是真正发出去的那份 |
| 浏览器 | 84/84 | 正式 Google Chrome，伺服 `site/dist` |
| 跨引擎退化 | 16/16 | WebKit 与 Firefox 各 8 项 |
| 依赖审计 | 无已知漏洞 | `pnpm audit`，prod 与 dev 各跑一次 |
| 打包内容 | 55 文件，157.4 KB packed / 584.0 KB unpacked | `scripts/verify-package.mjs`，问打包器它会装哪些进去 |
| 装回来 | 通过 | tarball 装进空的 Vite + React 19 项目：`skipLibCheck: false` 下类型检查通过，`vite build` 通过 |
| 文档站上线 | 通过 | https://tsdsj.github.io/liquid-glass-react/ ，5 条路由在正式 Chrome 上无控制台报错、无横向溢出，资源全部 200 |
| CI 全绿 | 3m42s | GitHub Actions run 34932607077 |

浏览器那 84 项里有一组是 6 页面 × 4 宽度的内部组合，不额外相加成独立用例数。截图是证据不是自动通过的基线——没有人看过就不算验证过。

## 合成对比度

玻璃的最终颜色取决于它背后是什么，所以不能把两个色值填进计算器。做法是把字形藏起来、截下控件、把 PNG 交回页面里解码，量玻璃究竟压成了什么颜色；文字颜色本身不透明且已知，唯一的未知数正是被量出来的那一半。

媒体场景上最差的一块：

| | Chrome | WebKit | Firefox |
| --- | --- | --- | --- |
| 修正前 | **4.38:1 不合格** | 5.69:1 | **4.42:1 不合格** |
| 修正后 | 7.83:1 | 9.47:1 | 7.83:1 |

根因不在库里：文档站把一片实测中位亮度 152、亮部 237 的场景声明成了 `backdropTone="dark"`，clear 材质于是只压暗 6%。工具是 `scripts/measure-contrast.mjs`，回归用例是 `tests/browser/contrast.spec.ts`（下限 4.5）。

## 帧间隔观测

11 块玻璃表面，1×、4×、6× CPU 节流下 rAF 间隔中位数均为 16.7ms。

**这不是 GPU 时间、掉帧率、INP，也不是低端设备的通过证明。** CPU 节流不动 GPU，而模糊花的恰恰是填充率和带宽——所以这组数只能当下限读。原始数据由 `scripts/measure-performance.mjs` 产出。

## 明确未完成

| 门槛 | 状态 |
| --- | --- |
| 屏幕阅读器（VoiceOver / NVDA 朗读顺序） | **未执行**。自动化只能证明角色与键盘路径是对的。这是最大的未知 |
| 触摸真机 | 有 4 项模拟 touch 用例；遮挡、甩动惯性、与系统边缘手势的冲突只能上手试 |
| 真实低端 GPU 与能耗 | 未执行 |
| 浏览器矩阵 | macOS + Ubuntu 两个系统；Windows、多个 Chrome 版本、关掉硬件加速都没测 |
| 真机 Safari 的退化观感 | 自动用例证明模糊、着色、边线、投影都在；**没有人用眼睛看过** |
| React 完整 SSR / hydration / 开发 Strict Mode | 部分覆盖 |
| 200% 缩放、语音控制、切换控制 | 未执行 |
| 按导入的 tree-shaking 成本 | 未测。`size.json` 是整文件大小，不是应用实际引入的成本 |
| 从 registry 装回来 | 未执行——包还没发出去。`exports` 解析、dist-tag、构建溯源只有发了才知道 |
| rdev / Liqui Design 同条件对照、目标开发者试用 | 未执行；因此不声称自研路线更优，也不声称定位已被用户验证 |

## 复现

```bash
pnpm install
pnpm exec playwright install --with-deps chrome webkit firefox
pnpm check
```

`pnpm check` = 类型检查 → 构建 → 单元 → SSR → 站点构建 → 真实 Chrome → WebKit/Firefox。CI 跑的是同一条链，见 `../docs/testing.md`。
