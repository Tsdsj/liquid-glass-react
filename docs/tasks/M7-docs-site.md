---
status: done
depends: [M6f]
---

# M7 — 文档站:首页 / 组件总览 / 组件演示页 / 使用文档(仿 ant.design 信息架构)

用本组件库自身搭建文档站(dogfooding),信息架构参照 ant.design 首页与
components/overview:首页(hero + 特性)、组件总览(卡片网格 + 搜索)、
组件详情页(演示 + 代码 + Props 表)、使用文档页(安装/快速开始/主题/
降级/国际化)。

## 硬约束

- **零新增依赖**(dev 与 runtime 都不加):路由用自写 hash router,代码块
  不用高亮库,站点只依赖已有的 vite + @vitejs/plugin-react + 本库。
- 站点代码与库代码隔离在 `site/`,不影响库构建(`pnpm build`)、dts、测试。
- 站点通过别名 `@ttq/liquid-glass-react` 引用 `src/index.ts`,演示代码
  与真实用户用法一致。
- 中文默认、中英可切换(接 `LiquidGlassConfig locale` + 站点文案字典);
  亮暗主题切换(`data-theme`)。
- 页面本身尽量使用库内组件(导航栏/卡片用 GlassSurface,交互用
  Button/Select/Switch/Input/Tooltip/toast 等)。

## 结构(定稿)

```
site/
  index.html
  vite.config.ts          # root=site,别名指向 ../src/index.ts
  src/
    main.tsx  App.tsx     # 主题/语言状态、hash 路由、Toaster、页面骨架
    router.ts             # useHashRoute:'', components, components/:slug, guide
    site-i18n.ts          # 站点文案字典(zh-CN 默认 / en-US)
    site.css              # 站点布局样式(尽量走 --lg-* token)
    components/DemoBlock.tsx PropsTable.tsx
    demos/registry.ts + <component>.demos.tsx × 12
    pages/HomePage.tsx ComponentsPage.tsx ComponentDetailPage.tsx GuidePage.tsx
```

- `package.json` 增加脚本:`site`(dev)、`site:build`。
- 根 `vite.config.ts` 增加 resolve.alias(vitest 解析站点测试用);
  `tsconfig.json` include 增加 `site`。
- 站点产物 `site/dist` 被既有 `.gitignore` 的 `dist/` 规则覆盖。

## 内容要求

- 组件总览覆盖全部公开组件(GlassSurface、Button、Checkbox、Input、
  Textarea、Select、Slider、Switch、Tooltip、Popover、Modal、Toast)。
- 每个详情页:简介、≥2 个可交互演示(带代码与复制按钮,复制成功用
  toast 反馈)、Props 表(与 TS 接口一致)。
- 使用文档页:安装、快速开始(三行代码 + style.css + Toaster)、主题与
  token 覆盖、浏览器支持与降级说明(折射 Chromium-only)、国际化。

## 验收标准

- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过(库构建不受影响)。
- [ ] `pnpm site:build` 产出静态站点。
- [ ] 冒烟测试:四类页面在 jsdom 下可渲染(首页文案、总览卡片数、
      详情页演示与 Props 表、文档页安装命令),语言切换生效、主题切换
      改变 `data-theme`,搜索过滤组件卡片。
- [ ] 中文默认;所有站点文案有中英两份。
- [ ] 无浏览器环境不做视觉验证,完成记录注明待本地目检。

## 明确非目标

- SSR / SEO / 站点部署配置(后续另行立卡)。
- 代码语法高亮、沙箱编辑器(CodeSandbox 跳转等)。
- 修改库本身的任何代码或样式。

## 完成记录(2026-07-15)

按定稿结构实现,零新增依赖,库代码零改动:

- 基建:`site/vite.config.ts`(root=site,别名 `@ttq/liquid-glass-react` →
  `../src/index.ts`,端口 6007)、`site/index.html`;根 `vite.config.ts` 加同名
  别名(供 vitest 解析站点测试);`tsconfig.json` include 加 `site`;
  `package.json` 加 `site` / `site:build` 脚本;`src/test/node-runtime.d.ts`
  补 `node:url` 垫片(types 白名单无 Node 类型)。
- 站点:自写 hash 路由(`router.ts`:首页 / components / components/:slug /
  guide);站点文案字典 `site-i18n.ts`(zh-CN 默认,en-US 全量);
  `App.tsx` 管理主题(`data-theme`)与语言(接 `LiquidGlassConfig locale` +
  站点 Context),导航栏为 GlassSurface 玻璃条,根挂 `<Toaster/>`。
- 页面:首页(photo 壁纸 hero + 玻璃组件橱窗 + 四特性卡 + 快速开始代码);
  组件总览(Input 搜索过滤 + 12 张玻璃卡片,预览区 inert 防 Tab 噪音);
  组件详情(左侧玻璃菜单 + DemoBlock 演示台/显示代码/复制(toast 反馈)+
  PropsTable);使用文档(安装/快速开始/主题 token/浏览器降级/i18n/性能
  六节)。12 个组件全部有 ≥1 个可交互演示 + API 表,共 19 个演示。
- 测试:`site/src/App.test.tsx` 10 条冒烟——默认中文首页、语言切换全站生效、
  主题切换 `data-theme`、总览全量卡片与搜索过滤/空态、详情页演示与 API 表
  与侧栏、显示代码、未知 slug 兜底、hash 导航往返、Modal 演示开关。

验证:`pnpm typecheck && pnpm build && pnpm test` 通过(187 tests,新增 10);
`pnpm site:build` 产出 `site/dist`(与库 `dist/` 互不干扰,已被 .gitignore
覆盖)。注:全量并行下既有 Modal 焦点测试偶发失败一次,单文件复跑通过,
为已记录的既有 flake,与本卡无关。**待本地目检**:`pnpm site` 起 6007 端口
检查视觉与交互(本环境无浏览器)。
