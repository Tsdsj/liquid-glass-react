import { test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/**
 * Which state changes move, and which ones just happen.
 *
 * The audit that started this had no list, only a suspicion: counting `transition` rules by
 * class prefix said `badge` 0, `card` 0, `split` 0, `toast` 1 — which is not a finding, it is
 * a reason to go and look. This goes and looks, in the browser, the way a reader would: press
 * the thing, hover the thing, focus the thing, then ask the element whether anything is
 * animating.
 *
 * `element.getAnimations({ subtree: true })` answers that question honestly for both CSS
 * transitions and keyframe animations, and it is the same instrument `interruptible.spec.ts`
 * uses — a transition that is running is in the list, one that never started is not. **A
 * trigger that changes what is on screen and produces nothing is one finding.**
 *
 * Same contract as `matrix.spec.ts`: its own project, out of `pnpm check`, because its job is
 * to find new things rather than guard old ones. Run it with `pnpm test:motion`; it writes
 * `reports/motion.json`. What it finds gets a named test in a project that does run on every
 * commit — the sweep never becomes the guard, or the guard would move whenever the sweep does.
 *
 * What it cannot tell you: whether the motion is any good. A 3-second linear fade registers
 * here exactly like a spring. Machine asks "is there any", person asks "is it right" — the
 * division of labour the 440-cell matrix already runs on.
 */

/** One thing we did to the page, and what moved because of it. */
interface Probe {
  slug: string;
  /** How a reader would describe the action: "hover", "press", "activate", "focus". */
  trigger: string;
  /** The element it landed on, as a stable-ish description. */
  target: string;
  /** `animation-name`s and transitioned properties that were running one frame later. */
  moved: string[];
  /**
   * Whether motion is actually owed here. Only these count as findings.
   *
   * The first version counted every empty reading and produced 1,255 of them — and most were
   * the library being right. A focus ring is an `outline` and appears at once, as the system's
   * own does; a card is content and should not react to a pointer passing over it; an
   * activation that changed nothing on screen has nothing to animate. A sweep whose output is
   * mostly correct behaviour is one nobody reads, and the number at the top of it
   * ("1,255 findings") is worse than no number, because somebody will quote it.
   */
  owed: boolean;
}

/**
 * The elements worth probing on a page, and how to name them in the report.
 *
 * Deliberately not "everything focusable": the site's own chrome (the sidebar, the tab bar,
 * the theme switch) appears on all 28 pages and would drown the component under test in 28
 * copies of the same answer. `#main` only, and only the first few of each kind — the third
 * identical button tells you nothing the first did not.
 */
const PROBE_LIMIT = 3;
/**
 * And a ceiling for the page as a whole.
 *
 * Per-kind alone is not a budget: a page with forty distinct `lg-` classes on it produces a
 * hundred and twenty probes at three apiece, and the first run of this sweep spent twenty
 * minutes on the first few pages and wrote no report at all. A sweep that never finishes
 * reports nothing, which is strictly worse than a sweep that reports the first two dozen
 * things on each page.
 */
const PAGE_LIMIT = 24;

/**
 * What counts as something a pointer is supposed to get a reaction out of.
 *
 * The control layer, in other words. A text field is left out on purpose: pressing one owes a
 * focus ring, not a press animation, and the ring is an outline. `.lg-card` is in the target
 * list but not in here — it is probed so the report shows it was looked at, and it is not a
 * finding when it sits still, because content is supposed to sit still.
 */
const INTERACTIVE = 'button, a[href], summary, [role="switch"], [role="tab"], '
  + '.lg-split-divider, .lg-list-row, .lg-sidebar-row, .lg-page-dot, .lg-color-swatch, .lg-segment, '
  + 'input[type="checkbox"], input[type="radio"], input[type="range"], input[type="color"]';

/**
 * …and what cancels that, because the control is in a state where nothing is owed.
 *
 * A disabled button is supposed to ignore the pointer; a `ListRow` with no `onSelect` is a line
 * of text. Without this the report's largest entries were the library being right: sixteen
 * readings from the disabled examples on the button page, eighteen from rows that are not
 * rows you can press.
 */
const NOT_OWED = ':disabled, [aria-disabled="true"], [data-disabled="true"], '
  + '[data-disabled="true"] *, .lg-list-row:not([data-interactive="true"]), '
  + '.lg-list-row:not([data-interactive="true"]) *';

async function probeTargets(page: Page) {
  return page.evaluate(({ limit, interactive, notOwed }) => {
    const seen = new Map<string, number>();
    const out: { selector: string; label: string; interactive: boolean }[] = [];
    const nodes = document.querySelectorAll<HTMLElement>(
      '#main :is(button, a[href], input, summary, [role="switch"], [role="tab"], [role="separator"], ' +
      '.lg-list-row, .lg-sidebar-row, .lg-page-dot, .lg-color-swatch, .lg-segment, .lg-card)');
    nodes.forEach((node, index) => {
      // Skip the documentation site's own furniture around each example.
      if (node.closest('.example-toolbar, .code-block, .outline, .subnav')) return;
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      /* The most specific `lg-` class, not the first: every glass element carries `lg-root`
         first, so naming by the first one filed sixteen different controls under "lg-root". */
      const classes = node.className.split(/\s+/).filter(name => name.startsWith('lg-'));
      const own = classes.find(name => name !== 'lg-root') ?? classes[0];
      const kind = own ?? node.getAttribute('role') ?? node.tagName.toLowerCase();
      const count = seen.get(kind) ?? 0;
      if (count >= limit) return;
      seen.set(kind, count + 1);
      node.setAttribute('data-motion-probe', String(index));
      /* `own` as well as the role test: the documentation site's own buttons and links are on
         these pages too, in every example, and this sweep is about the library. A plain text
         link in a paragraph owes no animation, and forty-two readings saying so is how a
         report stops being read. */
      out.push({ selector: `[data-motion-probe="${index}"]`, label: `${kind} #${count}`,
        interactive: !!own && node.matches(interactive) && !node.matches(notOwed) });
    });
    return out;
  }, { limit: PROBE_LIMIT, interactive: INTERACTIVE, notOwed: NOT_OWED });
}

/** Kept up to date after every page, so a run that is cut short still leaves its findings. */
async function writeReport(body: object) {
  const path = resolve(process.cwd(), 'reports/motion.json');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(body, null, 2) + '\n');
}

/**
 * Long enough for the style change the trigger caused to have been recalculated.
 *
 * Driven from Node rather than from `requestAnimationFrame` inside the page, which is the
 * difference between a sweep that finishes and one that does not: a headless page's frame
 * callbacks are throttled towards once a second, and two of them per reading, four readings
 * per control, came to eleven seconds a control. Forty milliseconds of wall clock is the same
 * information at a two-hundredth of the price.
 */
const SETTLE = 40;

/**
 * What is animating on this element or inside it, just after the trigger — and failing that,
 * on its immediate surroundings.
 *
 * The second look is not slack, it is the shape of these controls. A segmented control answers
 * a hover on the selected segment by lifting the **capsule**, which is a sibling of that
 * segment, not a child of it; a colour well's visible swatch is a sibling of the invisible
 * `<input type="color">` that receives the pointer. Reading only the element's own subtree
 * reported both as dead, sixty-six times between them, after they had been fixed and their
 * behaviour proved by a test. A neighbour that started moving within forty milliseconds of
 * this hover is this hover's answer; it is marked `^` in the report so a reader can see the
 * feedback landed next door rather than here.
 */
async function moving(page: Page, selector: string): Promise<string[]> {
  await page.waitForTimeout(SETTLE);
  return page.evaluate(target => {
    const node = document.querySelector(target);
    if (!node) return [];
    const name = (animation: Animation, near: boolean) => {
      const css = animation as CSSTransition & CSSAnimation;
      const what = css.transitionProperty ? `transition:${css.transitionProperty}` : `animation:${css.animationName ?? '?'}`;
      return near ? `^${what}` : what;
    };
    const own = node.getAnimations({ subtree: true });
    if (own.length) return own.map(animation => name(animation, false));
    return (node.parentElement?.getAnimations({ subtree: true }) ?? []).map(animation => name(animation, true));
  }, selector);
}

/**
 * Remember what was already running, and what the page looked like, before an activation.
 *
 * Both halves exist because the first version asked "is anything animating in the document"
 * and got "yes" every single time: one indeterminate progress bar spins forever on the page
 * that documents it, and several pages have one. That reading was true, useless, and — since
 * it never once came back empty — it meant the whole `activate` dimension tested nothing.
 */
async function markDocument(page: Page) {
  return page.evaluate(() => {
    const store = window as unknown as { __before: Set<Animation> };
    store.__before = new Set(document.getAnimations());
    // Cheap signature of "what is on screen", to tell a click that did something from one
    // that did nothing. Nothing changed means nothing was owed.
    return document.querySelectorAll('*').length;
  });
}

/** Animations that were **not** running before the trigger, named by where they landed. */
async function startedSince(page: Page): Promise<{ moved: string[]; changed: number }> {
  await page.waitForTimeout(SETTLE);
  return page.evaluate(() => {
    const store = window as unknown as { __before: Set<Animation> };
    const moved = document.getAnimations().filter(animation => !store.__before.has(animation)).map(animation => {
      const css = animation as CSSTransition & CSSAnimation;
      const owner = (css.effect as KeyframeEffect | null)?.target as HTMLElement | null;
      const where = owner?.className?.split?.(/\s+/).find((name: string) => name.startsWith('lg-')) ?? owner?.tagName?.toLowerCase() ?? '?';
      return `${where} ${css.transitionProperty ? `transition:${css.transitionProperty}` : `animation:${css.animationName ?? '?'}`}`;
    });
    return { moved, changed: document.querySelectorAll('*').length };
  });
}

async function componentSlugs(page: Page): Promise<string[]> {
  await page.goto('/#/components');
  await page.waitForSelector('.subnav-link', { timeout: 10_000 });
  return page.locator('.subnav-link').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute('href') ?? '')
      .filter(href => href.startsWith('#/components/'))
      .map(href => href.replace('#/components/', '')));
}

test('the motion inventory', async ({ page }) => {
  test.setTimeout(20 * 60 * 1000);
  const slugs = await componentSlugs(page);
  if (slugs.length < 24) throw new Error(`only ${slugs.length} component pages — the sweep would pass vacuously`);

  /**
   * The fixture's own page, not a second one in a second context.
   *
   * A background page has its `requestAnimationFrame` throttled to about once a second, and
   * every reading here waits two frames — the first version swept on a second page and spent
   * eleven seconds per probe waiting for frames that a visible page delivers in thirty-three
   * milliseconds. Fourteen controls on the first page took three minutes.
   */
  const probes: Probe[] = [];
  const sheet = page;

  for (const slug of slugs) {
    await sheet.goto(`/#/components/${slug}`);
    await sheet.waitForSelector('#main');
    await sheet.waitForTimeout(400);
    const targets = (await probeTargets(sheet)).slice(0, PAGE_LIMIT);
    // Progress on stdout: this runs for minutes and a silent sweep is one you cannot tell
    // apart from a stuck one — which is exactly how the first version was read.
    process.stdout.write(`  ${slug} (${targets.length})`);
    const began = Date.now();

    for (const { selector, label, interactive } of targets) {
      const node = sheet.locator(selector);
      if (!(await node.isVisible().catch(() => false))) continue;
      /**
       * Into view first, and only then measure.
       *
       * `boundingBox()` is in viewport coordinates, and `mouse.move` to a y below the fold
       * moves the pointer nowhere in particular — the control is never hovered and the reading
       * comes back "nothing moved". That is the sweep testing the scroll position rather than
       * the component, and it is indistinguishable in the report from a real gap: a list row
       * with a perfectly good hover transition was filed as a finding because it was 1,400px
       * down the page.
       */
      await node.scrollIntoViewIfNeeded({ timeout: 600 }).catch(() => {});
      const box = await node.boundingBox().catch(() => null);
      if (!box || box.y < 0 || box.y + box.height > 1000) continue;
      const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      // And confirm the pointer actually arrived, rather than assuming it.
      await sheet.mouse.move(centre.x, centre.y);
      if (!(await node.evaluate(element => element.matches(':hover')).catch(() => false))) continue;

      // Hover, then press, then release — the three states every control is supposed to have.
      probes.push({ slug, trigger: 'hover', target: label, owed: interactive, moved: await moving(sheet, selector) });

      await sheet.mouse.down();
      probes.push({ slug, trigger: 'press', target: label, owed: interactive, moved: await moving(sheet, selector) });

      /* Everything the release does — a menu opening, a panel swapping, a toast arriving —
         happens somewhere other than the control, so this one looks at the whole document:
         only what started because of the release, and only when the release changed anything. */
      const was = await markDocument(sheet);
      await sheet.mouse.up();
      const after = await startedSince(sheet);
      probes.push({ slug, trigger: 'activate', target: label, owed: after.changed !== was, moved: after.moved });

      /* Keyboard focus is its own state. Never a finding: the ring is an `outline` and appears
         at once, which is what the system's own ring does — `catalog.spec.ts` is what checks
         it is there at all. Recorded anyway, because "nothing here animates on focus" is worth
         being able to see rather than assume.

         With an explicit timeout: the activation above may have replaced this element, and
         `focus()` then waits the default thirty seconds for it to come back. Fourteen controls
         at thirty seconds each is seven minutes on one page, which is how the first version of
         this sweep managed to look like an infinite loop. */
      await node.focus({ timeout: 600 }).catch(() => {});
      probes.push({ slug, trigger: 'focus', target: label, owed: false, moved: await moving(sheet, selector) });

      // Put the page back: an activation may have opened something modal over the next probe.
      await sheet.keyboard.press('Escape').catch(() => {});
      await sheet.mouse.move(4, 4);
      await sheet.waitForTimeout(60);
    }

    process.stdout.write(` ${((Date.now() - began) / 1000).toFixed(1)}s\n`);
    const still = probes.filter(probe => probe.owed && probe.moved.length === 0);
    const byPage = new Map<string, number>();
    const byKind = new Map<string, number>();
    for (const probe of still) {
      byPage.set(probe.slug, (byPage.get(probe.slug) ?? 0) + 1);
      const kind = `${probe.trigger} ${probe.target.split(' #')[0]}`;
      byKind.set(kind, (byKind.get(kind) ?? 0) + 1);
    }
    const rank = (map: Map<string, number>) => Object.fromEntries([...map].sort((a, b) => b[1] - a[1]));
    /* Counts and a sample, not every probe. The full list is two thousand six hundred lines of
       JSON that nobody reads and that changes on every run; what is worth keeping in the
       repository is the shape — which page, which kind of control, which trigger. */
    await writeReport({
      generated: new Date().toISOString(),
      pages: slugs.length,
      swept: slugs.indexOf(slug) + 1,
      probes: probes.length,
      /* Of the probes where motion was owed. The rest are in `asked` and are not findings —
         see `Probe.owed` for what "owed" means and why the distinction is the whole report. */
      asked: probes.filter(probe => probe.owed).length,
      still: still.length,
      byPage: rank(byPage),
      byKind: rank(byKind),
      sample: still.slice(0, 60),
    });
  }

  const still = probes.filter(probe => probe.moved.length === 0);
  test.info().annotations.push({ type: 'motion', description: `${still.length} of ${probes.length} probes moved nothing` });
});
