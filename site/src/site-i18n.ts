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
    'zh-CN': '把 Apple 的液态玻璃搬上网页——边缘会折射身后的世界,高光随指尖流动,按下时轻轻回弹。',
    'en-US': "Apple's Liquid Glass, brought to the web — edges refract the world behind them, highlights follow your finger, and everything springs back when pressed.",
  },
  heroGetStarted: { 'zh-CN': '开始使用', 'en-US': 'Get started' },
  heroBrowse: { 'zh-CN': '浏览组件', 'en-US': 'Browse components' },
  heroBadge: {
    'zh-CN': 'React 18 / 19 · TypeScript · 主题可配置',
    'en-US': 'React 18 / 19 · TypeScript · Themeable',
  },
  featureTitle: { 'zh-CN': '为什么选择它', 'en-US': 'Why Liquid Glass React' },
  featureRefraction: { 'zh-CN': '会折射的玻璃', 'en-US': 'Glass that refracts' },
  featureRefractionDesc: {
    'zh-CN': '玻璃边缘真实折射身后的内容,光影随指针流动——是活的通透,不是一张模糊贴图。',
    'en-US': 'Edges genuinely bend the content behind them, with light that follows your pointer — living translucency, not a blurred screenshot.',
  },
  featureFallback: { 'zh-CN': '处处都好看', 'en-US': 'Great on every screen' },
  featureFallbackDesc: {
    'zh-CN': '不支持折射的浏览器自动换成细腻毛玻璃;暗色、高对比、减少动效也都照顾到,观感始终如一。',
    'en-US': 'Browsers without refraction get a refined frosted look instead, and dark mode, high contrast and reduced motion are all handled — it looks right everywhere.',
  },
  featureA11y: { 'zh-CN': '人人可用', 'en-US': 'Usable by everyone' },
  featureA11yDesc: {
    'zh-CN': '每个组件都能用键盘操作,焦点清晰可见,读屏友好;按下时的玻璃回馈,鼠标和键盘完全一致。',
    'en-US': 'Every component works from the keyboard with a clear focus ring and screen-reader support — and the press feedback feels the same whether you click or type.',
  },
  featureTheming: { 'zh-CN': '随心换装', 'en-US': 'Make it yours' },
  featureThemingDesc: {
    'zh-CN': '强调色、圆角、模糊、环境色随手可调,亮暗主题一键切换,想改整体或某一处都行。',
    'en-US': 'Tune accent color, corners, blur and ambient tint at will, flip between light and dark in one tap, and restyle the whole app or just one corner.',
  },
  quickStartTitle: { 'zh-CN': '三行代码开始', 'en-US': 'Start in three lines' },
  quickStartSubtitle: {
    'zh-CN': '引入一次样式文件，即可按需使用组件。',
    'en-US': 'Import the stylesheet once, then use only the components you need.',
  },
  homeComponentsTitle: { 'zh-CN': '从一块玻璃,到整套交互', 'en-US': 'From one pane of glass to a full toolkit' },
  homeComponentsSubtitle: {
    'zh-CN': '每个组件都共享同一种玻璃质感、同一套主题与无障碍标准。',
    'en-US': 'Every component shares the same glass, the same theming and the same accessibility standard.',
  },
  viewAllComponents: { 'zh-CN': '查看全部组件', 'en-US': 'View all components' },
  componentsTitle: { 'zh-CN': '组件总览', 'en-US': 'Components' },
  componentsSubtitle: {
    'zh-CN': '27 个玻璃组件,覆盖通用控件、数据录入、选择导航、容器展示与浮层反馈。',
    'en-US': '27 glass components across general controls, data entry, selection/navigation, containers/display and overlay feedback.',
  },
  searchPlaceholder: { 'zh-CN': '搜索组件', 'en-US': 'Search components' },
  searchEmpty: { 'zh-CN': '没有匹配的组件', 'en-US': 'No matching components' },
  overviewLabel: { 'zh-CN': '组件总览', 'en-US': 'Overview' },
  showComponentNav: { 'zh-CN': '展开组件导航', 'en-US': 'Show component navigation' },
  hideComponentNav: { 'zh-CN': '收起组件导航', 'en-US': 'Hide component navigation' },
  onThisPage: { 'zh-CN': '本页内容', 'en-US': 'On this page' },
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
