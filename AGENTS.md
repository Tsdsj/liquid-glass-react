# Repository conventions

Keep the geometry core DOM-free at import time. Refraction applies to decorative backdrops, never foreground text. Do not add unbounded caches, per-pointer map generation, implicit DOM screenshots, or blanket will-change/contain optimizations.

Keep CSS the auto default until the target Chrome/GPU matrix is validated. User reduced-transparency/motion and forced-colors choices override visual settings. Keep real button/radio/range/checkbox semantics and test focus when touching overlays.

Before proposing a release run typecheck, build, core tests, SSR tests and the branded Chrome project after a real pnpm install. Do not describe syntax-only transpilation as a typecheck, Chromium as Google Chrome, or rAF intervals as GPU timings. Update docs/action-items.md and reports with actual evidence, including failures.

Packages are private alpha workspaces. No remote publishing, deployment, lockfile fabrication or silent installation of competitor code. Preserve MIT notices and do not add Apple fonts or wallpaper assets.
