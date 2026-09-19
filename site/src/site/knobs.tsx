import { useState } from 'react';
import { Form, FormRow, FormSection, GlassSlider, GlassStepper, GlassSwitch, Picker, TextField } from '@ttqtt/liquid-glass-react';
import type { Knob, KnobValues } from '../catalog/types.js';

/** The starting values, straight from the spec. */
export const initialKnobs = (knobs: Knob[]): KnobValues =>
  Object.fromEntries(knobs.map(knob => [knob.name, knob.value]));

/** Past this many steps a stepper is a chore; that is where the slider starts. */
const STEPPER_MAX_STEPS = 12;

/**
 * The adjustable-properties panel.
 *
 * Built from this library's own `Form`, and that is not a shortcut — a panel of controls
 * beside a component page is exactly the case the form container exists for, so using anything
 * else here would mean the page recommends something its own author avoided.
 */
export function KnobPanel({ knobs, values, onChange }: {
  knobs: Knob[]; values: KnobValues; onChange: (name: string, value: string | number | boolean) => void;
}) {
  return <Form className="knob-panel" onSubmit={event => event.preventDefault()}>
    <FormSection header="调整属性" footer="改动会同时进入上面的示例和下面的代码。">
      {knobs.map(knob => <FormRow key={knob.name} label={knob.label} description={knob.name}
        layout={knob.type === 'text' ? 'stacked' : 'inline'}>
        {control(knob, values[knob.name], value => onChange(knob.name, value))}
      </FormRow>)}
    </FormSection>
  </Form>;
}

function control(knob: Knob, value: KnobValues[string], set: (value: string | number | boolean) => void) {
  switch (knob.type) {
    case 'boolean':
      return <GlassSwitch aria-label={knob.label} checked={value === true} onCheckedChange={set} />;
    case 'select':
      return <Picker label={knob.label} labelHidden options={knob.options}
        value={String(value)} onValueChange={set} />;
    case 'number': {
      const { min = 0, max = 100, step = 1 } = knob;
      return (max - min) / step <= STEPPER_MAX_STEPS
        ? <GlassStepper aria-label={knob.label} value={Number(value)} onValueChange={set} min={min} max={max} step={step} />
        : <div className="knob-slider">
          <GlassSlider aria-label={knob.label} value={Number(value)} onValueChange={set} min={min} max={max} step={step} />
        </div>;
    }
    case 'text':
      return <TextField label={knob.label} labelHidden value={String(value)}
        onChange={event => set(event.target.value)} />;
  }
}

/** Holds one demo's knob values. Reset puts the page back to the example as it is written. */
export function useKnobs(knobs: Knob[] | undefined) {
  const [values, setValues] = useState<KnobValues>(() => knobs ? initialKnobs(knobs) : {});
  return {
    values,
    set: (name: string, value: string | number | boolean) =>
      setValues(previous => ({ ...previous, [name]: value })),
  };
}
