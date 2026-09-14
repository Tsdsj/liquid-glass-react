# 分发

单包发布：`@ttqtt/liquid-glass-react`。发版步骤见 [`../RELEASING.md`](../RELEASING.md)。

## 产物

`pnpm build` 产出三样东西，`files` 字段只允许 `dist/` 加三份说明文件进入 npm 包：

| 文件 | 内容 |
| --- | --- |
| `dist/index.js` | 单个 ESM 产物，顶部带 `"use client"`。React 走 external，不会把第二份 React 打进来。 |
| `dist/index.d.ts` 及分目录声明 | 类型。内部引用全部是相对路径，使用方不需要配任何映射。 |
| `dist/style.css` | 合并后的样式表。另外单独提供 `dist/tokens.css` 与 `dist/components.css`，方便只想覆盖 token 的场景。 |

没有源码需要被复制粘贴——这不是 shadcn 那种把组件源码抄进项目的分发方式，装包就行。

## 入口

```json
"exports": {
  ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
  "./style.css": "./dist/style.css",
  "./tokens.css": "./dist/tokens.css",
  "./components.css": "./dist/components.css"
}
```

`sideEffects` 只列了 CSS，所以打包工具可以安全地摇掉没用到的组件；引入的样式表不会被误删。

## 体积

`pnpm size` 会输出 `dist/` 与站点产物里每个 JS/CSS 文件的原始大小和 gzip 大小，写进 `reports/size.json`。

这是**逐文件**的统计。它既不是「只 import 一个按钮要付出的代价」——那取决于你的打包工具摇掉了多少——也不是真实的网络传输量，几个文件各自的 gzip 大小加起来并不等于合并传输的结果。想知道真实成本，在你自己的应用里量。

## 验证包内容

```bash
pnpm pack
tar -tzf ttqtt-liquid-glass-react-*.tgz
```

重点确认两件事：包里没有 `src/`、`site/`、`tests/` 这些不该发出去的目录；`dist/index.js` 第一行是 `"use client";`，少了它在 Next.js App Router 的服务端组件里会直接报错。
