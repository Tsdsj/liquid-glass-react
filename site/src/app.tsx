import type { MouseEvent } from 'react';
import { Text } from '@ttqtt/liquid-glass-react';
import { useRoute, sectionOf } from './router.js';
import { Shell } from './site/shell.js';
import { Page } from './site/page.js';
import { componentDocs, findDoc, groupedDocs } from './catalog/index.js';
import { ComponentPage } from './pages/component-page.js';
import { ComponentsIndex } from './pages/components-index.js';
import { OverviewPage } from './pages/overview.js';
import {
  AccessibilityFoundation, ColorFoundation, LayoutFoundation, MaterialsFoundation,
  MotionFoundation, TypographyFoundation,
} from './pages/foundations.js';
import { InstallGuide, MigrationGuide, RendererGuide, SsrGuide, ThemingGuide } from './pages/guides.js';
import { MaterialLab } from './pages/lab.js';
import { StressPage } from './pages/stress.js';
import { PerformancePage } from './pages/performance.js';

const FOUNDATIONS = [
  ['materials', '材质'], ['color', '色彩'], ['typography', '排版'],
  ['layout', '布局与形状'], ['motion', '动效与交互'], ['accessibility', '无障碍'],
] as const;
const LABS = [['materials', '材质实验台'], ['layout', '布局夹具'], ['performance', '性能观测']] as const;
const GUIDES = [
  ['install', '接入组件'], ['renderer', '渲染策略'], ['theming', '主题与 token'],
  ['ssr', 'SSR 与 CSP'], ['migration', '从 0.1 迁移'],
] as const;

/** Secondary navigation for the current section, shown inside the sidebar at regular width. */
function SecondaryNav({ path, go }: { path: string; go: (path: string) => void }) {
  const section = sectionOf(path);
  const click = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); go(target); };
  const link = (target: string, label: string) => <a key={target} href={`#/${target}`} onClick={click(target)}
    className="subnav-link" aria-current={path === target ? 'page' : undefined}>{label}</a>;

  if (section === 'components') return <nav className="subnav" aria-label="组件列表">
    {groupedDocs.map(({ group, docs }) => <div key={group} className="subnav-group">
      <Text variant="caption1" emphasized tone="tertiary" className="subnav-title">{group}</Text>
      {docs.map(doc => link(`components/${doc.slug}`, doc.name))}
    </div>)}
  </nav>;
  if (section === 'foundations') return <nav className="subnav" aria-label="基础章节">
    {FOUNDATIONS.map(([slug, label]) => link(`foundations/${slug}`, label))}
  </nav>;
  if (section === 'labs') return <nav className="subnav" aria-label="实验室">
    {LABS.map(([slug, label]) => link(`labs/${slug}`, label))}
  </nav>;
  if (section === 'guides') return <nav className="subnav" aria-label="指南">
    {GUIDES.map(([slug, label]) => link(`guides/${slug}`, label))}
  </nav>;
  return null;
}

function NotFound({ go }: { go: (path: string) => void }) {
  return <Page title="没有这一页" lede="链接可能过时了，或者这个组件还没有文档。">
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
    return doc ? <ComponentPage doc={doc} /> : <NotFound go={go} />;
  }
  switch (path) {
    case 'foundations/materials': return <MaterialsFoundation />;
    case 'foundations/color': return <ColorFoundation />;
    case 'foundations/typography': return <TypographyFoundation />;
    case 'foundations/layout': return <LayoutFoundation />;
    case 'foundations/motion': return <MotionFoundation />;
    case 'foundations/accessibility': return <AccessibilityFoundation />;
    case 'labs/materials': return <MaterialLab />;
    case 'labs/layout': return <StressPage />;
    case 'labs/performance': return <PerformancePage />;
    case 'guides/install': return <InstallGuide />;
    case 'guides/renderer': return <RendererGuide />;
    case 'guides/theming': return <ThemingGuide />;
    case 'guides/ssr': return <SsrGuide />;
    case 'guides/migration': return <MigrationGuide />;
    default: return <NotFound go={go} />;
  }
}

export function App() {
  const [path, go] = useRoute();
  return <Shell path={path} go={go} secondaryNav={<SecondaryNav path={path} go={go} />}>
    {resolve(path, go)}
  </Shell>;
}

export { componentDocs };
