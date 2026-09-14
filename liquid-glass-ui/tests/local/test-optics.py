import os
from pathlib import Path
import json,io
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[2];(R/'reports/screenshots').mkdir(parents=True,exist_ok=True);P=R/'preview';results=[]
styles='\n'.join((P/f).read_text() for f in ['tokens.css','styles.css','app.css'])
bundle=(P/'bundle.js').read_text().replace("load('app/main.js');", "window.__fixture={React:load('vendor/react.js'),client:load('vendor/react-dom-client.js'),ui:load('packages/react/index.js'),core:load('packages/core/index.js')};")
html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>'+styles+'</style><style>body{margin:0}#stage{width:700px;height:420px;position:relative;background:repeating-linear-gradient(90deg,#204038 0px,#204038 3px,#f8f6d4 3px,#f8f6d4 7px)}.fixture-surface{position:absolute;left:160px;top:100px;width:360px;height:160px;padding:0}.fixture-surface .lg-content{height:100%;display:grid;place-items:center}.fixture-label{background:#eee;color:#182320;padding:8px; font-size:18px}</style></head><body><div id="root"></div></body></html>'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':900,'height':600});page.set_default_timeout(3000);errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_content(html);page.add_script_tag(content=bundle)
 page.evaluate('''() => {const {React:R,client,ui}=window.__fixture;window.fixtureRoot=client.createRoot(document.getElementById('root'));window.renderFixture=opts=>fixtureRoot.render(R.createElement(ui.GlassProvider,{renderer:'svg',motion:'reduced',...opts.provider},R.createElement('div',{id:'stage'},R.createElement(ui.GlassSurface,{className:'fixture-surface',material:'clear',backdropTone:'dark',radius:32,refraction:opts.strength ?? 0,...opts.surface},R.createElement('span',{className:'fixture-label'},'前景 ABC 0123')))));renderFixture({strength:0});}''')
 expect(page.locator('.fixture-surface')).to_have_attribute('data-renderer','svg');page.wait_for_timeout(200)
 a=page.locator('.fixture-surface').screenshot(path=str(R/'reports/screenshots/optical-zero.png'))
 before=page.locator('.fixture-label').bounding_box()
 page.evaluate('renderFixture({strength:64})');page.wait_for_timeout(100)
 d=page.locator('.fixture-surface').screenshot(path=str(R/'reports/screenshots/optical-64.png'))
 after=page.locator('.fixture-label').bounding_box()
 A=np.asarray(Image.open(io.BytesIO(a)).convert('RGB'),dtype=float);B=np.asarray(Image.open(io.BytesIO(d)).convert('RGB'),dtype=float);D=np.abs(A-B).mean(axis=2)
 h,w=D.shape;y,x=np.indices(D.shape);edge=((x<26)|(x>w-27)|(y<26)|(y>h-27)) & (x>4)&(x<w-5)&(y>4)&(y<h-5);center=(x>65)&(x<w-65)&(y>40)&(y<h-40)
 label=(slice(int(before['y']-100)+2,int(before['y']-100+before['height'])-2),slice(int(before['x']-160)+2,int(before['x']-160+before['width'])-2))
 optical={'edgeMeanAbsoluteDifference':float(D[edge].mean()),'centerMeanAbsoluteDifference':float(D[center].mean()),'opaqueForegroundMeanDifference':float(D[label].mean()),'changedPixelPercent':float((D>.5).mean()*100),'foregroundGeometryUnchanged':before==after,'foregroundFilter':page.locator('.fixture-label').evaluate('(x)=>getComputedStyle(x).filter')}
 results.append({'name':'SVG scale change alters actual edge pixels more than center, foreground unchanged','passed':optical['edgeMeanAbsoluteDifference']>2 and optical['edgeMeanAbsoluteDifference']>optical['centerMeanAbsoluteDifference'] and optical['opaqueForegroundMeanDifference']==0 and before==after,'measurements':optical})
 page.screenshot(path=str(R/'reports/screenshots/optical-grid.png'))
 generated=page.evaluate('window.__fixture.core.getGlassDiagnostics().generated')
 for i in range(8):page.mouse.move(180+i*20,140)
 page.wait_for_timeout(100);results.append({'name':'Pointer moves do not rebuild displacement maps','passed':page.evaluate('window.__fixture.core.getGlassDiagnostics().generated')==generated})
 page.evaluate("renderFixture({surface:{material:'clear',backdropTone:'mixed'}})");expect(page.locator('.fixture-surface')).to_have_attribute('data-material','regular');results.append({'name':'Unknown clear background downgraded to regular','passed':True})
 page.evaluate("renderFixture({provider:{renderer:'auto'}})");expect(page.locator('.fixture-surface')).to_have_attribute('data-renderer','css');results.append({'name':'Auto renderer remains CSS unless opt-in','passed':True})
 page.emulate_media(reduced_motion='reduce');page.evaluate("renderFixture({provider:{motion:'system'}})");expect(page.locator('.fixture-surface')).to_have_attribute('data-reduced-motion','true');results.append({'name':'OS reduced motion respected','passed':True})
 page.emulate_media(forced_colors='active');expect(page.locator('.fixture-surface')).to_have_attribute('data-renderer','opaque');assert page.locator('.lg-backdrop').evaluate('(x)=>getComputedStyle(x).backdropFilter')=='none';results.append({'name':'Forced colors disables background filters','passed':True});page.emulate_media(forced_colors='none')
 page.evaluate('fixtureRoot.unmount()');page.wait_for_timeout(100);assert page.evaluate('window.__fixture.core.getGlassDiagnostics().observers')==0;results.append({'name':'Unmount releases all material observers','passed':True})
 # Nested conservative user policy cannot be undone by child props.
 page.evaluate('''()=>{const {React:R,client,ui}=__fixture;window.fixtureRoot=client.createRoot(document.getElementById('root'));fixtureRoot.render(R.createElement(ui.GlassProvider,{transparency:'opaque',motion:'reduced'},R.createElement(ui.GlassProvider,{transparency:'system',motion:'system'},R.createElement(ui.GlassSurface,{className:'nested'},'Child'))));}''')
 expect(page.locator('.nested')).to_have_attribute('data-renderer','opaque');expect(page.locator('.nested')).to_have_attribute('data-reduced-motion','true');results.append({'name':'Child provider cannot override parent conservative preferences','passed':True})
 page.evaluate('''()=>{fixtureRoot.unmount();const {React:R,client,ui}=__fixture;window.refEvents={attached:0,released:0};window.fixtureRoot=client.createRoot(document.getElementById('root'));fixtureRoot.render(R.createElement(ui.GlassProvider,null,R.createElement(ui.GlassButton,{ref:node=>{if(node){refEvents.attached++;return()=>{refEvents.released++;};}}},'Cleanup')));}''')
 page.wait_for_timeout(120);page.evaluate('fixtureRoot.unmount()');assert page.evaluate('refEvents.attached>0 && refEvents.attached===refEvents.released');results.append({'name':'React 19 callback ref cleanup is preserved by merged refs','passed':True})
 webgl=page.evaluate('''()=>{const g=document.createElement('canvas').getContext('webgl');if(!g)return null;const d=g.getExtension('WEBGL_debug_renderer_info');return d?g.getParameter(d.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER)}''')
 (R/'reports/optics-and-policy.json').write_text(json.dumps({'browser':b.version,'method':'Headless Chromium local authored fixture injection','renderer':webgl,'results':results,'pageErrors':errs},ensure_ascii=False,indent=2))
 for r in results:print(r)
 b.close()

if any(not x['passed'] for x in results) or errs: raise SystemExit(1)
