---
status: todo
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

（实现后追加）
