# ADR 0001：首版采用原生 Chrome 交互原语

状态：alpha 采用；扩展前复审。

原调研建议 Base UI / Radix 二选一。交付版没有偷偷将另一套依赖写成“已经接入”，而是明确采用原生 button、radio、range、checkbox、popover 和 dialog。

## 决策依据

本项目只面向 Chrome，原生 Popover 顶层显示与原生 dialog 可承载受限的首版交互。原生表单输入保留浏览器自身的键盘和表单行为；组件库只增加材质、受控状态、锚点位置、菜单/工具栏/标签页的有限键盘规则。

同时，当前构建环境不能下载 npm 依赖。这个现实约束影响了本次可执行验证，但不是“原生方案比成熟无样式库更可访问”的证据。采用原生路线不等于免去焦点、边界条件和屏幕阅读器验证。

## 代价与范围

不支持多级菜单、复杂组合框、树、日期选择器、完整命令面板、拖拽排序或跨浏览器抽象。Toolbar 只保证按钮型成员；Popover 非模态、Dialog 模态、Tabs 页内切换、NavBar 页面链接，语义不能互换。

组件文件保留清晰边界，未来可以在 `react/overlays.tsx` 和 selection/toolbar 层替换底座，不需要改写位移图或设计 token。对外 props 变化应按 alpha 变更日志声明。

## 复审触发条件

增加多级菜单、Combobox、复杂焦点组合、需要超出 Chrome 的支持，或真实辅助技术测试暴露较大维护成本时，重新评估 Radix / Base UI。优先替换行为层，不重做材质内核。

参照：Chrome 官方 Popover 介绍 `https://developer.chrome.com/blog/introducing-popover-api`；Radix Primitives `https://www.radix-ui.com/primitives/docs/overview/introduction`；Base UI `https://base-ui.com/react/overview/about`。本 ADR 不声称对这两套库完成了性能或质量对比。
