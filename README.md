# Liquid Glass React

> 把 Apple 的液态玻璃搬上网页——边缘会折射身后的世界,高光随指尖流动,按下时轻轻回弹。

[![npm](https://img.shields.io/npm/v/@ttqtt/liquid-glass-react.svg)](https://www.npmjs.com/package/@ttqtt/liquid-glass-react)
[![CI](https://github.com/Tsdsj/liquid-glass-react/actions/workflows/ci.yml/badge.svg)](https://github.com/Tsdsj/liquid-glass-react/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@ttqtt/liquid-glass-react.svg)](./LICENSE)

一套复刻 Apple Liquid Glass 质感的 React 组件库:35 个组件共享同一种会折射的玻璃材质、同一套主题与无障碍标准。**English speakers:** a React component library that recreates Apple's Liquid Glass — real edge refraction on Chromium, a graceful frosted fallback everywhere else.

**🔗 在线预览 / Live demo:** https://tsdsj.github.io/liquid-glass-react/

## 亮点

- **会折射的玻璃** — 玻璃边缘真实折射身后的内容,光影随指针流动,不是一张模糊贴图。
- **处处都好看** — 不支持折射的浏览器自动换成细腻毛玻璃;暗色、高对比、减少动效都照顾到。
- **人人可用** — 每个组件都能用键盘操作,焦点清晰,读屏友好;按下的玻璃回馈鼠标键盘一致。
- **随心换装** — 强调色、圆角、模糊、环境色随手可调,亮暗主题一键切换。

## 安装

```bash
pnpm add @ttqtt/liquid-glass-react
```

需要 React 18 或 19(作为 peer 依赖)。唯一的第三方依赖是 `@floating-ui/react`。

## 三行上手

```tsx
import '@ttqtt/liquid-glass-react/style.css';
import { Button, Toaster, toast } from '@ttqtt/liquid-glass-react';

export function App() {
  return (
    <>
      <Toaster />
      <Button variant="accent" onClick={() => toast.success('你好,液态玻璃')}>
        点我
      </Button>
    </>
  );
}
```

## 浏览器支持

| 浏览器 | 效果 |
|---|---|
| Chrome / Edge(Chromium) | 完整边缘折射(SVG 位移滤镜) |
| Safari / Firefox | 自动降级为毛玻璃(模糊 + 饱和 + 高光),布局与交互完全一致 |

系统开启「减少透明度 / 增强对比度 / 减少动态」时进一步降级为不透明表面与纯淡入,无需额外配置。

## 主题

所有视觉参数都是 `--lg-*` CSS 变量:根元素设 `data-theme="dark"` 切暗色,在任意容器上覆盖变量即可局部定制。

```css
.brand-area {
  --lg-accent: #7c3aed;
  --lg-radius-md: 18px;
}
```

## 服务端渲染 / Next.js

组件在服务端安全降级(首帧毛玻璃、挂载后升级折射,无 hydration 不匹配)。在 Next.js App Router 中:根 `app/layout` 引入一次 `style.css`,用到 `toast` / 浮层等交互 API 的文件顶部加 `'use client'`。详见文档站「Next.js(App Router)」一节。

## 文档

组件总览、交互演示与 API 见文档站:**https://tsdsj.github.io/liquid-glass-react/**

## License

[MIT](./LICENSE) © ttqtt
