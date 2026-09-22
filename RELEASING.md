# 发版与 CI/CD

包名 `@ttqtt/liquid-glass-react`，单包发布，产物只有 `dist/`。

发版动作只有一个：**打标签**。其余全部由标签触发。

```bash
pnpm version 0.0.3 && git push --follow-tags
```

**如果 `package.json` 里已经写着要发的那个版本号**（这一版就是：0.0.2 提前写进去了，但从没发出去），`pnpm version` 会以 `ERR_PNPM_VERSION_NOT_CHANGED` 拒绝。那种情况下只打标签：

```bash
git push origin main            # 先把 main 推上去，等 CI 绿
git tag -a v0.0.2 -m "v0.0.2"
git push origin v0.0.2          # 这一下才是发版
```

**但第一次不行。** 这个包在 2026-09-15 被整包 `unpublish` 了，registry 上现在什么都没有，而 npm 的可信发布者是挂在**包**上的配置——包不存在，就没有那个设置页。所以 0.0.1 必须先手工发一次，见下面的〈首次发布〉。

---

## 一次性配置

### 1. npm Trusted Publishing

不用令牌。npm 直接认 GitHub 签发的 OIDC 身份，所以没有密钥可泄漏，没有到期，也不用掏 OTP。

**要等 0.0.1 手工发出去之后才能配。** 然后打开
https://www.npmjs.com/package/@ttqtt/liquid-glass-react/access → **Trusted Publisher** → Add：

| 项 | 取值 |
| --- | --- |
| Publisher | GitHub Actions |
| Label | 可留空 |
| Organization or user | `Tsdsj` |
| Repository | `liquid-glass-react` |
| Workflow filename | `release.yml` |
| Environment name | `npm` |
| **Allow npm publish** | **勾上** |

前六项必须和 `release.yml` 里的完全一致——OIDC 令牌里带着它们，对不上 npm 就拒绝。**这些字段建好之后改不了**，要改只能删掉重建。

最后那个勾单独说：npm 默认只允许可信发布者做 `npm stage publish`（发到暂存区，再人工提升为正式版），直接 `npm publish` 要单独授权。`release.yml` 跑的是 `npm publish`，所以必须勾上，否则发版那一步会被拒。

构建溯源（provenance）随之自动生成，包页上会出现一个可验证的来源徽章。

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
| `ci.yml` | push main、PR、手动 | 类型检查 → 构建 → 74 单元 → 7 SSR → 站点构建 → 462 真实 Chrome → 15 开发模式 → 18 WebKit/Firefox → 核对 tarball → 体积报告 |
| `pages.yml` | push main、手动 | 构建文档站并部署 |
| `release.yml` | push `v*` 标签 | 先整个跑一遍 `ci.yml`，再发 npm，再建 GitHub Release |

`release.yml` 用 `workflow_call` 复用 `ci.yml`，不是复制一份——标签走的检查和 PR 走的检查永远是同一套，不会各自漂移。

浏览器测试跑的是**正式 Google Chrome 渠道**，不是捆绑的 Chromium：折射路径依赖前者。本机第一次跑之前需要

```bash
pnpm exec playwright install --with-deps chrome
pnpm exec playwright install --with-deps webkit firefox
```

---

## 首次发布（只做一次）

0.0.1 必须手工发，因为可信发布者要挂在一个已经存在的包上。发完之后回到上面配好 Trusted Publishing，从 0.0.2 起就是打标签自动走了。

**要等到 2026-09-16 06:04 UTC（北京时间 14:04）之后。** 整包 unpublish 之后 npm 封这个名字 24 小时，早了会被拒。

```bash
npm login                                  # 走浏览器，2FA 在 npmjs.com 那边过
pnpm install --frozen-lockfile
pnpm check                                 # 和 CI 跑的是同一串
pnpm version 0.0.1 --no-git-tag-version    # 只改 package.json，标签留到最后
pnpm build
RELEASE_TAG=v0.0.1 pnpm verify:package
git commit -am "Release 0.0.1"             # pnpm 不从脏树上发包
pnpm publish --access public
```

倒数第二条不能省：`pnpm publish` 遇到未提交的改动会直接停下（`ERR_PNPM_GIT_UNCLEAN`）。这是对的——发出去的版本号必须对应一个真实的提交，否则 registry 上有 0.0.1、仓库里却找不到它是从哪来的。

最后一条会停下来问 `This operation requires a one-time password:`，这时候再去验证器 App 或邮箱拿码。**不要用 `--otp=` 预先填**——那个码只活半分钟到几分钟，等包传完多半已经过期了。

然后：

1. 回 npm 包页配 Trusted Publisher（上面那张表）；
2. 打标签推上去——

```bash
git tag v0.0.1 && git push --follow-tags
```

标签会触发 `release.yml`：跑完整套检查，发现 0.0.1 已经在 registry 上就跳过发包那一步，然后建好 GitHub Release。**从此以后不用再手工发。**

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
pnpm version 0.0.2        # 改 package.json、建提交、建 v0.0.2 标签
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

这个包名下曾有一套 2026 年 7 月的旧实现（0.1.0 / 0.2.0），与本项目没有代码继承关系。2026-09-15 整包 `unpublish`，registry 上现在是空的，号从 0.0.1 重开。

由此留下两条永久约束：

- **0.1.0 和 0.2.0 再也不能用了。** npm 的版本号是一次性的："Once `package@version` has been used, you can never use it again." 下架不会把号还回来。所以 0.0.x 之后下一个次版本号要跳过 0.1.0，直接走 **0.3.0**。
- **下架后 24 小时内不能以这个名字发任何版本。** 窗口在 2026-09-16 06:04 UTC（北京时间 14:04）之后结束。

### 往后

- **patch**（0.0.2）— 修 bug、补文档，不动 API。
- **minor**（0.3.0，跳过被占死的 0.1.0 / 0.2.0）— 新增组件或属性。0.x 阶段破坏性改动也走 minor，但必须附改名对照表，像 `docs/migration-0.2.md` 那样。
- **major**（1.0.0）— 留给 API 稳定、且屏幕阅读器与真机触摸验证都做完之后。现在的 README 自己写着这些没做完，提前发 1.0.0 就是和它打架。

预发布版本（`0.3.0-beta.1`）由 `release.yml` 自动发到 `next` 标签下，不会让人 `pnpm add` 时装上。

---

## 手工发布（应急）

流水线坏了又必须发的时候：

```bash
npm login
pnpm check
pnpm build
RELEASE_TAG=v0.0.2 pnpm verify:package
pnpm publish --access public          # 会停下来问 OTP，那时候再拿码
```

`prepublishOnly` 会再跑一次 `verify:package`，所以下面这些漏不掉：

- `dist/index.js` 第一行是 `"use client";`——少了这行，包在 Next.js App Router 的服务端组件里一导入就报错；
- tarball 里没有 `src/`、`site/`、`tests/`、`scripts/`；
- `exports` 里每一个入口都真的指向打进包里的文件；
- 有 `RELEASE_TAG` 时，标签号与 `package.json` 一致。

手工发布拿不到构建溯源（provenance）——那是 CI 用 OIDC 签的，本机签不了；而且每一次写操作都要现掏一次 OTP。所以只在应急时用。

---

## 发布后

- GitHub Release 由流水线自动建好，正文取自 CHANGELOG。
- 把 `docs/action-items.md` 里这一轮关掉的项更新掉。
- 在一个空的 Vite React 项目里从 registry 真装一次。`pnpm pack` 的文件清单证明不了 `exports` 在别人的打包器里解析得开。
