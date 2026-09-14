import { useEffect, useRef, useState } from 'react';
import { GlassButton, GlassGroup, GlassProvider, GlassSurface, getGlassDiagnostics, useGlassPolicy } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';
import { Page } from '../site/page.js';
const percentile = (values: number[], p: number) => [...values].sort((a,b) => a-b)[Math.min(values.length - 1, Math.floor(values.length * p))] ?? 0;
export function PerformancePage() {
  const policy = useGlassPolicy();
  const [count, setCount] = useState(8); const [shared, setShared] = useState(false); const [svg, setSvg] = useState(true); const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null); const [diagnostics, setDiagnostics] = useState(getGlassDiagnostics()); const frame = useRef(0); const finish = useRef<(() => void) | null>(null);
  useEffect(() => { const timer = setInterval(() => setDiagnostics(getGlassDiagnostics()), 750); return () => { clearInterval(timer); cancelAnimationFrame(frame.current); finish.current?.(); }; }, []);
  const run = () => {
    cancelAnimationFrame(frame.current); finish.current?.();
    setRunning(true); setResult(null); const values: number[] = []; let previous = 0; let longTasks = 0;
    const observer = typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes.includes('longtask') ? new PerformanceObserver(list => { longTasks += list.getEntries().length; }) : null;
    observer?.observe({ type: 'longtask', buffered: false }); let completed = false;
    const stop = (aborted = false) => {
      if (completed) return; completed = true; cancelAnimationFrame(frame.current); observer?.disconnect(); document.removeEventListener('visibilitychange', onVisibility); setRunning(false);
      setResult({ kind: 'requestAnimationFrame intervals, NOT GPU frame timings / INP', aborted, date: new Date().toISOString(), userAgent: navigator.userAgent, devicePixelRatio, hardwareConcurrency: navigator.hardwareConcurrency, viewport: [innerWidth, innerHeight], renderer: svg ? 'svg' : 'css', reducedMotion: policy.reduceMotion, mode: shared ? 'shared' : 'independent', count, samples: values.length, p50ms: +percentile(values,.5).toFixed(2), p95ms: +percentile(values,.95).toFixed(2), intervalsOver25ms: values.filter(v => v > 25).length, longTasks, diagnostics: getGlassDiagnostics() });
    };
    const onVisibility = () => { if (document.hidden) stop(true); };
    finish.current = () => { completed = true; observer?.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
    document.addEventListener('visibilitychange', onVisibility);
    const tick = (time: number) => { if (previous) values.push(time - previous); previous = time; if (values.length >= 180) stop(); else frame.current = requestAnimationFrame(tick); };
    frame.current = requestAnimationFrame(tick);
  };
  const download = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(result,null,2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'glass-frame-observation.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); };
  return <Page eyebrow="实验室" title="性能观测" lede="对照独立表面与共享表面，记录环境与主线程帧回调间隔。这是诊断线索，不是真机 GPU 结论。">
    <div className="perf-controls"><label>表面数量<select value={count} disabled={running} onChange={e => setCount(Number(e.target.value))}><option>1</option><option>8</option><option>24</option><option>48</option></select></label>
      <label>布局策略<select value={shared ? 'shared' : 'independent'} disabled={running} onChange={e => setShared(e.target.value === 'shared')}><option value="independent">独立采样</option><option value="shared">共享一个表面</option></select></label>
      <label>渲染器<select value={svg ? 'svg' : 'css'} disabled={running} onChange={e => setSvg(e.target.value === 'svg')}><option value="svg">SVG</option><option value="css">CSS</option></select></label>
      <GlassButton variant="glassProminent" disabled={running} onClick={run}>{running ? '采样中…' : '开始记录 180 帧回调'}</GlassButton>
    </div>
    <GlassProvider renderer={svg ? 'svg' : 'css'}><div className={`perf-stage ${running && !policy.reduceMotion ? 'is-running' : ''}`}>
      {shared ? <GlassGroup className="perf-shared">{Array.from({ length: count },(_,i) => <GlassButton key={i}>操作 {i+1}</GlassButton>)}</GlassGroup> : <div className="perf-items">{Array.from({ length: count },(_,i) => <GlassSurface key={i} material="clear" backdropTone="dark" className="perf-item"><Icon name="layer" size={17}/><span>Surface {i+1}</span></GlassSurface>)}</div>}
    </div></GlassProvider>
    <div className="diagnostic-grid"><div><span>缓存条目</span><strong>{diagnostics.entries} / {diagnostics.maxEntries}</strong></div><div><span>缓存字符串估算</span><strong>{(diagnostics.bytes / 1024).toFixed(1)} KB</strong></div><div><span>累计贴图生成</span><strong>{diagnostics.generated}</strong></div><div><span>活跃材质尺寸观测</span><strong>{diagnostics.observers}</strong></div></div>
    <section className="code-card"><div className="section-title"><h2>测量记录</h2>{result && <GlassButton density="compact" onClick={download}>导出 JSON</GlassButton>}</div><pre role="status">{result ? JSON.stringify(result,null,2) : '等待采样。记录将包含 UA、DPR、视口、配置与 p50 / p95 帧回调间隔。'}</pre></section>
    <div className="callout"><Icon name="info"/><p>rAF 间隔和 Long Tasks 仅作为诊断线索。它们不是合成器帧时间、真实掉帧率、INP 或设备 GPU 性能。发布门槛仍需 DevTools 录制与目标设备矩阵。</p></div>
  </Page>;
}
