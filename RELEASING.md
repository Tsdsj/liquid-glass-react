# 发版与 CI/CD

包名 `@ttqtt/liquid-glass-react`，单包发布，产物只有 `dist/`。

发版动作只有一个：**打标签**。其余全部由标签触发。

```bash
pnpm version 0.0.1 && git push --follow-tags
```

---

## 一次性配置

这三项配完之后，以后发版不用再碰。

### 1. npm Trusted Publishing

不用令牌。npm 直接认 GitHub 签发的 OIDC 身份，所以没有密钥可泄漏，也没有到期这回事。

打开 https://www.npmjs.com/package/@ttqtt/liquid-glass-react/access → **Trusted Publisher** → Add：

| 项 | 取值 |
| --- | --- |
| Publisher | GitHub Actions |
| Repository | `Tsdsj/liquid-glass-react` |
| Workflow filename | `release.yml` |
| Environment | `npm` |

这四项必须和 `release.yml` 里的完全一致——OIDC 令牌里带着它们，对不上 npm 就拒绝。构建溯源（provenance）随之自动生成，包页上会出现一个可验证的来源徽章。

> 首次发布一个**全新的包名**时，npm 还不知道有这个包，也就无处登记可信发布者。做法是先用一次性的 Granular Access Token 手工发出 0.0.1，包存在之后再回来配 Trusted Publishing，后续版本就全自动了。本项目的包名已经存在，可以直接配。

### 2. 发布环境

在 Settings → Environments 新建 `npm`。两个作用：

- Trusted Publishing 拿它当身份的一部分（上表最后一行）；
- 勾上 **Required reviewers** 填自己，发包前 GitHub 会等你按一下确认——防止误推的标签直接发到 registry 上。

```bash
gh api -X PUT /repos/Tsdsj/liquid-glass-react/environments/npm
```

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
pnpm version 0.0.1        # 改 package.json、建提交、建 v0.0.1 标签
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

registry 上原本有一套 2026 年 7 月发的旧实现：

```text
@ttqtt/liquid-glass-react   0.1.0 (2026-07-15)   0.2.0 (2026-07-16)
```

本轮是完整重写，与那套没有代码继承关系，所以**号从 0.0.1 重开**，旧的两个版本作废。

### 作废旧版本

```bash
npm deprecate "@ttqtt/liquid-glass-react@<=0.2.0" "旧实现，已被 0.0.1 起的重写版取代：https://tsdsj.github.io/liquid-glass-react/"
```

`deprecate` 是能立刻做到的那一种作废：版本还在 registry 上（已经写进别人锁文件的不会解析失败），但 `npm install` 会打印弃用警告，包页上也会标出来。

**彻底删除做不到。** npm 只允许在发布后 **72 小时内** `unpublish`；这两个版本是两个月前发的，早过了窗口。超期后想整包下架必须满足"无人依赖 + 周下载 < 300 + 单一维护者"并**联系 npm 支持**人工处理。而且一旦下架，那两个版本号就被永久占死、不能再发——所以即便办得到，`deprecate` 也是更划算的做法。

### 号会往回走

发 0.0.1 时 `latest` 会从 0.2.0 **退回**到 0.0.1。这是有意的，但要知道两件事：

- 已经装了 0.2.0 的人不会被自动升级，因为 `^0.2.0` 匹配不到 0.0.1，他们会停在旧实现上——弃用警告就是给他们看的；
- `npm view … version` 从此显示 0.0.1，看着像退步，实际是换了一条线。

### 往后

- **patch**（0.0.2）— 修 bug、补文档，不动 API。
- **minor**（0.1.0）— 新增组件或属性。0.x 阶段破坏性改动也走 minor，但必须附改名对照表，像 `docs/migration-0.2.md` 那样。
- **major**（1.0.0）— 留给 API 稳定、且屏幕阅读器与真机触摸验证都做完之后。现在的 README 自己写着这些没做完，提前发 1.0.0 就是和它打架。

预发布版本（`0.1.0-beta.1`）由 `release.yml` 自动发到 `next` 标签下，不会让人 `pnpm add` 时装上。

---

## 手工发布（应急）

流水线坏了又必须发的时候：

```bash
npm login
pnpm check
pnpm build
RELEASE_TAG=v0.0.1 pnpm verify:package
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
