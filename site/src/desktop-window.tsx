import { useState } from 'react';
import {
  GlassButton, GlassIconButton, GlassSlider, GlassToolbar, Inspector,
  MenuBar, OutlineView, type OutlineNode, Panel, PathBar, SplitView, Text,
  ToolbarGroup, ToolbarSpacer, useSizeClass,
} from '@ttqtt/liquid-glass-react';
import { Icon } from './icons.js';

/** One shot per leaf of the tree, with the folders it lives in — the path bar reads the same. */
const SHOTS: Record<string, { name: string; kind: string; path: string[] }> = {
  ridge: { name: '山脊 01', kind: 'RAW · 6000 × 4000', path: ['资料库', '2026', '山间'] },
  lake: { name: '湖面 04', kind: 'RAW · 6000 × 4000', path: ['资料库', '2026', '山间'] },
  pines: { name: '松林 12', kind: 'JPEG · 4032 × 3024', path: ['资料库', '2026', '山间'] },
  night: { name: '夜色 03', kind: 'JPEG · 4032 × 3024', path: ['资料库', '2026', '城市'] },
};

const folder = <Icon name="folder" size={15} />;
const photo = <Icon name="layer" size={15} />;
const LIBRARY: OutlineNode[] = [
  { key: 'library', label: '资料库', icon: folder, children: [
    { key: '2026', label: '2026', icon: folder, children: [
      { key: 'hills', label: '山间', icon: folder, children: [
        { key: 'ridge', label: SHOTS.ridge.name, icon: photo },
        { key: 'lake', label: SHOTS.lake.name, icon: photo },
        { key: 'pines', label: SHOTS.pines.name, icon: photo },
      ] },
      { key: 'city', label: '城市', icon: folder, children: [
        { key: 'night', label: SHOTS.night.name, icon: photo },
      ] },
    ] },
  ] },
];

/**
 * One window, built out of the library.
 *
 * Every page on this site shows a component on its own, which is the right way to look one up
 * and the wrong way to answer "what does an application made of these look like". This is the
 * answer: a menu bar, a toolbar, a split view with an outline of the library down its leading
 * side and an inspector down the other, a path bar along the bottom of the content, and a panel
 * floating over it — seven components that only make sense together. The outline and the path
 * bar are the same hierarchy read from its two ends, which is the arrangement the HIG's
 * outline-views page describes and the reason it names the split view by name.
 *
 * It is a **drawn** window, not the site's own chrome. The documentation site is a
 * documentation site and stopped pretending otherwise two rounds ago; this is a specimen
 * inside the page, with a frame around it so nobody mistakes the two.
 *
 * On a phone it is still the same composition and it adapts the way the library says it does:
 * the split view becomes a navigation stack, and the menu bar is gone — a menu bar is a
 * desktop object, which the HIG's own page says by covering only macOS and iPadOS. That is the
 * one thing here that is conditional on the size class rather than on CSS, because it is a
 * question about what exists, not about how it is drawn.
 */
export function DesktopWindow() {
  const [pick, setPick] = useState('ridge');
  const [open, setOpen] = useState(['library', '2026', 'hills']);
  const selected = SHOTS[pick];
  const [detail, setDetail] = useState(false);
  const [inspector, setInspector] = useState(true);
  const [panel, setPanel] = useState(true);
  const [exposure, setExposure] = useState(52);
  const [grain, setGrain] = useState(18);
  const [last, setLast] = useState('准备就绪');
  const regular = useSizeClass() === 'regular';

  const menus = [
    { key: 'file', title: '文件', items: [
      { key: 'import', label: '导入…', shortcut: 'mod shift i', onSelect: () => setLast('导入') },
      { key: 'export', label: '导出为…', shortcut: 'mod shift e', onSelect: () => setLast('导出') },
      { key: 'close', label: '关闭', shortcut: 'mod w', separatorBefore: true, onSelect: () => setLast('关闭'),
        alternate: { label: '全部关闭', shortcut: '⌥⌘W', onSelect: () => setLast('全部关闭') } },
    ] },
    { key: 'edit', title: '编辑', items: [
      { key: 'undo', label: '撤销', shortcut: 'mod z', onSelect: () => setLast('撤销') },
      { key: 'redo', label: '重做', shortcut: 'mod shift z', disabled: true, onSelect: () => {} },
    ] },
    { key: 'view', title: '显示', selection: 'single' as const, items: [
      { key: 'grid', label: '网格', checked: true, onSelect: () => setLast('网格视图') },
      { key: 'list', label: '列表', onSelect: () => setLast('列表视图') },
      { key: 'inspector', label: '检查器', separatorBefore: true, checked: inspector,
        onSelect: () => setInspector(value => !value) },
    ] },
  ];

  /* "Outline views work well … in the leading side of a split view, with related content on
     the opposite side" — the HIG's own placement, and the path bar under the canvas reads the
     same hierarchy from the other end. */
  const sidebar = <div className="window-sidebar">
    <OutlineView aria-label="照片库" items={LIBRARY}
      expanded={open} onExpandedChange={setOpen}
      selected={pick} onSelect={key => { if (SHOTS[key]) { setPick(key); setDetail(true); } }} />
  </div>;

  const content = <div className="window-content">
    <div className="window-canvas" role="img" aria-label={`${selected.name} 的预览`}>
      <Text variant="caption1" className="window-canvas-name">{selected.name}</Text>
    </div>
    <PathBar aria-label="位置" items={[
      ...selected.path.map(name => ({ label: name, onSelect: () => setLast(name) })),
      { label: selected.name },
    ]} />
  </div>;

  return <div className="window-frame">
    <div className="window-bar">
      <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
      {regular && <MenuBar aria-label="演示菜单栏" menus={menus} />}
      <ToolbarSpacer variant="flexible" />
      <GlassToolbar aria-label="照片工具栏" className="window-toolbar">
        <ToolbarGroup items={[
          { key: 'rotate', label: '旋转', icon: <Icon name="expand" size={18} />, onSelect: () => setLast('旋转') },
          { key: 'crop', label: '裁剪', icon: <Icon name="shrink" size={18} />, onSelect: () => setLast('裁剪') },
          { key: 'adjust', label: '调整', icon: <Icon name="tune" size={18} />, onSelect: () => setPanel(true) },
          { key: 'layers', label: '图层', icon: <Icon name="layer" size={18} />, onSelect: () => setLast('图层') },
          { key: 'grid', label: '网格', icon: <Icon name="grid" size={18} />, onSelect: () => setLast('网格') },
        ]} />
        <ToolbarSpacer />
        <ToolbarGroup>
          <GlassIconButton aria-label={inspector ? '隐藏检查器' : '显示检查器'} aria-pressed={inspector}
            onClick={() => setInspector(value => !value)}><Icon name="info" size={18} /></GlassIconButton>
        </ToolbarGroup>
        <ToolbarGroup prominent>
          <GlassButton variant="glassProminent" onClick={() => setLast('已导出')}>导出</GlassButton>
        </ToolbarGroup>
      </GlassToolbar>
    </div>

    {/* `headingLevel`: this window is a specimen inside a page that already has an `<h1>`, and
        the compact stack's title would otherwise be a second one. */}
    <SplitView className="window-split" title="照片" sidebar={sidebar} headingLevel={3}
      sidebarWidth={216} minSidebarWidth={176} maxSidebarWidth={280}
      inspectorVisible={inspector} inspectorWidth={188}
      compact={detail ? { title: selected.name, content } : undefined}
      onCompactBack={() => setDetail(false)}
      inspector={<Inspector title="信息">
        <Text variant="caption1" tone="secondary">{selected.kind}</Text>
        <Text variant="caption1" tone="secondary">曝光 {Math.round(exposure)} · 颗粒 {Math.round(grain)}</Text>
        <Text variant="caption1" tone="secondary">最近一次：{last}</Text>
      </Inspector>}>
      {content}
    </SplitView>

    {/* Same rule as the menu bar: the HIG's panels page covers macOS and says so by covering
        nothing else. A floating window over a 390px screen is most of the screen. */}
    {regular && <Panel title="调整" open={panel} onClose={() => setPanel(false)} width={196}
      defaultPosition={{ x: 236, y: 96 }}>
      <GlassSlider aria-label="曝光" value={exposure} onValueChange={setExposure} />
      <GlassSlider aria-label="颗粒" value={grain} onValueChange={setGrain} />
    </Panel>}
  </div>;
}
