import { useState } from 'react';
import { Input, Segmented, Switch } from '@ttqtt/liquid-glass-react';
import { useSiteLocale } from '../site-i18n';
import type {
  PlaygroundControl,
  PlaygroundProps,
  PlaygroundSpec,
} from '../demos/types';

function initialProps(controls: PlaygroundControl[]): PlaygroundProps {
  return Object.fromEntries(controls.map((control) => [control.key, control.default]));
}

export function Playground({ spec }: { spec: PlaygroundSpec }) {
  const locale = useSiteLocale();
  const [props, setProps] = useState<PlaygroundProps>(() => initialProps(spec.controls));
  const set = (key: string, value: string | boolean) =>
    setProps((current) => ({ ...current, [key]: value }));

  return (
    <div className="site-playground" data-testid="playground">
      <div className="site-demo__stage site-playground__preview">{spec.render(props)}</div>

      <div className="site-playground__controls">
        {spec.controls.map((control) => (
          <label key={control.key} className="site-playground__control">
            <span className="site-playground__label">{control.label[locale]}</span>
            {control.type === 'select' ? (
              <Segmented
                aria-label={control.label[locale]}
                options={control.options}
                value={props[control.key] as string}
                onChange={(value) => set(control.key, value)}
                size="sm"
              />
            ) : control.type === 'boolean' ? (
              <Switch
                aria-label={control.label[locale]}
                checked={props[control.key] as boolean}
                onCheckedChange={(checked) => set(control.key, checked)}
                size="sm"
              />
            ) : (
              <Input
                aria-label={control.label[locale]}
                value={props[control.key] as string}
                onChange={(event) => set(control.key, event.target.value)}
                size="sm"
              />
            )}
          </label>
        ))}
      </div>

      <pre className="site-code" data-testid="playground-code">
        {spec.code(props)}
      </pre>
    </div>
  );
}
