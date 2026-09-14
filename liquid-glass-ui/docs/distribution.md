# 分发、版本与包体

## 当前分发形态

三个 npm workspace 包均为 private alpha。它们没有公共 registry 发布状态，也没有 npm 名称占用/商标审查保证。本交付是压缩包源码 + 离线检查预览。

```bash
npm run registry:build
npm run source:copy -- ../app/src/vendor/liquid-glass
```

registry.json 是本项目本地 source-copy 清单，包含源文件内容、SHA-256 与版本。**它不是 shadcn registry schema，也没有宣称能通过 shadcn CLI 安装。** 源码复制脚本会把 core/tokens 引用改成相对路径，保留 React 导入与 LICENSE，拒绝覆盖已有目标。

## 本地 npm 包

```bash
npm install
npm run typecheck
npm run build:packages
npm run pack:local
```

`artifacts/` 中的三个 tgz 必须一起安装到消费项目，保证 @liquid-glass-ui/core/tokens/react 同步版本。先执行检查与构建，不能直接将未经语义检查的离线转译文件当成发布产物。

当前交付只包含已真实编译的 core/tokens dist；React 标准 dist 留给联网标准构建生成。离线 React 组件 JS 位于 preview，不作为公共包类型声明使用。

## 大小报告

`npm run size` 报告当前存在的 JS/CSS 文件原始和 gzip 大小。它明确标记为逐文件统计；未经过 tree-shaking 的总大小不是单独 import GlassButton 的成本，多个单独 gzip 结果之和也不等于真实 HTTP 分包结果。

正式发行前需要分别构建“单按钮”“共享工具栏”“SVG 场景”等独立消费入口，固定 bundler/压缩参数，再公布真实导入成本。当前没有虚构这一测量。

## 版本策略

alpha 可以调整 API，但每次变更要在 CHANGELOG 记录并同步三个内部包版本。未来达到正式发布门槛后再决定 SemVer 稳定区间、公共名字、registry 兼容与迁移脚本。private 字段是防止误发布的保护，不应仅为 npm publish 成功就删掉。
