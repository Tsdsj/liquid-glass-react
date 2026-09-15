# 发版与 CI/CD

包名 `@ttqtt/liquid-glass-react`，单包发布，产物只有 `dist/`。

发版动作只有一个：**打标签**。其余全部由标签触发。

```bash
pnpm version 0.3.0 && git push --follow-tags
```

---

## 一次性配置

这三项配完之后，以后发版不用再碰。

### 1. npm 令牌

在 https://www.npmjs.com/settings/ttqtt/tokens 建一个 **Granular Access Token**：

| 项 | 取值 |
| --- | --- |
| Packages | 只勾 `@ttqtt/liquid-glass-react`，权限 Read and write |
| Organizations | 不需要 |
| 有效期 | 90 天（到期要换，记在日历上） |

拿到的 `npm_…` 串存进仓库：

```bash
gh secret set NPM_TOKEN --repo Tsdsj/liquid-glass-react
```

> 更省事的替代是 npm 的 **Trusted Publishing**：在 npm 包设置里把 `Tsdsj/liquid-glass-react` 的 `release.yml` 登记为可信发布者，就不需要任何令牌，也没有到期问题。配好之后把 `release.yml` 里的 `NODE_AUTH_TOKEN` 那两行删掉即可。

### 2. 发布环境（可选，但建议）

在 Settings → Environments 新建 `npm`，勾上 **Required reviewers** 填自己。这样每次发包前 GitHub 会等你按一下确认——防止误推标签直接发到 registry 上。`release.yml` 已经指向这个环境。

### 3. GitHub Pages

已配置为 GitHub Actions 源，无需再动。每次推 `main` 自动部署到
https://tsdsj.github.io/liquid-glass-react/ 。

---

## 三条流水线

| 工作流 | 触发 | 做什么 |
| --- | --- | --- |
| `ci.yml` | push main、PR、手动 | 类型检查 → 构建 → 65 单元 → 3 SSR → 站点构建 → 84 真实 Chrome → 16 WebKit/Firefox → 核对 tarball → 体积报告 |
| `pages.yml` | push main、手动 | 构建文档站并部署 |
| `release.yml` | push `v*` 标签 | 先整个跑一遍 `ci.yml`，再发 npm，再建 GitHub Release |

`release.yml` 用 `workflow_call` 复用 `ci.yml`，不是复制一份——标签走的检查和 PR 走的检查永远是同一套，不会各自漂移。

浏览器测试跑的是**正式 Google Chrome 渠道**，不是捆绑的 Chromium：折射路径依赖前者。本机第一次跑之前需要

```bash
pnpm exec playwright install --with-deps chrome
pnpm exec playwright install --with-deps webkit firefox
```

---

## 发一个版本

### 1. 本机先过一遍

```bash
pnpm install --frozen-lockfile
pnpm check
```

`check` 和 CI 跑的是同一串命令。本机过不了就不要推标签——CI 只会慢十分钟告诉你同一件事。

### 2. 写 CHANGELOG

在 `CHANGELOG.md` 顶部加一节，标题必须正好是 `## <版本号>`（不带 `v`）。

**这一节会被原样用作 GitHub Release 的正文**，`release.yml` 按标题把它切出来。两边因此不可能对同一个版本给出两种说法。

### 3. 打标签

```bash
pnpm version 0.3.0        # 改 package.json、建提交、建 v0.3.0 标签
git push --follow-tags
```

然后就没你的事了。可以看着它跑：

```bash
gh run watch
```

### 4. 确认

```bash
npm view @ttqtt/liquid-glass-react version
```

再在一个空的 Vite React 项目里真装一次——`pnpm pack` 的文件清单证明不了 `exports` 在别人的打包器里解析得开。

---

## 版本号

现在的 registry 状态：

```text
@ttqtt/liquid-glass-react   0.1.0 (2026-07-15)   0.2.0 (2026-07-16)   latest → 0.2.0
```

**0.2.0 及以下都已被占用**，而且 npm 不允许覆盖已发布的版本。本轮重写的第一个正式版因此从 **0.3.0** 起。

- **patch**（0.3.1）— 修 bug、补文档，不动 API。
- **minor**（0.4.0）— 新增组件或属性，旧写法继续可用。0.x 阶段破坏性改动也走 minor，但必须附改名对照表，像 `docs/migration-0.2.md` 那样。
- **major**（1.0.0）— 留给 API 稳定、且屏幕阅读器与真机触摸验证都做完之后。

预发布版本（`0.4.0-beta.1`）由 `release.yml` 自动发到 `next` 标签下，不会让人 `pnpm add` 时装上。

---

## 手工发布（应急）

流水线坏了又必须发的时候：

```bash
pnpm check
pnpm build
RELEASE_TAG=v0.3.0 pnpm verify:package
pnpm publish --access public
```

`prepublishOnly` 会再跑一次 `verify:package`，所以下面这些漏不掉：

- `dist/index.js` 第一行是 `"use client";`——少了这行，包在 Next.js App Router 的服务端组件里一导入就报错；
- tarball 里没有 `src/`、`site/`、`tests/`、`scripts/`；
- `exports` 里每一个入口都真的指向打进包里的文件；
- 有 `RELEASE_TAG` 时，标签号与 `package.json` 一致。

手工发布拿不到构建溯源（provenance）——那是 CI 用 OIDC 签的，本机签不了。所以只在应急时用。

---

## 发布后

- GitHub Release 由流水线自动建好，正文取自 CHANGELOG。
- 把 `docs/action-items.md` 里这一轮关掉的项更新掉。
- npm 令牌到期前换新的。
