import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiquidGlassConfig } from '../config/LiquidGlassConfig';
import { __resetGlassSupportCache } from '../hooks/useGlassSupport';
import { computeBlurLayers } from './computeBlurLayers';
import { ProgressiveBlur } from './ProgressiveBlur';

function layers(container: HTMLElement): NodeListOf<HTMLElement> {
  return container.querySelectorAll<HTMLElement>('.lg-progressive-blur__layer');
}

describe('ProgressiveBlur', () => {
  it('renders an aria-hidden root with the default 5 layers matching computeBlurLayers', () => {
    const { container } = render(<ProgressiveBlur />);

    const root = container.querySelector('.lg-progressive-blur');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-direction', 'to-bottom');

    const layerEls = layers(container);
    const expected = computeBlurLayers(16, 5);
    expect(layerEls).toHaveLength(5);

    layerEls.forEach((el, index) => {
      expect(el.style.getPropertyValue('--lg-pb-blur')).toBe(`blur(${expected[index].blur}px)`);
      expect(el.style.getPropertyValue('--lg-pb-mask')).toContain('to bottom');
    });
  });

  it('clamps the layer count', () => {
    const { container } = render(<ProgressiveBlur layers={20} />);
    expect(layers(container)).toHaveLength(8);
  });

  it('flips the gradient axis for direction=to-top', () => {
    const { container } = render(<ProgressiveBlur direction="to-top" />);
    expect(container.querySelector('.lg-progressive-blur')).toHaveAttribute(
      'data-direction',
      'to-top',
    );
    expect(layers(container)[0].style.getPropertyValue('--lg-pb-mask')).toContain('to top');
  });

  it('marks the strongest layer at the strong edge (100% mask reaches the last layer)', () => {
    const { container } = render(<ProgressiveBlur maxBlur={16} layers={5} />);
    const layerEls = layers(container);
    // Last layer carries the max blur and its mask plateau reaches the strong edge.
    expect(layerEls[4].style.getPropertyValue('--lg-pb-blur')).toBe('blur(16px)');
    expect(layerEls[4].style.getPropertyValue('--lg-pb-mask')).toContain('100%');
  });

  it('degrades to a single fallback layer with no blur under reduced transparency', () => {
    __resetGlassSupportCache();
    const { container } = render(
      <LiquidGlassConfig forceReducedTransparency>
        <ProgressiveBlur />
      </LiquidGlassConfig>,
    );

    expect(layers(container)).toHaveLength(0);
    const fallback = container.querySelector('.lg-progressive-blur__fallback');
    expect(fallback).toBeInTheDocument();
    expect(container.querySelector('.lg-progressive-blur')).toHaveAttribute('data-reduced');
    __resetGlassSupportCache();
  });
});
