import { useRef, useState } from 'react';
import { GlassButton, GlassDialog, GlassIconButton, GlassMenu, GlassPopover, GlassSegmentedControl, GlassSlider, GlassSwitch, GlassToolbar, Panel, ToolbarGroup, ToolbarSpacer, useSizeClass } from '@ttqtt/liquid-glass-react';
import { Icon } from './icons.js';
import { AlpineScene, SyntheticVideo } from './scene.js';

/**
 * Anything past the right-hand edge, which the panel's own clamp resolves to *the* right-hand
 * edge. It means "open at the trailing side" at every width without the viewer having to be
 * measured before the first paint.
 */
const TRAILING = 4000;
export function MediaViewer({ compact = false }: { compact?: boolean }) {
  const [playing, setPlaying] = useState(false); const [favorite, setFavorite] = useState(false); const [scene, setScene] = useState(0); const [zoom, setZoom] = useState(false);
  const [volume, setVolume] = useState(65); const [exportOpen, setExportOpen] = useState(false); const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('alpine-study'); const [view, setView] = useState('fit'); const canvas = useRef<HTMLDivElement>(null);
  const [adjust, setAdjust] = useState(true); const [exposure, setExposure] = useState(50); const [contrast, setContrast] = useState(50); const [warm, setWarm] = useState(false);
  const regular = useSizeClass() === 'regular';
  /* 50 is neutral on both, so the picture the contrast measurements were taken on is the
     picture the page opens with. */
  const grade =`brightness(${(.75 + exposure / 100 * .5).toFixed(3)}) contrast(${(.7 + contrast / 100 * .6).toFixed(3)})`;
  const download = () => {
    const svg = canvas.current?.querySelector('svg'); if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${fileName.trim().replace(/[^\w\u4e00-\u9fa5-]/g, '_') || 'alpine-study'}.svg`;
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); setStatus('已导出原创 SVG 场景'); setExportOpen(false);
  };
  return <div className={`media-viewer ${compact ? 'is-compact' : ''}`} data-testid="media-viewer">
    <div className={`scene-art ${zoom || view === 'fill' ? 'is-zoomed' : ''}`} ref={canvas} style={{ filter: grade }}><AlpineScene warm={warm}/></div>
    <SyntheticVideo playing={playing}/>
    <div className="media-topline"><span className="scene-identity"><span className="scene-dot"/> FIELD NOTES <span className="muted-divider">/</span> 0{scene % 2 + 1}</span>
      <GlassIconButton material="clear" backdropTone="light" aria-label={zoom ? '还原场景大小' : '放大场景'} onClick={() => setZoom(!zoom)}><Icon name={zoom ? 'shrink' : 'expand'}/></GlassIconButton>
    </div>
    <div className="scene-caption"><span className="eyebrow">A STUDY IN STILLNESS</span><h2>{scene % 2 ? '暮色，留在湖面。' : '山间，有回响。'}</h2><p>原创矢量场景 · 无外部图片依赖</p></div>
    <div className="media-control-wrap">
      <GlassToolbar aria-label="媒体查看器操作" className="media-toolbar">
        {/* Transport and secondary actions are different jobs, so they get different glass groups.
            The tone is a statement about the scene: measured here at 152 median luminance with the
            bright patches at 237, so it is a light backdrop and the clear glass has to dim it. */}
        <ToolbarGroup material="clear" backdropTone="light" density={compact ? 'compact' : 'comfortable'}>
          <GlassIconButton aria-label="上一场景" onClick={() => { setScene(x => x + 1); setWarm(w => !w); setPlaying(false); }}><Icon name="previous"/></GlassIconButton>
          <GlassIconButton aria-label={playing ? '暂停动态背景' : '播放动态背景'} aria-pressed={playing} onClick={() => setPlaying(!playing)}><Icon name={playing ? 'pause' : 'play'}/></GlassIconButton>
          <GlassIconButton aria-label="下一场景" onClick={() => { setScene(x => x + 1); setWarm(w => !w); setPlaying(false); }}><Icon name="next"/></GlassIconButton>
        </ToolbarGroup>
        <ToolbarSpacer/>
        <ToolbarGroup material="clear" backdropTone="light" density={compact ? 'compact' : 'comfortable'}>
        <GlassIconButton aria-label={favorite ? '取消收藏' : '收藏场景'} aria-pressed={favorite} onClick={() => setFavorite(!favorite)}><Icon name="heart" style={favorite ? { fill: 'currentColor' } : undefined}/></GlassIconButton>
        <GlassPopover title="查看设置" description="玻璃承载操作，内容保持清晰。" trigger={<GlassIconButton aria-label="打开查看设置"><Icon name="tune"/></GlassIconButton>}>
          <label className="field-label">显示方式</label><GlassSegmentedControl aria-label="显示方式" value={view} onValueChange={setView} density="compact" items={[{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }]}/>
          <div className="field-heading"><span>音量（界面演示）</span><output>{volume}%</output></div><GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} formatValue={v => `${v}%`}/>
          <p className="micro-note">动态背景是本地合成视频，无音轨。</p>
        </GlassPopover>
        <GlassMenu aria-label="媒体更多操作" trigger={<GlassIconButton aria-label="更多媒体操作"><Icon name="more"/></GlassIconButton>} items={[
          { key: 'export', label: '导出原创场景', onSelect: () => setExportOpen(true) },
          { key: 'favorite', label: favorite ? '取消收藏' : '收藏此场景', onSelect: () => setFavorite(!favorite) },
          { key: 'reset', label: '重置查看器', separatorBefore: true, onSelect: () => { setScene(0); setZoom(false); setPlaying(false); setFavorite(false); setStatus('查看器已重置'); } },
        ]}/>
        </ToolbarGroup>
      </GlassToolbar>
    </div>
    {/**
      * A big piece of clear glass you can drag across the picture, and the reason this demo
      * exists at all.
      *
      * Refraction is an edge effect: it bends what is directly behind the rim. On a 40px
      * capsule over a smooth gradient there is nothing to bend and nothing to see, which is
      * exactly the complaint this answers. A tall panel has a long rim, `clear` barely blurs
      * so the picture still reads through it, and the tree line along the far shore is the
      * sharpest thing in the scene — drag the panel over it and the trunks visibly kink.
      *
      * Not on a phone, and by the size class rather than by the `compact` prop: nobody passes
      * that prop, so the panel would have opened at 390px and covered the picture it floats on.
      */}
    {/* `chroma` splits the bend into three channel passes, so the rim fringes the way a real
        edge does. It is opt-in because it costs three passes; one surface is inside the budget
        the performance guide sets, and this is the surface the page exists to show. */}
    {regular && <Panel title="调整" material="clear" backdropTone="light" chroma width={212}
      open={adjust} onClose={() => setAdjust(false)} defaultPosition={{ x: TRAILING, y: 168 }}>
      <div className="field-heading"><span>曝光</span><output>{Math.round(exposure)}</output></div>
      <GlassSlider aria-label="曝光" value={exposure} onValueChange={setExposure}/>
      <div className="field-heading"><span>对比</span><output>{Math.round(contrast)}</output></div>
      <GlassSlider aria-label="对比" value={contrast} onValueChange={setContrast}/>
      <GlassSwitch aria-label="暖色" label="暖色" checked={warm} onCheckedChange={setWarm}/>
      <GlassButton variant="gray" controlSize="small"
        onClick={() => { setExposure(50); setContrast(50); setWarm(false); }}>恢复原样</GlassButton>
    </Panel>}
    {regular && !adjust && <div className="media-reopen">
      <GlassButton material="clear" backdropTone="light" controlSize="small" onClick={() => setAdjust(true)}>调整</GlassButton>
    </div>}
    <span className="media-footnote">{playing ? 'LIVE · 合成视频测试' : '1200 × 720 · VECTOR'}</span>
    <span role="status" className="sr-only">{status}</span>
    <GlassDialog title="导出这一刻" description="导出的是项目附带的原创 SVG 场景，可继续编辑或用于测试背景。" open={exportOpen} onOpenChange={setExportOpen}>
      <form onSubmit={event => { event.preventDefault(); download(); }}><label className="field-label" htmlFor="export-name">文件名称</label><input id="export-name" className="text-input" value={fileName} onChange={event => setFileName(event.target.value)}/>
        <p className="micro-note">格式：SVG · 无需网络 · 不包含工具栏</p><div className="dialog-actions"><GlassButton onClick={() => setExportOpen(false)}>取消</GlassButton><GlassButton type="submit" variant="glassProminent"><Icon name="download" size={16}/>导出 SVG</GlassButton></div>
      </form>
    </GlassDialog>
  </div>;
}
