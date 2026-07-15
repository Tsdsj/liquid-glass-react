---
status: done
depends: [M14]
---

# M15 — 三阶段·公开发布准备

> 三阶段总纲(M15–M18):**发布与硬化**。把功能完整但未发布的库做成公众可
> `pnpm add` 的公开 npm 包(scope `@ttqtt`)+ GitHub Pages 文档站,并补齐生产可信度。
> 串行 M15→M16→M17→M18。实际 `npm publish` 与 Pages 部署凭据由用户持有。

本卡:让仓库"可发布"——重命名 scope、License、README、CHANGELOG、公开 package 元数据、
装包烟测。不含 CI 自动化(M18)、不做实际 publish(用户触发)。

## 执行前提

- 遵守 `AGENTS.md`;面向真实用户的公开包,README/文案用用户视角(延续 site 去术语基调)。
- 不新增运行时依赖;本卡只碰元数据/文档/构建脚本,不改组件行为与公共 API。

## 步骤

### 1. `@ttq` → `@ttqtt` 全仓重命名(包名定稿 `@ttqtt/liquid-glass-react`)

全量替换字符串 `@ttq/liquid-glass-react` → `@ttqtt/liquid-glass-react`,覆盖:

- `package.json` 的 `name`。
- `vite.config.ts` 与 `site/vite.config.ts` 的 alias 键。
- `site/src/**`:所有 demo/页面的 `import ... from '@ttq/liquid-glass-react'` 与代码字符串
  (HomePage `QUICK_START_CODE`、各 `*.demos.tsx` 的 `code` 段、GuidePage 代码段)。
- 测试断言:`site/src/App.test.tsx` 中 `'pnpm add @ttq/liquid-glass-react'` 与
  "显示代码后包含 `@ttq/liquid-glass-react`" 两处 → 改为 `@ttqtt/...`。
- 其余源码/stories 若有硬编码包名一并替换(`grep -rn "@ttq/"`)。

重命名后 dist 需重建(alias/包名变化);`grep -rn "@ttq/liquid-glass-react"` 应零命中。

### 2. LICENSE

- 新增 `LICENSE`(MIT),版权行 `Copyright (c) 2026 ttqtt`(年份/署名以用户为准)。
- `package.json` `"license": "MIT"`(现为 ISC)。

### 3. README.md(面向真实用户)

结构:标语 + 一句话定位 → 特性亮点(会折射的玻璃 / 处处好看 / 人人可用 / 随心换装,
呼应 site 文案)→ 安装(`pnpm add @ttqtt/liquid-glass-react`)→ 三行上手(引样式 + 一个
组件)→ 浏览器支持与降级(Chromium 真折射,Safari/Firefox 毛玻璃)→ 主题一句话 →
文档站链接(占位,M18 填 Pages URL)→ License。中文为主,可附英文一段。

### 4. CHANGELOG.md

- Keep a Changelog 格式,`## [0.1.0] - <日期>` 首个版本,列出:玻璃引擎、27 个组件、
  文档站。日期用绝对日期(2026-07-15 之后的实际提交日,由用户/实现时确定)。

### 5. package.json 转公开

- `version`: `0.0.0` → `0.1.0`。
- 增补 `description`、`keywords`(react, components, glass, liquid-glass, ui, backdrop-filter,
  apple 等)、`repository`(git.ttlist.top 或 GitHub 镜像 URL,M18 确定)、`homepage`
  (Pages URL 占位)、`bugs`、`author`。
- `"publishConfig": { "access": "public" }`(scoped 包公开发布必需)。
- `"prepublishOnly": "pnpm typecheck && pnpm build && pnpm test"`。
- 确认 `files: ["dist"]`、`exports`、`sideEffects` 保持正确。

### 6. 装包烟测脚本 `scripts/smoke-pack.mjs`(+ `pnpm smoke:pack`)

- `pnpm build` → 校验 `dist/{index.js,index.cjs,index.d.ts,style.css}` 与 `exports` 映射
  全部指向真实文件 → `pnpm pack` 产出 tarball → `tar -tzf` 校验 tarball 含
  dist + package.json + README + LICENSE。
- ESM `import()` 与 CJS `require()` 直接解析 `dist`(依赖从仓库 node_modules 解析,纯 Node、无
  网络、无浏览器),断言 Button/GlassSurface/Modal/toast 等命名导出可用。
- **tree-shaking 不在本卡断言**:实测发现单文件产物(单入口 `dist/index.js`)在 rollup 与
  esbuild 下「只 import Button」都会拉进整库(见完成记录),修复(preserveModules)与验证
  归入 M16(体积预算/摇树)。
- 脚本失败退出码非 0;tarball 用完清理。

## 测试要求

- 重命名后 `pnpm test` 全量仍绿(App.test 两处断言已同步为 `@ttqtt`)。
- `pnpm smoke:pack` 本机跑通(记录输出)。
- `pnpm typecheck && pnpm build` 通过。

## 验收标准

- [x] 功能代码(src/site/config)`@ttq/` 零命中;包名统一 `@ttqtt/liquid-glass-react`
      (历史任务卡按 AGENTS §10 保留 `@ttq` 记录,不改)。
- [x] LICENSE(MIT)、README、CHANGELOG(0.1.0)齐备;package.json 公开元数据完整、
      `publishConfig.access=public`、`prepublishOnly` 就位、version=0.1.0。
- [x] `pnpm smoke:pack` 通过(ESM/CJS/types/css + tarball + exports;tree-shaking → M16)。
- [x] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [x] 完成记录注明:实际 `npm publish` 留用户触发(M18 自动化或手动)。

## 明确非目标

- 实际执行 `npm publish`(用户持令牌触发);CI/GitHub Pages(M18);a11y/SSR(M17);
  修 flaky 测试(M16)。

## 完成记录

- 全仓重命名 `@ttq/liquid-glass-react` → `@ttqtt/liquid-glass-react`(sed 覆盖 package.json、
  两处 vite alias、`site/src/**` 全部导入与代码字符串、App.test 两处断言);历史任务卡
  (M0/M5/M7)按 AGENTS §10 保留原 `@ttq` 记录未改。功能代码 `@ttq/` 零命中。
- `LICENSE`(MIT,`Copyright (c) 2026 ttqtt`)、`README.md`(用户视角:亮点/安装/三行上手/
  浏览器支持/主题/文档站占位)、`CHANGELOG.md`(0.1.0)。
- `package.json` 转公开:version 0.1.0、description、keywords、repository/homepage/bugs
  (占位 `github.com/ttqtt/liquid-glass-react` 与 `ttqtt.github.io/liquid-glass-react/`,
  **待用户确认实际 GitHub 仓库地址**)、`author: ttqtt`、`license: MIT`、
  `publishConfig.access: public`、`prepublishOnly`。
- `scripts/smoke-pack.mjs` + `pnpm smoke:pack`:build → 校验 dist 四件套与 exports 映射 →
  `pnpm pack` → tar 校验内容 → ESM `import()` / CJS `require()` 解析(纯 Node,无网络/浏览器)。
  本机通过。
- **重要发现(交 M16)**:当前单入口打包(`dist/index.js` 一个文件)**不可摇树**——rollup 与
  esbuild 下「只 import Button」都会拉进整库(实测 Button-only bundle 114–178KB,含
  lg-modal/lg-drawer/feImage 等)。尽管 dist 有 193 处 `/*@__PURE__*/` 且 `sideEffects` 正确,
  单文件结构使消费者无法摇树。修复方案 = rollup `output.preserveModules`(每源码模块独立
  chunk),连同摇树验证一并在 **M16** 落地。故 M15 的 smoke 只做「可安装 + 解析正确」,不断言摇树。
- **留用户触发**:实际 `npm publish`(令牌在你手,M18 自动化或手动);GitHub 仓库/Pages URL 待你确认。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm smoke:pack` ✓、`pnpm test` 全量绿
  (site App.test 13/13,`@ttqtt` 断言已同步)。
