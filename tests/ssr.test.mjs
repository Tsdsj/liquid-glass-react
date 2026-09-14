import test from 'node:test';import assert from 'node:assert/strict';import { createElement as h } from 'react';import { renderToString } from 'react-dom/server';
import { GlassProvider,GlassSurface,GlassButton,GlassSegmentedControl,GlassDialog } from '../dist/index.js';
test('server import and render do not require DOM or canvas',()=>{
 assert.equal(typeof document,'undefined');const html=renderToString(h(GlassProvider,{renderer:'svg'},h(GlassSurface,null,h(GlassButton,null,'SSR button'))));
 assert.match(html,/SSR button/);assert.match(html,/data-renderer="css"/);assert.doesNotMatch(html,/feDisplacementMap/);
});
test('stable IDs and multi-root prefixes are unique',()=>{
 const tree=h(GlassProvider,null,h(GlassSegmentedControl,{'aria-label':'SSR choices',items:[{value:'a',label:'A'},{value:'b',label:'B'}]}));
 const a=renderToString(tree,{identifierPrefix:'first-'}),b=renderToString(tree,{identifierPrefix:'second-'});assert.notEqual(a,b);assert.match(a,/first-/);assert.match(b,/second-/);
});
test('default-open dialog is safe server markup; native opening is a client effect',()=>{
 const html=renderToString(h(GlassProvider,null,h(GlassDialog,{title:'Title',description:'Description',defaultOpen:true},'Body')));
 assert.match(html,/<dialog/);assert.doesNotMatch(html,/<dialog[^>]*\sopen(?:=|\s|>)/);
});
