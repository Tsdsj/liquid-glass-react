import { GlassIconButton, GlassPopover, GlassSegmentedControl, GlassSwitch, Text } from '@liquid-glass-ui/react';
import type { TextSize } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';

export interface SitePreferences {
  theme: 'system' | 'light' | 'dark';
  textSize: TextSize;
  opaque: boolean;
  reducedMotion: boolean;
  moreContrast: boolean;
}

/**
 * The switches this site uses to exercise its own accessibility paths.
 *
 * These are demo overrides layered *on top of* the OS settings, never replacements: a user
 * who has asked the system for reduced transparency keeps it whatever these say.
 */
export function PreferencesButton({ value, onChange }: {
  value: SitePreferences; onChange: (next: SitePreferences) => void;
}) {
  const set = <K extends keyof SitePreferences>(key: K, next: SitePreferences[K]) => onChange({ ...value, [key]: next });
  return <GlassPopover title="显示偏好" description="这些开关叠加在系统设置之上，不会覆盖系统的减少透明度或减少动效。"
    align="end"
    trigger={<GlassIconButton aria-label="打开显示偏好" variant="plain"><Icon name="tune" size={18} /></GlassIconButton>}>
    <div className="pref-group">
      <Text variant="subhead" emphasized>外观</Text>
      <GlassSegmentedControl aria-label="外观" density="compact" value={value.theme}
        onValueChange={next => set('theme', next as SitePreferences['theme'])}
        items={[{ value: 'system', label: '跟随系统' }, { value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} />
    </div>
    <div className="pref-group">
      <Text variant="subhead" emphasized>文字大小</Text>
      <GlassSegmentedControl aria-label="文字大小" density="compact" value={value.textSize}
        onValueChange={next => set('textSize', next as TextSize)}
        items={[{ value: 'm', label: '小' }, { value: 'l', label: '标准' }, { value: 'xxl', label: '大' }, { value: 'ax3', label: 'AX3' }]} />
      <Text variant="caption1" tone="secondary">Dynamic Type 的 Web 等价物。AX3 用来检查布局是否还能回流。</Text>
    </div>
    <div className="pref-rows">
      <label className="pref-row"><Text as="span" variant="subhead">减少透明度</Text>
        <GlassSwitch aria-label="减少透明度" checked={value.opaque} onCheckedChange={next => set('opaque', next)} /></label>
      <label className="pref-row"><Text as="span" variant="subhead">减少动效</Text>
        <GlassSwitch aria-label="减少动效" checked={value.reducedMotion} onCheckedChange={next => set('reducedMotion', next)} /></label>
      <label className="pref-row"><Text as="span" variant="subhead">增强对比度</Text>
        <GlassSwitch aria-label="增强对比度" checked={value.moreContrast} onCheckedChange={next => set('moreContrast', next)} /></label>
    </div>
  </GlassPopover>;
}
