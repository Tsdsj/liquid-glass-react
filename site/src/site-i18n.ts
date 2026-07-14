import { createContext, useContext } from 'react';
import type { LiquidGlassLocale } from '@ttq/liquid-glass-react';

export interface Bilingual {
  'zh-CN': string;
  'en-US': string;
}

export const SiteLocaleContext = createContext<LiquidGlassLocale>('zh-CN');

export function useSiteLocale(): LiquidGlassLocale {
  return useContext(SiteLocaleContext);
}

/** Resolves a bilingual copy entry against the current site locale. */
export function useT(): (copy: Bilingual) => string {
  const locale = useSiteLocale();
  return (copy) => copy[locale];
}

export const SITE_COPY = {
  brand: { 'zh-CN': 'Liquid Glass React', 'en-US': 'Liquid Glass React' },
  navHome: { 'zh-CN': '首页', 'en-US': 'Home' },
  navComponents: { 'zh-CN': '组件', 'en-US': 'Components' },
  navGuide: { 'zh-CN': '使用文档', 'en-US': 'Docs' },
  themeLight: { 'zh-CN': '浅色', 'en-US': 'Light' },
  themeDark: { 'zh-CN': '深色', 'en-US': 'Dark' },
  heroTitle: {
    'zh-CN': '液态玻璃质感的 React 组件库',
    'en-US': 'Liquid Glass React components',
  },
  heroSubtitle: {
    'zh-CN': '复刻 Apple Liquid Glass 的边缘折射、动态高光与流体动效,Chromium 真折射、其余浏览器自动降级为毛玻璃。',
    'en-US': 'Apple-style Liquid Glass for the web: edge refraction, dynamic specular light and fluid motion. Real refraction on Chromium, graceful frosted fallback elsewhere.',
  },
  heroGetStarted: { 'zh-CN': '开始使用', 'en-US': 'Get started' },
  heroBrowse: { 'zh-CN': '浏览组件', 'en-US': 'Browse components' },
  heroBadge: { 'zh-CN': '零运行时依赖 · TypeScript · 中英双语', 'en-US': 'Zero runtime deps · TypeScript · Bilingual' },
  featureTitle: { 'zh-CN': '为什么选择它', 'en-US': 'Why Liquid Glass React' },
  featureRefraction: { 'zh-CN': '真实边缘折射', 'en-US': 'Real edge refraction' },
  featureRefractionDesc: {
    'zh-CN': 'SVG 位移贴图驱动的透镜折射,滤镜按形状全局复用,首帧无闪烁。',
    'en-US': 'Lens refraction driven by SVG displacement maps, filters shared per shape, flicker-free first frame.',
  },
  featureFallback: { 'zh-CN': '全链路自动降级', 'en-US': 'Graceful degradation' },
  featureFallbackDesc: {
    'zh-CN': 'Safari/Firefox 毛玻璃降级;减少透明度、高对比度、强制配色、减少动态全部适配。',
    'en-US': 'Frosted fallback for Safari/Firefox; reduced transparency, contrast, forced colors and reduced motion all covered.',
  },
  featureA11y: { 'zh-CN': '可访问性优先', 'en-US': 'Accessibility first' },
  featureA11yDesc: {
    'zh-CN': '完整键盘操作、焦点管理与 aria 语义;键盘按压与指针共享同一套玻璃反馈。',
    'en-US': 'Full keyboard support, focus management and aria semantics; keyboard presses share the same glass feedback as pointers.',
  },
  featureTheming: { 'zh-CN': 'Token 化主题', 'en-US': 'Token-based theming' },
  featureThemingDesc: {
    'zh-CN': '所有视觉参数都是 --lg-* CSS 变量,亮暗主题一个属性切换,可整体或局部覆盖。',
    'en-US': 'Every visual knob is a --lg-* CSS variable: one attribute flips dark mode, override globally or per subtree.',
  },
  quickStartTitle: { 'zh-CN': '三行代码开始', 'en-US': 'Start in three lines' },
  componentsTitle: { 'zh-CN': '组件总览', 'en-US': 'Components' },
  componentsSubtitle: {
    'zh-CN': '12 个玻璃组件,覆盖通用控件、数据录入与浮层反馈。',
    'en-US': '12 glass components across general controls, data entry and overlay feedback.',
  },
  searchPlaceholder: { 'zh-CN': '搜索组件', 'en-US': 'Search components' },
  searchEmpty: { 'zh-CN': '没有匹配的组件', 'en-US': 'No matching components' },
  backToOverview: { 'zh-CN': '返回组件总览', 'en-US': 'Back to overview' },
  demosTitle: { 'zh-CN': '代码演示', 'en-US': 'Examples' },
  apiTitle: { 'zh-CN': 'API', 'en-US': 'API' },
  showCode: { 'zh-CN': '显示代码', 'en-US': 'Show code' },
  hideCode: { 'zh-CN': '收起代码', 'en-US': 'Hide code' },
  copyCode: { 'zh-CN': '复制代码', 'en-US': 'Copy code' },
  copied: { 'zh-CN': '代码已复制', 'en-US': 'Code copied' },
  copyFailed: { 'zh-CN': '复制失败,请手动复制', 'en-US': 'Copy failed, please copy manually' },
  propColumn: { 'zh-CN': '属性', 'en-US': 'Prop' },
  typeColumn: { 'zh-CN': '类型', 'en-US': 'Type' },
  defaultColumn: { 'zh-CN': '默认值', 'en-US': 'Default' },
  descColumn: { 'zh-CN': '说明', 'en-US': 'Description' },
  notFoundTitle: { 'zh-CN': '组件不存在', 'en-US': 'Component not found' },
  guideTitle: { 'zh-CN': '使用文档', 'en-US': 'Getting started' },
  footer: {
    'zh-CN': '基于本组件库自身构建 · 折射效果需 Chromium 内核浏览器',
    'en-US': 'Built with the library itself · refraction requires a Chromium browser',
  },
} satisfies Record<string, Bilingual>;
