import { Button, GlassSurface } from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types';

const CATEGORY = { 'zh-CN': '通用', 'en-US': 'General' };

export const glassSurfaceDoc: ComponentDoc = {
  slug: 'glass-surface',
  name: 'GlassSurface',
  title: { 'zh-CN': '玻璃表面', 'en-US': 'Glass surface' },
  category: CATEGORY,
  description: {
    'zh-CN':
      '所有玻璃质感的底层原语:折射、模糊、染色与高光都在这里实现。其余组件全部基于它构建,你也可以直接用它包装任意内容。',
    'en-US':
      'The primitive behind every glass material: refraction, blur, tint and specular light live here. Every other component builds on it, and you can wrap arbitrary content with it directly.',
  },
  renderPreview: () => (
    <GlassSurface style={{ padding: '12px 20px' }}>Liquid Glass</GlassSurface>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '默认 regular 材质,自动折射;radius 同时驱动圆角与折射贴图。',
        'en-US': 'Default regular material with automatic refraction; radius drives both corners and the refraction map.',
      },
      code: `
import { GlassSurface } from '@ttqtt/liquid-glass-react';

<GlassSurface radius={22} style={{ padding: 24 }}>
  内容浮在玻璃上
</GlassSurface>`,
      render: () => (
        <GlassSurface radius={22} style={{ padding: 24 }}>
          内容浮在玻璃上 / Content on glass
        </GlassSurface>
      ),
    },
    {
      id: 'materials',
      title: { 'zh-CN': '材质与暗化层', 'en-US': 'Materials and dimming' },
      description: {
        'zh-CN': 'clear 材质更透,适合媒体背景;亮背景上可加 dim 暗化层保证可读性。',
        'en-US': 'The clear material lets more show through for media backdrops; add the dim layer over bright content for legibility.',
      },
      code: `
<GlassSurface material="regular" style={{ padding: 16 }}>regular</GlassSurface>
<GlassSurface material="clear" style={{ padding: 16 }}>clear</GlassSurface>
<GlassSurface material="clear" dim style={{ padding: 16 }}>clear + dim</GlassSurface>`,
      render: () => (
        <>
          <GlassSurface material="regular" style={{ padding: 16 }}>
            regular
          </GlassSurface>
          <GlassSurface material="clear" style={{ padding: 16 }}>
            clear
          </GlassSurface>
          <GlassSurface material="clear" dim style={{ padding: 16 }}>
            clear + dim
          </GlassSurface>
        </>
      ),
    },
    {
      id: 'interactive',
      title: { 'zh-CN': '交互光影', 'en-US': 'Interactive light' },
      description: {
        'zh-CN': 'interactive 开启指针跟随高光与按压反馈,按压瞬间折射增强。',
        'en-US': 'interactive enables the pointer-tracking highlight and press feedback; refraction intensifies while pressed.',
      },
      code: `
<GlassSurface interactive as="button" style={{ padding: '14px 28px' }}>
  按住试试
</GlassSurface>`,
      render: () => (
        <GlassSurface interactive as="button" style={{ padding: '14px 28px' }}>
          按住试试 / Press me
        </GlassSurface>
      ),
    },
  ],
  api: [
    {
      title: 'GlassSurface',
      rows: [
        { prop: 'as', type: 'React.ElementType', defaultValue: "'div'", description: { 'zh-CN': '渲染的宿主元素', 'en-US': 'Host element to render' } },
        { prop: 'radius', type: 'number | string', defaultValue: 'var(--lg-radius-md)', description: { 'zh-CN': '圆角;传 number 时参与折射贴图,传 string 时折射自动关闭', 'en-US': 'Corner radius; numbers feed the refraction map, strings disable refraction' } },
        { prop: 'refraction', type: "'auto' | 'off'", defaultValue: "'auto'", description: { 'zh-CN': '边缘折射开关,auto 时按浏览器能力自动启用', 'en-US': 'Edge refraction; auto enables it when the browser supports it' } },
        { prop: 'depth', type: 'number', defaultValue: '1', description: { 'zh-CN': '折射强度系数', 'en-US': 'Refraction strength multiplier' } },
        { prop: 'bezel', type: 'number', defaultValue: '12', description: { 'zh-CN': '边缘折射带宽度(px)', 'en-US': 'Width of the refracting bezel in px' } },
        { prop: 'tint', type: 'string', description: { 'zh-CN': '覆盖染色颜色', 'en-US': 'Overrides the tint color' } },
        { prop: 'interactive', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '指针/键盘交互光影与按压反馈', 'en-US': 'Pointer/keyboard light tracking and press feedback' } },
        { prop: 'material', type: "'regular' | 'clear'", defaultValue: "'regular'", description: { 'zh-CN': '材质变体', 'en-US': 'Material variant' } },
        { prop: 'dim', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '在染色层下叠加暗化层(亮媒体背景用)', 'en-US': 'Adds a dimming layer beneath the tint for bright media' } },
      ],
    },
  ],
};

export const buttonDoc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  title: { 'zh-CN': '按钮', 'en-US': 'Button' },
  category: CATEGORY,
  description: {
    'zh-CN': '玻璃质感按钮,四种语义变体与三档尺寸;按压时缩放并增强折射,键盘 Space/Enter 与指针反馈一致。',
    'en-US': 'Glass buttons with four semantic variants and three sizes; pressing scales and intensifies refraction, with identical keyboard feedback.',
  },
  renderPreview: () => (
    <>
      <Button>默认</Button>
      <Button variant="accent">主要</Button>
    </>
  ),
  playground: {
    controls: [
      {
        key: 'variant',
        type: 'select',
        label: { 'zh-CN': '变体', 'en-US': 'Variant' },
        options: [
          { value: 'glass', label: 'glass' },
          { value: 'accent', label: 'accent' },
          { value: 'ghost', label: 'ghost' },
          { value: 'danger', label: 'danger' },
        ],
        default: 'accent',
      },
      {
        key: 'size',
        type: 'select',
        label: { 'zh-CN': '尺寸', 'en-US': 'Size' },
        options: [
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
        ],
        default: 'md',
      },
      { key: 'disabled', type: 'boolean', label: { 'zh-CN': '禁用', 'en-US': 'Disabled' }, default: false },
      { key: 'loading', type: 'boolean', label: { 'zh-CN': '加载中', 'en-US': 'Loading' }, default: false },
      { key: 'children', type: 'text', label: { 'zh-CN': '文案', 'en-US': 'Label' }, default: '点我' },
    ],
    render: (p) => (
      <Button
        variant={p.variant as 'glass' | 'accent' | 'ghost' | 'danger'}
        size={p.size as 'sm' | 'md' | 'lg'}
        disabled={p.disabled as boolean}
        loading={p.loading as boolean}
      >
        {(p.children as string) || 'Button'}
      </Button>
    ),
    code: (p) =>
      `<Button variant="${p.variant}" size="${p.size}"${p.disabled ? ' disabled' : ''}${
        p.loading ? ' loading' : ''
      }>${p.children}</Button>`,
  },
  demos: [
    {
      id: 'variants',
      title: { 'zh-CN': '四种变体', 'en-US': 'Variants' },
      description: {
        'zh-CN': 'glass 默认;accent/danger 用半透明玻璃色承载语义;ghost 无底板。',
        'en-US': 'glass by default; accent/danger carry semantics on translucent glass; ghost has no plate.',
      },
      code: `
import { Button } from '@ttqtt/liquid-glass-react';

<Button>默认</Button>
<Button variant="accent">主要操作</Button>
<Button variant="danger">危险操作</Button>
<Button variant="ghost">幽灵按钮</Button>`,
      render: () => (
        <>
          <Button>默认</Button>
          <Button variant="accent">主要操作</Button>
          <Button variant="danger">危险操作</Button>
          <Button variant="ghost">幽灵按钮</Button>
        </>
      ),
    },
    {
      id: 'sizes',
      title: { 'zh-CN': '尺寸与状态', 'en-US': 'Sizes and states' },
      description: {
        'zh-CN': '三档尺寸;loading 显示旋转指示并禁用交互。',
        'en-US': 'Three sizes; loading shows a spinner and blocks interaction.',
      },
      code: `
<Button size="sm">小</Button>
<Button size="md">中</Button>
<Button size="lg">大</Button>
<Button loading>加载中</Button>
<Button disabled>禁用</Button>`,
      render: () => (
        <>
          <Button size="sm">小</Button>
          <Button size="md">中</Button>
          <Button size="lg">大</Button>
          <Button loading>加载中</Button>
          <Button disabled>禁用</Button>
        </>
      ),
    },
  ],
  api: [
    {
      title: 'Button',
      rows: [
        { prop: 'variant', type: "'glass' | 'accent' | 'ghost' | 'danger'", defaultValue: "'glass'", description: { 'zh-CN': '语义变体', 'en-US': 'Semantic variant' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
        { prop: 'loading', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '加载态,禁用交互并显示指示器', 'en-US': 'Loading state; blocks interaction and shows a spinner' } },
        { prop: 'icon', type: 'ReactNode', description: { 'zh-CN': '文字前的图标', 'en-US': 'Icon rendered before the label' } },
      ],
    },
  ],
};
