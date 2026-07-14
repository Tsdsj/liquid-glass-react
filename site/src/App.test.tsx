import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { COMPONENT_DOCS } from './demos/registry';
import { App } from './App';

function setHash(hash: string): void {
  window.location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

describe('docs site', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    delete document.documentElement.dataset.theme;
  });

  it('renders the Chinese home page by default', () => {
    render(<App />);
    expect(screen.getByText('液态玻璃质感的 React 组件库')).toBeInTheDocument();
    expect(screen.getByTestId('hero-showcase')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /组件/ })).toHaveAttribute('href', '#/components');
  });

  it('switches the whole site to English via the language select', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('combobox', { name: 'language' }));
    await user.click(await screen.findByRole('option', { name: 'English' }));

    expect(
      await screen.findByText('Liquid Glass React components'),
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en-US');
  });

  it('toggles the theme attribute on the document root', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('switch', { name: 'theme' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('lists every component on the overview page and filters by search', async () => {
    window.location.hash = '#/components';
    const user = userEvent.setup();
    render(<App />);

    for (const doc of COMPONENT_DOCS) {
      expect(screen.getByTestId(`component-card-${doc.slug}`)).toBeInTheDocument();
    }

    await user.type(screen.getByRole('textbox', { name: '搜索组件' }), 'button');
    expect(screen.getByTestId('component-card-button')).toBeInTheDocument();
    expect(screen.queryByTestId('component-card-select')).not.toBeInTheDocument();

    await user.clear(screen.getByRole('textbox', { name: '搜索组件' }));
    await user.type(screen.getByRole('textbox', { name: '搜索组件' }), 'zzz-none');
    expect(screen.getByText('没有匹配的组件')).toBeInTheDocument();
  });

  it('renders demos, API table and sidebar on a component detail page', () => {
    window.location.hash = '#/components/button';
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Button/ })).toBeInTheDocument();
    expect(screen.getAllByTestId('demo-block').length).toBeGreaterThan(0);
    expect(screen.getAllByText('属性').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Select/ })).toHaveAttribute(
      'href',
      '#/components/select',
    );
  });

  it('renders the container and navigation component detail pages', () => {
    for (const slug of ['card', 'avatar', 'breadcrumb', 'pagination', 'side-nav', 'drawer', 'menu']) {
      window.location.hash = `#/components/${slug}`;
      const { unmount } = render(<App />);

      expect(screen.getAllByTestId('demo-block').length).toBeGreaterThan(0);
      expect(screen.getAllByText('属性').length).toBeGreaterThan(0);

      unmount();
    }
  });

  it('renders the lightweight display component detail pages', () => {
    for (const slug of ['tag', 'badge', 'progress', 'spin', 'skeleton']) {
      window.location.hash = `#/components/${slug}`;
      const { unmount } = render(<App />);

      expect(screen.getAllByTestId('demo-block').length).toBeGreaterThan(0);
      expect(screen.getAllByText('属性').length).toBeGreaterThan(0);

      unmount();
    }
  });

  it('renders the new selection and navigation component detail pages', () => {
    for (const slug of ['radio-group', 'segmented', 'tabs']) {
      window.location.hash = `#/components/${slug}`;
      const { unmount } = render(<App />);

      expect(screen.getAllByTestId('demo-block').length).toBeGreaterThan(0);
      expect(screen.getAllByText('属性').length).toBeGreaterThan(0);

      unmount();
    }
  });

  it('shows the code after pressing the show-code button', async () => {
    window.location.hash = '#/components/button';
    const user = userEvent.setup();
    render(<App />);

    const [firstShow] = screen.getAllByRole('button', { name: '显示代码' });
    await user.click(firstShow);
    expect(document.querySelector('.site-code')?.textContent).toContain(
      "@ttq/liquid-glass-react",
    );
  });

  it('falls back to a not-found panel for unknown component slugs', () => {
    window.location.hash = '#/components/nope';
    render(<App />);
    expect(screen.getByText('组件不存在')).toBeInTheDocument();
  });

  it('renders the guide page with the install command', () => {
    window.location.hash = '#/guide';
    render(<App />);
    expect(screen.getByTestId('guide-install')).toHaveTextContent(
      'pnpm add @ttq/liquid-glass-react',
    );
    expect(screen.getByTestId('guide-browsers')).toBeInTheDocument();
  });

  it('navigates between pages on hash changes', async () => {
    render(<App />);
    expect(screen.getByText('液态玻璃质感的 React 组件库')).toBeInTheDocument();

    act(() => setHash('#/components'));
    await waitFor(() =>
      expect(screen.getByTestId('component-card-glass-surface')).toBeInTheDocument(),
    );

    act(() => setHash('#/'));
    await waitFor(() =>
      expect(screen.getByText('液态玻璃质感的 React 组件库')).toBeInTheDocument(),
    );
  });

  it('opens the modal demo from the detail page', async () => {
    window.location.hash = '#/components/modal';
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '打开弹窗' }));
    expect(await screen.findByRole('dialog', { name: '玻璃弹窗' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '玻璃弹窗' })).not.toBeInTheDocument(),
    );
  });
});
