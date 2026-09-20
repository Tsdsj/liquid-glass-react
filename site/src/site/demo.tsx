import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { GlassBackdrop, GlassProvider, GlassSegmentedControl, LibraryIcon, Text, useGlassPolicy } from '@ttqtt/liquid-glass-react';
import { AlpineScene } from '../scene.js';
import { CodeBlock } from './code-block.js';
import { KnobPanel, useKnobs } from './knobs.js';
import type { DemoEntry } from '../catalog/types.js';

export type DemoBackdrop = 'plain' | 'media' | 'both';
type Scheme = 'light' | 'dark';
type Surface = 'plain' | 'media';

interface DemoSettings { scheme: Scheme; surface: Surface }
const DemoSettingsContext = createContext<DemoSettings>({ scheme: 'light', surface: 'plain' });

/**
 * One set of controls for every example on the page.
 *
 * It starts in whatever appearance the site is using, which matters more than it sounds:
 * dialogs and sheets render in the browser's top layer and cover the whole page, so a demo
 * that defaulted to light would drop a white dialog onto a dark site. Switching is for
 * comparing the two deliberately, not for correcting a wrong default.
 */
export function DemoSettings({ showSurface, children }: { showSurface: boolean; children: ReactNode }) {
  const site = useGlassPolicy().resolvedTheme;
  const [scheme, setScheme] = useState<Scheme>(site);
  const [touched, setTouched] = useState(false);
  const [surface, setSurface] = useState<Surface>('plain');
  useEffect(() => { if (!touched) setScheme(site); }, [site, touched]);
  return <DemoSettingsContext.Provider value={{ scheme, surface }}>
    <div className="demo-settings">
      {showSurface && <GlassSegmentedControl aria-label="演示背景" density="compact" value={surface}
        onValueChange={value => setSurface(value as Surface)}
        items={[{ value: 'plain', label: '纯色背景' }, { value: 'media', label: '图片背景' }]} />}
      <GlassSegmentedControl aria-label="演示外观" density="compact" value={scheme}
        onValueChange={value => { setTouched(true); setScheme(value as Scheme); }}
        items={[{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} />
    </div>
    {children}
  </DemoSettingsContext.Provider>;
}

/**
 * The stage a single example is rendered on, and the element the example's anchor points at.
 *
 * The `id` is here rather than on the card around it, and that is load-bearing. The adjustable
 * examples carry a panel of this library's own controls — a `Picker` for a select, a
 * `GlassStepper` for a number — so a card-level id would put a second segmented control, a
 * second stepper and a second text field inside `#segmented-basic`. Every test that scoped a
 * component selector to the example id then matched the apparatus as well as the example.
 * The example is what is on the stage; the knobs are how you change it.
 */
export function Demo({ id, children, backdrop = 'plain', height = 200 }: {
  id?: string; children: ReactNode; backdrop?: DemoBackdrop; height?: number;
}) {
  const { scheme, surface: chosen } = useContext(DemoSettingsContext);
  // An example that only makes sense over a photo keeps its photo whatever the page says.
  const surface: Surface = backdrop === 'media' ? 'media' : backdrop === 'both' ? chosen : 'plain';
  return <div className="demo-stage" id={id} data-scheme={scheme} data-surface={surface} style={{ minHeight: height }}>
    {surface === 'media' && <div className="demo-art" aria-hidden="true"><AlpineScene /></div>}
    <GlassProvider theme={scheme}>
      {/* Telling the glass what is behind it, instead of having it read the screen. */}
      <GlassBackdrop tone={surface === 'media' ? 'dark' : 'mixed'} className="demo-content">{children}</GlassBackdrop>
    </GlassProvider>
  </div>;
}

/**
 * Title, live example, and the code behind it — folded away until you ask for it.
 *
 * A demo that declares `knobs` also gets a panel of its properties, and its code block is
 * written from the current values rather than fixed: the point of the panel is that you can see
 * what a property does *and* what to type to get it, and a snippet that did not follow the
 * knobs would be showing the reader a call that produces something other than what is on
 * screen.
 */
export function DemoCard({ id, title, description, render: Render, code, backdrop, height, knobs }: DemoEntry) {
  const [showCode, setShowCode] = useState(false);
  const { values, set, reset, changed } = useKnobs(knobs);
  const snippet = typeof code === 'function' ? code(values) : code;
  return <section className="demo-card" data-demo={id} data-adjustable={knobs ? 'true' : undefined}>
    <Demo id={id} backdrop={backdrop} height={height}><Render knobs={values} /></Demo>
    <div className="demo-card-body">
      <Text as="h3" variant="headline">{title}</Text>
      {description && <Text variant="subhead" tone="secondary">{description}</Text>}
    </div>
    {knobs && <KnobPanel knobs={knobs} values={values} onChange={set} onReset={reset} changed={changed} />}
    <button type="button" className="demo-code-toggle" aria-expanded={showCode} aria-controls={`${id}-code`}
      onClick={() => setShowCode(value => !value)}>
      <LibraryIcon name={showCode ? 'chevronDown' : 'chevronForward'} size={15} />
      <Text as="span" variant="footnote">{showCode ? '收起代码' : '显示代码'}</Text>
    </button>
    <div id={`${id}-code`} className="demo-card-code" hidden={!showCode}>
      <CodeBlock code={snippet} />
    </div>
  </section>;
}

/**
 * Links inside an example must not navigate the documentation site. Spread this onto demo
 * anchors so they keep real link semantics — focusable, announced as a link — without
 * taking the reader somewhere else when they try the component.
 */
export const demoLink = {
  href: '#',
  onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
};
