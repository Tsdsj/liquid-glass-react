import { createRef } from 'react';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Spin } from './Spin';

describe('Spin', () => {
  it('renders a polite status region with the localized loading text and ring', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spin ref={ref} />);

    const status = screen.getByRole('status');
    expect(ref.current).toHaveClass('lg-spin');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status.querySelector('.lg-spin__ring')).toBeInTheDocument();
    expect(screen.getByText('加载中')).toBeInTheDocument();
  });

  it('localizes the loading text to English via config', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <Spin />
      </LiquidGlassConfig>,
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders a tip when provided', () => {
    render(<Spin tip="上传中" />);
    expect(screen.getByText('上传中')).toBeInTheDocument();
  });

  it('wraps children with an overlay while spinning', () => {
    render(
      <Spin>
        <button type="button">inside</button>
      </Spin>,
    );

    expect(screen.getByRole('button', { name: 'inside' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(document.querySelector('.lg-spin__overlay')).toBeInTheDocument();
  });

  it('shows children without an overlay when not spinning', () => {
    render(
      <Spin spinning={false}>
        <button type="button">inside</button>
      </Spin>,
    );

    expect(screen.getByRole('button', { name: 'inside' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(document.querySelector('.lg-spin__overlay')).not.toBeInTheDocument();
  });

  it('does not place the status region in the tab order', () => {
    render(<Spin />);
    expect(screen.getByRole('status')).not.toHaveAttribute('tabindex');
  });

  it('disables the ring animation under reduced motion', () => {
    const spinCss = readFileSync('src/components/Spin/spin.css', 'utf8');
    const reducedBlock = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}/.exec(spinCss);
    expect(reducedBlock).not.toBeNull();
    expect(reducedBlock?.[1]).toMatch(/\.lg-spin__ring\s*\{[^}]*animation:\s*none/);
  });
});
