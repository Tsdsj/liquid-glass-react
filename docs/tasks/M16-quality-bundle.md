---
status: todo
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

### 2. 产物体积预算 `scripts/check-bundle.mjs`(+ `pnpm check:bundle`)

- `pnpm build` 后读取 `dist/index.js`(ESM)与 `dist/style.css`,计算 gzip 体积。
- 设置合理上限常量(以当前实测值 + 宽裕余量,如 JS gzip ≤ 一个明确 KB 阈值、CSS 同理),
  超限退出码非 0 并打印当前值 vs 阈值。阈值写进脚本注释说明来源(当前实测)。
- 与 M15 `smoke:pack` 的 tree-shaking 断言互补:smoke 验"摇树正确",本卡验"整体体积不膨胀"。

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
