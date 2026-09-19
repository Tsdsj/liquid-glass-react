/**
 * Server markup, hydrated for real.
 *
 * `tests/ssr.test.mjs` renders to a string and reads it, which proves the server output is safe
 * but says nothing about what React does when it meets that markup in a browser — and a
 * hydration mismatch is only reported at that moment, in a development build.
 * `docs/roadmap-0.3.md` listed `defaultOpen` overlays as a suspicion for exactly this reason:
 * the server cannot emit an open `<dialog>`, so the element arrives closed and an effect opens
 * it, and whether React counts that as a mismatch was the open question.
 *
 * Both passes happen here, at the top level of a page that does nothing else, with the same
 * `identifierPrefix` on each side so `useId` agrees across them. `tests/browser/hydration.spec.ts`
 * watches the console.
 */
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import {
  GlassAlert, GlassButton, GlassDialog, GlassMenu, GlassPopover, GlassProvider,
  GlassSegmentedControl, GlassSheet, GlassSwitch, GlassToolbar, ToolbarGroup,
} from '@ttqtt/liquid-glass-react';
import '@ttqtt/liquid-glass-react/style.css';

const CASES: Array<[string, ReactNode]> = [
  ['dialog-default-open', <GlassDialog title="标题" description="说明" defaultOpen>正文</GlassDialog>],
  ['sheet-default-open', <GlassSheet title="标题" defaultOpen>正文</GlassSheet>],
  ['alert-default-open', <GlassAlert title="标题" defaultOpen actions={[{ key: 'ok', label: '好' }]} />],
  ['popover-default-open', <GlassPopover title="标题" defaultOpen>正文</GlassPopover>],
  ['menu-default-open', <GlassMenu aria-label="菜单" defaultOpen items={[{ key: 'a', label: 'A', onSelect: () => {} }]} />],
  ['segmented', <GlassSegmentedControl aria-label="范围" items={[{ value: 'a', label: '日' }, { value: 'b', label: '周' }]} />],
  ['switch', <GlassSwitch aria-label="Wi-Fi" defaultChecked />],
  ['toolbar', <GlassToolbar aria-label="工具"><ToolbarGroup><GlassButton>动作</GlassButton></ToolbarGroup></GlassToolbar>],
];

const host = document.getElementById('cases')!;

for (const [index, [name, node]] of CASES.entries()) {
  const prefix = `ssr-${index}-`;
  const tree = <GlassProvider>{node}</GlassProvider>;
  const container = document.createElement('div');
  container.dataset.case = name;
  // The server pass, written into the document before React ever touches it — so hydration
  // meets exactly the bytes a server would have sent.
  container.innerHTML = renderToString(tree, { identifierPrefix: prefix });
  host.append(container);
  hydrateRoot(container, tree, { identifierPrefix: prefix });
}

const marker = document.createElement('p');
marker.id = 'probe-done';
marker.textContent = `hydrated ${CASES.length}`;
document.body.append(marker);
