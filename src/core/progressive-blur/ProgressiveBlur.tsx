import { type CSSProperties } from 'react';
import { useGlassSupport } from '../hooks/useGlassSupport';
import { cx } from '../utils/cx';
import { computeBlurLayers } from './computeBlurLayers';

export interface ProgressiveBlurProps {
  direction?: 'to-top' | 'to-bottom';
  size?: number | string;
  maxBlur?: number;
  layers?: number;
  className?: string;
}

const DEFAULT_MAX_BLUR = 16;
const DEFAULT_LAYERS = 5;

interface LayerStyle extends CSSProperties {
  '--lg-pb-blur'?: string;
  '--lg-pb-mask'?: string;
}

function toDimension(value: number | string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}

function toPercent(fraction: number): string {
  return `${Math.round(fraction * 1e4) / 1e2}%`;
}

/**
 * Internal primitive (not publicly exported — same posture as ScrollEdge):
 * stacks N absolutely-positioned layers whose backdrop-filter blur grows
 * geometrically and whose linear-gradient masks confine each to its depth band,
 * approximating Apple's progressive blur along one axis.
 *
 * Per-layer compositing means this is only for a bounded strip (top bar / hero
 * edge), never a full page. jsdom cannot verify the real blur — the tests assert
 * the layer count and inline styles match the pure computeBlurLayers output.
 */
export function ProgressiveBlur({
  direction = 'to-bottom',
  size,
  maxBlur = DEFAULT_MAX_BLUR,
  layers = DEFAULT_LAYERS,
  className,
}: ProgressiveBlurProps) {
  const glassSupport = useGlassSupport();
  const rootStyle: CSSProperties = { height: toDimension(size) };

  // Reduced transparency (forced or OS-level): collapse to a single opaque
  // gradient scrim with no backdrop-filter, matching ScrollEdge's degradation.
  if (glassSupport.reducedTransparency) {
    return (
      <div
        className={cx('lg-progressive-blur', className)}
        data-direction={direction}
        data-reduced=""
        aria-hidden="true"
        style={rootStyle}
      >
        <div className="lg-progressive-blur__fallback" />
      </div>
    );
  }

  const axis = direction === 'to-top' ? 'to top' : 'to bottom';
  const blurLayers = computeBlurLayers(maxBlur, layers);

  return (
    <div
      className={cx('lg-progressive-blur', className)}
      data-direction={direction}
      aria-hidden="true"
      style={rootStyle}
    >
      {blurLayers.map((layer, index) => {
        const start = toPercent(layer.maskStart);
        const end = toPercent(layer.maskEnd);
        const mask = `linear-gradient(${axis}, transparent ${start}, #000 ${start}, #000 ${end}, transparent ${end})`;
        // Blur/mask travel as custom properties, not the real backdrop-filter /
        // mask-image, so the CSS forced-colors and reduced-transparency paths can
        // neutralise them (inline properties would otherwise win).
        const layerStyle: LayerStyle = {
          '--lg-pb-blur': `blur(${layer.blur}px)`,
          '--lg-pb-mask': mask,
        };
        return <div key={index} className="lg-progressive-blur__layer" style={layerStyle} />;
      })}
    </div>
  );
}
