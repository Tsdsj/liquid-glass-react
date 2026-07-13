# AGENTS.md — Codex 工作入口

你是本项目的实现工程师。本项目是一个复刻 Apple Liquid Glass（液态玻璃）风格的 React 组件库。**所有设计决策已经定稿**，你的职责是按规范实现，不是重新设计。

## 必读文档（按顺序）

| 文档 | 内容 | 何时读 |
|---|---|---|
| `PLAN.md` | 总体计划与决策背景 | 首次接触项目 |
| `docs/architecture.md` | 模块划分与依赖规则 | 首次接触项目 |
| `docs/conventions.md` | 代码规范、命名、文件组织 | 写任何代码前 |
| `docs/glass-engine.md` | 玻璃引擎完整规格（核心） | 实现 M1 及任何用到 GlassSurface 的组件前 |
| `docs/tokens.md` | Design token 完整定义表 | 写任何 CSS 前 |
| `docs/component-guide.md` | 组件开发流程与通用 API 约定 | 实现任何组件前 |
| `docs/testing.md` | 测试规范 | 写测试前 |
| `docs/tasks/M*.md` | 当前里程碑的任务卡 | 每次开工 |

## 工作流程

1. 查看 `docs/tasks/` 下**编号最小的未完成**任务卡（任务卡顶部有状态标记）。
2. 通读该任务卡 + 其引用的规范文档章节。
3. 按任务卡的步骤实现，**逐条满足验收标准**。
4. 运行验证命令（见下），全部通过后把任务卡顶部状态改为 `status: done`，并在底部追加简短的完成记录（改了哪些文件、验证结果）。
5. git 提交（规范见下）。**一个任务卡一个或多个提交，不要把多个任务卡混在一个提交里。**

## 命令

```bash
corepack enable pnpm        # 首次（本机 Node v24，pnpm 未全局安装）
pnpm install
pnpm storybook              # 开发调试（端口 6006）
pnpm build                  # 产出 dist/{index.js,index.cjs,index.d.ts,style.css}
pnpm test                   # vitest 单测
pnpm typecheck              # tsc --noEmit
```

**每个任务完成前必须通过：`pnpm typecheck && pnpm build && pnpm test`。**

## 硬性约束（违反即返工）

1. **禁止新增运行时依赖。** 唯一允许的 dependency 是 `@floating-ui/react`。需要小工具函数（如 clsx）一律自写在 `src/core/utils/`。devDependency 新增需在任务卡中有明确要求。
2. **禁止 CSS-in-JS、CSS Modules、Tailwind、预处理器。** 只写纯 CSS + CSS 变量，规范见 `docs/conventions.md` §CSS。
3. **组件 `.tsx` 文件禁止 `import './xxx.css'`。** 所有组件 CSS 由 `src/styles/index.css` 统一 `@import`。
4. **所有视觉参数必须走 token**（`--lg-*` 变量），禁止在组件 CSS 里写死颜色/圆角/时长的字面量（布局尺寸如 padding 除外，但优先用 token）。
5. **所有玻璃质感必须通过 `GlassSurface` 原语实现**，禁止组件自己写 backdrop-filter。
6. **公共 API 变更（新增/修改导出、props）必须先在任务卡或对应规范文档中有定义。** 规范没写的 props 不要加。
7. **不做设计发挥。** 视觉调整只改 token 默认值，不改结构。对规范有疑问时，在任务卡底部记录问题并选择最保守的实现，不要自行扩大范围。
8. **可访问性不可省略**：键盘操作、focus 样式、aria 属性是验收标准的一部分，不是可选项。
9. TypeScript strict 模式，禁止 `any`（第三方类型缺失处可用 `unknown` + 收窄；确实无法避免时单行 `// eslint-disable` 级别的显式注释说明原因）。
10. 禁止修改 `docs/` 下的规范文档内容（任务卡的状态标记和完成记录除外）。发现规范有错误或矛盾，在任务卡底部记录，不要擅自改规范。

## Git 提交规范

- Conventional Commits：`feat(button): ...`、`fix(glass): ...`、`docs: ...`、`chore: ...`、`test(slider): ...`
- 提交信息用中文或英文均可，描述清楚做了什么。
- 不要提交 `dist/`、`node_modules/`、`storybook-static/`（.gitignore 已配置）。

## 项目状态速览

- 当前阶段：文档/规范已定稿，代码尚未开始。第一个任务是 `docs/tasks/M0-scaffold.md`。
- 包名：`@ttq/liquid-glass-react`（发布 scope 后续可改，代码中不要硬编码包名）。
- 目标环境：现代浏览器。折射效果 Chromium-only，Safari/Firefox 自动降级（详见 `docs/glass-engine.md` §降级）。
