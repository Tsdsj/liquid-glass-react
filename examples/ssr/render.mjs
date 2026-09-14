// Server-side rendering example. Run `pnpm build` first, then `node examples/ssr/render.mjs`.
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { GlassProvider, GlassToolbar, ToolbarGroup, ToolbarSpacer, GlassButton } from '../../dist/index.js';

export const App = () => h(
  GlassProvider,
  { renderer: 'auto' },
  h(
    GlassToolbar,
    { 'aria-label': 'Image actions' },
    h(ToolbarGroup, null, h(GlassButton, null, 'View')),
    h(ToolbarSpacer, { variant: 'flexible' }),
    h(ToolbarGroup, { prominent: true }, h(GlassButton, { variant: 'glassProminent' }, 'Export')),
  ),
);

const html = renderToString(h(App), { identifierPrefix: 'demo-' });
console.log(html);

// On the client: hydrateRoot(container, h(App), { identifierPrefix: 'demo-' }).
// Load the stylesheet before hydration:  import '@ttqtt/liquid-glass-react/style.css';
// Give every independent root its own identifierPrefix so ids stay unique.
