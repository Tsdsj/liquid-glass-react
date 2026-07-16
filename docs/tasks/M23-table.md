---
status: done
depends: [M22]
---

# M23 — 四阶段·Table 表格

> 四阶段组件线中**最大一卡**。数据表格:列定义 / 排序 / 行选中 / 分页联动 + 玻璃表头与行悬浮。
> 复用已有 `Pagination`、`Checkbox`。串行 M19→M26。无新运行时依赖。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`。本卡 props 表即公共 API 定稿。
- a11y:语义表格(`role`/scope)、排序表头 `aria-sort`、键盘可达是验收项。
- 玻璃质感只经 `GlassSurface`;表格数据层为内容层,不逐格套玻璃。

## API 定稿

```ts
export interface TableColumn<T> {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;       // sortable 时缺省按 dataIndex 比较
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  // 排序(受控/非受控)
  sort?: { key: string; order: 'asc' | 'desc' } | null;
  defaultSort?: { key: string; order: 'asc' | 'desc' } | null;
  onSortChange?: (sort: { key: string; order: 'asc' | 'desc' } | null) => void;
  // 行选中(受控/非受控)
  selectable?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  // 分页(联动已有 Pagination;不传则不分页)
  pagination?: { pageSize: number; page?: number; onChange?: (page: number) => void } | false;
  size?: 'sm' | 'md' | 'lg';
  emptyText?: React.ReactNode;           // 无数据占位(M25 有 Empty 后可对接)
  'aria-label'?: string;
}
```

- **排序**:点击 sortable 表头循环 `asc → desc → 无`;表头 `aria-sort`;非受控内部维护,受控由外部驱动。
- **选中**:表头全选 Checkbox(半选态)+ 行 Checkbox;受控/非受控双模;仅当前页/全量选中范围在文档写明。
- **分页**:内置分页时,排序/选中与页码联动(复用 `Pagination` 组件);`pagination=false` 或缺省时全量渲染。
- **玻璃**:表头行为 GlassSurface(轻 tint,sticky 可选);行 hover 高光(吃 M20 动效 token);表体内容层。
- **a11y**:`<table>` 语义 + `<th scope>`;排序表头为 button 可键盘触发;选中 Checkbox 键盘可达。
- **纯函数抽取**:排序(`applySort`)、分页切片(`paginate`)、选中集合运算抽成纯函数便于 jsdom 测。

## 实现步骤

1. `src/components/Table/table-utils.ts`(applySort / paginate / 选中集合)+ 单测(RED→GREEN)。
2. Table 组件:列渲染、排序表头、选中列、分页联动(component-guide checklist)。
3. site:`site/src/demos/` 新增 tableDoc(可排序可选中可分页的真实示例 + API 表,中英双语);总览计数同步。
4. 全量验证 + 提交(可拆多提交:排序 / 选中 / 分页)。

## 测试要求

- 纯函数:applySort(asc/desc/自定义 sorter/稳定性)、paginate(边界页/末页不足)、选中(全选/半选/反选)。
- 交互:点表头循环排序 + `aria-sort`;行/全选 Checkbox 受控与非受控;分页切换后排序/选中状态一致。
- a11y:table 语义、th scope、排序表头键盘触发、选中键盘可达。
- 行 hover 不触发滤镜重建(沿用惯例)。
- site App.test 增 Table 详情页可渲染断言。

## 验收标准

- [ ] Table/TableColumn/TableProps 从 `src/index.ts` 导出,API 与本卡一致。
- [ ] 排序/选中/分页三条链路受控+非受控均绿;纯函数断言完整;a11y 断言通过。
- [ ] site 出现 Table 卡片,详情页含排序+选中+分页示例 + API 表,中英双语,计数同步。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 无新增运行时依赖。

## 明确非目标

- 虚拟滚动/大数据性能优化;列拖拽调宽/固定列/展开行/树形表格;服务端排序分页封装
  (只提供受控接口由使用者接);单元格编辑。

## 完成记录

- **纯函数** `table-utils.ts`:`defaultCompare`(nullish 优先、数字比大小、其余 localeCompare)、
  `applySort`(拷贝排序,desc 用**取负**而非 reverse 以保稳定)、`paginate`/`pageCount`、选中集合
  `toggleKey`/`toggleAll`(仅当前页键)/`selectionState`(表头 checked/indeterminate)。9 单测(RED→GREEN)。
- **Table 组件**:排序/选中/分页三条链路各用 `useControllableState` 受控+非受控双模。
  - 排序:点 sortable 表头循环 `asc→desc→null`;`comparator = column.sorter ?? 按 dataIndex defaultCompare`;
    `<th aria-sort>` 反映 none/ascending/descending;排序箭头 CSS(aria-hidden,不污染表头可访问名)。
  - 选中:表头 Checkbox(`indeterminate` 半选)`toggleAll` 当前页;行 Checkbox `toggleKey`;
    行 `data-selected` 高亮。
  - 分页:复用 `Pagination`(`total=sortedData.length`),排序在翻页间保持(先排序后切片)。
- **玻璃合规(AGENTS §5)**:整表根为**单个 `GlassSurface` 卡**;表头 tint 与行 hover 用**普通
  token 背景**(`--lg-tint`/`--lg-accent-glass`),`table.css` **不含任何 backdrop-filter**——玻璃只
  来自外层 GlassSurface。行 hover 是纯背景过渡(吃 `--lg-duration-press`),不改尺寸、不触发滤镜重建。
- **a11y**:原生 `<table>` 语义 + `<th scope="col">`;排序表头是 `<button>` 键盘可触发;选择列
  Checkbox 有 aria-label;空态 `colSpan` 占位。纳入 a11y 冒烟(sortable+selectable,无 critical/serious)。
- **导出/注册**:`src/index.ts` 增 `Table` + `TableColumn`/`TableProps`/`TableSort`;`styles/index.css`
  @import `table.css`;五件套齐全(含 `Table.stories.tsx` Basic + SortableSelectablePaged)。
  纳入 SSR 冒烟(GlassSurface+Pagination+useControllableState 均 SSR 安全)。
- **文档**:`display.demos.tsx` 新增 `tableDoc`(排序+选中+分页真实示例 + Table/TableColumn 两张 API 表,
  中英双语),接入 registry「展示」组;总览计数由 `COMPONENT_DOCS` 派生自动 +1。
- **测试**:`Table.test.tsx` 6 条(语义渲染、排序循环+aria-sort、自定义 sorter+受控 sort、
  选中+表头半选/全选、分页+排序跨页保持、空态)。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓(dist 含 4 个 Table 公共项)、`pnpm test` **454/454 绿**
  (较 M22 的 437 +17)、`pnpm site:build` ✓。**无新增运行时依赖**。
- **留本地目检**:玻璃表头 tint、行 hover 高光与选中态、粘性表头、分页联动观感。
