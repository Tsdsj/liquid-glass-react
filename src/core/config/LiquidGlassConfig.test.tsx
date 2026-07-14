import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiquidGlassConfig, useLiquidGlassContext } from './LiquidGlassConfig';

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
