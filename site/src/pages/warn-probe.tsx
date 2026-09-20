/**
 * Deliberately wrong compositions, one per development-mode rule.
 *
 * This is the only place in the project that gets them wrong on purpose, which is the point:
 * the rules were checked by eye until now, and a rule nobody can demonstrate failing is a rule
 * that quietly stops working. `tests/browser/warnings.spec.ts` reads the console here.
 *
 * It runs against the Vite dev server rather than the built site, because that is where these
 * warnings exist at all — a production build folds them away, which is the whole intent.
 */
import { GlassButton, GlassGroup, GlassIconButton, GlassMenuButton, GlassSurface, GlassToolbar, LibraryIcon, ToolbarGroup } from '@ttqtt/liquid-glass-react';

export function WarnProbe() {
  return <main id="main" style={{ padding: 24, display: 'grid', gap: 24 }}>
    <h1>warning probe</h1>

    {/* Two preferred actions on one surface: neither reads as preferred. */}
    <section id="two-prominent">
      <GlassGroup>
        <GlassButton variant="glassProminent">导出</GlassButton>
        <GlassButton variant="glassProminent">分享</GlassButton>
      </GlassGroup>
    </section>

    {/* Small glass inside small glass: the inner surface has nothing left to refract. */}
    <section id="glass-on-glass">
      <GlassSurface size="small" style={{ padding: 16 }}>
        <GlassSurface size="small" style={{ padding: 16 }}>嵌套</GlassSurface>
      </GlassSurface>
    </section>

    {/* `clear` with no declared backdrop tone: silently served as `regular`. */}
    <section id="clear-without-tone">
      <GlassSurface material="clear" style={{ padding: 16 }}>clear</GlassSurface>
    </section>

    {/* Icons and words sharing one background read as a single wide button. */}
    <section id="mixed-group">
      <GlassToolbar aria-label="混排">
        <ToolbarGroup>
          <GlassButton>重命名</GlassButton>
          <GlassIconButton aria-label="更多"><LibraryIcon name="ellipsis" /></GlassIconButton>
        </ToolbarGroup>
      </GlassToolbar>
    </section>

    {/* A menu that costs a press to reveal less than two plain buttons would have shown. */}
    <section id="short-menu">
      <GlassMenuButton label="更多" items={[
        { key: 'a', label: '重命名', onSelect: () => {} },
        { key: 'b', label: '复制', onSelect: () => {} },
      ]} />
    </section>

    {/*
      A tint whose label lands under 4.5:1 on what is actually painted behind it. A pale yellow
      on a prominent button is the classic case: `tintContrast` defaults to white, and white on
      yellow is unreadable whatever the variant. The rule used to compare the two *props*, so it
      could only ever see the prominent pairing — which is why this section is worth having.
    */}
    <section id="tint-contrast">
      <GlassButton variant="glassProminent" tint="#ffd60a">继续</GlassButton>
    </section>

    {/* A correct composition, to show the rules do not fire on everything. */}
    <section id="clean">
      <GlassGroup>
        <GlassButton variant="glassProminent">保存</GlassButton>
        <GlassButton>取消</GlassButton>
      </GlassGroup>
      <GlassMenuButton label="新建" items={[
        { key: 'a', label: '文稿', onSelect: () => {} },
        { key: 'b', label: '文件夹', onSelect: () => {} },
        { key: 'c', label: '相册', onSelect: () => {} },
      ]} />
    </section>
  </main>;
}
