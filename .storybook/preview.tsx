import { useEffect, type ReactNode } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import {
  LiquidGlassConfig,
  type LiquidGlassLocale,
} from '../src/core/config/LiquidGlassConfig';
import '../src/styles/index.css';

const WALLPAPERS = {
  photo: [
    'linear-gradient(164deg, transparent 0 40%, rgb(54 91 73 / 0.95) 40% 56%, transparent 56%)',
    'linear-gradient(196deg, transparent 0 46%, rgb(32 62 50 / 0.9) 46% 63%, transparent 63%)',
    'linear-gradient(180deg, #8cb7d3 0%, #dce6e6 47%, #55705b 48%, #20382b 100%)',
  ].join(', '),
  gradient: 'linear-gradient(135deg, #315d80 0%, #7398a5 38%, #db9d8f 72%, #f1c987 100%)',
  'plain-light': 'linear-gradient(#eef1f3, #d9dfe3)',
  'plain-dark': 'linear-gradient(#20252a, #0f1215)',
} as const;

type Theme = 'light' | 'dark';
type Wallpaper = keyof typeof WALLPAPERS;

interface PreviewFrameProps {
  children: ReactNode;
  theme: Theme;
  wallpaper: Wallpaper;
  locale: LiquidGlassLocale;
}

function PreviewFrame({ children, theme, wallpaper, locale }: PreviewFrameProps) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: '48px',
        color: theme === 'dark' ? '#ffffff' : '#111820',
        backgroundImage: WALLPAPERS[wallpaper],
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </div>
  );
}

const withPreviewFrame: Decorator = (Story, context) => {
  const theme: Theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  const locale: LiquidGlassLocale =
    context.globals.locale === 'en-US' ? 'en-US' : 'zh-CN';
  const wallpaper: Wallpaper =
    context.globals.wallpaper === 'gradient' ||
    context.globals.wallpaper === 'plain-light' ||
    context.globals.wallpaper === 'plain-dark'
      ? context.globals.wallpaper
      : 'photo';

  return (
    <LiquidGlassConfig locale={locale}>
      <PreviewFrame theme={theme} wallpaper={wallpaper} locale={locale}>
        <Story />
      </PreviewFrame>
    </LiquidGlassConfig>
  );
};

const preview = {
  decorators: [withPreviewFrame],
  globalTypes: {
    theme: {
      description: 'Preview theme',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    wallpaper: {
      description: 'Preview wallpaper',
      toolbar: {
        icon: 'photo',
        items: [
          { value: 'photo', title: 'Photo' },
          { value: 'gradient', title: 'Gradient' },
          { value: 'plain-light', title: 'Plain light' },
          { value: 'plain-dark', title: 'Plain dark' },
        ],
      },
    },
    locale: {
      description: 'Preview locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'zh-CN', title: '中文' },
          { value: 'en-US', title: 'English' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    wallpaper: 'photo',
    locale: 'zh-CN',
  },
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
} satisfies Preview;

export default preview;
