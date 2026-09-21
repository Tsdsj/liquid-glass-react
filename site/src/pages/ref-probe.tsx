/**
 * A harness, not a page. It mounts every exported component with a `ref` and a set of plain
 * HTML attributes, then writes what came back into the DOM for `tests/browser/refs.spec.ts`.
 *
 * It lives in the site rather than in the test file because these are React components: the
 * only honest way to ask "does this forward a ref" is to render it with React and look. It is
 * not linked from anywhere and carries no chrome; the route exists so Playwright can reach it.
 *
 * The table is checked against the package's own export list at runtime, so a component added
 * without an entry here fails rather than quietly skipping the check.
 */
import { Component, useEffect, useRef, useState, type ComponentProps, type ElementType, type ErrorInfo, type ReactNode } from 'react';
import * as lib from '@ttqtt/liquid-glass-react';
import {
  Card, Concentric, DisclosureGroup, Divider, Form, FormRow, FormSection, Grid, Kbd,
  List, ListRow, ListSection, MaterialView, Text,
  GlassBackdrop, GlassBadge, GlassButton, GlassIconButton, GlassProgress, GlassSegmentedControl,
  GlassSlider, GlassStepper, GlassSwitch, GlassSurface, GlassGroup, LibraryIcon, Picker, ColorWell, Banner,
  GlassCheckbox, RadioGroup,
  SearchField, TextField,
  GroupBox, OutlineView, Inspector, MenuBar, NavigationBar, PathBar, Panel, NavigationStack, PageControl, Screen, ScrollEdge, Sidebar, SplitView, TabBar, GlassTabs, GlassToolbar, ToolbarGroup, ToolbarSpacer,
  CommandPalette, GlassActionSheet, GlassAlert, GlassDialog, GlassMenu, GlassMenuButton, GlassMenuDescription, GlassPopover, GlassSheet, ContextMenu, Tooltip,
} from '@ttqtt/liquid-glass-react';

/**
 * Context providers. They render their children and a context value, and nothing of their own,
 * so there is no element for a ref to point at. Listed explicitly: "it has no ref" has to be a
 * decision someone wrote down, not a component that was forgotten.
 */
const CONTEXT_ONLY = new Set(['GlassProvider', 'BackdropToneProvider', 'SharedSurface', 'ToastProvider']);

/**
 * What every probe is handed. A component passes if the ref lands and all three survive.
 *
 * The ref is a callback rather than a `Ref<Element>` on purpose: a callback taking `Element`
 * is assignable to `Ref<HTMLDivElement>`, `Ref<HTMLInputElement>` and the rest, so one probe
 * type fits every component — and `tsc` still rejects it on a component whose props have no
 * `ref` at all. That rejection is the type half of this test; the DOM half is in
 * `tests/browser/refs.spec.ts`. Both are needed: a component can forward a ref at runtime
 * through a rest spread while its published types give the caller no way to pass one.
 */
interface Probe {
  ref: (node: Element | null) => void;
  id: string;
  'data-probe': string;
  style: { outlineOffset: string };
}

const entries: Array<[string, (p: Probe) => ReactNode]> = [
  /* Content */
  ['Card', p => <Card {...p}>card</Card>],
  ['Concentric', p => <Concentric {...p}>concentric</Concentric>],
  ['Divider', p => <Divider {...p} />],
  ['List', p => <List {...p} />],
  ['ListSection', p => <ListSection {...p}><ListRow label="row" /></ListSection>],
  ['ListRow', p => <ul><ListRow {...p} label="row" /></ul>],
  ['MaterialView', p => <MaterialView {...p}>material</MaterialView>],
  ['Text', p => <Text {...p}>text</Text>],
  ['Kbd', p => <Kbd {...p} keys="⌘K" />],
  ['DisclosureGroup', p => <DisclosureGroup {...p} label="disclosure">body</DisclosureGroup>],
  ['Grid', p => <Grid {...p}><span>item</span></Grid>],
  ['Form', p => <Form {...p}><FormSection><FormRow label="row"><input aria-label="row" /></FormRow></FormSection></Form>],
  ['FormSection', p => <FormSection {...p} header="section"><FormRow label="row"><input aria-label="row" /></FormRow></FormSection>],
  ['FormRow', p => <FormRow {...p} label="row"><input aria-label="row" /></FormRow>],

  /* Controls */
  ['GlassBadge', p => <GlassBadge {...p} count={3} aria-label="3 unread" />],
  ['GlassButton', p => <GlassButton {...p}>button</GlassButton>],
  ['GlassIconButton', p => <GlassIconButton {...p} aria-label="icon"><LibraryIcon name="plus" /></GlassIconButton>],
  ['GlassProgress', p => <GlassProgress {...p} value={40} aria-label="progress" />],
  ['GlassSegmentedControl', p => <GlassSegmentedControl {...p} aria-label="segmented"
    items={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} defaultValue="a" />],
  ['GlassSlider', p => <GlassSlider {...p} aria-label="slider" defaultValue={40} />],
  ['GlassStepper', p => <GlassStepper {...p} aria-label="stepper" defaultValue={1} />],
  ['GlassSwitch', p => <GlassSwitch {...p} aria-label="switch" />],
  ['GlassCheckbox', p => <GlassCheckbox {...p} label="checkbox" />],
  ['RadioGroup', p => <RadioGroup {...p} label="radios"
    options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />],
  /* Inline, so the probe measures one shape rather than whichever the window happened to pick. */
  ['Picker', p => <Picker {...p} label="picker" presentation="inline"
    options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />],
  /* The ref lands on the `<input type="color">` — the control, not the shell around it. */
  ['ColorWell', p => <ColorWell {...p} aria-label="colour" defaultValue="#0a84ff" />],

  /* Fields */
  ['SearchField', p => <SearchField {...p} aria-label="search" />],
  ['TextField', p => <TextField {...p} label="field" />],

  /* Navigation */
  ['NavigationBar', p => <NavigationBar {...p} title="title" />],
  ['ScrollEdge', p => <ScrollEdgeProbe {...p} />],
  /* `page` scroll: the probe mounts every component at once, and a container-scrolled
     Screen would be a 100dvh box in the middle of the table. */
  ['Screen', p => <Screen {...p} scroll="page" top={<span>bar</span>}>content</Screen>],
  ['NavigationStack', p => <NavigationStack {...p} root={{ key: 'r', title: 'root', content: 'content' }} />],
  ['PageControl', p => <PageControl {...p} aria-label="pages" count={3} />],
  ['MenuBar', p => <MenuBar {...p} aria-label="menu bar"
    menus={[{ key: 'a', title: 'A', items: [{ key: 'x', label: 'X', onSelect: () => {} }] }]} />],
  ['PathBar', p => <PathBar {...p} aria-label="path" items={[{ label: 'root', onSelect: () => {} }, { label: 'here' }]} />],
  ['GroupBox', p => <GroupBox {...p} title="box">body</GroupBox>],
  ['OutlineView', p => <OutlineView {...p} aria-label="outline"
    items={[{ key: 'a', label: 'A', children: [{ key: 'b', label: 'B' }] }]} />],
  ['SplitView', p => <SplitView {...p} title="split" sidebar={<span>side</span>}>content</SplitView>],
  ['Inspector', p => <Inspector {...p} title="inspector">body</Inspector>],
  ['Sidebar', p => <Sidebar {...p} aria-label="sidebar">side</Sidebar>],
  ['TabBar', p => <TabBar {...p} aria-label="tabs" current="a"
    items={[{ key: 'a', href: '#/_probe/refs', label: 'A' }, { key: 'b', href: '#/_probe/refs', label: 'B' }]} />],
  ['GlassTabs', p => <GlassTabs {...p} aria-label="tabs" defaultValue="a"
    items={[{ value: 'a', label: 'A', content: 'A' }, { value: 'b', label: 'B', content: 'B' }]} />],
  ['GlassToolbar', p => <GlassToolbar {...p} aria-label="toolbar"><ToolbarGroup><GlassButton>x</GlassButton></ToolbarGroup></GlassToolbar>],
  ['ToolbarGroup', p => <ToolbarGroup {...p}><GlassButton>x</GlassButton></ToolbarGroup>],
  ['ToolbarSpacer', p => <ToolbarSpacer {...p} />],

  /* Overlays. They render their panel whether or not it is open, so no trigger is needed. */
  ['GlassActionSheet', p => <GlassActionSheet {...p} aria-label="actions" title="sheet" actions={[{ key: 'a', label: 'A' }]} />],
  ['GlassAlert', p => <GlassAlert {...p} title="alert" actions={[{ key: 'ok', label: 'OK' }]} />],
  ['GlassDialog', p => <GlassDialog {...p} title="dialog" description="d">body</GlassDialog>],
  ['CommandPalette', p => <CommandPalette {...p} title="commands" shortcut={null}
    commands={[{ id: 'a', label: 'A', onSelect: () => {} }]} />],
  ['GlassMenu', p => <GlassMenu {...p} aria-label="menu" items={[{ key: 'a', label: 'A', onSelect: () => {} }]} />],
  /* The ref lands on the button, not the menu panel — the button is the element on the page. */
  ['GlassMenuButton', p => <GlassMenuButton {...p} label="menu button" items={[{ key: 'a', label: 'A', onSelect: () => {} }]} />],
  ['GlassMenuDescription', p => <GlassMenuDescription {...p}>description</GlassMenuDescription>],
  ['GlassPopover', p => <GlassPopover {...p} title="popover">body</GlassPopover>],
  ['Panel', p => <Panel {...p} title="panel">body</Panel>],
  /* The ref lands on the tooltip panel. Rendered only where there is a hover, so the probe
     reports it as absent on a touch device — which is the component working as documented. */
  ['Tooltip', p => <Tooltip {...p} content="tip"><button type="button">anchor</button></Tooltip>],
  ['ContextMenu', p => <ContextMenu {...p} aria-label="context" items={[{ key: 'a', label: 'A', onSelect: () => {} }]}>
    <span>target</span>
  </ContextMenu>],
  ['GlassSheet', p => <GlassSheet {...p} title="sheet">body</GlassSheet>],
  ['Banner', p => <Banner {...p} title="banner" message="message" />],

  /* System */
  ['GlassBackdrop', p => <GlassBackdrop {...p} tone="light">backdrop</GlassBackdrop>],
  ['GlassSurface', p => <GlassSurface {...p}>surface</GlassSurface>],
  ['GlassGroup', p => <GlassGroup {...p}><GlassButton>x</GlassButton></GlassGroup>],
  ['LibraryIcon', p => <LibraryIcon {...p} name="plus" />],
];

/**
 * The compile-time half, and the reason it cannot be folded into the table above: a JSX spread
 * skips excess-property checking, so `<X {...probe} />` compiles even when `X` declares none of
 * these props. `ComponentProps` resolves what the component actually accepts. Every value below
 * must be `never` — a component missing one of the contract keys leaves that key in the union
 * and `satisfies` fails on that component's own line, naming it.
 *
 * `ref` is the one that used to slip through: several components collected it in a rest spread
 * typed as glass options and passed it on, so it reached *an* element at runtime — in TabBar's
 * case the wrong one — while the published types gave a caller no way to write it.
 */
type Contract = 'ref' | 'id' | 'style' | 'aria-describedby';
type Gap<C extends ElementType> = Exclude<Contract, keyof ComponentProps<C>>;

const _contract = {
  Card: null as unknown as Gap<typeof Card>,
  Concentric: null as unknown as Gap<typeof Concentric>,
  Divider: null as unknown as Gap<typeof Divider>,
  List: null as unknown as Gap<typeof List>,
  ListSection: null as unknown as Gap<typeof ListSection>,
  ListRow: null as unknown as Gap<typeof ListRow>,
  MaterialView: null as unknown as Gap<typeof MaterialView>,
  Text: null as unknown as Gap<typeof Text>,
  Kbd: null as unknown as Gap<typeof Kbd>,
  DisclosureGroup: null as unknown as Gap<typeof DisclosureGroup>,
  Grid: null as unknown as Gap<typeof Grid>,
  Form: null as unknown as Gap<typeof Form>,
  FormSection: null as unknown as Gap<typeof FormSection>,
  FormRow: null as unknown as Gap<typeof FormRow>,
  GlassBadge: null as unknown as Gap<typeof GlassBadge>,
  GlassButton: null as unknown as Gap<typeof GlassButton>,
  GlassIconButton: null as unknown as Gap<typeof GlassIconButton>,
  GlassProgress: null as unknown as Gap<typeof GlassProgress>,
  GlassSegmentedControl: null as unknown as Gap<typeof GlassSegmentedControl>,
  GlassSlider: null as unknown as Gap<typeof GlassSlider>,
  GlassStepper: null as unknown as Gap<typeof GlassStepper>,
  GlassSwitch: null as unknown as Gap<typeof GlassSwitch>,
  Picker: null as unknown as Gap<typeof Picker>,
  ColorWell: null as unknown as Gap<typeof ColorWell>,
  Banner: null as unknown as Gap<typeof Banner>,
  SearchField: null as unknown as Gap<typeof SearchField>,
  TextField: null as unknown as Gap<typeof TextField>,
  NavigationBar: null as unknown as Gap<typeof NavigationBar>,
  ScrollEdge: null as unknown as Gap<typeof ScrollEdge>,
  Screen: null as unknown as Gap<typeof Screen>,
  NavigationStack: null as unknown as Gap<typeof NavigationStack>,
  PageControl: null as unknown as Gap<typeof PageControl>,
  MenuBar: null as unknown as Gap<typeof MenuBar>,
  PathBar: null as unknown as Gap<typeof PathBar>,
  GroupBox: null as unknown as Gap<typeof GroupBox>,
  OutlineView: null as unknown as Gap<typeof OutlineView>,
  SplitView: null as unknown as Gap<typeof SplitView>,
  Inspector: null as unknown as Gap<typeof Inspector>,
  Sidebar: null as unknown as Gap<typeof Sidebar>,
  TabBar: null as unknown as Gap<typeof TabBar>,
  GlassTabs: null as unknown as Gap<typeof GlassTabs>,
  GlassToolbar: null as unknown as Gap<typeof GlassToolbar>,
  ToolbarGroup: null as unknown as Gap<typeof ToolbarGroup>,
  ToolbarSpacer: null as unknown as Gap<typeof ToolbarSpacer>,
  GlassActionSheet: null as unknown as Gap<typeof GlassActionSheet>,
  GlassAlert: null as unknown as Gap<typeof GlassAlert>,
  GlassDialog: null as unknown as Gap<typeof GlassDialog>,
  CommandPalette: null as unknown as Gap<typeof CommandPalette>,
  GlassMenu: null as unknown as Gap<typeof GlassMenu>,
  GlassMenuButton: null as unknown as Gap<typeof GlassMenuButton>,
  GlassMenuDescription: null as unknown as Gap<typeof GlassMenuDescription>,
  GlassPopover: null as unknown as Gap<typeof GlassPopover>,
  Panel: null as unknown as Gap<typeof Panel>,
  Tooltip: null as unknown as Gap<typeof Tooltip>,
  ContextMenu: null as unknown as Gap<typeof ContextMenu>,
  GlassSheet: null as unknown as Gap<typeof GlassSheet>,
  GlassBackdrop: null as unknown as Gap<typeof GlassBackdrop>,
  GlassSurface: null as unknown as Gap<typeof GlassSurface>,
  GlassGroup: null as unknown as Gap<typeof GlassGroup>,
  LibraryIcon: null as unknown as Gap<typeof LibraryIcon>,
} satisfies Record<string, never>;
void _contract;

/** ScrollEdge needs something to watch; the probe is about its own root, not the target. */
function ScrollEdgeProbe(p: Probe) {
  const target = useRef<HTMLDivElement>(null);
  return <><div ref={target} /><ScrollEdge {...p} targetRef={target} /></>;
}

interface Result { name: string; tag: string | null; id: string | null; probe: string | null; style: string | null; error?: string }

/**
 * One component that throws must not take the table down with it, or the run reports nothing
 * at all and the failure reads as "the harness is broken" rather than "this component is".
 */
class Boundary extends Component<{ name: string; onError: (name: string, message: string) => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, _info: ErrorInfo) { this.props.onError(this.props.name, error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Case({ name, render, report }: { name: string; render: (p: Probe) => ReactNode; report: (r: Result) => void }) {
  const seen = useRef(false);
  const ref = (node: Element | null) => {
    if (!node || seen.current) return;
    seen.current = true;
    report({
      name,
      tag: node.tagName.toLowerCase(),
      id: node.getAttribute('id'),
      probe: node.getAttribute('data-probe'),
      style: node.getAttribute('style'),
    });
  };
  useEffect(() => {
    // A component that never calls the ref reports nothing, which is the failure we are after.
    const timer = setTimeout(() => { if (!seen.current) report({ name, tag: null, id: null, probe: null, style: null }); }, 0);
    return () => clearTimeout(timer);
  }, [name, report]);
  const onError = (which: string, message: string) => {
    seen.current = true;
    report({ name: which, tag: null, id: null, probe: null, style: null, error: message });
  };
  return <div className="probe-case">
    <Boundary name={name} onError={onError}>
      {render({ ref, id: `probe-${name}`, 'data-probe': name, style: { outlineOffset: '3px' } })}
    </Boundary>
  </div>;
}

export function RefProbe() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const report = useRef((r: Result) => setResults(previous => (previous[r.name] ? previous : { ...previous, [r.name]: r }))).current;

  const exported = Object.entries(lib)
    .filter(([name, value]) => /^[A-Z]/.test(name) && (typeof value === 'function' || (value && typeof value === 'object')))
    .map(([name]) => name);
  const covered = new Set(entries.map(([name]) => name));
  const missing = exported.filter(name => !covered.has(name) && !CONTEXT_ONLY.has(name));

  const done = Object.keys(results).length === entries.length;
  return <main id="main" style={{ padding: 24 }}>
    <h1>ref probe</h1>
    <div hidden>{entries.map(([name, render]) => <Case key={name} name={name} render={render} report={report} />)}</div>
    {done && <pre id="probe-result">{JSON.stringify({ missing, results: Object.values(results) }, null, 2)}</pre>}
  </main>;
}
