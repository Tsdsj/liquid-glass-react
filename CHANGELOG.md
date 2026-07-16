# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与
[语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布 / Unreleased]

### 新增

- **主题定制 API**:`createTheme`(类型安全的 `--lg-*` 覆盖)、`presetThemes`
  (default / midnight / warm),`LiquidGlassConfig` 增 `theme` 作用域套用。
- **进阶引擎转正**:`ProgressiveBlur` 渐进模糊、`useAmbientFromImage` 环境取样
  由内部实验提升为公共 API。
- **13 个新组件**:Form(自写校验的受控表单)、Table(排序/选中/分页/展开行)、DatePicker
  (自写日期算法 + 键盘日历)、Alert、Accordion、Command(⌘K 命令面板)、Empty、Steps、
  Dropdown、InputNumber、Rate、Timeline、Upload(受控文件列表)、RangePicker(日期范围)、
  TimePicker(时间选择)—— 组件总数 27 → 42。
- **既有组件增强**:Select 多选 + 搜索、Table 展开行、`Modal.confirm()` 命令式确认、
  Tabs 可关闭页签(全部向后兼容)。
- **交互动效**:交互面板 hover 升起(`--lg-hover-lift`)与更跟手的按压时长
  (`--lg-duration-press`),reduced-motion 全降级。
- **文档站**:props playground(交互调参)、`/` 键站内搜索(Command 驱动)、
  浅色模式玻璃可读性增强、演示沙箱(演示内交互不再影响站点路由)、全量 token 参考表。

### 修复

- `toast` 在未挂载 `<Toaster/>` 时开发模式给出一次性警告(此前静默丢失)。
- 稳定 Menu 键盘导航测试的异步竞态;CI typecheck 与构建解耦。

### 内部

- 消费者装包审计脚本 `pnpm smoke:consumer`(打包产物三层验证:严格类型 / SSR / jsdom 运行)。

## [0.1.0] - 2026-07-15

首个公开版本。

### 新增

- **玻璃引擎**:`GlassSurface` 原语 —— SVG 位移滤镜驱动的边缘折射(Chromium),
  按形状全局复用滤镜、首帧无闪烁;Safari/Firefox 自动降级为毛玻璃;`prefers-reduced-transparency`
  / `forced-colors` / `prefers-reduced-motion` 全适配。
- **27 个组件**:
  - 基础控件:Button、Switch、Slider、Checkbox。
  - 数据录入:Input、Textarea、Select。
  - 选择控件:RadioGroup/Radio、Segmented。
  - 导航:Tabs、Breadcrumb、Pagination、SideNav、Drawer、Menu。
  - 容器与展示:Card、Avatar、Tag、Badge、Progress、Spin、Skeleton。
  - 浮层反馈:Modal、Popover、Tooltip、Toast。
- **主题**:`--lg-*` CSS 变量体系,`data-theme` 亮暗切换,可整体或局部覆盖。
- **国际化**:内置文案中/英,经 `LiquidGlassConfig` 的 `locale` 切换。
- 文档站(组件总览 + 交互演示 + API,中英双语)。

[0.1.0]: https://github.com/Tsdsj/liquid-glass-react/releases/tag/v0.1.0
