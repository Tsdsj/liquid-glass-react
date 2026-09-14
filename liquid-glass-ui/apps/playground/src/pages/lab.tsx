import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from 'react';
import { GlassButton, GlassProvider, GlassSegmentedControl, GlassSlider, GlassSurface, GlassSwitch, type GlassMaterial, type GlassRenderer, type BackdropTone } from '@liquid-glass-ui/react';
import { AlpineScene, SyntheticVideo } from '../scene.js';
import { Icon } from '../icons.js';
import { Page } from '../site/page.js';
import { Text } from '@liquid-glass-ui/react';
import { CodeBlock } from '../site/code-block.js';
export const backgrounds = [ ['alpine','山间场景'], ['white','白色背景'], ['black','黑色背景'], ['split','明暗交界'], ['grid','细线网格'], ['text','滚动正文'], ['video','合成视频'] ];
export function StressBackground({ kind, children }: { kind: string; children?: ReactNode }) {
  return <div className={`stress-background bg-${kind}`}>
    {kind === 'alpine' && <AlpineScene/>}
    {kind === 'video' && <SyntheticVideo playing/>}
    {kind === 'text' && <div className="background-paragraphs" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <p key={i}>清晰先于透明。界面是内容与操作的关系，而不是一层滤镜。Keep the content clear. Form follows purpose. 0123456789</p>)}</div>}
    {children}
  </div>;
}
/** Drag the specimen across the background with the pointer; keyboard users can nudge it with arrow keys on the grip. */
function useDraggable(bounds: RefObject<HTMLDivElement | null>) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const clampOffset = (x: number, y: number) => {
    const box = bounds.current?.getBoundingClientRect();
    if (!box) return { x, y };
    const limitX = Math.max(0, box.width / 2 - 120), limitY = Math.max(0, box.height / 2 - 100);
    return { x: Math.max(-limitX, Math.min(limitX, x)), y: Math.max(-limitY, Math.min(limitY, y)) };
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button,input,a,select,textarea,[role="slider"]')) return;
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }; setDragging(true);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging) return;
    setOffset(clampOffset(start.current.ox + event.clientX - start.current.x, start.current.oy + event.clientY - start.current.y));
  };
  const onPointerUp = () => setDragging(false);
  const nudge = (dx: number, dy: number) => setOffset(current => clampOffset(current.x + dx, current.y + dy));
  const reset = () => setOffset({ x: 0, y: 0 });
  return { offset, dragging, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }, nudge, reset };
}
export function MaterialLab() {
  const [material, setMaterial] = useState<GlassMaterial>('clear'); const [tone, setTone] = useState<BackdropTone>('dark');
  const [background, setBackground] = useState('alpine'); const [strength, setStrength] = useState(32); const [renderer, setRenderer] = useState<GlassRenderer>('svg');
  const [radius, setRadius] = useState(32); const [clicks, setClicks] = useState(0); const [drift, setDrift] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const drag = useDraggable(preview);
  useEffect(() => { if (!drift) return; let frame = 0; const start = performance.now(); const tick = (now: number) => { const t = (now - start) / 1000; preview.current?.style.setProperty('--drift', `${Math.sin(t / 1.8) * 70}px ${Math.cos(t / 2.6) * 30}px`); frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => { cancelAnimationFrame(frame); preview.current?.style.removeProperty('--drift'); }; }, [drift]);
  const specimenStyle = { '--offset-x': `${drag.offset.x}px`, '--offset-y': `${drag.offset.y}px` } as CSSProperties;
  return <Page eyebrow="实验室" title="材质实验台" lede="在同一组背景中观察折射、模糊与可读性。拖动玻璃穿过明暗交界，按住按钮感受回弹。滤镜参数不等于设计系统。">
    <div className="lab-layout"><div className={`lab-preview ${drag.dragging ? 'is-dragging' : ''} ${drift ? 'is-drifting' : ''}`} ref={preview}><StressBackground kind={background}>
      <div className="specimen-drift" style={specimenStyle}>
      <GlassSurface className="specimen" material={material} backdropTone={tone} renderer={renderer} radius={radius} refraction={strength} data-testid="lab-specimen" {...drag.handlers}>
        <button type="button" className="specimen-grip" aria-label="移动玻璃试样（方向键微调）" onKeyDown={e => { const step = e.shiftKey ? 40 : 12; if (e.key === 'ArrowLeft') { e.preventDefault(); drag.nudge(-step, 0); } else if (e.key === 'ArrowRight') { e.preventDefault(); drag.nudge(step, 0); } else if (e.key === 'ArrowUp') { e.preventDefault(); drag.nudge(0, -step); } else if (e.key === 'ArrowDown') { e.preventDefault(); drag.nudge(0, step); } else if (e.key === 'Home') { e.preventDefault(); drag.reset(); } }}><i/><i/><i/></button>
        <span className="specimen-symbol"><Icon name="layer" size={28}/></span><span className="specimen-overline">LIQUID / 01</span><h2>有厚度的轻盈。</h2><p>折射留在边缘，文字保持清晰。</p>
        <GlassButton material={material} backdropTone={tone} onClick={() => setClicks(c => c + 1)} data-testid="specimen-action">触碰一下 <Icon name="arrow" size={16}/></GlassButton>
        <span role="status" className="specimen-status">{clicks ? `已响应 ${clicks} 次交互` : '拖动我 · 按住看边缘折射加深'}</span>
      </GlassSurface>
      </div>
      <div className="lab-preview-hud"><span>{drag.offset.x || drag.offset.y ? `Δ ${Math.round(drag.offset.x)}, ${Math.round(drag.offset.y)}` : 'DRAG THE GLASS'}</span>{(drag.offset.x || drag.offset.y) ? <button type="button" onClick={drag.reset}>归位</button> : null}</div>
    </StressBackground></div>
      <aside className="inspector" aria-label="材质控制面板"><div className="inspector-title"><Icon name="tune" size={17}/><h2>材质参数</h2><span>LIVE</span></div>
        <div className="inspector-field"><span className="field-label">渲染器</span><GlassSegmentedControl aria-label="渲染器" density="compact" value={renderer} onValueChange={v => setRenderer(v as GlassRenderer)} items={[{ value: 'css', label: 'CSS' }, { value: 'svg', label: 'SVG' }, { value: 'auto', label: 'Auto' }]}/><p className="field-hint">{renderer === 'css' ? '模糊 / 底色 / 高光基线' : renderer === 'svg' ? '几何位移图折射边缘' : 'Auto 默认保守 CSS'}</p></div>
        <div className="inspector-field"><span className="field-label">材质预设</span><GlassSegmentedControl aria-label="材质预设" density="compact" value={material} onValueChange={v => setMaterial(v as GlassMaterial)} items={[{ value: 'regular', label: 'Regular' }, { value: 'clear', label: 'Clear' }]}/><p className="field-hint">{material === 'regular' ? '可读优先，适合文字较多' : '受控媒体场景，更透明'}</p></div>
        <div className="inspector-field"><span className="field-label">背景上下文</span><GlassSegmentedControl aria-label="背景上下文" density="compact" value={tone} onValueChange={v => setTone(v as BackdropTone)} items={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'mixed', label: 'Mixed' }]}/><p className="field-hint">{tone === 'dark' ? '已知暗背景' : tone === 'light' ? '亮背景，叠加暗化层' : '未知背景，回退 Regular'}</p></div>
        <div className="inspector-field"><div className="field-heading"><span>折射幅度</span><output>{strength} px</output></div><GlassSlider aria-label="折射幅度" min={0} max={64} value={strength} onValueChange={setStrength} formatValue={v => `${v} px`}/></div>
        <div className="inspector-field"><div className="field-heading"><span>几何圆角</span><output>{radius} px</output></div><GlassSlider aria-label="几何圆角" min={8} max={80} value={radius} onValueChange={setRadius}/></div>
        <div className="inspector-switch"><GlassSwitch aria-label="背景漂移" checked={drift} onCheckedChange={setDrift} label="让背景漂移"/></div>
        <div className="inspector-note"><Icon name="info" size={16}/><p>Clear + Mixed 会回退为 Regular。减少透明度设置优先于效果选项。</p></div>
      </aside>
    </div>
    <div className="background-selector" role="group" aria-label="测试背景">{backgrounds.map(([value,label]) => <button key={value} type="button" className={background === value ? 'is-active' : ''} aria-pressed={background === value} onClick={() => setBackground(value)}><span className={`swatch bg-${value}`}/>{label}</button>)}</div>
    <section className="section-block"><div className="section-title"><h2>三条路径，同一个场景。</h2><span>CSS / SVG / OPAQUE</span></div>
      <div className="comparison-grid">{(['css','svg','opaque'] as const).map(mode => <div key={mode} className="comparison-card"><StressBackground kind={background === 'video' ? 'grid' : background}>
        <GlassProvider transparency={mode === 'opaque' ? 'opaque' : 'system'}>
          <GlassSurface renderer={mode === 'opaque' ? 'css' : mode} material="clear" backdropTone="dark" radius={28} className="comparison-specimen"><Icon name="layer" size={25}/><strong>Liquid Glass</strong><span>边缘、底色、真实文字</span><GlassButton density="compact">按住试试</GlassButton></GlassSurface>
        </GlassProvider>
      </StressBackground><div className="comparison-caption"><strong>{mode === 'css' ? 'CSS 基线' : mode === 'svg' ? 'SVG 增强' : '不透明回退'}</strong><span>{mode === 'svg' ? '背景位移 · 前景不变' : mode === 'css' ? '模糊 / 底色 / 高光' : '优先保障稳定可读'}</span></div></div>)}</div>
      <p className="section-note">这里比较本项目三种路径。rdev、Liqui Design 的第三方实测尚未完成，详见 docs/competitor-evaluation.md；没有用模拟效果冒充竞品。</p>
    </section>
    <section className="code-card"><Text variant="footnote" emphasized tone="accent">当前配置</Text><CodeBlock code={`<GlassSurface\n  material="${material}"\n  backdropTone="${tone}"\n  renderer="${renderer}"\n  radius={${radius}}\n  refraction={${strength}}\n>\n  <h2>有厚度的轻盈。</h2>\n</GlassSurface>`}/></section>
  </Page>;
}
