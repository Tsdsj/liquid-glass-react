---
status: done
depends: []
---

# M0 — 项目脚手架

## 目标

可构建、可测试、可跑 Storybook 的空壳项目。

## 步骤

1. `corepack enable pnpm`，`pnpm init`。按 PLAN.md §2 补全 package.json（name `@ttq/liquid-glass-react`、type module、exports map、files、sideEffects、peerDependencies react `^18.0.0 || ^19.0.0`、packageManager）。
2. 安装依赖：
   - dependencies：`@floating-ui/react`
   - devDependencies：`react` `react-dom` `@types/react` `@types/react-dom` `typescript` `vite` `@vitejs/plugin-react` `vite-plugin-dts` `vitest` `jsdom` `@testing-library/react` `@testing-library/user-event` `@testing-library/jest-dom` `storybook` `@storybook/react-vite`（Storybook v9，`pnpm create storybook` 或手动装，framework react-vite）
3. `tsconfig.json`：strict、`moduleResolution: "bundler"`、`jsx: "react-jsx"`、`target: "ES2022"`、include `src`。
4. `vite.config.ts`：
   - lib mode：entry `src/index.ts`，formats `['es','cjs']`，fileName `index`
   - `rollupOptions.external: ['react','react-dom','react/jsx-runtime']`
   - `build.cssCodeSplit: false`，产出命名保证 CSS 为 `dist/style.css`（`assetFileNames`）
   - `vite-plugin-dts`（`rollupTypes: true`）
   - `test` 字段：environment jsdom、setupFiles `src/test/setup.ts`、globals true
5. 骨架文件：
   - `src/index.ts`：`import './styles/index.css';` + 占位导出 `export const VERSION = '0.0.0';`（M1 起逐步替换为真实导出）
   - `src/styles/index.css`：`@import './tokens.css'; @import './themes.css';`
   - `src/styles/tokens.css` / `themes.css`：空壳（M1 填充）
   - `src/test/setup.ts`：引入 jest-dom + jsdom 补丁（见 testing.md）
6. Storybook：
   - `.storybook/main.ts`：framework `@storybook/react-vite`，stories glob `../src/**/*.stories.tsx`
   - `.storybook/preview.tsx`：
     - `import '../src/styles/index.css'`
     - globalTypes 两个 toolbar：`theme`（light/dark）与 `wallpaper`（photo / gradient / plain-light / plain-dark）
     - decorator：外层 div `min-height:100vh; padding:48px; background:...center/cover`；theme 切换写 `document.documentElement.dataset.theme`
     - `parameters.backgrounds = { disable: true }`
     - 壁纸：gradient/plain 用 CSS 渐变字符串；photo 用 `.storybook/assets/` 下的本地图（放 1-2 张免版权风景图，或先用多层渐变模拟，不阻塞）
   - 写一个临时 story `src/Welcome.stories.tsx` 验证 decorator（M1 后可删）
7. `.gitignore`：node_modules、dist、storybook-static、*.log、.DS_Store
8. `.npmrc`：占位注释（私有 registry 配置留到 M5）
9. package.json scripts：`dev`(=storybook)、`storybook`、`build`(`vite build`)、`test`(`vitest run`)、`test:watch`、`typecheck`(`tsc --noEmit`)

## 验收标准

- [ ] `pnpm typecheck` 通过
- [ ] `pnpm build` 产出 `dist/index.js`、`dist/index.cjs`、`dist/index.d.ts`、`dist/style.css` 四件
- [ ] `pnpm test` 通过（可 0 test 但管线跑通）
- [ ] `pnpm storybook` 打开后能看到壁纸背景 + theme/wallpaper toolbar 均可切换
- [ ] git 提交：`chore: 项目脚手架`

## 完成记录

- 2026-07-13：新增 pnpm 包配置与锁文件、TypeScript/Vite/Vitest 构建测试配置、`src` 样式与测试骨架、Storybook 配置和临时 Welcome story。
- 验证：`pnpm typecheck`、`pnpm build`、`pnpm test` 全部通过；构建产出 `dist/index.js`、`dist/index.cjs`、`dist/index.d.ts`、`dist/style.css`。
- Storybook：在 `http://127.0.0.1:6006/` 完成浏览器冒烟验证，theme/wallpaper toolbar 均可切换，控制台无错误或警告。
- 遗留问题：无。
