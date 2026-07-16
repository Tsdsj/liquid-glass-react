import type { Bilingual } from './site-i18n';

export interface TokenRef {
  /** Full custom property name, e.g. `--lg-accent`. */
  name: string;
  /** Default value as declared in `src/styles/tokens.css`. */
  default: string;
  category: Bilingual;
  description: Bilingual;
}

const GLASS: Bilingual = { 'zh-CN': '玻璃材质', 'en-US': 'Glass material' };
const GEOMETRY: Bilingual = { 'zh-CN': '几何', 'en-US': 'Geometry' };
const COLOR: Bilingual = { 'zh-CN': '颜色', 'en-US': 'Color' };
const TYPE_MOTION: Bilingual = { 'zh-CN': '排版与动效', 'en-US': 'Type & motion' };

/**
 * The full `--lg-*` token surface, documented for the Theming guide. Kept in
 * exact sync with `src/styles/tokens.css` by `theming-tokens.test.ts` (a drift
 * test parses the stylesheet and asserts this list neither misses nor invents a
 * token).
 */
export const TOKEN_REFERENCE: TokenRef[] = [
  // Glass material
  { name: '--lg-blur', default: '4px', category: GLASS, description: { 'zh-CN': 'Chromium 折射路径叠加的背景模糊', 'en-US': 'Backdrop blur layered on the refraction path (Chromium)' } },
  { name: '--lg-fallback-blur', default: '16px', category: GLASS, description: { 'zh-CN': '降级毛玻璃的背景模糊', 'en-US': 'Backdrop blur for the frosted fallback' } },
  { name: '--lg-saturation', default: '1.5', category: GLASS, description: { 'zh-CN': '背景饱和度增益', 'en-US': 'Backdrop saturation boost' } },
  { name: '--lg-refraction', default: '40', category: GLASS, description: { 'zh-CN': '边缘折射位移强度', 'en-US': 'Edge refraction displacement strength' } },
  { name: '--lg-refraction-press', default: '1.35', category: GLASS, description: { 'zh-CN': '按压时折射强度倍率', 'en-US': 'Refraction strength multiplier while pressed' } },
  { name: '--lg-tint', default: 'rgb(255 255 255 / 0.25)', category: GLASS, description: { 'zh-CN': '玻璃染色层底色', 'en-US': 'Glass tint layer base colour' } },
  { name: '--lg-tint-hover', default: 'rgb(255 255 255 / 0.4)', category: GLASS, description: { 'zh-CN': 'hover 时的染色', 'en-US': 'Tint on hover' } },
  { name: '--lg-clear-tint', default: 'rgb(255 255 255 / 0.12)', category: GLASS, description: { 'zh-CN': '通透变体的染色', 'en-US': 'Tint for the clear variant' } },
  { name: '--lg-clear-tint-hover', default: 'rgb(255 255 255 / 0.22)', category: GLASS, description: { 'zh-CN': '通透变体 hover 染色', 'en-US': 'Clear-variant tint on hover' } },
  { name: '--lg-opaque-surface', default: 'rgb(245 247 250 / 0.96)', category: GLASS, description: { 'zh-CN': '减少透明度时的不透明表面', 'en-US': 'Opaque surface under reduced transparency' } },
  { name: '--lg-highlight', default: 'rgb(255 255 255 / 0.75)', category: GLASS, description: { 'zh-CN': '左上高光描边', 'en-US': 'Top-left specular rim' } },
  { name: '--lg-shade', default: 'rgb(0 0 0 / 0.08)', category: GLASS, description: { 'zh-CN': '右下暗缘', 'en-US': 'Bottom-right shade' } },
  { name: '--lg-pointer-highlight', default: 'rgb(255 255 255 / 0.55)', category: GLASS, description: { 'zh-CN': '指针高光颜色', 'en-US': 'Pointer-follow highlight colour' } },
  { name: '--lg-pointer-shade', default: 'rgb(0 0 0 / 0.12)', category: GLASS, description: { 'zh-CN': '指针暗部颜色', 'en-US': 'Pointer-follow shade colour' } },
  { name: '--lg-drop-shadow', default: 'rgb(0 0 0 / 0.15)', category: GLASS, description: { 'zh-CN': '外投影颜色', 'en-US': 'Drop shadow colour' } },
  { name: '--lg-dim-layer', default: 'rgb(0 0 0 / 0.35)', category: GLASS, description: { 'zh-CN': '浮层遮罩颜色', 'en-US': 'Overlay scrim colour' } },
  { name: '--lg-ambient', default: 'transparent', category: GLASS, description: { 'zh-CN': '环境色调,可由取样写入', 'en-US': 'Ambient wash, optionally sampled in' } },
  { name: '--lg-scroll-edge-size', default: 'calc(var(--lg-space-4) * 2)', category: GLASS, description: { 'zh-CN': '滚动边缘渐隐高度', 'en-US': 'Scroll-edge fade height' } },
  { name: '--lg-scroll-edge-blur', default: '6px', category: GLASS, description: { 'zh-CN': '滚动边缘模糊', 'en-US': 'Scroll-edge blur' } },
  // Geometry
  { name: '--lg-radius-sm', default: '8px', category: GEOMETRY, description: { 'zh-CN': '小圆角', 'en-US': 'Small radius' } },
  { name: '--lg-radius-md', default: '14px', category: GEOMETRY, description: { 'zh-CN': '默认圆角', 'en-US': 'Default radius' } },
  { name: '--lg-radius-lg', default: '22px', category: GEOMETRY, description: { 'zh-CN': '大圆角', 'en-US': 'Large radius' } },
  { name: '--lg-radius-full', default: '999px', category: GEOMETRY, description: { 'zh-CN': '全圆(胶囊)', 'en-US': 'Pill / full radius' } },
  { name: '--lg-control-h-sm', default: '28px', category: GEOMETRY, description: { 'zh-CN': '小号控件高度', 'en-US': 'Small control height' } },
  { name: '--lg-control-h-md', default: '36px', category: GEOMETRY, description: { 'zh-CN': '默认控件高度', 'en-US': 'Default control height' } },
  { name: '--lg-control-h-lg', default: '44px', category: GEOMETRY, description: { 'zh-CN': '大号控件高度', 'en-US': 'Large control height' } },
  { name: '--lg-space-1', default: '4px', category: GEOMETRY, description: { 'zh-CN': '间距刻度 1', 'en-US': 'Spacing step 1' } },
  { name: '--lg-space-2', default: '8px', category: GEOMETRY, description: { 'zh-CN': '间距刻度 2', 'en-US': 'Spacing step 2' } },
  { name: '--lg-space-3', default: '12px', category: GEOMETRY, description: { 'zh-CN': '间距刻度 3', 'en-US': 'Spacing step 3' } },
  { name: '--lg-space-4', default: '16px', category: GEOMETRY, description: { 'zh-CN': '间距刻度 4', 'en-US': 'Spacing step 4' } },
  // Color
  { name: '--lg-accent', default: '#0a84ff', category: COLOR, description: { 'zh-CN': '强调色', 'en-US': 'Accent colour' } },
  { name: '--lg-accent-contrast', default: '#ffffff', category: COLOR, description: { 'zh-CN': '强调色上的前景色', 'en-US': 'Foreground on accent' } },
  { name: '--lg-danger', default: '#ff3b30', category: COLOR, description: { 'zh-CN': '危险色', 'en-US': 'Danger colour' } },
  { name: '--lg-success', default: '#34c759', category: COLOR, description: { 'zh-CN': '成功色', 'en-US': 'Success colour' } },
  { name: '--lg-warning', default: '#ff9500', category: COLOR, description: { 'zh-CN': '警告色', 'en-US': 'Warning colour' } },
  { name: '--lg-accent-glass', default: 'color-mix(in srgb, var(--lg-accent) 72%, transparent)', category: COLOR, description: { 'zh-CN': '强调色玻璃(派生)', 'en-US': 'Accent glass (derived)' } },
  { name: '--lg-danger-glass', default: 'color-mix(in srgb, var(--lg-danger) 72%, transparent)', category: COLOR, description: { 'zh-CN': '危险色玻璃(派生)', 'en-US': 'Danger glass (derived)' } },
  { name: '--lg-text', default: 'rgb(0 0 0 / 0.85)', category: COLOR, description: { 'zh-CN': '主文本色', 'en-US': 'Primary text' } },
  { name: '--lg-text-secondary', default: 'rgb(0 0 0 / 0.5)', category: COLOR, description: { 'zh-CN': '次文本色', 'en-US': 'Secondary text' } },
  { name: '--lg-text-disabled', default: 'rgb(0 0 0 / 0.3)', category: COLOR, description: { 'zh-CN': '禁用文本色', 'en-US': 'Disabled text' } },
  // Type & motion
  { name: '--lg-font', default: '-apple-system, …, sans-serif', category: TYPE_MOTION, description: { 'zh-CN': '字体栈', 'en-US': 'Font stack' } },
  { name: '--lg-font-size-sm', default: '13px', category: TYPE_MOTION, description: { 'zh-CN': '小号字号', 'en-US': 'Small font size' } },
  { name: '--lg-font-size-md', default: '15px', category: TYPE_MOTION, description: { 'zh-CN': '默认字号', 'en-US': 'Default font size' } },
  { name: '--lg-font-size-lg', default: '17px', category: TYPE_MOTION, description: { 'zh-CN': '大号字号', 'en-US': 'Large font size' } },
  { name: '--lg-ease', default: 'cubic-bezier(0.32, 0.72, 0, 1)', category: TYPE_MOTION, description: { 'zh-CN': '标准缓动', 'en-US': 'Standard easing' } },
  { name: '--lg-ease-bounce', default: 'cubic-bezier(0.34, 1.56, 0.64, 1)', category: TYPE_MOTION, description: { 'zh-CN': '回弹缓动(指示器等)', 'en-US': 'Bounce easing (indicators, …)' } },
  { name: '--lg-duration', default: '200ms', category: TYPE_MOTION, description: { 'zh-CN': '标准过渡时长', 'en-US': 'Standard transition duration' } },
  { name: '--lg-duration-slow', default: '350ms', category: TYPE_MOTION, description: { 'zh-CN': '慢过渡时长', 'en-US': 'Slow transition duration' } },
  { name: '--lg-duration-press', default: '140ms', category: TYPE_MOTION, description: { 'zh-CN': '交互按压/悬浮的更快时长', 'en-US': 'Faster duration for press / hover feedback' } },
  { name: '--lg-interaction-scale', default: '0.98', category: TYPE_MOTION, description: { 'zh-CN': '交互按压缩放', 'en-US': 'Interaction press scale' } },
  { name: '--lg-hover-lift', default: '-1px', category: TYPE_MOTION, description: { 'zh-CN': '交互 hover 升起的位移', 'en-US': 'Interactive hover lift offset' } },
  { name: '--lg-z-overlay', default: '1000', category: TYPE_MOTION, description: { 'zh-CN': '浮层层级', 'en-US': 'Overlay z-index' } },
];
