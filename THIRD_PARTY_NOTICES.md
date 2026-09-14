# 第三方与素材说明

本项目新编写的 TypeScript/JavaScript、CSS、测试、文档、图标路径和 Alpine SVG 场景按根目录 MIT LICENSE 分发。演示图不是 Apple 壁纸，不含 Apple 标志或打包字体。

## 离线预览运行时

`preview/vendor/react-runtime.js` 及由它生成的 `preview/bundle.js` 含 React 19.1.1、ReactDOM 19.1.1、JSX runtime 和 Scheduler 的生产运行时代码。原始 MIT 版权头保留，完整许可见 `preview/vendor/LICENSE-React.txt`。

本次离线环境没有从 npm 重新下载这些包；预览运行时来自环境中已安装的 Playwright trace viewer bundle 中的 React/Scheduler/ReactDOM 代码段，已排除其应用辅助代码，仅用于可运行检查预览。这个来源、版本与源码工作区的 npm 依赖分开记录。生产发行应通过真实 npm 安装与标准 Vite 构建重新生成产物并审计其依赖。

React 官方源码：`https://github.com/facebook/react`。工作区声明的 React 19.2.7 并未在本环境安装验证。

## 参考但未复制

rdev/liquid-glass-react、shuding/liquid-glass、leefanv/liqui-design 和 Apple 文档用于原调研与概念参照。本项目没有把它们的源码作为已安装内核或 vendored 文件交付。后续选择复用时应固定实际版本/提交并保留对应许可。

## 字体与网络素材

只使用系统字体栈，不交付 .woff/.woff2/.ttf/.otf 文件。演示不从图片服务、字体 CDN 或追踪服务加载资源。生成/导出的 SVG 只来自项目内原创场景。
