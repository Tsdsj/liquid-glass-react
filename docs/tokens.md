# Design Token 定义表（定稿）

所有视觉参数的单一事实源。实现 `src/styles/tokens.css`（light 默认值）与 `src/styles/themes.css`（dark 覆盖）时照此表逐条写入，不得增删改名。

## 命名规范

`--lg-<域>[-<细分>]`。组件级 token `--lg-<组件>-<属性>`，声明在各组件 CSS 顶部、默认值必须引用全局 token。

## 全局 token

### 玻璃材质

| 变量 | Light 值 | Dark 值 | 说明 |
|---|---|---|---|
| `--lg-blur` | `4px` | 同 | 折射模式辅助模糊 |
| `--lg-fallback-blur` | `16px` | 同 | 降级模式主模糊 |
| `--lg-saturation` | `1.5` | `1.3` | backdrop 饱和度 |
| `--lg-refraction` | `40` | 同 | feDisplacementMap scale 基准（无单位数字） |
| `--lg-tint` | `rgb(255 255 255 / 0.25)` | `rgb(40 40 40 / 0.35)` | 玻璃染色 |
| `--lg-tint-hover` | `rgb(255 255 255 / 0.4)` | `rgb(60 60 60 / 0.5)` | interactive hover 染色 |
| `--lg-highlight` | `rgb(255 255 255 / 0.75)` | `rgb(255 255 255 / 0.25)` | 左上高光 rim |
| `--lg-shade` | `rgb(0 0 0 / 0.08)` | `rgb(0 0 0 / 0.35)` | 右下暗缘 |
| `--lg-drop-shadow` | `rgb(0 0 0 / 0.15)` | `rgb(0 0 0 / 0.5)` | 外投影颜色 |

### 几何

| 变量 | 值（两主题相同） | 说明 |
|---|---|---|
| `--lg-radius-sm` | `8px` | 小圆角（Checkbox 等） |
| `--lg-radius-md` | `14px` | 默认圆角 |
| `--lg-radius-lg` | `22px` | 大圆角（Modal/Card） |
| `--lg-radius-full` | `999px` | 胶囊（Button/Switch/Toast） |
| `--lg-control-h-sm` | `28px` | 控件高度 sm |
| `--lg-control-h-md` | `36px` | 控件高度 md |
| `--lg-control-h-lg` | `44px` | 控件高度 lg |
| `--lg-space-1..4` | `4px / 8px / 12px / 16px` | 间距刻度 |

### 颜色

| 变量 | Light 值 | Dark 值 |
|---|---|---|
| `--lg-accent` | `#0a84ff` | `#0a84ff` |
| `--lg-accent-contrast` | `#ffffff` | `#ffffff` |
| `--lg-danger` | `#ff3b30` | `#ff453a` |
| `--lg-success` | `#34c759` | `#30d158` |
| `--lg-warning` | `#ff9500` | `#ff9f0a` |
| `--lg-text` | `rgb(0 0 0 / 0.85)` | `rgb(255 255 255 / 0.9)` |
| `--lg-text-secondary` | `rgb(0 0 0 / 0.5)` | `rgb(255 255 255 / 0.55)` |
| `--lg-text-disabled` | `rgb(0 0 0 / 0.3)` | `rgb(255 255 255 / 0.3)` |

### 字体与动效

| 变量 | 值 | 说明 |
|---|---|---|
| `--lg-font` | `-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", Roboto, sans-serif` | 字体栈 |
| `--lg-font-size-sm/md/lg` | `13px / 15px / 17px` | 对应 size 刻度 |
| `--lg-ease` | `cubic-bezier(0.32, 0.72, 0, 1)` | Apple 风格缓动 |
| `--lg-ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 弹性缓动（Switch thumb 等） |
| `--lg-duration` | `200ms` | 标准时长 |
| `--lg-duration-slow` | `350ms` | 浮层进出场 |
| `--lg-z-overlay` | `1000` | Modal/Popover/Toast 层级基准 |

## 主题机制（themes.css）

```css
/* 1. data-theme 显式声明（优先） */
[data-theme="dark"] { /* 上表全部 dark 值 */ }
/* 2. 系统偏好兜底（仅当应用未显式声明时） */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { /* 同一组 dark 值，重复一份 */ }
}
```

- 支持局部主题岛：`<div data-theme="dark">` 内组件自动用 dark token（因此 dark 值选择器写 `[data-theme="dark"]` 而不是 `:root[data-theme="dark"]`）。
- 组件 CSS **只准引用变量**，永远不写 `[data-theme]` 选择器——主题差异全部收敛在 themes.css。

## 使用者定制方式（写进 README）

```css
/* 全局调整 */
:root { --lg-accent: #ff2d55; --lg-radius-md: 10px; }
/* 只调某组件 */
.my-panel { --lg-button-bg: rgb(255 255 255 / 0.4); }
```
