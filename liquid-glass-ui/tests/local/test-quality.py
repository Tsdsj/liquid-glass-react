import os
from pathlib import Path
import json, time, traceback
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[2];(R/'reports/screenshots').mkdir(parents=True,exist_ok=True);P=R/'preview';results=[];errors=[]
style='\n'.join((P/f).read_text() for f in ['tokens.css','styles.css','app.css']);bundle=(P/'bundle.js').read_text()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 def setup(csp=False,width=1440):
  p=b.new_page(viewport={'width':width,'height':1000});p.set_default_timeout(3500);p.on('pageerror',lambda e:errors.append(str(e)))
  meta='''<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-local-test'; style-src 'nonce-local-test'; style-src-attr 'unsafe-inline'; img-src data:; media-src blob:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">''' if csp else ''
  p.set_content('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>Glass quality verification</title>'+meta+'<style nonce="local-test">'+style+'</style></head><body><div id="root"></div></body></html>')
  p.evaluate("() => {window.cspViolations=[];document.addEventListener('securitypolicyviolation',e=>window.cspViolations.push({directive:e.violatedDirective,blocked:e.blockedURI}));}")
  p.evaluate("code=>{const s=document.createElement('script');s.nonce='local-test';s.textContent=code;document.body.append(s)}",bundle);p.wait_for_timeout(200);return p
 def check(name,fn,csp=False):
  p=setup(csp);t=time.monotonic()
  try:fn(p);results.append({'name':name,'status':'passed','ms':round((time.monotonic()-t)*1000)})
  except Exception as e:results.append({'name':name,'status':'failed','error':str(e),'traceback':traceback.format_exc()});p.screenshot(path=str(R/'reports/screenshots'/('quality-failure-'+str(len(results))+'.png')),full_page=True)
  finally:p.close()
 def csp(p):
  p.evaluate("location.hash='components'");p.get_by_role('button',name='打开弹出层').click();expect(p.get_by_label('界面名称')).to_be_visible();p.keyboard.press('Escape');p.wait_for_timeout(200);assert p.evaluate('cspViolations')==[];assert p.locator('[data-renderer=svg]').count()>0
 check('Nonce CSP inline fixture: script, SVG data map and popover without violations',csp,True)
 def responsive(p):
  widths=[390,768,1440];routes=['overview','materials','components','stress','performance','docs'];records=[]
  for w in widths:
   p.set_viewport_size({'width':w,'height':1000})
   for route in routes:
    p.evaluate('(r)=>location.hash=r',route);p.wait_for_timeout(120)
    record=p.evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})');records.append({**record,'route':route});assert record['scrollWidth']<=record['width'],str(records[-1])
   if w==390:
    p.evaluate("location.hash='components'");p.wait_for_timeout(100);p.screenshot(path=str(R/'reports/screenshots/components-mobile.png'),full_page=True)
  (R/'reports/responsive.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 check('18 route/viewport combinations fit 390, 768, 1440 CSS px',responsive)
 def dark(p):
  p.get_by_role('button',name='切换深色主题').click();p.screenshot(path=str(R/'reports/screenshots/overview-dark.png'),full_page=True);p.evaluate("location.hash='materials'");p.wait_for_timeout(200);p.screenshot(path=str(R/'reports/screenshots/materials-dark.png'),full_page=True)
 check('Dark theme screenshot evidence',dark)
 def skip(p):
  p.evaluate("location.hash='components'");p.locator('.skip-link').focus();p.keyboard.press('Enter');expect(p.locator('main')).to_be_focused();expect(p.locator('h1')).to_contain_text('组件')
 check('Skip-to-content preserves SPA route and focuses main',skip)
 def stress(p):
  p.evaluate("location.hash='stress'");p.wait_for_timeout(300);p.screenshot(path=str(R/'reports/screenshots/layout-stress.png'),full_page=True);assert p.locator('.stress-card').count()==6
  buttons=p.get_by_role('button',name='测试顶层弹出层').all();assert len(buttons)==6
  for button in buttons:
   button.click();expect(p.locator('[popover]:popover-open')).to_have_count(1);p.keyboard.press('Escape')
 check('Layout boundary fixtures render; screenshot is evidence, not identical-optics approval',stress)
 def performance(p):
  p.evaluate("location.hash='performance'");p.get_by_role('button',name='开始记录 180 帧回调').click();p.get_by_role('button',name='开始记录 180 帧回调').wait_for(timeout=15000)
  data=json.loads(p.locator('pre[role=status]').inner_text());assert data['samples']==180;assert data['aborted']==False;(R/'reports/headless-raf-observation.json').write_text(json.dumps(data,ensure_ascii=False,indent=2));p.screenshot(path=str(R/'reports/screenshots/performance-desktop.png'),full_page=True)
 check('Performance recorder completes 180 rAF intervals and records environment',performance)
 def resize(p):
  p.evaluate("location.hash='materials'");p.wait_for_timeout(200)
  for w in [420,1440,600,1280,390,1440]:p.set_viewport_size({'width':w,'height':1000});p.wait_for_timeout(100)
  d=p.evaluate('window.__glassPreview.diagnostics()');assert d['entries']<=24;assert d['bytes']<=8388608;assert p.locator('[data-renderer=svg]').count()>0
 check('Repeated resize keeps bounded map cache and renderer usable',resize)
 def export(p):
  p.evaluate("() => {window.downloadRequest=null;window.__originalAnchorClick=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download){window.downloadRequest={filename:this.download,href:this.href};}else window.__originalAnchorClick.call(this);}}")
  p.get_by_role('button',name='更多媒体操作').click();p.get_by_role('menuitem',name='导出原创场景').click();p.get_by_label('文件名称').fill('local-scene');p.get_by_role('button',name='导出 SVG',exact=True).click();d=p.evaluate('window.downloadRequest');assert d['filename']=='local-scene.svg' and d['href'].startswith('blob:');expect(p.get_by_role('dialog',name='导出这一刻')).to_be_hidden()
 check('Export constructs SVG Blob and filename (download dispatch intercepted; no browser navigation)',export)
 (R/'reports/browser-quality.json').write_text(json.dumps({'browser':b.version,'runtime':'React 19.1.1 offline preview','results':results,'pageErrors':errors},ensure_ascii=False,indent=2))
 for r in results:print(r['status'],r['name'],r.get('error','')[:350])
 print(errors);b.close()

if any(x['status']!='passed' for x in results) or errors: raise SystemExit(1)
