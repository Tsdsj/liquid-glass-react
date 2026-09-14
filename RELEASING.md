# 发版

包名 `@ttqtt/liquid-glass-react`，单包发布，构建产物只有 `dist/`。

## 1. 发版前

```bash
pnpm install --frozen-lockfile
pnpm check          # 类型检查 → 构建 → 单元测试 → SSR → 站点构建 → 真实 Chrome
```

`pnpm check` 里的 `test:chrome` 用的是正式 Google Chrome，不是捆绑的 Chromium——折射路径依赖它。本机第一次跑之前需要：

```bash
pnpm exec playwright install --with-deps chrome
```

## 2. 确认发布内容

```bash
pnpm pack
tar -tzf ttqtt-liquid-glass-react-*.tgz
```

应该只有这些：

```text
package/package.json
package/README.md
package/LICENSE
package/THIRD_PARTY_NOTICES.md
package/dist/index.js          单个 ESM 产物，顶部带 "use client"
package/dist/index.js.map
package/dist/index.d.ts        以及按目录分布的类型声明
package/dist/style.css         合并后的样式表
package/dist/tokens.css        单独的 token 部分
package/dist/components.css    单独的组件部分
```

检查 `dist/index.js` 第一行是 `"use client";`。少了这一行，包在 Next.js App Router 的服务端组件里会直接报错。

```bash
head -c 20 dist/index.js
```

## 3. 改版本号并打标签

```bash
pnpm version 0.2.0-alpha.2     # 或 patch / minor / major
git push --follow-tags
```

`pnpm version` 会自己创建提交和标签。推上去之后 CI 会跑全套检查，文档站也会自动部署到
https://tsdsj.github.io/liquid-glass-react/ 。

## 4. 发布

```bash
pnpm publish --access public
```

预发布版本记得带 tag，避免被当成最新稳定版装上：

```bash
pnpm publish --access public --tag next
```

## 5. 发布后

- 在 GitHub 上按标签建一个 Release，正文用 `CHANGELOG.md` 里对应的段落。
- 装一次真包验证：`pnpm add @ttqtt/liquid-glass-react` 到一个空的 Vite React 项目里，引样式表，放一个按钮上去。

## 版本号约定

- **patch** — 修 bug、补文档，不动 API。
- **minor** — 新增组件或属性，旧写法继续可用。
- **major** — 有破坏性改动，同时写一篇升级指南放进 `docs/`，并在站点的「指南」里加上入口。

0.x 阶段仍可能出现破坏性改动，但每次都会给出改名对照表和结构调整说明，就像 `docs/migration-0.2.md` 那样。
