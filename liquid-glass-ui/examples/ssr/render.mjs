// Run after npm install && npm run build:packages.
import { createElement as h } from 'react';import { renderToString } from 'react-dom/server';
import { GlassProvider, GlassToolbar, GlassButton } from '../../packages/react/dist/index.js';
export const App=()=>h(GlassProvider,{renderer:'auto'},h(GlassToolbar,{'aria-label':'SSR actions'},h(GlassButton,null,'View'),h(GlassButton,{variant:'primary'},'Export')));
const html=renderToString(h(App),{identifierPrefix:'demo-'});console.log(html);
// Your client entry must call hydrateRoot(container, h(App), {identifierPrefix:'demo-'}).
// Serve tokens.css/styles.css before hydration. Do not reuse the prefix for unrelated roots.
