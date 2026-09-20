import { MenuBar } from '@ttqtt/liquid-glass-react';
import type { TextSize } from '@ttqtt/liquid-glass-react';
import type { SitePreferences } from './preferences.js';

const REPO = 'https://github.com/Tsdsj/liquid-glass-react';

/**
 * The window's command surface, on wide layouts.
 *
 * It is the site's own dogfooding of `MenuBar`, and it is not decoration: every item here does
 * something, and four of the five settings have no other keyboard-reachable home on a desktop.
 * A menu bar of greyed-out placeholders would be the opposite of what this page is for.
 *
 * Four menus rather than one "View" holding everything, and the reason is semantic rather than
 * tidy: appearance and text size are each **one choice out of a list** (`menuitemradio`), while
 * the three accessibility switches are independent toggles (`menuitemcheckbox`). One menu
 * cannot be both, and a menu that announced "reduce motion, 3 of 3 selected" would be telling
 * a screen-reader user something untrue about what picking another one does.
 */
export function SiteMenuBar({ value, onChange, go }: {
  value: SitePreferences;
  onChange: (next: SitePreferences) => void;
  go: (path: string) => void;
}) {
  const set = <K extends keyof SitePreferences>(key: K, next: SitePreferences[K]) =>
    onChange({ ...value, [key]: next });

  return <MenuBar aria-label="站点命令" className="app-menubar" radius={12} menus={[
    {
      key: 'appearance', title: '外观', selection: 'single',
      items: ([['system', '跟随系统'], ['light', '浅色'], ['dark', '深色']] as const).map(([key, label]) => ({
        key, label, checked: value.theme === key, onSelect: () => set('theme', key),
      })),
    },
    {
      key: 'text', title: '文字', selection: 'single',
      /* The labels carry what the popover explains in a sentence, because a menu item is one
         line and has nowhere to put a footnote. AX5 is the size the layout rules in `app.css`
         were measured at, so it is the one offered rather than a gentler setting that would let
         a reader conclude the layout holds up without the hard case ever being on screen. */
      items: ([['m', '小'], ['l', '标准'], ['xxl', '大'], ['ax5', 'AX5（最大档，用来看回流）']] as const)
        .map(([key, label]) => ({
          key, label, checked: value.textSize === key, onSelect: () => set('textSize', key as TextSize),
        })),
    },
    {
      key: 'a11y', title: '辅助功能',
      items: [
        { key: 'opaque', label: '减少透明度', checked: value.opaque, onSelect: () => set('opaque', !value.opaque) },
        { key: 'motion', label: '减少动效', checked: value.reducedMotion, onSelect: () => set('reducedMotion', !value.reducedMotion) },
        { key: 'contrast', label: '增强对比度', checked: value.moreContrast, onSelect: () => set('moreContrast', !value.moreContrast) },
      ],
    },
    {
      key: 'help', title: '帮助',
      items: [
        { key: 'install', label: '安装与使用', onSelect: () => go('guides/install') },
        { key: 'components', label: '组件目录', onSelect: () => go('components') },
        { key: 'changelog', label: '更新日志', separatorBefore: true, onSelect: () => go('changelog') },
        { key: 'repo', label: '在 GitHub 上打开', onSelect: () => window.open(REPO, '_blank', 'noopener') },
      ],
    },
  ]} />;
}
