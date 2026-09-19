import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/**
 * The audit, turned into something a machine runs.
 *
 * The last full pass over these pages (alpha.5) was a person reading 27 screens against the
 * rules. That found real defects and it does not scale: it takes a day, it cannot be repeated
 * per commit, and the next refactor silently undoes whatever it fixed. This runs the same
 * structural questions over every component page under every combination of the settings a
 * user can turn on, and writes the answers to `reports/matrix.json`.
 *
 * It is deliberately **not** a screenshot comparison. A screenshot tells you something changed,
 * not whether it is wrong, and it fails on every legitimate redesign. These are questions with
 * an answer that does not depend on taste: does anything run off the side, is every target big
 * enough to hit, does every icon-only control have a name, is any text below the readable
 * floor, did anything collapse to nothing, did the console complain.
 *
 * ## Why one factor at a time
 *
 * The full product — 28 pages × 2 appearances × 5 accessibility settings × 2 directions ×
 * 2 text sizes — is over three thousand cells, which nobody will ever run and therefore nobody
 * will ever fix. Each setting is instead varied against the baseline on its own, plus the two
 * pairs that actually interact: the largest text size is what breaks a layout, and it breaks it
 * differently once the layout is mirrored or the material has gone opaque. That is 10 cells a
 * page and it finishes in minutes.
 *
 * Run with `pnpm test:matrix`. It is its own project, out of `pnpm check`, because it is slow
 * and because its job is to find new things rather than to guard old ones — what it finds gets
 * a dedicated test of its own.
 */

/** A setting, expressed the way a user would have turned it on. */
interface Variant {
  id: string;
  /** Context options — the input device, which cannot be changed on a live page. */
  context?: { hasTouch?: boolean };
  /** Applied before the page loads. Reduced transparency has to be here — see below. */
  init?: (page: Page) => Promise<void>;
  /** Applied to the loaded page. */
  apply?: (page: Page) => Promise<void>;
}

/**
 * Chromium cannot emulate `prefers-reduced-transparency`, so this overrides `matchMedia` for
 * that one query and lets the library's own policy do the rest. Driving the site's preference
 * switch instead would work too and would test the switch rather than the setting.
 */
async function fakeMedia(page: Page, query: string) {
  await page.addInitScript(([target]) => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = (input: string) => input.includes(target)
      ? { matches: true, media: input, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false } as MediaQueryList
      : original(input);
  }, [query]);
}

const VARIANTS: Variant[] = [
  { id: 'base' },
  /* The finger. `hasTouch` is what makes `(pointer: coarse)` match in Chromium, and it is the
     only variant in which the 44pt rule runs at all. */
  { id: 'touch', context: { hasTouch: true } },
  { id: 'dark', apply: page => page.emulateMedia({ colorScheme: 'dark' }) },
  { id: 'reduce-transparency', init: page => fakeMedia(page, 'prefers-reduced-transparency') },
  { id: 'increase-contrast', apply: page => page.emulateMedia({ contrast: 'more' }) },
  { id: 'reduce-motion', apply: page => page.emulateMedia({ reducedMotion: 'reduce' }) },
  { id: 'forced-colors', apply: page => page.emulateMedia({ forcedColors: 'active' }) },
  { id: 'rtl', apply: page => page.evaluate(() => { document.documentElement.dir = 'rtl'; }) },
  { id: 'ax5', apply: page => page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; }) },
  {
    id: 'rtl+ax5',
    apply: page => page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      document.documentElement.dataset.lgTextSize = 'ax5';
    }),
  },
  {
    id: 'dark+ax5',
    apply: async page => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.evaluate(() => { document.documentElement.dataset.lgTextSize = 'ax5'; });
    },
  },
];

interface Finding { rule: string; detail: string }
interface Cell { slug: string; variant: string; findings: Finding[] }

/**
 * The questions, asked inside the page so the whole sweep is one round trip per cell.
 *
 * Every one of these has a known answer that is not a matter of opinion, and every one of them
 * has a documented source: the 44pt hit region, the 11pt readable floor, names on icon-only
 * controls, and "nothing runs off the side" are all HIG requirements this project has already
 * written down elsewhere.
 */
async function audit(page: Page): Promise<Finding[]> {
  return page.evaluate(() => {
    const findings: { rule: string; detail: string }[] = [];
    const add = (rule: string, detail: string) => { if (findings.length < 40) findings.push({ rule, detail }); };
    const where = (node: Element) => {
      const id = node.closest('[id]')?.id;
      const label = node.getAttribute('aria-label') ?? node.textContent?.trim().slice(0, 24) ?? '';
      return `${node.tagName.toLowerCase()}${node.className && typeof node.className === 'string' ? '.' + node.className.split(' ')[0] : ''}${id ? ` in #${id}` : ''}${label ? ` "${label}"` : ''}`;
    };
    const visible = (node: Element) => {
      const box = node.getBoundingClientRect();
      if (box.width === 0 && box.height === 0) return false;
      /* A skip link parks itself off the top of the screen until it is focused. It is not
         hidden and it is not reachable either; asking whether a finger can land on it is the
         wrong question. */
      if (box.bottom < 0 || box.right < 0 || box.top > innerHeight || box.left > innerWidth) return false;
      const style = getComputedStyle(node);
      return style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';
    };

    /* Nothing runs off the side. This is the one that AX5 and RTL break, and it is the one a
       user cannot work around. */
    const root = document.documentElement;
    if (root.scrollWidth > root.clientWidth + 1) {
      add('overflow', `document scrolls ${root.scrollWidth - root.clientWidth}px sideways`);
    }

    const interactive = Array.from(document.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [role="button"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="tab"], [role="switch"], [role="slider"], [tabindex]:not([tabindex="-1"])',
    )).filter(visible);

    /**
     * 44×44, hit-tested rather than measured.
     *
     * The first version of this rule read `getBoundingClientRect` and reported six thousand
     * failures, almost all of them wrong. Two reasons, and both matter:
     *
     * - A control is often drawn smaller than it is touchable. A text field's `<input>` is
     *   38px inside a 44px glass box; the finger lands on the box. `.lg-button` grows its
     *   region with an `::after` pseudo-element that does not appear in the element's own box
     *   at all. Measuring the artwork measures the wrong thing.
     * - 44pt is a *finger* requirement. On a pointer platform a 34px row is not a defect, and
     *   flagging it everywhere buries the cases that are.
     *
     * So: sample the four corners of a 42px square centred on the control and ask the document
     * what is there. That is the question a finger asks, it is indifferent to how the region
     * was produced, and it only runs where the pointer is coarse.
     */
    const coarse = matchMedia('(pointer: coarse)').matches;
    if (coarse) for (const node of interactive) {
      const box = node.getBoundingClientRect();
      // Text inside prose is a link, not a control; the same HIG page exempts it.
      const inProse = node.tagName === 'A' && !!node.closest('p, li, .md-p, .md-list');
      // A scrollable region is focusable so it can be scrolled by keyboard. It is not a target.
      const isRegion = node.classList.contains('lg-tab-panel') || node.getAttribute('role') === 'region';
      if (inProse || isRegion) continue;

      const x = box.left + box.width / 2, y = box.top + box.height / 2;
      const reach = 21;
      /**
       * Only corners that are on screen. `elementFromPoint` is a viewport query and answers
       * `null` for anything outside it, which the first run read as "nothing there" and
       * reported every row clipped by the bottom edge as too small. A control at the edge of
       * the window needs scrolling, not a bigger target.
       */
      const corners = ([[-reach, -reach], [reach, -reach], [-reach, reach], [reach, reach]] as const)
        .map(([dx, dy]) => [x + dx, y + dy] as const)
        .filter(([px, py]) => px >= 0 && py >= 0 && px <= innerWidth && py <= innerHeight);
      /**
       * A corner that lands on a **neighbouring control** is not a miss. Controls in a row are
       * adjacent targets and share the space between them — a page control's dots are 18px
       * apart, and asking each one to own 44px in every direction would make a four-page
       * control 176px wide and still not fix anything, because they would overlap each other
       * instead. If a finger slips onto the next dot it hits the next dot, which is what a row
       * of things does.
       *
       * The failure this is looking for is a control nobody can hit *at all*, because the
       * space around it belongs to a background, a container, or a bar floating over it.
       *
       * The limit, stated rather than pretended away: a **row of controls that are all too
       * small** excuses itself, because each one's neighbours are interactive. Whether a row
       * is acceptably dense is a judgement about the control — the system's own page control
       * has 7px dots 18px apart — and a sweep cannot make it. Controls like that carry their
       * own measurement instead; `page-control.spec.ts` checks the band each dot owns.
       * Verified that this still fires: removing `.lg-button::after`, the hit region every
       * button relies on, produces 34 findings.
       */
      const misses = corners.filter(([px, py]) => {
        const hit = document.elementFromPoint(px, py);
        if (!hit) return false;
        if (hit === node || node.contains(hit) || hit.contains(node)) return false;
        return !hit.closest('button, a[href], input, select, textarea, [role="button"], [role="tab"], [role="switch"], [role="slider"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]');
      });
      if (misses.length) {
        add('hit-target', `${Math.round(box.width)}×${Math.round(box.height)}, ${misses.length}/${corners.length} corners of a 42px touch land on nothing interactive — ${where(node)}`);
      }
    }
    for (const node of interactive) {
      /* An icon-only control with no name is silent to a screen reader and unreachable by
         Voice Control, which matches the visible text it cannot see. */
      const named = node.getAttribute('aria-label')
        || node.getAttribute('title')
        || (node.getAttribute('aria-labelledby') ? 'ref' : '')
        // A `<label for>` names a field, and it is the *preferred* way: the words are on screen.
        || (node.id && document.querySelector(`label[for="${CSS.escape(node.id)}"]`) ? 'label' : '')
        || node.closest('label')?.textContent?.trim()
        || node.textContent?.trim();
      if (!named) add('unnamed-control', where(node));
    }

    /* The readable floor. Leaf text nodes only — a container's font-size says nothing about
       what is actually painted. */
    for (const node of Array.from(document.querySelectorAll<HTMLElement>('main *'))) {
      if (node.children.length || !node.textContent?.trim() || !visible(node)) continue;
      const size = parseFloat(getComputedStyle(node).fontSize);
      if (Number.isFinite(size) && size < 11) add('text-too-small', `${size.toFixed(1)}px — ${where(node)}`);
    }

    /* A glass surface with no box is a surface that failed to lay out, which a screenshot
       would show and an assertion about its styles would not. */
    for (const node of Array.from(document.querySelectorAll<HTMLElement>('.lg-root'))) {
      if (node.getClientRects().length === 0) continue;
      const box = node.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) add('collapsed', `${Math.round(box.width)}×${Math.round(box.height)} — ${where(node)}`);
    }

    return findings;
  });
}

async function componentSlugs(page: Page): Promise<string[]> {
  await page.goto('/#/components');
  // The list lives in the sidebar, which only exists once the tab bar has taken its wide form.
  await page.waitForSelector('.subnav-link', { timeout: 10_000 });
  return page.locator('.subnav-link').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute('href') ?? '')
      .filter(href => href.startsWith('#/components/'))
      .map(href => href.replace('#/components/', '')));
}

test('the matrix', async ({ page, browser }) => {
  test.setTimeout(20 * 60 * 1000);
  const slugs = await componentSlugs(page);
  /* 28 pages today. The roadmap wrote "41 components" here, which is the number of exported
     components — several share a page (List/ListSection/ListRow, the toolbar parts). The
     floor is a guard against the selector silently matching nothing, not a target. */
  expect(slugs.length, 'no component pages found — the sweep would pass vacuously').toBeGreaterThan(24);

  const cells: Cell[] = [];
  const errors = new Map<string, string[]>();

  for (const variant of VARIANTS) {
    /* A fresh context per variant: `addInitScript` and `emulateMedia` are context-wide, and a
       leftover setting from one variant silently contaminating the next is exactly the kind of
       result that makes a sweep worse than no sweep. */
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...variant.context });
    const sheet = await context.newPage();
    if (variant.init) await variant.init(sheet);

    for (const slug of slugs) {
      const key = `${slug}@${variant.id}`;
      const lines: string[] = [];
      sheet.on('console', message => { if (message.type() === 'error') lines.push(message.text()); });
      sheet.on('pageerror', error => lines.push(String(error)));

      await sheet.goto(`/#/components/${slug}`);
      await sheet.waitForSelector('#main');
      if (variant.apply) await variant.apply(sheet);
      await sheet.waitForTimeout(160);

      const findings = await audit(sheet);
      if (lines.length) { errors.set(key, lines); findings.push({ rule: 'console', detail: lines.join(' | ') }); }
      cells.push({ slug, variant: variant.id, findings });

      // Undo the in-page settings; the emulated ones belong to the context and are fine.
      await sheet.evaluate(() => {
        document.documentElement.removeAttribute('dir');
        delete document.documentElement.dataset.lgTextSize;
      });
      sheet.removeAllListeners('console');
      sheet.removeAllListeners('pageerror');
    }
    await context.close();
  }

  const failing = cells.filter(cell => cell.findings.length > 0);
  const byRule = new Map<string, number>();
  for (const cell of failing) for (const finding of cell.findings) byRule.set(finding.rule, (byRule.get(finding.rule) ?? 0) + 1);

  const report = {
    generated: new Date().toISOString(),
    pages: slugs.length,
    variants: VARIANTS.map(variant => variant.id),
    cells: cells.length,
    failing: failing.length,
    byRule: Object.fromEntries([...byRule].sort((a, b) => b[1] - a[1])),
    findings: failing,
  };
  const path = resolve(process.cwd(), 'reports/matrix.json');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(report, null, 2) + '\n');

  // Reported, not asserted: this run's job is to produce the list. What it finds gets fixed,
  // and each fix gets a test of its own that does belong in `pnpm check`.
  test.info().annotations.push({ type: 'matrix', description: `${failing.length} of ${cells.length} cells have findings` });
});
