---
status: todo
depends: [M4]
---

# M5 — 构建发布与烟测

## 步骤

1. **README.md**（面向使用者，中文）：
   - 简介 + 效果截图（Storybook 截图，`docs/assets/` 存放）
   - 安装：`pnpm add @ttq/liquid-glass-react`
   - 快速开始三行代码（import 组件 + `import '@ttq/liquid-glass-react/style.css'` + `<Toaster/>`）
   - 浏览器支持说明：折射 Chromium-only，Safari/Firefox 自动降级为毛玻璃（一句话 + 对比截图）
   - 主题定制：dark 模式（`data-theme`）+ token 覆盖表（链接 docs/tokens.md 或内嵌常用 10 个）
   - 组件清单表 + 指向 Storybook
   - 性能建议：长列表用 `refraction="off"`；玻璃用于浮层与控件
2. **发布配置**：`.npmrc` 私有 registry（用户自填 registry 地址，留注释模板）；package.json 补 `prepublishOnly: "pnpm typecheck && pnpm build && pnpm test"`、`repository`、`license: "MIT"`（或用户指定）。
3. **烟测**（在 `/tmp` 下建临时 vite react 项目）：
   - `pnpm pack` 生成 tarball，临时项目安装
   - 验证：ESM import 正常；`style.css` 导入生效；TS 类型提示正常；`vite build` 后检查 bundle——只 import Button 时产物不含 Modal/floating-ui 代码（tree-shaking）
   - CJS 冒烟：node -e require 能加载
4. 版本 `0.1.0`，`pnpm publish --access restricted`（**发布动作需用户确认 registry 与 scope 后执行，不要自行发布**）。

## 验收标准

- [ ] 烟测四项全过，结果记录在完成记录里
- [ ] README 完整（上述 7 节）
- [ ] `git tag v0.1.0`
- [ ] 发布步骤就绪，等待用户确认 registry

## 完成记录

（完成后填写）
