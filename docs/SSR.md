# SSR、Hydration 与 Strict Mode

组件模块不在 import 阶段调用 document、Canvas 或 ResizeObserver。首次服务端渲染输出普通 CSS 材质；客户端测量后才启用 SVG，滤镜 ID 由 React useId 生成。这样设计的目标是避免服务端依赖 DOM 和客户端首帧缺失可读内容。

```bash
pnpm install
pnpm build
ppnpm test:ssr
node examples/ssr/render.mjs
```

`examples/ssr/render.mjs` 展示 renderToString 和 identifierPrefix 的使用。使用 hydrateRoot 时，树结构、初始 props 和 prefix 必须与服务端一致。多根应用使用各不相同的字母/数字/连字符前缀，不能复用同一 SSR HTML 给多个根。

系统主题在服务端没有浏览器偏好，因此默认先使用浅色。需要避免首屏切换时，应让应用把已知 theme 一致传入服务端和客户端。不要在组件模块加载时根据 window 改写树结构。

Dialog 的 defaultOpen 由挂载 effect 调用 showModal，不将一个原生模态顶层伪装成单纯 HTML open 属性。受控开关也应保持服务端与客户端初值一致。

## 实际状态

核心模块的 Node 导入、无 DOM 安全返回已经执行。React renderToString、流式 SSR、hydration、React 19.2.7 的开发 Strict Mode **尚未执行**，因为当前环境未能安装相应 npm 依赖。离线预览使用 React 19.1.1 production，即使源码包裹 StrictMode，也不能据此声称开发模式重复 effect 检查通过。

新增 SSR 框架适配时先用最小客户端边界接入，再测试多实例、开着的弹层、系统主题、组件挂卸载和多根 ID。不要直接宣称“兼容所有 Next.js 场景”。
