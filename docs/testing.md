# 测试规范

## 工具链

vitest + jsdom + @testing-library/react + @testing-library/user-event。配置在 `vite.config.ts` 的 `test` 字段（environment: 'jsdom'，setupFiles: `src/test/setup.ts` 引入 `@testing-library/jest-dom/vitest`）。

## 范围（务实原则）

**测逻辑，不测视觉。** 视觉由 Storybook 人工验收。禁止写断言 CSS 具体数值的测试（class 名与 data 属性可以断言）。

### 必测（每个组件）

1. **渲染与透传**：children/className/ref/原生属性正确落到宿主元素。
2. **受控模式**：传 `value` + `onChange`，交互后 `onChange` 收到正确值且显示不自变；父级更新 value 后显示更新。
3. **非受控模式**：`defaultValue` 生效，交互后自更新。
4. **键盘**：该组件 API 定义中列出的每条键盘行为一个 case（用 `userEvent.keyboard`）。
5. **disabled**：交互不触发回调，aria 正确。
6. **a11y 冒烟**：role/aria-* 属性符合 API 定义（不引入 axe，手动断言关键属性）。

### 引擎层必测（M1）

- `computeDisplacementPixels`：中心像素 = (128,128)；四条边中点的位移方向符号正确（向内）；bezel 外像素中性；LRU 缓存命中（同参数第二次调用不重复计算——用 spy 验证）。
- `filter-registry`：同 key 复用同 id；不同 key 不同 id；引用计数归零后延迟移除（fake timers）；移除 pending 期间再 acquire 取消移除；subscribe 通知时机。
- `useGlassSupport`：mock UA/userAgentData 覆盖 Chrome / Edge / Safari / Firefox / 无 backdrop-filter / SSR 六分支（用导出的 `__resetGlassSupportCache`）。
- `useControllableState`：受控/非受控/切换警告。
- `toast-store`：show 返回 id、自动 dismiss（fake timers）、手动 dismiss(id)、dismiss() 清空、Toaster 未挂载时 show 不抛错。

### 不测

- 位移贴图的 canvas/dataURI 环节（jsdom 无 canvas；纯计算函数已覆盖）。
- backdrop-filter 实际渲染效果。
- Storybook stories。

## jsdom 环境补丁（setup.ts 中统一 mock）

jsdom 缺失的 API 一次性 stub：`ResizeObserver`、`matchMedia`、`OffscreenCanvas`（返回假 context，displacement-map 的 canvas 封装在 jsdom 下不被真实调用）、`scrollTo`。浮层测试若遇 floating-ui 需要的布局 API，参考其官方测试建议 mock。

## 结构约定

- 文件与组件同目录：`Button.test.tsx`；引擎测试放 `src/core/**/*.test.ts`。
- `describe('<组件名>')` 下按"渲染 / 受控 / 非受控 / 键盘 / disabled"分组。
- 每个组件 5~10 个 case 为宜，覆盖 API 定义的全部行为即可，不追求行覆盖率指标。
