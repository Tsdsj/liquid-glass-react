import { useState, type CSSProperties } from 'react';
import { GlassButton, GlassPopover, GlassProvider, GlassSurface, GlassSwitch, GlassToolbar, GlassIconButton, ToolbarGroup } from '@liquid-glass-ui/react';
import { StressBackground } from './lab.js';
import { Icon } from '../icons.js';
import { Page } from '../site/page.js';
const fixtures: { name: string; description: string; style: CSSProperties }[] = [
  { name: '常规布局', description: '无额外合成属性的对照。', style: {} },
  { name: '祖先 opacity', description: '祖先透明度可能改变背景采样边界。', style: { opacity: .88 } },
  { name: '祖先 filter', description: '需要观察背景是否被局限到祖先内。', style: { filter: 'contrast(1.03)' } },
  { name: '祖先 mask', description: '遮罩与裁剪是专项回归场景。', style: { maskImage: 'linear-gradient(black 85%,transparent)' } },
  { name: '祖先 transform', description: '形成堆叠上下文不等于所有采样边界。', style: { transform: 'translateZ(0)' } },
  { name: '嵌套共享表面', description: '内层按钮没有独立 backdrop-filter。', style: {} },
];
export function StressPage() {
  const [opaque, setOpaque] = useState(false); const [rtl, setRtl] = useState(false);
  return <Page eyebrow="实验室" title="布局夹具" lede="把高风险布局保留成可重复的场景：祖先 opacity / filter / mask / transform 会改变背景采样边界。不靠随手加 z-index 或 will-change 打补丁。">
    <div className="page-controls"><GlassSwitch aria-label="压力测试使用不透明材质" checked={opaque} onCheckedChange={setOpaque} label="不透明回退"/><GlassSwitch aria-label="长标签压力" checked={rtl} onCheckedChange={setRtl} label="中文长标签"/></div>
    <GlassProvider transparency={opaque ? 'opaque' : 'system'}><div className="stress-grid">{fixtures.map((fixture,index) => <section className="stress-card" key={fixture.name}>
      <StressBackground kind="grid"><div className="fixture-ancestor" style={fixture.style}>
        {index === 5 ? <GlassToolbar aria-label="嵌套共享测试"><ToolbarGroup renderer="svg"><GlassIconButton aria-label="嵌套工具一"><Icon name="layer"/></GlassIconButton><GlassButton>{rtl ? '这是一个包含很长中文标签的操作' : '共享表面'}</GlassButton></ToolbarGroup></GlassToolbar> : <GlassSurface renderer="svg" material="clear" backdropTone="dark" className="fixture-glass"><strong>{rtl ? '需要验证换行与放大后的中文文本内容' : '背景折射测试'}</strong><span>Foreground remains DOM.</span></GlassSurface>}
        <GlassPopover title={`顶层弹出层：${fixture.name}`} description="检查它是否仍锚定、可见、可聚焦，以及如何采样页面背景。" trigger={<GlassButton renderer="css">测试顶层弹出层</GlassButton>}><GlassButton>可聚焦操作</GlassButton></GlassPopover>
      </div></StressBackground><h2>{fixture.name}</h2><p>{fixture.description}</p>
    </section>)}</div></GlassProvider>
    <div className="callout"><Icon name="info"/><p>这是观察与回归夹具，不代表每种布局都能实现同样的折射。外层 filter / opacity / mask 场景应按实际效果决定是否回退 CSS。</p></div>
  </Page>;
}
