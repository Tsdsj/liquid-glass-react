# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与
[语义化版本](https://semver.org/lang/zh-CN/)。

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

[0.1.0]: https://github.com/ttqtt/liquid-glass-react/releases/tag/v0.1.0
