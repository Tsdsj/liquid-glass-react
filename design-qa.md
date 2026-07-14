# Design QA

- Feedback source: `codex-clipboard-8d8d1cad-aee8-42e2-8852-98bd1673b877.png`, `codex-clipboard-cf254b7a-5c45-405f-847a-2ff5736e3d32.png`
- Before/after comparison: `test-results/site-qa/feedback-components-before-after.png`
- Desktop implementation: `test-results/site-qa/home-feedback-1440x1024.png`, `test-results/site-qa/components-overview-feedback-1440x1024.png`, `test-results/site-qa/component-detail-feedback-1440x1024.png`
- Mobile implementation: `test-results/site-qa/components-overview-feedback-mobile-390x844.png`, `test-results/site-qa/component-detail-feedback-mobile-390x844.png`, `test-results/site-qa/component-detail-feedback-dark-mobile-390x844.png`
- Viewports: desktop `1440 x 1024`, intermediate `1200 x 900`, mobile `390 x 844`
- State: Chinese locale; light theme for primary captures; dark theme checked separately

## Feedback verification

The comparison image places the user's washed-out component overview beside the corrected implementation. The final page keeps the low-glare gray-green surface while restoring the original WebP's wood, teal, ink, and plant detail behind every glass component.

The Header theme control now sits on a site-local support surface. In the light theme, the unchecked track resolves to `rgb(147, 162, 154)` against a `rgb(227, 234, 229)` control shelf, so the switch remains visible without changing the component library's global tokens.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Contrast: the page background is a softer `#edf2ee`; cards remain `#f8faf7`; stronger borders separate page, card, and control layers without returning to bright white.
- Glass visibility: preview and demo areas use the existing real WebP with `background-blend-mode: normal`. The former `soft-light` wash is removed, making refraction, blur, tint, and highlights readable.
- Desktop width: at 1440px the documentation layout is 1376px wide and the main content is 916px. At 1200px the right table of contents collapses and the main content remains 884px.
- Typography: component overview headings, sidebar links, card titles and descriptions, detail headings, demo copy, and API tables are one step larger while preserving the existing hierarchy.
- Responsive layout: mobile Header controls fit within the 343px inner width; the document scroll width equals the client width in both themes, so no horizontal overflow is present.
- States and interactions: theme switching, language selection, component navigation, search, demos, and code controls retain their existing behavior.
- Browser health: no warning or error entries were reported during the final desktop and mobile checks.

## Patches made during QA

- Added a site-scoped Header control shelf and Switch token overrides.
- Darkened the default low-glare page surface slightly and strengthened site borders.
- Expanded documentation pages to a 1480px maximum and moved the three-to-two-column breakpoint to 1240px.
- Increased component-documentation typography and widened the search field.
- Removed the lightening blend from home previews, component cards, and demo stages.

## Implementation checklist

- [x] Header theme switch visible in light and dark themes
- [x] Wider component overview and detail pages
- [x] Larger component documentation typography
- [x] High-detail backdrops behind glass components
- [x] Desktop, intermediate, and mobile responsive checks
- [x] Same-screen before/after comparison

final result: passed
