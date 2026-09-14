import os
from pathlib import Path
import json,time
from playwright.sync_api import sync_playwright,expect
R=Path(__file__).resolve().parents[2];(R/'reports/screenshots').mkdir(parents=True,exist_ok=True);P=R/'preview';result=[];errors=[]
style='\n'.join((P/f).read_text() for f in ['tokens.css','styles.css','app.css'])
html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>Glass local verification</title><style>'+style+'</style></head><body><div id="root"></div></body></html>'
bundle=(P/'bundle.js').read_text()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 def setup(route='components',width=1440):
  p=b.new_page(viewport={'width':width,'height':1000},device_scale_factor=1);p.set_default_timeout(3500)
  p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(html);p.add_script_tag(content=bundle);p.evaluate('(r)=>location.hash=r',route);p.wait_for_timeout(160);return p
 def check(name,fn,route='components'):
  p=setup(route);t=time.monotonic()
  try: fn(p);result.append({'name':name,'status':'passed','ms':round((time.monotonic()-t)*1000)})
  except Exception as e:
   result.append({'name':name,'status':'failed','error':str(e)});p.screenshot(path=str(R/'reports/screenshots'/('failure-'+str(len(result))+'.png')),full_page=True)
  finally:p.close()
 def button(p):
  p.get_by_role('button',name='默认按钮',exact=True).click();expect(p.get_by_text('交互计数：1',exact=True)).to_be_visible();expect(p.get_by_role('button',name='不可操作')).to_be_disabled();expect(p.get_by_role('button',name='处理中')).to_be_disabled()
 check('Buttons: state, disabled, loading',button)
 def popover(p):
  trigger=p.get_by_role('button',name='打开弹出层');trigger.click();panel=p.get_by_role('dialog',name='显示设置');expect(panel).to_be_visible();expect(p.get_by_label('界面名称')).to_be_focused();p.keyboard.press('Escape');expect(panel).to_be_hidden();expect(trigger).to_be_focused();trigger.click();p.locator('h1').click();expect(panel).to_be_hidden()
 check('Popover: open, autofocus, Escape, return focus, light dismiss',popover)
 def menu(p):
  trigger=p.get_by_role('button',name='打开菜单');trigger.click();expect(p.get_by_role('menuitem',name='Alpha',exact=True)).to_be_focused();p.keyboard.press('ArrowDown');expect(p.get_by_role('menuitem',name='Charlie',exact=True)).to_be_focused();p.keyboard.press('Home');p.keyboard.press('c');expect(p.get_by_role('menuitem',name='Charlie')).to_be_focused();p.keyboard.press('Enter');expect(p.get_by_test_id('menu-status')).to_have_text('Charlie 已执行');expect(trigger).to_be_focused();expect(p.get_by_role('menu')).to_have_count(0)
 check('Menu: arrows skip disabled, typeahead, selection, focus return',menu)
 def dialog(p):
  t=p.get_by_role('button',name='打开对话框');t.click();d=p.get_by_role('dialog',name='创建一个工作区');expect(d).to_be_visible();assert p.evaluate("document.body.style.overflow")=='hidden';p.get_by_label('工作区名称').fill('我的测试');p.get_by_role('button',name='保存到本地状态').click();expect(p.get_by_test_id('menu-status')).to_have_text('工作区设置已在本地更新');p.get_by_role('button',name='保存到本地状态').focus();p.keyboard.press('Tab');assert p.evaluate("document.querySelector('dialog[open]').contains(document.activeElement)");p.keyboard.press('Escape');expect(d).to_be_hidden();expect(t).to_be_focused();assert p.evaluate("document.body.style.overflow")!='hidden'
 check('Dialog: modal, focus loop, submit, Esc, scroll unlock',dialog)
 def radio(p):
  p.get_by_role('radio',name='日',exact=True).focus();p.keyboard.press('ArrowRight');expect(p.get_by_role('radio',name='周',exact=True)).to_be_checked();p.keyboard.press('ArrowRight');p.keyboard.press('ArrowRight');expect(p.get_by_role('radio',name='日',exact=True)).to_be_checked()
 check('Segmented: native radio arrow keys and disabled skip',radio)
 def tabs(p):
  p.get_by_role('tab',name='设计',exact=True).focus();p.keyboard.press('ArrowRight');expect(p.get_by_role('tab',name='实现',exact=True)).to_have_attribute('aria-selected','true');expect(p.get_by_role('tabpanel')).to_have_count(1);expect(p.get_by_role('tabpanel')).to_contain_text('Native Chrome');p.keyboard.press('End');expect(p.get_by_role('tab',name='测试',exact=True)).to_be_focused()
 check('Tabs: arrow activation, panels, End',tabs)
 def controls(p):
  s=p.get_by_role('slider',name='示例音量');s.focus();p.keyboard.press('ArrowRight');expect(p.get_by_test_id('gallery-volume')).to_have_text('43%');c=p.get_by_role('switch',name='自动播放');c.focus();p.keyboard.press('Space');expect(c).to_be_checked()
 check('Slider and switch: native keyboard input',controls)
 def toolbar(p):
  tool=p.get_by_role('toolbar',name='示例编辑工具栏');buttons=tool.locator('button');assert buttons.count()==4;buttons.first.focus();p.keyboard.press('ArrowRight');expect(buttons.nth(1)).to_be_focused();p.keyboard.press('End');expect(buttons.last).to_be_focused();assert tool.locator('[data-renderer=shared]').count()==4;assert tool.locator('[data-renderer=svg]').count()==0
 check('Toolbar: roving focus, End and one shared surface',toolbar)
 def scroll(p):
  top=p.locator('.lg-scroll-edge[data-edge=top]');expect(top).to_have_attribute('data-active','false');p.get_by_test_id('reading-scroll').evaluate('(x)=>x.scrollTop=150');expect(top).to_have_attribute('data-active','true')
 check('ScrollEdge follows actual scroll position',scroll)
 def theme(p):
  p.get_by_role('button',name='切换深色主题').click();expect(p.locator('.app-shell')).to_have_attribute('data-app-theme','dark');assert p.locator('.lg-root[data-lg-theme=dark]').count()>0
 check('Dark theme updates component policy',theme)
 def policy(p):
  p.get_by_role('button',name='打开显示偏好').click();p.get_by_role('switch',name='减少透明度').check();p.get_by_role('switch',name='减少动效').check();p.keyboard.press('Escape');p.wait_for_timeout(100);assert p.locator('[data-renderer=svg]').count()==0;assert p.locator('.lg-root[data-reduced-motion=true]').count()>0;assert p.locator('.lg-backdrop').evaluate_all('(xs)=>xs.every(x=>getComputedStyle(x).backdropFilter==="none")')
 check('Explicit conservative preferences remove filters and animation',policy)
 def media(p):
  p.get_by_role('button',name='下一场景').click();expect(p.get_by_role('heading',name='暮色，留在湖面。')).to_be_visible();p.get_by_role('button',name='收藏场景').click();expect(p.get_by_role('button',name='取消收藏')).to_have_attribute('aria-pressed','true');p.get_by_role('button',name='放大场景').click();assert p.locator('.scene-art').get_attribute('class').endswith('is-zoomed');p.get_by_role('button',name='播放动态背景').click();p.wait_for_timeout(200);assert p.locator('video').evaluate('(v)=>v.srcObject instanceof MediaStream');p.get_by_role('button',name='暂停动态背景').click()
 check('Media viewer: scene, favorite, zoom and local video stream',media,'overview')
 def mobile(p):
  p.set_viewport_size({'width':390,'height':844});p.wait_for_timeout(100);assert p.evaluate('document.documentElement.scrollWidth <= innerWidth');p.screenshot(path=str(R/'reports/screenshots/overview-mobile.png'),full_page=True)
 check('390px overview without horizontal overflow',mobile,'overview')
 def life(p):
  samples=[]
  for _ in range(5):
   p.evaluate("location.hash='components'");p.wait_for_timeout(90);p.evaluate("location.hash='docs'");p.wait_for_timeout(90);samples.append(p.evaluate('window.__glassPreview.diagnostics()'))
  assert samples[-1]['observers']==samples[0]['observers'];assert all(x['entries']<=24 and x['bytes']<=8388608 for x in samples)
  (R/'reports/lifecycle.json').write_text(json.dumps(samples,indent=2))
 check('Repeated route unmount: material observers stable, cache bounded',life)
 (R/'reports/browser-interactions.json').write_text(json.dumps({'browser':b.version,'runtime':'React 19.1.1 production offline preview','method':'Local authored HTML + compiled code injection on about:blank; no blocked navigation or policy modification','results':result,'pageErrors':errors},ensure_ascii=False,indent=2))
 for x in result:print(x['status'],x['name'],x.get('error','')[:400])
 print('pageErrors',errors);b.close()

if any(x['status']!='passed' for x in result) or errors: raise SystemExit(1)
