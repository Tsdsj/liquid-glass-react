import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiquidGlassConfig, useLiquidGlassContext } from './LiquidGlassConfig';

function LocaleProbe({ testId }: { testId: string }) {
  const { locale } = useLiquidGlassContext();
  return <span data-testid={testId}>{locale}</span>;
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
});
