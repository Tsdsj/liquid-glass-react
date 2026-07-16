---
status: done
depends: [M30]
---

# M31 — 五阶段·新组件批

> 五阶段组件线之二。一次补五个常见缺口:**Dropdown、InputNumber、Rate、Timeline、Upload**。
> 一卡多组件(M25 惯例),一组件一或多提交。串行 M27→M32。无新运行时依赖。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`(五件套、size/disabled/受控约定、@import、导出)。
- 每组件 props 表即公共 API 定稿;a11y 是验收项;玻璃质感只经 `GlassSurface`。
- Upload **不封装真实上传请求**——受控文件列表 + 选择/移除交互,网络由使用者处理。

## API 定稿（逐组件）

### Dropdown（按钮 + 菜单的薄组合,复用 Menu）
```ts
export interface DropdownProps {
  items: MenuItem[];                       // 复用 Menu 的 items
  onSelect?: (key: string) => void;
  label: React.ReactNode;                  // 按钮文案
  variant?: ButtonProps['variant'];        // 透传 Button
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```
- 实现=内置 `<Button>`(带下拉箭头,aria-hidden)作 `<Menu>` 触发器;键盘/焦点/a11y 全部
  复用 Menu 既有能力,本组件不重复实现。

### InputNumber
```ts
export interface InputNumberProps {
  value?: number | null; defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number; max?: number; step?: number;      // step 默认 1
  precision?: number;                              // 小数位,缺省不处理
  placeholder?: string; size?: 'sm' | 'md' | 'lg'; disabled?: boolean;
  'aria-label'?: string;
}
```
- 玻璃输入框(复用 Input 视觉层)+ 右侧上下步进钮;键盘 ArrowUp/Down 步进、
  失焦时解析/clamp/precision 归一;`role="spinbutton"` + `aria-valuenow/min/max`;
  非法输入失焦回退最近合法值。解析/clamp/步进抽纯函数单测。

### Rate
```ts
export interface RateProps {
  value?: number; defaultValue?: number;
  onChange?: (value: number) => void;
  count?: number;                                  // 默认 5
  disabled?: boolean; readOnly?: boolean;
  'aria-label'?: string;
}
```
- 整星评分:`role="radiogroup"` + 每星 `role="radio"`(roving tabindex,方向键增减,
  与 RadioGroup 键盘模型一致);hover 预览,点击当前值可清零;readOnly 用 `role="img"` +
  文本化 aria-label(「3/5」)。

### Timeline（纯展示）
```ts
export interface TimelineItem {
  key: string; content: React.ReactNode;
  time?: React.ReactNode; color?: 'accent' | 'success' | 'warning' | 'danger';
  dot?: React.ReactNode;                           // 自定义节点图标
}
export interface TimelineProps { items: TimelineItem[]; }
```
- `<ol>/<li>` 语义;节点圆点走语义色 token,连接线装饰(aria-hidden)。

### Upload（受控文件列表）
```ts
export interface UploadFile {
  key: string; name: string; size?: number;
  status?: 'ready' | 'uploading' | 'done' | 'error';  // 状态由使用者驱动
  percent?: number;                                    // uploading 时进度
}
export interface UploadProps {
  fileList?: UploadFile[]; defaultFileList?: UploadFile[];
  onChange?: (list: UploadFile[], meta: { file: File | null; type: 'add' | 'remove' }) => void;
  accept?: string; multiple?: boolean;
  maxCount?: number;                                   // 超出忽略并提示
  disabled?: boolean;
  children?: React.ReactNode;                          // 触发区内容,缺省内置按钮文案
}
```
- 隐藏 `<input type="file">` + 玻璃触发按钮;选择文件→生成 UploadFile(status 'ready')
  回调 onChange,**原生 File 对象经 meta 透出**供使用者自行上传;列表项显示名/大小/状态/
  进度(复用 Progress)+ 移除按钮(i18n aria-label);键盘可达。

## 实现步骤

1. 由简到繁:Timeline → Dropdown → Rate → InputNumber → Upload,逐个 RED→GREEN 走
   component-guide checklist(五件套 + @import + 导出 + SSR/a11y 冒烟)。
2. site:五条 ComponentDoc(演示 + API 表,中英双语)接入 registry;计数派生同步。
3. 全量验证 + 提交。

## 测试要求

- InputNumber:解析/clamp/precision 纯函数逐条;键盘步进;失焦归一;受控/非受控。
- Rate:方向键增减、点击清零、readOnly 语义;Dropdown:选择回调 + Menu 行为冒烟(不重测 Menu)。
- Upload:选择(mock input files)→onChange 列表与 File 透出、maxCount 拦截、移除、禁用。
- Timeline:语义与语义色渲染。全部纳入 SSR + a11y 冒烟;site App.test 详情页断言。

## 验收标准

- [ ] 五组件及类型从 `src/index.ts` 导出,API 与本卡一致;五件套齐全。
- [ ] 各组件交互/键盘/a11y 断言通过;`pnpm smoke:consumer` 覆盖五个新组件仍绿。
- [ ] site 五张新卡片(演示 + API 表,中英双语),计数派生同步。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱,无新运行时依赖。

## 明确非目标

- Upload 拖拽区/目录上传/断点续传/真实请求封装;Rate 半星;InputNumber 千分位格式化;
  Dropdown hover 触发与多级子菜单;Timeline 交替布局。

## 完成记录

五组件全部落地(RED→GREEN,先写测试),组件总数 35 → **40**(README/CHANGELOG 由 M29
防漂移测试强制同步,本卡已同步)。

- **Timeline**:`<ol>/<li>` 语义,节点语义色 token(color-mix 环 + 自定义 dot 替换环),
  连接线 aria-hidden。2 测试。
- **Dropdown**:纯薄组合——内置 `<Button>`(带 caret,`data-expanded` 旋转)作 `<Menu>`
  触发器,键盘/焦点/a11y **零重复实现**全部来自 Menu。2 测试(选择回调 + disabled 不开)。
- **Rate**:`role="radiogroup"` + 每星 radio,roving tabindex,方向键增减并选中(同 RadioGroup
  键盘模型),hover 预览,点击当前值清零;**readOnly 转 `role="img"`** + 文本化 aria-label
  (「n / count」)。5 测试。
- **InputNumber**:纯函数 `input-number-utils`(parse/clamp/precision/step,7 测)——
  **实现要点**:precision 取整用**字符串指数移位**(`1.005` 直乘 100 得 100.4999… 的经典浮点坑,
  移位法精确);step 缺省 precision 时按步长小数位归一(0.1+0.2 不漂移)。组件复用 `<Input>`
  视觉层(suffix 放步进钮,tabIndex=-1 键盘走方向键),draft/commit 两态:失焦解析→clamp→
  precision,非法回退上一合法值,清空提交 null;`role="spinbutton"` + aria-value* 全套。5 测试。
- **Upload**:隐藏 `<input type="file">` + Button 触发;选择产出 `UploadFile`(status 'ready'),
  **原生 File 经 `onChange(list, meta)` 的 meta 透出**由使用者上传;status/percent 使用者驱动
  (uploading 复用 Progress);maxCount 超量忽略、移除按钮 i18n;**不碰网络**(卡内定)。
  onChange 带双参,故列表状态用 useControllableState 存储 + 手动通知。5 测试。
- **接入**:`src/index.ts` 导出 5 组件 + 7 类型;`styles/index.css` @import ×5(顺带修掉一处
  Tag 重复 import);五件套齐全(stories ×5);SSR + a11y 冒烟各 +5;**smoke:consumer 用例
  39 → 44** 三层全绿;site 五条 ComponentDoc(录入 ×3 / 导航 Dropdown / 展示 Timeline)+
  registry,总览计数派生 40,README「40 个组件」与 CHANGELOG「27 → 40」同步(防漂移测试盯住)。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **603/603 绿**(较 M30 的 562 +41)、
  `pnpm smoke:consumer` ✓、`pnpm site:build` ✓。无新增运行时依赖。
- **留本地目检**:Rate 星星 hover 放大、Timeline 节点配色、Upload 列表 hover、InputNumber
  步进钮布局、Dropdown caret 旋转。
