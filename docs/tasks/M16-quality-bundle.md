---
status: done
depends: [M15]
---

# M16 — 三阶段·质量债与体积预算

> 三阶段第二卡。先把测试稳定成"可 CI 门禁"的状态,并给产物体积上锁,再进 M17/M18。

## 背景

- 二阶段每卡都记录:默认并行 `pnpm test` 下,M4 既有 Modal 焦点测试
  `keeps Tab focus inside the dialog` 会因 `user.tab()` 焦点时序 + worker 争用而 flake
  (`document.activeElement` 循环中偶现瞬时落到 `document.body`),`--no-file-parallelism`
  也非 100% 稳定。前几卡因"Modal 既有测试零改动"约束未动;**本阶段目标即硬化,现在可以修**。
- 公开包需要一个能进 CI 的确定性绿套件,以及防止体积悄悄膨胀的护栏。

## 步骤

### 1. 修复 Modal 焦点测试的时序 flake(可动 M4 测试)

- 用 systematic-debugging 思路定位:焦点陷阱重聚焦是异步的,断言与 `user.tab()` 存在竞态。
- 修法(保持测试意图=焦点圈闭在对话框内、不逃逸):把"焦点不在 body / 不在外部按钮"的断言
  用 `waitFor` 包裹重试至焦点落定;或断言"焦点仍在 dialog 内"(`dialog.contains(activeElement)`)
  而非"不等于 body"。**不弱化语义**:仍验证 Tab 循环不逃出对话框。
- 目标:该文件在**默认并行**下连续多次(如 `--repeat` 或本地 5 次)稳定通过。

### 2. 摇树修复(M15 发现:单入口产物不可摇树)

- 根因:构建产物里组件是 `const X = forwardRef(...)`,**缺 `/*#__PURE__*/` 标注**
  (dist 里的 193 处 PURE 来自 floating-ui 等依赖,不是组件),rollup/esbuild 遂把每个
  forwardRef 调用当潜在副作用保留 → 「只 import Button」拉进整库。
- 修法(零构建配置改动、最低风险;vite lib 模式强制 inlineDynamicImports 与 preserveModules
  冲突,故不走 preserveModules):给 `src/**` 27 个组件/原语的 `= forwardRef<` 前加
  `/* @__PURE__ */`(rollup 与 esbuild 均识别),标注为纯,未用组件即可 DCE。

### 3. 产物体积预算 + 摇树校验 `scripts/check-bundle.mjs`(+ `pnpm check:bundle`)

- gzip 体积:`dist/index.js` 与 `dist/style.css` 各设上限常量(当前实测 + ~15% 余量),超限
  退出非 0。
- 摇树:用 rollup 打「只 import Button」,断言 `lg-modal/lg-drawer/lg-tabs/lg-select/
  FloatingPortal` 均被摇掉、且 Button-only 产物 < 40KB。

## 测试要求

- Modal 测试文件默认并行多次重跑稳定绿(记录重跑命令与结果)。
- `pnpm check:bundle` 本机跑通,输出当前体积与阈值。
- 全量 `pnpm test` 绿(含改后的 Modal 测试);存量其它断言不动。

## 验收标准

- [ ] Modal `keeps Tab focus inside the dialog` 不再 flake(默认并行多次稳定通过),
      且语义未弱化(仍验证焦点圈闭)。
- [ ] `scripts/check-bundle.mjs` + `pnpm check:bundle` 就位,阈值有据可查。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:flaky 根因与修法、当前体积基线数值。

## 明确非目标

- 视觉回归;新增组件;a11y/SSR(M17);CI(M18)。改测试仅限该 flaky 用例的稳定化,
  不借机重写其它 Modal 测试。

## 完成记录

- **修复 Modal 焦点 flake**:`keeps Tab focus inside the dialog` 的每次 `user.tab()` 后断言
  改为 `await waitFor(() => { expect(outside).not.toHaveFocus(); expect(dialog.contains(activeElement)).toBe(true); })`
  ——等焦点陷阱异步重聚焦落定,断言「焦点仍在对话框内、未逃到外部按钮」(语义未弱化)。
  根因:FloatingFocusManager 重聚焦是异步的,原同步断言与之竞态,并行 worker 争用下几乎必现。
  验证:**默认并行**全量套件连续 3 次跑,该用例每次绿(47/47)。
- **修复摇树**:给 27 个组件/原语的 `forwardRef` 加 `/* @__PURE__ */` 标注。效果实测:
  「只 import Button」的 rollup 产物 **178,849 → 18,395 字节(约 10×)**,lg-modal/lg-drawer/
  lg-tabs/lg-select/FloatingPortal 全部摇掉;纯注释、无行为改动、无构建配置改动。
- **体积预算**:`scripts/check-bundle.mjs` + `pnpm check:bundle`——gzip 上限
  `index.js ≤ 60KB`(实测 48.6)、`style.css ≤ 14KB`(实测 9.2);摇树断言 Button-only 无 overlay
  且 < 40KB(实测 18.0)。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm check:bundle` ✓、`pnpm smoke:pack` ✓、
  `pnpm test`(默认并行)全量绿。
- 影响 M15:`smoke:pack` 当时因摇树未修而未断言摇树;摇树现已在本卡修复 + `check:bundle` 覆盖。
