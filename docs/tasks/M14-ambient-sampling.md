---
status: todo
depends: [M12]
---

# M14 — 二阶段·引擎实验:环境色自动取样(--lg-ambient 自动化)

> 优先于 M5 执行。二阶段收尾卡。opt-in、内部化、不改现有默认行为。

## 背景与平台限制(定稿,写死)

M6b 引入了声明式环境色 token `--lg-ambient`(默认 transparent,手动覆盖)。
Apple 材质会实时反射周围内容颜色;Web **无法读取任意 DOM 的渲染像素**
(Element/Region Capture 需屏幕共享授权,库不可用;html2canvas 类方案违反
零依赖约束)。可行面只有两条,本卡只做 (a):

- (a) 已知 URL 的图片背景 → canvas `drawImage` + 像素统计(需同源或
  CORS `crossorigin`);
- (b) 纯色/渐变背景 → getComputedStyle 解析(留作记录,不实现)。

定位:**辅助工具**,不是引擎行为。不改 LiquidGlassConfig、不改 GlassSurface。

## 产出(定稿)

```ts
// src/core/utils/ambient-color.ts —— 纯函数
export interface AmbientSampleOptions {
  /** 'average' 全图均值;'edge' 边缘加权(默认,均值易发灰) */
  strategy?: 'average' | 'edge';
  /** 输出透明度(--lg-ambient 需要低透明度写入),默认 0.16 */
  alpha?: number;
}
export function computeAmbientColor(
  data: Uint8ClampedArray, width: number, height: number,
  options?: AmbientSampleOptions,
): string; // 返回 rgb(r g b / a) 字符串

// src/core/hooks/useAmbientFromImage.ts —— 内部 hook,不公开导出
// 降采样(≤64×64)绘制取色;CORS/解码失败返回 null(静默回手动 token);
// 卸载取消加载;SSR 返回 null。
export function useAmbientFromImage(
  url: string | null, options?: AmbientSampleOptions,
): string | null;
```

消费者:site 壁纸切换 demo(取到色则设置容器 `--lg-ambient`,取不到保持
手动值)+ Storybook story。

## 测试要求(无浏览器环境的验收面)

- 纯函数:手造 ImageData 数据断言——纯色图取色准确、双色分块图的
  average/edge 策略差异、alpha 写入格式、空数据兜底。
- hook(mock Image/canvas):成功路径写出颜色、CORS 失败静默 null、
  卸载后不 setState(无 act 警告)、SSR 快照 null。
- 现有测试零改动全绿;`--lg-ambient` 默认行为不变(不消费该 hook 的
  表面零影响)。

## 验收标准

- [ ] 纯函数 + hook 测试先 RED 后 GREEN。
- [ ] 不新增公共导出;LiquidGlassConfig / GlassSurface 零改动。
- [ ] site 壁纸自动取色 demo(中英文案),失败降级路径可见。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:真实图片取色观感由用户在 site 本地目检
      (目检点:photo 壁纸下玻璃是否带上环境暖色、均值是否发灰)。

## 退出条件

site 实测取色与视觉期望偏差大(发灰)且 edge 加权不解决 → 纯函数保留在
utils,记录"自动取样不进入运行时,--lg-ambient 维持手动 token",hook 降级
为 story 级实验。

## 明确非目标

- 读取任意 DOM 背景;实时逐帧取样;跟随滚动动态更新;(b) 路线的
  getComputedStyle 解析实现。
