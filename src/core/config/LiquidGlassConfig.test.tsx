import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiquidGlassConfig, useLiquidGlassContext } from './LiquidGlassConfig';
import { createTheme } from '../theme/createTheme';

function LocaleProbe({ testId }: { testId: string }) {
  const { locale } = useLiquidGlassContext();
  return <span data-testid={testId}>{locale}</span>;
}

function ConfigProbe({ testId }: { testId: string }) {
  const { forceFallback, forceReducedTransparency } = useLiquidGlassContext();
  return (
    <span
      data-testid={testId}
      data-fallback={forceFallback ? 'on' : 'off'}
      data-transparency={forceReducedTransparency ? 'reduced' : 'normal'}
    />
  );
}

describe('LiquidGlassConfig locale', () => {
  it('uses Chinese by default', () => {
    render(<LocaleProbe testId="locale" />);

    expect(screen.getByTestId('locale')).toHaveTextContent('zh-CN');
  });

  it('supports an English locale', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <LocaleProbe testId="locale" />
      </LiquidGlassConfig>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
  });

  it('inherits locale through nested configuration', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <LiquidGlassConfig>
          <LocaleProbe testId="inherited" />
        </LiquidGlassConfig>
        <LiquidGlassConfig locale="zh-CN">
          <LocaleProbe testId="overridden" />
        </LiquidGlassConfig>
      </LiquidGlassConfig>,
    );

    expect(screen.getByTestId('inherited')).toHaveTextContent('en-US');
    expect(screen.getByTestId('overridden')).toHaveTextContent('zh-CN');
  });

  it('inherits forced fallback and reduced transparency with OR semantics', () => {
    render(
      <LiquidGlassConfig forceFallback forceReducedTransparency>
        <LiquidGlassConfig forceFallback={false} forceReducedTransparency={false}>
          <ConfigProbe testId="nested" />
        </LiquidGlassConfig>
      </LiquidGlassConfig>,
    );

    expect(screen.getByTestId('nested')).toHaveAttribute('data-fallback', 'on');
    expect(screen.getByTestId('nested')).toHaveAttribute(
      'data-transparency',
      'reduced',
    );
  });
});

describe('LiquidGlassConfig theme', () => {
  it('scopes theme tokens onto a display:contents wrapper', () => {
    render(
      <LiquidGlassConfig theme={createTheme({ accent: '#7c3aed' })}>
        <div data-testid="child" />
      </LiquidGlassConfig>,
    );

    const wrapper = screen.getByTestId('child').parentElement!;
    expect(wrapper.style.getPropertyValue('--lg-accent')).toBe('#7c3aed');
    expect(wrapper.style.display).toBe('contents');
  });

  it('adds no wrapper element when no theme is given', () => {
    render(
      <LiquidGlassConfig>
        <div data-testid="child" />
      </LiquidGlassConfig>,
    );

    const parent = screen.getByTestId('child').parentElement!;
    expect(parent.style.display).not.toBe('contents');
    expect(parent.style.getPropertyValue('--lg-accent')).toBe('');
  });
});
