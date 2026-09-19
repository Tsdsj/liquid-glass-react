# 0.4.0：0.3.0 装不下的

> 内容视 0.3.0 的反馈定。这里只记下已经确定「不在 0.0.2 也不在 0.3.0」的东西，免得它们被遗忘或被塞进不该去的版本。

## 一、新组件第二批的余量

0.0.2 的第二批候选是 `Picker`、`Banner`、`Gauge`、`RatingIndicator`、`ColorWell`、`Box`、`Breadcrumb`，建议只做前三个（见 [`../0.0.2/phase-2-plan.md`](../0.0.2/phase-2-plan.md) 第六节）。**没做完的顺延到这里。**

判断规则不变：纯新增就还能进 0.0.x，所以「顺延到 0.4.0」只在 0.3.0 已经发出去之后才成立。如果 0.0.2 之后、0.3.0 之前还想加组件，那是 0.0.3。

## 二、浏览器矩阵

`docs/testing.md` 的「发布前还需要人做的事」里，有三格至今是空的，都需要机器而不是代码：

| 维度 | 缺什么 |
| --- | --- |
| Windows | Chrome 关掉硬件加速时的 `backdrop-filter` 路径；0.0.2 的 P7 滚动条抖动也要在这里验 |
| 多版本 Chrome | 现在只跑过一个版本；折射路径依赖正式 Chrome 渠道 |
| 真实低端 GPU | `measure-performance.mjs` 只节流了 CPU，而模糊花的是填充率 |

这三条不进任何一个版本的功能排期——它们是**发版前的门槛**，谁先有机器谁先做。

## 三、明确不做的

这些在 2026-09-16 就判过，理由没有变，写在这里是为了不必每次重新讨论：

| 组件 | 原因 |
| --- | --- |
| Combobox / TokenField | 自动完成的无障碍模型（`aria-activedescendant` + 虚拟焦点）是一整期的工作量，做半截比不做差 |
| DatePicker | 平台差异太大；web 上原生 `<input type="date">` 加样式是更诚实的答案 |
| 数据表格 | 内容层、和玻璃无关、体量是整个库的一半 |
| 滚轮选择器 | 触摸专属，web 上没有好的键盘模型。菜单式的 `Picker` 已经覆盖这个需求 |
| `Stack` / `Spacer` | CSS flex 已经是这个东西；做一层没有 HIG 规则可以放进去的包装，只是多一个名字 |
| BottomAccessory | `TabBar` 已有 `accessory` 属性；缺的是一个文档示例，不是组件 |
| 图像视图 / 图像井 | `<img>` + `aspect-ratio` 足够 |
| activity-rings、charts、digit-entry-views、lockups、ornaments | 平台专属，或体量是整个库的一半 |
| `Grid` 虚拟化 | 另一期的事，且和「内容层不做玻璃」无关 |
| 大纲视图（Tree） | 键盘模型自成一体，值得单独一期 |
