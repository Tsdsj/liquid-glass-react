---
status: done
depends: [M8, M9]
---

# M10 — 二阶段·容器与导航批:Card、Avatar、Breadcrumb、Pagination、SideNav

> 优先于 M5 执行。Card 是本批唯一玻璃主角;SideNav 复用 M8 的
> `useSlidingIndicator`(垂直向),故依赖 M8。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`;本卡 props 表即 API 定稿。
- 服务器无浏览器:视觉验证留用户本地目检。

## API 定稿

### Card(玻璃主角)

```ts
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;              // 默认 'div'
  padding?: 'none' | 'sm' | 'md' | 'lg'; // 默认 'md',映射 --lg-space-*
  material?: 'regular' | 'clear';
  dim?: boolean;
  radius?: number | string;
  interactive?: boolean;
  children: React.ReactNode;
}
```

- 整卡一个 GlassSurface(`refraction="auto"`、较大 bezel),material/dim/
  radius/interactive 直接透传;不做结构化 header/footer(保持容器纯粹)。
- 卡内再放玻璃控件时嵌套自动禁折射是**引擎既定行为**,site demo 必须配文
  说明,防误报 bug。
- a11y:非交互无 role;interactive 时语义宿主由使用方经 `as` 决定。

### Avatar

```ts
export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;          // 图片失败/缺省时显示(文字缩写等)
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';         // 默认 'circle'
}
```

- 无玻璃。img onError 回退 fallback(jsdom 可测);有图走 `img[alt]`,
  纯文字 `role="img"` + `aria-label`(取 alt)。

### Breadcrumb

```ts
export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
}
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;         // 默认 '/'
}
```

- 无玻璃(纯文字导航)。`<nav aria-label>`(i18n "面包屑"/"Breadcrumb");
  末项 `aria-current="page"` 且渲染为纯文本不可点;separator `aria-hidden`。

### Pagination

```ts
export interface PaginationProps {
  current?: number;
  defaultCurrent?: number;             // 默认 1
  total: number;                       // 条目总数
  pageSize?: number;                   // 默认 10
  onChange?: (page: number) => void;
  siblingCount?: number;               // 当前页两侧显示数,默认 1
  size?: 'sm' | 'md';
  disabled?: boolean;
}
```

- 容器无玻璃;页码为纯 tint ghost 按钮,当前页 tint 强化。**不做滑动玻璃
  指示器**(省略号导致 FLIP 目标不稳定,收益低——决策随卡存档)。
- 省略号序列计算提取纯函数 `computePageItems(current, totalPages, siblingCount)`
  (返回 `(number | 'ellipsis-l' | 'ellipsis-r')[]`),重点单测。
- a11y:`<nav>` + 每按钮 i18n `aria-label`("上一页/下一页/第 X 页");
  当前页 `aria-current="page"`;首尾页禁用前后翻按钮。

### SideNav(用户指定新增)

```ts
export type SideNavItem =
  | { key: string; label: React.ReactNode; icon?: React.ReactNode;
      href?: string; disabled?: boolean }
  | { type: 'group'; label: React.ReactNode };
export interface SideNavProps {
  items: SideNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  'aria-label'?: string;
}
```

- 垂直导航列表;**选中项玻璃滑块指示器** = GlassSurface,由
  `useSlidingIndicator` 垂直向驱动(M8 hook 若只支持横向,本卡内扩展为
  双向,属内部 API 允许修改)。
- 项有 href 渲染 `<a>`,否则 `<button>`;`<nav>` 容器 + 选中项
  `aria-current="page"`;键盘走原生 Tab 序(导航链接语义,不做 roving)。
- 范围红线:**不做折叠、不做嵌套子级**。group 仅是不可交互的分组标题。

## 实现步骤

1. Card → Avatar → Breadcrumb(轻)。
2. `computePageItems` 纯函数 + 单测 → Pagination。
3. `useSlidingIndicator` 纵向扩展 + 单测 → SideNav。
4. site:Card/Avatar 进 `display.demos.tsx`,Breadcrumb/Pagination/SideNav 进
   `navigation.demos.tsx`,五条 ComponentDoc 进 registry。
5. 全量验证 + 提交(一组件一提交)。

## 测试要求

- Card:props 透传到 GlassSurface(material/dim/radius/interactive 的 data
  属性断言)、嵌套玻璃自动 data-nested。
- Avatar:onError 回退、alt/aria 分支。
- Breadcrumb:末项 aria-current 且非链接、separator aria-hidden、i18n。
- Pagination:纯函数全分支(首/中/尾/小于窗口)、受控/非受控、边界禁用、
  aria-label i18n。
- SideNav:受控/非受控、href/button 分支、disabled、aria-current、
  指示器切换不触发 filter 重建(同 M8 断言)。

## 验收标准

- [ ] 五组件 API 与定稿一致并导出。
- [ ] Pagination 省略号纯函数覆盖全部形态。
- [ ] SideNav 指示器复用 M8 hook,无重复实现。
- [ ] site 五张新卡片 + 详情页完整,中英双语;Card demo 含嵌套禁折射说明。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:Card 玻璃观感与 SideNav 指示器动效留本地目检。

## 明确非目标

- Card 结构化 header/footer/actions;Avatar 组(重叠堆叠);Breadcrumb
  下拉折叠;Pagination 快速跳转/每页条数切换;SideNav 折叠与嵌套。

## 完成记录

- `Card`(玻璃主角):整卡一个 `GlassSurface`(refraction=auto、bezel=16),
  material/dim/radius/interactive/as 直通引擎,padding 映射 `--lg-space-*`(作用于
  `.lg-surface__content`);测试断言透传的 data 属性 + 嵌套玻璃 `data-nested`。
- `Avatar`:无玻璃;`img[alt]`,onError 回退 fallback,纯文字 `role=img`+`aria-label`;
  src 变化时清除 error 状态;圆/方形、三档尺寸。
- `Breadcrumb`:`<nav>` i18n aria-label(面包屑/Breadcrumb),末项 `aria-current=page`
  纯文本不可点,分隔符 `aria-hidden`;有 href 渲染 `<a>`、仅 onClick 渲染 `<button>`。
- `Pagination`:纯函数 `computePageItems(current,totalPages,siblingCount)` 返回
  `(number|'ellipsis-l'|'ellipsis-r')[]`(首/中/尾/小于窗口/大 sibling/单页全覆盖);
  容器无玻璃,ghost 页码 + 当前页 tint 强化;每按钮 i18n aria-label,首尾禁用前后翻,
  受控/非受控。**不做滑动指示器**(省略号致 FLIP 目标不稳,决策随卡)。
- `SideNav`:垂直导航,选中项玻璃滑块 = `GlassSurface`,由 M8 `useSlidingIndicator`
  驱动(hook 本就输出 `translate(x,y)`,纵向零改动复用,仅补一条纵向纯函数断言);
  href→`<a>` / 无→`<button>`,group 为不可交互标题,选中 `aria-current=page`,走原生
  Tab 序;指示器切换不触发 filter 重建(测试断言快照长度不变)。
- 五件套齐全;`styles/index.css` 按字母序追加 5 条 @import;`src/index.ts` 导出组件与
  Props/子类型(Avatar/Breadcrumb+Item/Card/Pagination/SideNav+Item)。
  `computePageItems` 仅内部使用,不进公共导出。
- site:Card/Avatar 进 `display.demos.tsx`,Breadcrumb/Pagination/SideNav 进
  `navigation.demos.tsx`,五条 ComponentDoc 进 registry,总览计数 20 → 25;
  **Card demo 含「卡内玻璃控件自动禁折射是引擎既定行为,不是 bug」说明**;
  `App.test.tsx` 新增五详情页可渲染断言。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test`——单线程全量 288/288 全绿
  (`vitest run --no-file-parallelism`)。默认并行下 M4 既有 Modal 焦点测试
  (keeps Tab focus inside the dialog)因 jsdom 焦点时序 + worker 争用 flake(二阶段新增
  大量焦点测试后几乎必现),隔离重跑 11/11 通过,非本卡回归,未改 M4 测试。
- **留本地目检**:Card 玻璃观感(含卡内嵌套禁折射)、SideNav 玻璃滑块纵向动效
  (`--lg-ease-bounce`)、Pagination 尺寸/箭头(服务器无浏览器)。
