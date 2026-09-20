import { test, expect, type Page } from '@playwright/test';

/**
 * A shortcut that is printed and a shortcut that is bound have to be the same shortcut.
 *
 * `Kbd` could already draw `"mod k"` as ⌘K — the half that cannot be wrong in a way anybody
 * notices. `useShortcut` binds it, and the two read the same table and resolve `mod` the same
 * way, so the interface cannot print one combination and listen for another.
 *
 * Which is exactly what these tests ask, and they ask it **without assuming a platform**. The
 * first version expected "Command J" and got "Control J", because Playwright's Chrome reports
 * a Linux user agent — the library was right and the test was parochial. So: read the hint off
 * the page, press the other modifier and expect nothing, then press the one it printed.
 *
 * Most of the rest of this file is about **not** firing, which is the part of a shortcut system
 * that is easy to leave out and impossible to discover by using the happy path.
 */

const COUNT = '#kbd-bind-count';

/** What the page says the shortcut is, and therefore what has to work. */
async function printedModifier(page: Page) {
  const label = await page.locator('#kbd-bind-demo .lg-kbd').first().getAttribute('aria-label');
  expect(label, 'the hint has no spoken name at all').toBeTruthy();
  const command = label!.startsWith('Command');
  expect(command || label!.startsWith('Control'), `the hint reads "${label}"`).toBe(true);
  return { press: command ? 'Meta' : 'Control', other: command ? 'Control' : 'Meta', label: label! };
}

async function openDemo(page: Page) {
  await page.goto('/#/components/kbd');
  const demo = page.locator('#kbd-bind-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator(COUNT)).toHaveText('0');
  return demo;
}

test('the shortcut the page prints is the shortcut that runs, and the other one does not', async ({ page }) => {
  const demo = await openDemo(page);
  const { press, other, label } = await printedModifier(page);

  await page.keyboard.press(`${other}+j`);
  await expect(demo.locator(COUNT), `"${label}" is printed and ${other}+J also fired it`).toHaveText('0');

  await page.keyboard.press(`${press}+j`);
  await expect(demo.locator(COUNT), `"${label}" is printed and ${press}+J did nothing`).toHaveText('1');
});

/**
 * A held key is one command.
 *
 * Dispatched rather than typed, and that is a real limitation worth naming: Playwright's
 * keyboard sends every `keydown` with `repeat: false`, so there is no way to produce a genuine
 * auto-repeat through it. A synthetic event is weaker evidence than a real one — it proves the
 * handler reads `event.repeat`, not that the browser sets it — but the alternative was a test
 * that passes whether or not the guard exists, which proves nothing at all.
 */
test('a held key is one command, not a stream of them', async ({ page }) => {
  const demo = await openDemo(page);
  const { press } = await printedModifier(page);
  await page.keyboard.press(`${press}+j`);
  await expect(demo.locator(COUNT)).toHaveText('1');

  await page.evaluate(modifier => {
    for (let index = 0; index < 5; index++) {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'j', code: 'KeyJ', repeat: true, bubbles: true,
        metaKey: modifier === 'Meta', ctrlKey: modifier === 'Control',
      }));
    }
  }, press);
  await expect(demo.locator(COUNT), 'holding the key ran the command five more times').toHaveText('1');
});

/**
 * And a bare letter is a letter while somebody is typing.
 *
 * The demo binds `/` with no modifier precisely so this can be seen. The first version of this
 * test only exercised `mod j`, which has a modifier — so the guard it was supposed to be
 * checking was never reached, and removing the guard left the test green.
 */
test('a bare shortcut is a character inside a field, and a command outside one', async ({ page }) => {
  const demo = await openDemo(page);
  const bare = demo.locator('#kbd-bind-bare');
  await expect(bare).toHaveText('0');

  await page.keyboard.press('/');
  await expect(bare, 'a bare shortcut did not fire outside a field').toHaveText('1');

  const field = demo.locator('input[type="text"]');
  await field.click();
  await page.keyboard.type('/');
  await expect(field, 'the slash was swallowed by the shortcut').toHaveValue('/');
  await expect(bare, 'typing a slash into a field ran the command').toHaveText('1');
});

/**
 * The rule that matters most, and the one nobody writes until it bites: while a modal is on
 * screen the keyboard belongs to it.
 *
 * Otherwise ⌘S saves the document behind the sheet that is asking whether to save it.
 */
test('a modal takes the keyboard with it', async ({ page }) => {
  const demo = await openDemo(page);
  const { press } = await printedModifier(page);
  await page.keyboard.press(`${press}+j`);
  await expect(demo.locator(COUNT)).toHaveText('1');

  /* The site's own command palette is a dialog, and it is the modal reachable from this page —
     which makes it a fair stand-in for any application's. */
  await page.keyboard.press(`${press}+k`);
  const dialog = page.locator('dialog[open], [role="dialog"][aria-modal="true"]').first();
  await expect(dialog).toBeVisible();

  await page.keyboard.press(`${press}+j`);
  await expect(demo.locator(COUNT), 'the page behind the modal answered its shortcut').toHaveText('1');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.keyboard.press(`${press}+j`);
  await expect(demo.locator(COUNT), 'the shortcut did not come back when the modal closed').toHaveText('2');
});

test('typing in a field is typing, and a modified shortcut still works there', async ({ page }) => {
  const demo = await openDemo(page);
  const { press } = await printedModifier(page);

  const field = demo.locator('input[type="text"]');
  await field.click();
  await field.fill('');
  await page.keyboard.type('j');
  await expect(field, 'a bare letter was swallowed by a shortcut').toHaveValue('j');

  // With a modifier it is a command again: ⌘F inside a text field is still Find.
  await page.keyboard.press(`${press}+j`);
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator(COUNT)).toHaveText('1');
});

/* =========================================================================================
 * Menus: the hint beside a command is the same component, and the item says so in ARIA.
 * ======================================================================================= */

test('a menu item carries its shortcut where assistive technology can read it', async ({ page }) => {
  await page.goto('/#/components/menu');
  await page.waitForTimeout(600);
  /* `.outline-trigger` is the site's own narrow-window table of contents, which is also a
     menu button and is the first one in the document. Scoped to the example instead. */
  await page.locator('#menu-basic').scrollIntoViewIfNeeded();
  await page.locator('#menu-basic button[aria-haspopup="menu"]').first().click();
  const item = page.locator('[role="menuitem"]:has(.lg-menu-shortcut)').first();
  await expect(item).toBeVisible();

  const keys = await item.getAttribute('aria-keyshortcuts');
  expect(keys, 'the shortcut is drawn beside the command but never announced').toBeTruthy();
  /* The glyphs themselves are `aria-hidden`: the item's name is the command, and a screen
     reader gets the keys from `aria-keyshortcuts` rather than from an unpronounceable
     character in the middle of the label. */
  await expect(item.locator('.lg-menu-shortcut')).toHaveAttribute('aria-hidden', 'true');
  // And it is a `Kbd`, so the glyph order is the platform's rather than whatever was typed.
  await expect(item.locator('.lg-menu-shortcut')).toHaveClass(/lg-kbd/);
});
