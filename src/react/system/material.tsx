'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type Ref } from 'react';
import { getDisplacementTexture, supportsSvgBackdrop, trackObserver, clamp, createSpring, type EncodedMap } from '../../core/index.js';
import { materialTokens, densityTokens, type GlassMaterial, type BackdropTone, type GlassDensity, type GlassRenderer, type GlassSize } from '../../tokens/index.js';
import { useGlassPolicy } from './provider.js';
import { useBackdropTone } from './backdrop.js';
import { useSharedSurface } from './shared.js';
import { useMergedRef } from './utils.js';
import { attachPull } from './pull.js';

export interface GlassSurfaceOptions {
  material?: GlassMaterial;
  /** Known tone of whatever is behind this surface. Small glass flips its appearance to match. */
  backdropTone?: BackdropTone;
  density?: GlassDensity;
  renderer?: GlassRenderer;
  radius?: number | 'pill';
  /**
   * Small glass (buttons, toolbars, tab bars) flips light/dark with its backdrop.
   * Large glass (sidebars, menus, sheets, popovers, alerts) is thicker, more opaque,
   * has a deeper shadow and stronger lensing, and does not flip.
   */
  size?: GlassSize;
  /** Experimental optical tuning. Defaults are material-specific, range 0..64 CSS px. */
  refraction?: number;
  /**
   * Chromatic dispersion: splits the refraction into three channel passes so edges
   * fringe like real glass. Roughly triples filter cost — use it on a couple of hero
   * controls, never on always-on-screen chrome that repaints every frame.
   */
  chroma?: boolean;
}

/** Chromatic spread: red bends least, blue most, matching normal glass dispersion. */
const CHROMA_SPREAD = [1.09, 1, .91] as const;

export function useGlassSurface<T extends HTMLElement>(options: GlassSurfaceOptions, externalRef?: Ref<T>, forceShared = false, pressable = false) {
  const policy = useGlassPolicy();
  const inheritedTone = useBackdropTone();
  const onSharedSurface = useSharedSurface();
  const [root, ref] = useMergedRef<T>(externalRef);
  const id = `lg-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [texture, setTexture] = useState<EncodedMap | null>(null);
  const [capable, setCapable] = useState(false);
  const frame = useRef(0);
  const displacement = useRef<(SVGFEDisplacementMapElement | null)[]>([]);
  const requestedMaterial = options.material ?? policy.material;
  const tone = options.backdropTone ?? inheritedTone;
  const size = options.size ?? 'small';
  /**
   * Glass on glass is muddy: a second blur over an already-translucent panel buys nothing but a
   * compositing layer, and a second fill leaves the control the same colour as the thing it sits
   * on. A control inside a sheet, a popover or a toolbar group therefore renders flat and borrows
   * that surface — which is also what the system controls do. Large glass is the container, never
   * the passenger, so it always keeps its own material.
   */
  const shared = forceShared || (size === 'small' && onSharedSurface);
  // Unknown backgrounds deliberately use regular, not an unverified auto-contrast heuristic.
  const material = requestedMaterial === 'clear' && tone === 'mixed' ? 'regular' : requestedMaterial;
  const density = options.density ?? policy.density;
  const radius = options.radius ?? densityTokens[density].radius;
  const renderer = options.renderer ?? policy.renderer;
  const chroma = !!options.chroma && !policy.reduceTransparency;
  const wantsSvg = !shared && !policy.reduceTransparency && (renderer === 'svg' || (renderer === 'auto' && policy.enableSvgAuto));
  const spec = materialTokens[material][size];
  const strength = Number.isFinite(options.refraction) ? clamp(options.refraction!, 0, 64) : spec.refraction;
  /**
   * Small glass flips light/dark with what is behind it — that is what makes a tab bar
   * legible over a photo. Large glass keeps the app appearance: flipping a sidebar or a
   * sheet as content scrolls under it is distracting (WWDC25/219).
   */
  const appearance = size === 'small' && tone !== 'mixed' ? tone : policy.resolvedTheme;

  useEffect(() => { setCapable(supportsSvgBackdrop()); }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || !wantsSvg || !capable || typeof ResizeObserver === 'undefined') { setTexture(null); return; }
    let queued = 0;
    const update = () => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(() => {
        const width = element.offsetWidth, height = element.offsetHeight;
        if (!width || !height) { setTexture(null); return; }
        const r = radius === 'pill' ? Math.min(width, height) / 2 : Math.min(Math.max(0, radius), Math.min(width, height) / 2);
        const next = getDisplacementTexture({ width, height, radius: r, edge: spec.edge, maxResolution: policy.quality === 'high' ? 512 : 256 });
        setTexture(previous => previous?.url === next?.url && previous?.width === next?.width && previous?.height === next?.height ? previous : next);
      });
    };
    const observer = new ResizeObserver(update); observer.observe(element); trackObserver(1); update();
    return () => { observer.disconnect(); trackObserver(-1); cancelAnimationFrame(queued); };
  }, [root, wantsSvg, capable, radius, spec.edge, policy.quality]);

  useEffect(() => {
    const node = root.current;
    if (!node || policy.reduceMotion) return;
    /**
     * One pointer position drives two things: the interactive glow that pools under the
     * finger, and the angle of the virtual light source. The specular rim travels around
     * the silhouette instead of sitting on one edge — the highlight is refraction, not a
     * gradient painted across the face.
     */
    /**
     * `atan2` jumps by a full turn when the pointer crosses the element's leading edge. Fed
     * straight into a transitioned angle that reads as the highlight spinning right round —
     * always in the same place, which is exactly what makes it look like a glitch rather than
     * light. Keep a continuous angle instead and let it grow past 360°.
     */
    let turns = 0, previous = NaN;
    const setLight = (clientX: number, clientY: number) => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const x = clamp((clientX - box.left) / box.width * 100, 0, 100);
      const y = clamp((clientY - box.top) / box.height * 100, 0, 100);
      node.style.setProperty('--lg-light-x', `${x}%`);
      node.style.setProperty('--lg-light-y', `${y}%`);
      // CSS conic angles start at 12 o'clock and run clockwise; screen y grows downward.
      const raw = 90 + Math.atan2(clientY - (box.top + box.height / 2), clientX - (box.left + box.width / 2)) * 180 / Math.PI;
      if (Number.isFinite(previous)) {
        if (raw - previous > 180) turns -= 1;
        else if (previous - raw > 180) turns += 1;
      }
      previous = raw;
      node.style.setProperty('--lg-light-angle', `${(raw + turns * 360).toFixed(1)}deg`);
    };
    // The glow enters where the pointer enters, follows it 1:1, and fades out where it left. Position is never reset.
    const onEnter = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; cancelAnimationFrame(frame.current); setLight(event.clientX, event.clientY); node.setAttribute('data-lit', 'true'); };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setLight(event.clientX, event.clientY));
    };
    const onLeave = () => { cancelAnimationFrame(frame.current); node.removeAttribute('data-lit'); };
    // Press origin for every pointer type: the glass swells toward the exact touch / click point.
    const onDown = (event: PointerEvent) => { cancelAnimationFrame(frame.current); setLight(event.clientX, event.clientY); };
    // Keyboard activation gets the same press choreography as a pointer (Enter does not set :active in Chrome).
    const onKeyDown = (event: KeyboardEvent) => { if ((event.key === 'Enter' || event.key === ' ') && event.target === node && !event.repeat) node.setAttribute('data-pressed', 'true'); };
    const onKeyUp = () => node.removeAttribute('data-pressed');
    node.addEventListener('pointerenter', onEnter); node.addEventListener('pointermove', onMove); node.addEventListener('pointerleave', onLeave); node.addEventListener('pointerdown', onDown);
    node.addEventListener('keydown', onKeyDown); node.addEventListener('keyup', onKeyUp); node.addEventListener('blur', onKeyUp);
    const detachPull = pressable ? attachPull(node, () => ({ disabled: () => node.matches(':disabled,[aria-disabled="true"]') })) : undefined;
    return () => {
      node.removeEventListener('pointerenter', onEnter); node.removeEventListener('pointermove', onMove); node.removeEventListener('pointerleave', onLeave); node.removeEventListener('pointerdown', onDown);
      node.removeEventListener('keydown', onKeyDown); node.removeEventListener('keyup', onKeyUp); node.removeEventListener('blur', onKeyUp);
      node.removeAttribute('data-pressed'); node.removeAttribute('data-lit'); cancelAnimationFrame(frame.current); detachPull?.();
    };
  }, [root, policy.reduceMotion, pressable]);

  const active = wantsSvg && capable && texture;

  /**
   * Press-time lensing: while the glass is held the edge refraction deepens, like pressing
   * into a droplet, and springs back on release. Only the filter's scale attribute changes;
   * the geometry map is never regenerated.
   */
  useEffect(() => {
    const node = root.current; if (!node || !active || policy.reduceMotion) return;
    const spring = createSpring(strength, value => {
      const maps = displacement.current;
      for (let i = 0; i < maps.length; i++) maps[i]?.setAttribute('scale', (value * (chroma ? CHROMA_SPREAD[i] ?? 1 : 1)).toFixed(2));
    });
    const pressed = () => spring.to(Math.min(64, strength * 1.6 + 6));
    const released = () => spring.to(strength);
    const onKey = (event: KeyboardEvent) => { if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) pressed(); };
    node.addEventListener('pointerdown', pressed); node.addEventListener('keydown', onKey); node.addEventListener('keyup', released); node.addEventListener('blur', released);
    window.addEventListener('pointerup', released); window.addEventListener('pointercancel', released);
    spring.set(strength);
    return () => {
      spring.stop();
      node.removeEventListener('pointerdown', pressed); node.removeEventListener('keydown', onKey); node.removeEventListener('keyup', released); node.removeEventListener('blur', released);
      window.removeEventListener('pointerup', released); window.removeEventListener('pointercancel', released);
    };
  }, [root, active, strength, chroma, policy.reduceMotion]);

  const resolvedRenderer = shared ? 'shared' : policy.reduceTransparency ? 'opaque' : active ? 'svg' : 'css';
  const style = {
    '--lg-radius': radius === 'pill' ? '9999px' : `${Math.max(0, Number.isFinite(radius) ? radius : 18)}px`,
    '--lg-control-height': `${densityTokens[density].controlHeight}px`,
    '--lg-blur': `${spec.blur}px`,
    '--lg-backdrop': active
      ? `url("#${id}") saturate(${spec.saturation}) contrast(var(--lg-glass-contrast,1))`
      : `blur(${spec.blur}px) saturate(${spec.saturation}) contrast(var(--lg-glass-contrast,1))`,
  } as CSSProperties;
  const attributes = {
    'data-lg-theme': appearance, 'data-material': material, 'data-backdrop-tone': tone,
    'data-density': density, 'data-renderer': resolvedRenderer, 'data-glass-size': size,
    'data-reduced-motion': policy.reduceMotion ? 'true' : 'false',
    'data-transparency': policy.reduceTransparency ? 'opaque' : 'normal',
    'data-forced-colors': policy.forcedColors ? 'true' : 'false',
    ...(policy.increaseContrast ? { 'data-lg-contrast': 'more' } : {}),
  };

  const channels = chroma ? CHROMA_SPREAD : ([1] as const);
  const filter = active && <svg width="0" height="0" className="lg-filter-defs" focusable="false" aria-hidden="true"><defs>
    <filter id={id} x={-80} y={-80} width={texture!.width + 160} height={texture!.height + 160}
      filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation={spec.blur / 2} result="softened" />
      <feImage href={texture!.url} x="0" y="0" width={texture!.width} height={texture!.height} preserveAspectRatio="none" result="geometry" />
      {channels.map((spread, index) => <feDisplacementMap key={index}
        ref={node => { displacement.current[index] = node; }}
        in="softened" in2="geometry" scale={strength * spread} xChannelSelector="R" yChannelSelector="G"
        result={chroma ? `bent-${index}` : undefined} />)}
      {/* Isolate one channel per pass, then screen them back together: the edge fringes, the centre does not. */}
      {chroma && <>
        <feColorMatrix in="bent-0" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="channel-r" />
        <feColorMatrix in="bent-1" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="channel-g" />
        <feColorMatrix in="bent-2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="channel-b" />
        <feBlend in="channel-r" in2="channel-g" mode="screen" result="channel-rg" />
        <feBlend in="channel-rg" in2="channel-b" mode="screen" />
      </>}
    </filter>
  </defs></svg>;

  const decoration = shared ? null : <span className="lg-decoration" aria-hidden="true">
    {filter}
    <span className="lg-backdrop" /><span className="lg-tint" /><span className="lg-rim" /><span className="lg-glow" />
  </span>;

  return { ref, root, style, attributes, decoration, policy, appearance, size };
}
