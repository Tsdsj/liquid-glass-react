import { GlassIconButton, GlassPopover, GlassSegmentedControl, GlassSwitch, Text } from '@ttqtt/liquid-glass-react';
import type { TextSize } from '@ttqtt/liquid-glass-react';
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
        items={[{ value: 'm', label: '小' }, { value: 'l', label: '标准' }, { value: 'xxl', label: '大' }, { value: 'ax5', label: 'AX5' }]} />
      {/* AX5, not AX3: AX5 is the size the layout rules in `app.css` were measured at — the
          comments there quote widths found at AX5 — and it is the one the HIG asks a layout to
          survive. Offering a gentler setting than the one the tests use invites a reader to
          conclude the layout holds up when the hard case was never on screen. */}
      <Text variant="caption1" tone="secondary">跟随系统文字大小设置的网页版。AX5 是最大的一档，用来看布局还能不能排得开。</Text>
    </div>
    {/*
      Each row is the switch and nothing else.
      These were `<label className="pref-row">` wrapping a `GlassSwitch`, which renders its own
      `<label htmlFor>` — a label inside a label, which is exactly the markup this site's own
      `Form` page tells readers not to write. `GlassSwitch` has a visible-label slot for this;
      the words come first by way of `row-reverse` rather than by a second element.
    */}
    <div className="pref-rows">
      <GlassSwitch className="pref-row" aria-label="减少透明度" label="减少透明度"
        checked={value.opaque} onCheckedChange={next => set('opaque', next)} />
      <GlassSwitch className="pref-row" aria-label="减少动效" label="减少动效"
        checked={value.reducedMotion} onCheckedChange={next => set('reducedMotion', next)} />
      <GlassSwitch className="pref-row" aria-label="增强对比度" label="增强对比度"
        checked={value.moreContrast} onCheckedChange={next => set('moreContrast', next)} />
    </div>
  </GlassPopover>;
}
