import { useEffect, useRef, type MouseEvent } from 'react';
import { Text } from '@ttqtt/liquid-glass-react';
import { useRoute, sectionOf } from './router.js';
import { Shell } from './site/shell.js';
import { Page } from './site/page.js';
import { docLabel, findDoc, groupedDocs } from './catalog/index.js';
import { ComponentPage } from './pages/component-page.js';
import { ComponentsIndex } from './pages/components-index.js';
import { OverviewPage } from './pages/overview.js';
import {
  AccessibilityFoundation, ColorFoundation, LayoutFoundation, MaterialsFoundation,
  MotionFoundation, TypographyFoundation,
} from './pages/foundations.js';
import { InstallGuide, MigrationGuide, RendererGuide, SsrGuide, ThemingGuide } from './pages/guides.js';
import { ChangelogPage } from './pages/changelog.js';
import { RefProbe } from './pages/ref-probe.js';
import { WarnProbe } from './pages/warn-probe.js';

const FOUNDATIONS = [
  ['materials', '材质'], ['color', '色彩'], ['typography', '文字'],
  ['layout', '布局与形状'], ['motion', '动效'], ['accessibility', '无障碍'],
] as const;
const GUIDES = [
  ['install', '安装与使用'], ['theming', '换主题色'], ['renderer', '效果与性能'],
  ['ssr', '服务端渲染'], ['migration', '从 0.1 升级'],
] as const;

/** Section-level navigation, shown inside the sidebar once the window is wide enough. */
function SecondaryNav({ path, go }: { path: string; go: (path: string) => void }) {
  const section = sectionOf(path);
  const click = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); go(target); };
  const link = (target: string, label: string) => <a key={target} href={`#/${target}`} onClick={click(target)}
    className="subnav-link" aria-current={path === target ? 'page' : undefined}>{label}</a>;

  if (section === 'components') return <nav className="subnav" aria-label="组件列表">
    {groupedDocs.map(({ group, docs }) => <div key={group} className="subnav-group">
      <Text variant="caption1" emphasized tone="tertiary" className="subnav-title">{group}</Text>
      {docs.map(doc => link(`components/${doc.slug}`, docLabel(doc)))}
    </div>)}
  </nav>;
  if (section === 'foundations') return <nav className="subnav" aria-label="基础章节">
    {FOUNDATIONS.map(([slug, label]) => link(`foundations/${slug}`, label))}
  </nav>;
  if (section === 'guides') return <nav className="subnav" aria-label="指南">
    {GUIDES.map(([slug, label]) => link(`guides/${slug}`, label))}
  </nav>;
  return null;
}

function NotFound({ go }: { go: (path: string) => void }) {
  return <Page title="没有这一页" lede="链接可能过时了。">
    <a href="#/components" onClick={event => { event.preventDefault(); go('components'); }}>
      <Text as="span" variant="body" tone="accent">回到组件目录</Text>
    </a>
  </Page>;
}

function resolve(path: string, go: (path: string) => void) {
  if (path === 'overview') return <OverviewPage go={go} />;
  if (path === 'components') return <ComponentsIndex go={go} />;
  if (path.startsWith('components/')) {
    const doc = findDoc(path.slice('components/'.length));
    return doc ? <ComponentPage key={doc.slug} doc={doc} /> : <NotFound go={go} />;
  }
  switch (path) {
    case 'changelog': return <ChangelogPage />;
    case 'foundations/materials': return <MaterialsFoundation />;
    case 'foundations/color': return <ColorFoundation />;
    case 'foundations/typography': return <TypographyFoundation />;
    case 'foundations/layout': return <LayoutFoundation />;
    case 'foundations/motion': return <MotionFoundation />;
    case 'foundations/accessibility': return <AccessibilityFoundation />;
    case 'guides/install': return <InstallGuide />;
    case 'guides/renderer': return <RendererGuide />;
    case 'guides/theming': return <ThemingGuide />;
    case 'guides/ssr': return <SsrGuide />;
    case 'guides/migration': return <MigrationGuide />;
    default: return <NotFound go={go} />;
  }
}

/** What this route is called, for the window title. */
function titleOf(path: string): string {
  if (path === 'overview') return '概览';
  if (path === 'components') return '组件';
  if (path === 'changelog') return '更新日志';
  if (path.startsWith('components/')) {
    const doc = findDoc(path.slice('components/'.length));
    return doc ? docLabel(doc) : '没有这一页';
  }
  const slug = path.split('/')[1];
  if (path.startsWith('foundations/')) return FOUNDATIONS.find(([key]) => key === slug)?.[1] ?? '基础';
  if (path.startsWith('guides/')) return GUIDES.find(([key]) => key === slug)?.[1] ?? '指南';
  return '没有这一页';
}

export function App() {
  const [path, go] = useRoute();
  const first = useRef(true);

  /**
   * A hash router changes the page without the browser doing any of the things it does for a
   * real navigation. Two of those matter to someone not looking at the screen: the window
   * title is how a screen reader and the tab strip say where you are, and focus has to land
   * in the new page or the next Tab continues from wherever the old one left it.
   *
   * Not on first load — focus belongs wherever the browser put it, and moving it there would
   * skip past the skip link that exists for exactly this.
   */
  useEffect(() => {
    document.title = `${titleOf(path)} · Liquid Glass UI`;
    if (first.current) { first.current = false; return; }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [path]);
  /**
   * The ref harness renders outside the shell: it mounts every component at once, and the
   * sidebar and tab bar would be a second copy of several of them in the same document.
   * Unlinked and unlisted — `tests/browser/refs.spec.ts` is the only thing that visits it.
   */
  if (path === '_probe/refs') return <RefProbe />;
  if (path === '_probe/warnings') return <WarnProbe />;
  return <Shell path={path} go={go} secondaryNav={<SecondaryNav path={path} go={go} />}>
    {resolve(path, go)}
  </Shell>;
}
