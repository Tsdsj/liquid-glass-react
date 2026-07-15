---
status: done
depends: [M15, M16, M17]
---

# M18 — 三阶段·CI 与发布/部署自动化

> 三阶段收尾卡。把前三卡的成果编排成自动化:CI 门禁、GitHub Pages 部署、npm 发布。
> 本卡产出配置与脚本;**实际运行需用户提供密钥并启用 Pages**(无浏览器/无 runner 处无法自验)。

## 执行前提

- 遵守 `AGENTS.md`。CI 依赖前置卡:M16 已把套件稳定成可门禁;M15 已备好公开元数据与
  `prepublishOnly`;M17 的 a11y/SSR 测试并入套件。

## 步骤

### 1. 可移植 CI(Gitea/Forgejo Actions 与 GitHub Actions 通用)

- `.github/workflows/ci.yml`(Gitea Actions 亦读 `.github/workflows/`):push / pull_request →
  `actions/checkout` → `actions/setup-node`(Node 24)→ `corepack enable pnpm` → `pnpm install`
  → `pnpm typecheck` → `pnpm build` → `pnpm test`。
- 只用两个通用 action(checkout / setup-node),避免依赖 GitHub 专有 marketplace,保证 Gitea 可跑。
- 测试步骤按需加 `--no-file-parallelism` 兜底(M16 已修 flaky,理论上默认并行即可,注释说明取舍)。

### 2. GitHub Pages 部署站点

- 站点子路径适配:`site/vite.config.ts` 增 `base`(生产 `'/liquid-glass-react/'`,dev 保持 `'/'`,
  用 env 区分);站点已是 hash 路由,子路径下客户端导航天然可用,只需资产带 base。
- `.github/workflows/deploy-pages.yml`(GitHub 专用):push 到 main → build 库 + `pnpm site:build`
  → `actions/upload-pages-artifact` → `actions/deploy-pages`。启用仓库 Pages(用户操作)。
- README/package.json `homepage` 回填实际 Pages URL(`https://ttqtt.github.io/liquid-glass-react/`
  或用户实际路径)。

### 3. npm 发布自动化

- `.github/workflows/release.yml`:打 `v*` tag → checkout → setup-node → corepack → install →
  `pnpm build` → `npm publish --access public`,鉴权用 `NODE_AUTH_TOKEN`(仓库 secret,用户配)。
- `prepublishOnly` 已在 M15 就位,发布前自动跑 typecheck/build/test。

### 4. `RELEASING.md`

- 发版流程:更新 CHANGELOG → bump version → `git tag v0.x.y` → push tag(触发 release 工作流)
  或手动 `pnpm publish`;Pages 随 main 更新。列明需要的 secret(`NODE_AUTH_TOKEN`)与
  Pages 启用步骤、GitHub 镜像仓库地址。

## 测试要求(无 runner/无浏览器环境的验收面)

- YAML 合法(结构/缩进正确);`site/vite.config.ts` 加 base 后 `pnpm site:build` 本机成功、
  产物资产路径带 `/liquid-glass-react/` 前缀。
- 库构建与全量测试仍绿(base 改动不影响库构建与库测试;site App.test 用别名不受 base 影响)。

## 验收标准

- [ ] `ci.yml` / `deploy-pages.yml` / `release.yml` 三个工作流就位,CI 仅用通用 action、可移植。
- [ ] 站点加 `base`,`pnpm site:build` 生产构建资产带子路径前缀,本机验证通过。
- [ ] `RELEASING.md` 说明发版/部署流程与所需 secret / Pages 启用。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:**留用户操作**——启用 GitHub Pages、配置 `NODE_AUTH_TOKEN`、
      建 GitHub 镜像、首次打 tag 触发发布;这些在本环境无法自验。

## 明确非目标

- 实际执行 publish / 部署(凭据在用户手);视觉回归;发布后监控/统计;多包/monorepo 化。

## 完成记录

- **可移植 CI** `.github/workflows/ci.yml`:push / pull_request → checkout → setup-node(Node 24)
  → `corepack enable` → `pnpm install --frozen-lockfile` → typecheck → build → test。仅用
  `actions/checkout` + `actions/setup-node` 两个通用 action,GitHub Actions 与 Gitea/Forgejo
  Actions 通用(均读 `.github/workflows/`)。测试用默认并行(M16 已修 flaky),注释里留了
  `--no-file-parallelism` 兜底说明。
- **站点子路径** `site/vite.config.ts` 改为函数式:`base = command === 'build' ? '/liquid-glass-react/'
  : '/'`——生产构建带子路径、dev 保持 `/`。实测 `pnpm site:build` 后 `site/dist/index.html` 资产
  路径为 `/liquid-glass-react/assets/...`。站点是 hash 路由,子路径下客户端导航天然可用。
- **Pages 部署** `.github/workflows/deploy-pages.yml`(GitHub 专用):push main → `pnpm site:build`
  → `configure-pages` / `upload-pages-artifact`(`path: site/dist`)→ `deploy-pages`。含 Pages 三项
  权限与 `concurrency: pages`。站点别名指向 `../src`,无需先构建库。
- **发布自动化** `.github/workflows/release.yml`:推 `v*` tag → setup-node(`registry-url`)→
  install → build → `npm publish --access public`,鉴权 `NODE_AUTH_TOKEN`;`prepublishOnly`(M15)
  发布前自动跑 typecheck/build/test 作最终门禁。
- **`RELEASING.md`**:三工作流一览 + 发版步骤(改 CHANGELOG → `pnpm version` → push main & tags)
  + 手动发布 + 一次性人工配置(镜像仓库、启用 Pages、配 `NODE_AUTH_TOKEN`)。
- **homepage 回填**:`package.json` / `README` / `CHANGELOG` 的 URL 已在 M17 改为真实账号
  `github.com/Tsdsj/...`、Pages 域 `tsdsj.github.io/liquid-glass-react/`。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **393/393 绿**、`pnpm site:build` ✓、
  三个 workflow YAML 结构合法。
- **留用户操作**(本环境无 runner/浏览器/凭据,无法自验):① 建 GitHub 镜像并 `git push github main`;
  ② Settings → Pages → Source 选 "GitHub Actions" 启用 Pages;③ 配 `NODE_AUTH_TOKEN` secret;
  ④ 首次打 `v0.1.0` tag 推送以触发 `release.yml`。用户已反馈①②③已完成。
