# 离线预览

这是同一套组件与演示源代码的 ESM 转译产物，不是静态截图。

使用 `node scripts/serve-preview.mjs` 从项目根目录启动。不要双击 HTML：ES 模块需要 HTTP 服务。

该预览仅为交付检查附带 React / ReactDOM **19.1.1** 的 MIT 许可客户端运行时（当前执行环境预置版本）。npm 开发工程声明 **19.2.7**，尚未联网安装。请勿把预览运行时版本视为开发依赖已经验证；正式部署应安装开发依赖并运行 `npm run build` 重新生成。

React 客户端运行时的许可见 `vendor/LICENSE-React.txt`。没有打包字体文件，也没有包含 React Server Components 服务端。
