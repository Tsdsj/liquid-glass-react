# Design QA

- Source visual truth: `test-results/site-qa/ant-design-reference-desktop.png`
- Implementation: `test-results/site-qa/component-detail-1440x1024.png`
- Full comparison: `test-results/site-qa/comparison-desktop-side-by-side.png`
- Mobile implementation: `test-results/site-qa/home-mobile-390x844.png`, `test-results/site-qa/component-detail-mobile-390x844.png`
- Viewport: desktop `1440 x 1024`; mobile `390 x 844`
- State: Chinese locale, light theme, component detail at the top of the page

## Full-view comparison evidence

The combined image compares the source and implementation at the same desktop viewport. Both use a 64px document header, persistent left navigation, a constrained central article, and a sticky right table of contents. The implementation intentionally replaces pure white with a low-glare gray-green surface while preserving the reference hierarchy and density.

No separate focused crop was needed: the original-resolution combined image keeps the header, both sidebars, typography, dividers, demo frames, and visible controls legible. Mobile captures separately verify the responsive navigation and first-screen composition.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Typography: system font stack, non-negative letter spacing, and a clear 36px/24px/15px document hierarchy match the reference intent. No clipping or unintended wrapping was observed.
- Spacing and layout: desktop columns, sticky offsets, section rhythm, and 8px repeated-item radii are consistent. Desktop and mobile have no horizontal overflow.
- Colors and tokens: the default background resolves to `rgb(243, 246, 243)`. Secondary text resolves to `rgb(85, 97, 91)` with a measured 5.94:1 contrast ratio.
- Image quality: the existing project WebP is used as the real glass backdrop. No CSS illustration, placeholder asset, custom SVG, or fake icon was introduced.
- Copy and content: existing component descriptions, examples, API data, bilingual copy, and routes are preserved. The inaccurate zero-runtime-dependency hero claim was removed.
- States and interactions: theme and language controls, search filtering, demo code toggles, component links, and the mobile component-navigation disclosure remain functional.
- Accessibility: semantic navigation, headings, labels, focus-visible styles, reduced-motion handling, keyboard controls, and mobile tap targets are present.
- P3 follow-up: the same project illustration appears across multiple previews. A future brand-asset pass could add complementary backdrops, but this does not block the current redesign.

## Patches made during QA

- Reduced mobile header and hero tool-surface height so the next section remains visible.
- Replaced the mobile horizontal component scroller with an accessible collapsed navigation control.
- Added site-local secondary and tertiary text tokens for stronger low-glare contrast.
- Removed nested GlassSurface containers around interactive demos so child components retain their own glass rendering.

## Implementation checklist

- [x] Desktop header and three-column documentation layout
- [x] Soft light theme and dark-theme compatibility
- [x] Responsive home, overview, detail, and guide layouts
- [x] Functional mobile component navigation
- [x] Same-viewport source/implementation comparison

final result: passed
