import test from 'node:test';import assert from 'node:assert/strict';import { createElement as h } from 'react';import { renderToString } from 'react-dom/server';
import { GlassProvider,GlassSurface,GlassButton,GlassSegmentedControl,GlassDialog,GlassStepper,defaultStrings } from '../dist/index.js';
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

/**
 * Three sources for one label, in order: the component's own default, the provider's table,
 * and an explicit prop. The last must keep winning — the table is a default, not a policy,
 * and a library that made central translation mean "you can no longer label one button
 * differently" would have traded one problem for another.
 */
const stepper=(strings,props)=>renderToString(h(GlassProvider,strings?{strings}:null,h(GlassStepper,{'aria-label':'Guests',...props})));
test('component labels fall back to English and nothing else',()=>{
 assert.equal(defaultStrings.decrease,'Decrease');
 const html=stepper(null,{});assert.match(html,/aria-label="Decrease"/);assert.match(html,/aria-label="Increase"/);
});
test('the provider table replaces them',()=>{
 const html=stepper({decrease:'减少',increase:'增加'},{});
 assert.match(html,/aria-label="减少"/);assert.match(html,/aria-label="增加"/);assert.doesNotMatch(html,/aria-label="Decrease"/);
});
test('a partial table leaves the rest in English rather than blanking them',()=>{
 const html=stepper({decrease:'减少'},{});assert.match(html,/aria-label="减少"/);assert.match(html,/aria-label="Increase"/);
});
test('an explicit prop still beats the table',()=>{
 const html=stepper({decrease:'减少'},{decrementLabel:'少一位客人'});
 assert.match(html,/aria-label="少一位客人"/);assert.doesNotMatch(html,/aria-label="减少"/);
});
