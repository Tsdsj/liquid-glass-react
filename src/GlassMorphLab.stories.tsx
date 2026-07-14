import { useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassSurface } from './core/GlassSurface';
import { computeMorphFrames, useMorphTransition } from './core/morph';
import { useLiquidGlassContext } from './core/config/LiquidGlassConfig';

/**
 * Internal experiment lab for M13 (liquid morph). NOT a public API and not shown
 * on the docs site — these stories exist only for local visual verification of
 * the graded morph approaches. See the M13 task card completion record for the
 * documented conclusions.
 */

const COPY = {
  'zh-CN': {
    l0Intro:
      'L0(正式落地):同一块玻璃在两个位置间过渡——transform 平移缩放 + border-radius 插值 + 液滴进出场。过渡只改 transform/圆角,不改尺寸,故折射滤镜全程不重建。',
    l0Toggle: '在两处之间融合',
    l1Intro:
      'L1(预判不可行):祖先 SVG goo 滤镜会形成 backdrop root,后代 backdrop-filter 只能采样容器内内容——真玻璃折射直接失效。这是合成模型互斥,不是调参。',
    l1Note: '容器已套 filter:url(#lab-goo);两块「玻璃」的真折射应当消失(观感≈普通半透明块)。',
    l15Intro:
      'L1.5(仅技术验证):过渡期把真玻璃临时换成不透明 tint+高光「假玻璃」副本放进 goo 容器融合,结束后换回。唯一看点:切换瞬间是否肉眼可见跳变。',
    l15Toggle: '触发替身融合(~300ms)',
    real: '真玻璃',
    fake: '替身(假玻璃)',
  },
  'en-US': {
    l0Intro:
      'L0 (ships): one glass pane transitions between two slots — translate/scale transform + border-radius interpolation + a droplet enter/exit. Only transform/radius change, never size, so the refraction filter is never rebuilt.',
    l0Toggle: 'Morph between slots',
    l1Intro:
      'L1 (predicted infeasible): an ancestor SVG goo filter forms a backdrop root, so descendant backdrop-filter can only sample inside the container — real glass refraction dies. A compositing-model conflict, not a tuning problem.',
    l1Note: 'The container has filter:url(#lab-goo); the two "glass" panes should lose their real refraction (they read as plain translucent blocks).',
    l15Intro:
      'L1.5 (verification only): during the morph, swap the real glass for opaque tint+specular "fake glass" copies inside a goo container, then swap back. The only question: is the swap visible?',
    l15Toggle: 'Trigger stand-in fusion (~300ms)',
    real: 'Real glass',
    fake: 'Stand-in (fake glass)',
  },
} as const;

const STAGE_STYLE: CSSProperties = {
  position: 'relative',
  width: 420,
  height: 160,
  borderRadius: 20,
  background: 'var(--lg-tint)',
  fontFamily: 'var(--lg-font)',
};

function L0Morph() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const surfaceRef = useRef<HTMLElement>(null);
  const slotBRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const [atB, setAtB] = useState(false);
  const { play } = useMorphTransition(surfaceRef, { duration: 340 });

  const toggle = () => {
    const el = surfaceRef.current;
    const target = (atB ? homeRef : slotBRef).current;
    if (!el || !target) {
      return;
    }
    const from = el.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    play(computeMorphFrames(from, to, atB ? 40 : 16, atB ? 16 : 40, 2));
    setAtB((value) => !value);
  };

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520, fontFamily: 'var(--lg-font)', color: 'var(--lg-text)' }}>
      <p style={{ margin: 0 }}>{copy.l0Intro}</p>
      <div style={STAGE_STYLE}>
        <div ref={homeRef} style={{ position: 'absolute', left: 16, top: 40, width: 120, height: 80 }} />
        <div ref={slotBRef} style={{ position: 'absolute', right: 16, top: 40, width: 180, height: 80 }} />
        <GlassSurface
          ref={surfaceRef}
          interactive
          radius={16}
          style={{ position: 'absolute', left: 16, top: 40, width: 120, height: 80, willChange: 'transform' }}
        />
      </div>
      <button type="button" onClick={toggle} style={{ justifySelf: 'start' }}>
        {copy.l0Toggle}
      </button>
    </div>
  );
}

function GooFilterDef() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="lab-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

function L1GooOnGlass() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520, fontFamily: 'var(--lg-font)', color: 'var(--lg-text)' }}>
      <p style={{ margin: 0 }}>{copy.l1Intro}</p>
      <p style={{ margin: 0, color: 'var(--lg-text-secondary)' }}>{copy.l1Note}</p>
      <GooFilterDef />
      <div style={{ ...STAGE_STYLE, filter: 'url(#lab-goo)', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <GlassSurface radius={40} style={{ width: 90, height: 90 }} />
        <GlassSurface radius={40} style={{ width: 90, height: 90 }} />
      </div>
    </div>
  );
}

function L15SnapshotSwap() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [fake, setFake] = useState(false);

  const fakeGlass: CSSProperties = {
    width: 90,
    height: 90,
    borderRadius: 40,
    background: 'var(--lg-tint-hover)',
    boxShadow: 'inset 0 1px 0 var(--lg-highlight)',
  };

  const swap = () => {
    setFake(true);
    // Real timers are unavailable in the workflow env but Storybook runs in a
    // real browser; this is only exercised there.
    window.setTimeout(() => setFake(false), 300);
  };

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520, fontFamily: 'var(--lg-font)', color: 'var(--lg-text)' }}>
      <p style={{ margin: 0 }}>{copy.l15Intro}</p>
      <p style={{ margin: 0, color: 'var(--lg-text-secondary)' }}>{fake ? copy.fake : copy.real}</p>
      <div style={{ ...STAGE_STYLE, filter: fake ? 'url(#lab-goo)' : undefined, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <GooFilterDef />
        {fake ? (
          <>
            <div style={fakeGlass} />
            <div style={fakeGlass} />
          </>
        ) : (
          <>
            <GlassSurface radius={40} style={{ width: 90, height: 90 }} />
            <GlassSurface radius={40} style={{ width: 90, height: 90 }} />
          </>
        )}
      </div>
      <button type="button" onClick={swap} style={{ justifySelf: 'start' }}>
        {copy.l15Toggle}
      </button>
    </div>
  );
}

const meta = {
  title: 'Core/GlassMorphLab',
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const L0_SharedShapeMorph: Story = { render: () => <L0Morph /> };
export const L1_GooOnRealGlass: Story = { render: () => <L1GooOnGlass /> };
export const L1_5_SnapshotStandIn: Story = { render: () => <L15SnapshotSwap /> };
