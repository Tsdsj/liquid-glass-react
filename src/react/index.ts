'use client';
/* System — policy, the material itself, and the primitives every layer shares. */
export * from './system/provider.js';
export { useSizeClass, REGULAR_MIN_WIDTH, type SizeClass } from './system/size-class.js';
export * from './system/backdrop.js';
export * from './system/material.js';
export * from './system/surface.js';
export { useFusion, type FusionOptions } from './system/fusion.js';
export { usePull, attachPull, elementAt, type PullOptions, type PullRange, type PullRelease } from './system/pull.js';
export { LibraryIcon, type LibraryIconProps, type LibraryIconName } from './system/icon.js';

/* Content layer — solid surfaces and standard materials, never Liquid Glass. */
export * from './content/text.js';
export * from './content/kbd.js';
export * from './content/card.js';
export * from './content/list.js';
export * from './content/material-view.js';
export * from './content/divider.js';

/* Controls */
export * from './controls/button.js';
/* `useSelectionLens` / `lensOrigin` / `trackSpan` stay internal: they are how the tab bar, the
   tabs and the segmented control share one lens, not an API. They write to a DOM node you hand
   them and assume the stylesheet's transform chain. */
export { GlassSegmentedControl, type GlassChoice, type GlassSegmentedControlProps } from './controls/segmented.js';
export * from './controls/slider.js';
export * from './controls/switch.js';
export * from './controls/stepper.js';
export * from './controls/progress.js';
export * from './controls/badge.js';

/* Fields */
export * from './fields/text-field.js';
export * from './fields/search-field.js';

/* Navigation */
export * from './navigation/toolbar.js';
export * from './navigation/tab-bar.js';
export * from './navigation/sidebar.js';
export * from './navigation/nav-bar.js';
export * from './navigation/tabs.js';
export * from './navigation/scroll-edge.js';

/* Layout containers: the skeleton the bars and the content are arranged in. */
export * from './layout/screen.js';
export * from './layout/navigation-stack.js';

/* Overlays.
   Only the shared prop shapes are public. `triggerElement`, `usePopover` and `lockScroll` are how
   the overlays are assembled — anchoring maths, a scroll lock with a reference count, a render
   prop wired to a specific `aria-haspopup` — and none of them is usable on its own. */
export type { OpenProps, TriggerProps, Align } from './overlays/anchor.js';
export * from './overlays/popover.js';
export * from './overlays/menu.js';
export * from './overlays/menu-button.js';
export * from './overlays/tooltip.js';
export * from './overlays/dialog.js';
export * from './overlays/sheet.js';
export * from './overlays/alert.js';
export * from './overlays/action-sheet.js';
export * from './overlays/toast.js';

export type * from '../tokens/index.js';
export {
  getGlassDiagnostics, clearGlassCache,
  concentricRadius, concentricInset, capsuleRadius, type ConcentricOptions,
  createSpring, advanceSpring, springAtRest, defaultSpring,
  type SpringConfig, type SpringState, type SpringHandle,
} from '../core/index.js';
