import { useState } from 'react';
import { Form, FormRow, FormSection, GlassButton, GlassSlider, GlassStepper, GlassSwitch, Picker, TextField } from '@ttqtt/liquid-glass-react';
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
export function KnobPanel({ knobs, values, onChange, onReset, changed }: {
  knobs: Knob[]; values: KnobValues; onChange: (name: string, value: string | number | boolean) => void;
  onReset: () => void; changed: boolean;
}) {
  return <Form className="knob-panel" onSubmit={event => event.preventDefault()}>
    <FormSection header="调整属性" footer="改动会同时进入上面的示例和下面的代码。">
      {knobs.map(knob => <FormRow key={knob.name} label={knob.label} description={knob.name}
        layout={knob.type === 'text' || knob.type === 'select' ? 'stacked' : 'inline'}>
        {control(knob, values[knob.name], value => onChange(knob.name, value))}
      </FormRow>)}
    </FormSection>
    {/* Only once something has moved: a reset that is always there is one more control to read
        past, and it says the page starts in a state you might want to leave. */}
    {changed && <div className="knob-reset">
      <GlassButton variant="plain" controlSize="small" onClick={onReset}>恢复示例原样</GlassButton>
    </div>}
  </Form>;
}

function control(knob: Knob, value: KnobValues[string], set: (value: string | number | boolean) => void) {
  switch (knob.type) {
    case 'boolean':
      return <GlassSwitch aria-label={knob.label} checked={value === true} onCheckedChange={set} />;
    case 'select':
      /* `automatic`, with no override: this panel is the reference for how to use the library,
         so where its behaviour was wrong the fix belongs in `Picker` — which is where it went. */
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
  const initial = knobs ? initialKnobs(knobs) : {};
  const [values, setValues] = useState<KnobValues>(initial);
  return {
    values,
    set: (name: string, value: string | number | boolean) =>
      setValues(previous => ({ ...previous, [name]: value })),
    reset: () => setValues(initial),
    /* Compared by value, not by a "has been touched" flag: setting a knob back by hand really
       does put the page back where it started, and offering to reset it then is noise. */
    changed: Object.keys(initial).some(name => values[name] !== initial[name]),
  };
}
