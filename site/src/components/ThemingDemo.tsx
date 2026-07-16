import { useMemo, useState, type CSSProperties } from 'react';
import {
  Button,
  Card,
  Segmented,
  Switch,
  presetThemes,
} from '@ttqtt/liquid-glass-react';
import { useSiteLocale, type Bilingual } from '../site-i18n';
import { TOKEN_REFERENCE } from '../theming-tokens';

type Preset = keyof typeof presetThemes;

const COPY = {
  'zh-CN': {
    title: '定制主题(createTheme)',
    desc: '所有视觉参数都是 --lg-* CSS 变量。用 createTheme 把一组覆盖变成可 spread 到任意容器的 style,作用域内即时生效;或用预设主题,通过 LiquidGlassConfig 的 theme 全局套用。下方切换预设看强调色与玻璃染色的变化。',
    presetLabel: '预设主题',
    presets: { default: '默认', midnight: '午夜', warm: '暖阳' } as Record<Preset, string>,
    previewCard: '玻璃卡片',
    previewButton: '强调按钮',
    tableTitle: '全量 Token 参考',
    colToken: 'Token',
    colDefault: '默认值',
    colDesc: '说明',
  },
  'en-US': {
    title: 'Custom themes (createTheme)',
    desc: 'Every visual knob is a --lg-* CSS variable. createTheme turns a set of overrides into a style you can spread onto any container — scoped and instant — or apply a preset globally via LiquidGlassConfig theme=. Switch presets below to watch the accent and glass tint change.',
    presetLabel: 'Preset theme',
    presets: { default: 'Default', midnight: 'Midnight', warm: 'Warm' } as Record<Preset, string>,
    previewCard: 'Glass card',
    previewButton: 'Accent button',
    tableTitle: 'Full token reference',
    colToken: 'Token',
    colDefault: 'Default',
    colDesc: 'Description',
  },
} as const;

const CODE = `import { createTheme, LiquidGlassConfig, presetThemes } from '@ttqtt/liquid-glass-react';

// 1) Spread a custom theme onto any container — scopes tokens to that subtree
<div style={createTheme({ accent: '#7c3aed', radiusMd: '18px' })}>
  <Button variant="accent">Purple</Button>
</div>

// 2) Or apply a preset globally through the config provider
<LiquidGlassConfig theme={presetThemes.midnight}>
  <App />
</LiquidGlassConfig>`;

export function ThemingDemo() {
  const locale = useSiteLocale();
  const copy = COPY[locale];
  const [preset, setPreset] = useState<Preset>('default');
  const [switchOn, setSwitchOn] = useState(true);

  const grouped = useMemo(() => {
    const map = new Map<string, { category: Bilingual; rows: typeof TOKEN_REFERENCE }>();
    for (const token of TOKEN_REFERENCE) {
      const key = token.category['en-US'];
      if (!map.has(key)) map.set(key, { category: token.category, rows: [] });
      map.get(key)!.rows.push(token);
    }
    return [...map.values()];
  }, []);

  return (
    <section
      className="site-guide__section"
      id="guide-createTheme"
      data-testid="theming-demo"
    >
      <h2 className="site-guide__section-title">{copy.title}</h2>
      <p className="site-guide__section-description">{copy.desc}</p>

      <div className="theming-demo__controls">
        <Segmented
          aria-label={copy.presetLabel}
          value={preset}
          onChange={(value) => setPreset(value as Preset)}
          options={(Object.keys(presetThemes) as Preset[]).map((key) => ({
            label: copy.presets[key],
            value: key,
          }))}
        />
      </div>

      <div
        className="theming-demo__preview"
        style={presetThemes[preset] as CSSProperties}
        data-testid="theming-preview"
      >
        <Card padding="md">
          <strong>{copy.previewCard}</strong>
          <div className="theming-demo__preview-row">
            <Button variant="accent">{copy.previewButton}</Button>
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
          </div>
        </Card>
      </div>

      <pre className="site-code site-code--guide">{CODE}</pre>

      <h3 className="theming-demo__table-title">{copy.tableTitle}</h3>
      <div className="theming-demo__table-scroll">
        <table className="theming-demo__table">
          <thead>
            <tr>
              <th scope="col">{copy.colToken}</th>
              <th scope="col">{copy.colDefault}</th>
              <th scope="col">{copy.colDesc}</th>
            </tr>
          </thead>
          {grouped.map((group) => (
            <tbody key={group.category['en-US']}>
              <tr>
                <th scope="rowgroup" colSpan={3} className="theming-demo__table-group">
                  {group.category[locale]}
                </th>
              </tr>
              {group.rows.map((token) => (
                <tr key={token.name}>
                  <td>
                    <code>{token.name}</code>
                  </td>
                  <td>
                    <code>{token.default}</code>
                  </td>
                  <td>{token.description[locale]}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
}
