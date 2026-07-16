---
status: done
depends: [M18]
---

# M19 — 四阶段·主题定制 API

> 四阶段总纲（M19–M26）：**扩容·产品化·生态**。在 release-ready 的地基上补齐重型组件、
> 把引擎实验特性转正、提升 DX。串行 M19→M26。本卡是地基卡:后续组件/文档均引用主题 API。

本卡：把已有的 `--lg-*` CSS 变量体系封成**友好的主题 API**——类型安全的 `createTheme` 工具、
2–3 套预设主题、全量 token 参考文档。不改任何组件行为,只新增一个 headless 主题层。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/conventions.md`（纯 CSS 变量,禁止 CSS-in-JS/预处理器）。
- 本卡的 API 表即公共 API 定稿（AGENTS §6），不加不减。
- 不新增运行时依赖;主题本质是一组 `--lg-*` 自定义属性,通过 inline style 应用。

## API 定稿

`src/core/theme/`（新目录）:

```ts
/** 所有可覆盖的主题 token（键去掉 --lg- 前缀,值为 CSS 值字符串/数字） */
export interface LiquidGlassThemeTokens {
  accent?: string;
  radiusSm?: string; radiusMd?: string; radiusLg?: string;
  blur?: string; fallbackBlur?: string; saturation?: string;
  tint?: string; highlight?: string; shade?: string;
  duration?: string; durationSlow?: string; ease?: string; easeBounce?: string;
  // …与 tokens.css 一一对应,完整列表以 tokens.css 为准
}

/** 主题对象 = 可 spread 到任意元素 style 的 --lg-* 自定义属性映射 */
export type LiquidGlassTheme = React.CSSProperties;

/** 纯函数:token 覆盖 → { '--lg-accent': ..., '--lg-radius-md': ... } */
export function createTheme(tokens: LiquidGlassThemeTokens): LiquidGlassTheme;

/** 预设主题(2–3 套),本身就是 LiquidGlassTheme */
export const presetThemes: {
  default: LiquidGlassTheme;   // = createTheme({}) 空覆盖,占位对齐
  midnight: LiquidGlassTheme;  // 深色强调 + 冷色调
  warm: LiquidGlassTheme;      // 暖强调 + 柔和圆角
};
```

- `createTheme` 是**纯函数**:把驼峰键转成 `--lg-kebab` 并组装成对象,jsdom 直接测数值。
- 应用方式(文档演示):`<div style={createTheme({ accent: '#7c3aed' })}>…</div>`,任意容器
  作用域生效,与 `data-theme="dark"` 正交(暗色仍走 CSS,主题只覆盖变量)。
- 便利集成:`LiquidGlassConfig` 增可选 `theme?: LiquidGlassTheme` prop,内部渲染一个应用
  该 style 的包裹节点(默认 `display: contents` 不影响布局);不传则行为不变。

## 实现步骤

1. `src/core/theme/createTheme.ts` + 单测(RED→GREEN):驼峰→kebab 映射、未知键忽略、
   空覆盖返回空对象、数字/字符串值处理。
2. `src/core/theme/presetThemes.ts`:2–3 套预设(值取自设计意图,只调 token 默认,不改结构)。
3. `LiquidGlassConfig` 增 `theme` prop(向后兼容,`display: contents` 包裹)+ 测试。
4. `src/index.ts` 导出 `createTheme`、`presetThemes`、类型 `LiquidGlassTheme`/`LiquidGlassThemeTokens`。
5. 文档:`site` 新增「主题 / Theming」指南页——全量 `--lg-*` token 参考表(名/默认值/说明)
   + `createTheme` 用法 + 三套预设切换演示;中英双语。
6. 全量验证 + 提交。

## 测试要求

- `createTheme` 纯函数:键映射、边界(空/未知键/数字值)逐条断言。
- `LiquidGlassConfig` 传 `theme` 时包裹节点带对应 `--lg-*` inline 变量;不传时 DOM 不变(存量断言不削弱)。
- token 文档表与 `tokens.css` 实际变量**不漏不多**(可加一个测试:解析 tokens.css 变量名与文档表比对,或人工核对并在完成记录注明)。
- site App.test 增主题页可渲染断言。

## 验收标准

- [ ] `createTheme`/`presetThemes`/类型 从 `src/index.ts` 导出,API 与本卡一致。
- [ ] `LiquidGlassConfig` `theme` prop 向后兼容,不传无行为变化。
- [ ] 主题指南页含全量 token 参考表 + createTheme 用法 + 预设切换演示,中英双语。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:预设主题的实际观感留本地目检(服务器无浏览器)。

## 明确非目标

- 运行时动态换肤动画;主题持久化/localStorage;设计工具(Figma)token 同步;
  暗色模式重构(沿用现有 `data-theme` 机制)。

## 完成记录

- **`createTheme`**（`src/core/theme/createTheme.ts`）：纯函数,机械式 camelCase→`--lg-kebab`
  转换,返回可 spread 到任意元素 `style` 的 `LiquidGlassTheme`(=`React.CSSProperties`)。
  类型安全接口 `LiquidGlassThemeTokens` 覆盖 32 个常改视觉 token(颜色/玻璃材质/圆角/动效/字号);
  派生(`--lg-accent-glass` 等)与布局(`--lg-control-h-*`/`--lg-space-*`)token 不进 helper,
  可仍以 CSS 变量直接覆盖(注释与文档已说明)。跳过 `undefined` 值、保留数字值。5 单测 TDD。
- **`presetThemes`**（`src/core/theme/presetThemes.ts`）：3 套预设 `default`(空覆盖)/`midnight`
  (冷调靛蓝)/`warm`(暖琥珀 + 大圆角),均由 `createTheme` 组装。4 单测。
- **`LiquidGlassConfig` `theme` prop**：可选,传入时用 `display:contents` 包裹节点作用域化 token
  (布局不受影响),不传则**不加包裹**、行为与既往一致(向后兼容,存量 5 断言不变)。2 新断言。
- **导出**：`src/index.ts` 增 `createTheme`、`presetThemes`、类型 `LiquidGlassTheme`/`LiquidGlassThemeTokens`。
- **文档**:`site/src/theming-tokens.ts` 全量 50 个 token 参考表(名/默认值/中英说明,按类分组);
  `site/src/theming-tokens.test.ts` **drift 测试**——读取 `src/styles/tokens.css` 解析声明的
  `--lg-*` 名,断言参考表与之**不漏不多**(2 断言,已捕获我最初漏计并校正)。
  `site/src/components/ThemingDemo.tsx`:预设切换器(dogfood `Segmented`)+ 实时玻璃预览
  + `createTheme`/`presetThemes`/`LiquidGlassConfig theme` 用法代码 + 全量 token 参考表;
  接入 GuidePage(「主题与 Token」文案补 createTheme 指引 + 新增「定制主题」导航锚点 + 渲染 demo);
  `site.css` 加 `.theming-demo__*` 样式。App.test 增 theming-demo + token 名断言。
- **踩坑**:`tokens.css?raw` 在本项目 vitest CSS 处理下返回空串;`new URL(rel, import.meta.url)`
  的 `import.meta.url` 非 `file:` scheme;`node:path`/`process` 无类型(仓库无 `@types/node`,
  仅手写 `src/test/node-runtime.d.ts` 声明 `node:fs`/`node:url`)。最终改用 `Spin.test` 同款
  `readFileSync('src/styles/tokens.css','utf8')`(cwd 相对路径)读取,类型与运行均通过。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **406/406 绿**(较基线 393 +13:createTheme 5 +
  presetThemes 4 + drift 2 + config theme 2)、`pnpm site:build` ✓。
- **留本地目检**(服务器无浏览器):三套预设的实际观感、预设切换时玻璃强调色/染色的过渡。
