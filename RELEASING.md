# 发布与部署 Releasing

本项目的 CI、文档站部署、npm 发布都由 `.github/workflows/` 下的三个工作流驱动。
本文说明发版流程、所需密钥,以及一次性的人工配置。

## 工作流一览

| 工作流 | 触发 | 作用 |
|---|---|---|
| `ci.yml` | 每次 push / PR | typecheck + build + test 门禁。只用 `checkout` / `setup-node`,**GitHub Actions 与 Gitea/Forgejo Actions 通用**。 |
| `deploy-pages.yml` | push 到 `main` | 构建文档站并发布到 GitHub Pages(GitHub 专用)。 |
| `release.yml` | 推送 `v*` tag | `npm publish` 发布到 npm(`prepublishOnly` 先跑 typecheck/build/test)。 |

## 一次性人工配置(仓库 owner)

1. **GitHub 镜像仓库**:`https://github.com/Tsdsj/liquid-glass-react`
   - 本地已配 remote:`git remote add github https://github.com/Tsdsj/liquid-glass-react.git`
   - 推送:`git push github main`
2. **启用 GitHub Pages**:仓库 → Settings → Pages → Source 选 **"GitHub Actions"**。
   - 首次 push 到 `main` 后,`deploy-pages.yml` 会自动构建并发布到
     `https://tsdsj.github.io/liquid-glass-react/`。
3. **配置 npm 发布密钥**:仓库 → Settings → Secrets and variables → Actions →
   New repository secret,名字 **`NODE_AUTH_TOKEN`**,值为 npm 的 **Automation** 令牌
   (npmjs.com → Access Tokens → Generate → Automation)。
   - 包已配置为公开 scoped 包(`publishConfig.access = public`,scope `@ttqtt`)。

## 发版步骤

1. 更新 [`CHANGELOG.md`](./CHANGELOG.md):把改动归入新版本号小节。
2. 提升版本号:

   ```bash
   pnpm version patch   # 或 minor / major;会改 package.json 并打好 tag
   ```

   > `pnpm version` 会创建 `vX.Y.Z` 的 git tag。若你手动改版本号,则用
   > `git tag vX.Y.Z` 补上。

3. 推送分支与 tag:

   ```bash
   git push github main
   git push github --tags
   ```

   - 推 `main` → `deploy-pages.yml` 更新文档站。
   - 推 `vX.Y.Z` tag → `release.yml` 发布到 npm。

## 手动发布(可选,不走 CI)

已在本机 `npm login`(账号 `ttqtt`)的前提下:

```bash
npm publish --access public
```

`prepublishOnly` 会先自动跑 `pnpm typecheck && pnpm build && pnpm test`,任一失败即中止发布。

## 本地自检脚本

- `pnpm check:bundle` — 校验产物 gzip 体积预算与摇树(Button-only 无 overlay)。
- `pnpm smoke:pack` — 打包后校验 dist 结构、exports、ESM/CJS 解析。
