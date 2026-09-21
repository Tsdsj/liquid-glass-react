import { test, expect, type Page } from '@playwright/test';

/**
 * A palette is a combobox over a listbox with **virtual focus**, and most of these tests are
 * about that one sentence: real focus never leaves the field, so the next keystroke keeps
 * filtering while the arrow keys move a highlight that is named rather than focused.
 *
 * Nothing here assumes a platform. `mod` is Command on Apple hardware and Control everywhere
 * else, and Playwright's Chrome reports a Linux user agent — so the modifier is read off the
 * hint the page prints, the same way `shortcut.spec.ts` does it.
 */

/** The demo palette, which is the second one on the page: the first is the site's own ⌘K. */
const palette = (page: Page) => page.locator('.lg-palette', { has: page.locator('h2', { hasText: '命令' }) }).first();

async function openPalette(page: Page) {
  await page.goto('/#/components/command-palette');
  const demo = page.locator('#palette-basic');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '打开命令面板' }).click();
  const panel = palette(page);
  await expect(panel).toBeVisible();
  return panel;
}

const input = (panel: ReturnType<typeof palette>) => panel.locator('.lg-palette-input');
const highlighted = (panel: ReturnType<typeof palette>) => panel.locator('[role="option"][aria-selected="true"]');

/**
 * The ring has to go round something.
 *
 * It was on the field row, on the reading that the row is the container and the input has no
 * box of its own. Both halves of that are true; the conclusion was not, because the row has no
 * box of its own either — it is the top slab of the panel, full width, no radius. So the ring
 * came out as a hard rectangle with square corners whose top two were clipped away by the
 * panel's `overflow: hidden`, and whose bottom edge was a bright blue line straight across the
 * middle of the panel. Measured here rather than looked at: exactly one box wears the ring, it
 * is the panel's own box, and it has corners.
 */
test('the focus ring goes round the panel, not across the middle of it', async ({ page }) => {
  const panel = await openPalette(page);
  await expect(input(panel)).toBeFocused();
  /* After the entry animation, not during it. Measured mid-scale the panel is a few pixels
     narrower and a few higher than it will be, which is enough for a strip taken from those
     coordinates to miss the ring entirely — and the failure then reads as "no ring". */
  await panel.evaluate(node => Promise.all(node.getAnimations().map(animation =>
    animation.finished.catch(() => undefined))));

  const ringed = await panel.evaluate(node => {
    const painted = [node, ...node.querySelectorAll<HTMLElement>('*')].filter(element => {
      const style = getComputedStyle(element);
      return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
        && !/rgba\(0, 0, 0, 0\)|transparent/.test(style.outlineColor);
    });
    const panelBox = node.getBoundingClientRect();
    return painted.map(element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        what: element.className || element.tagName,
        height: Math.round(box.height), panelHeight: Math.round(panelBox.height),
        radius: Math.min(...[style.borderTopLeftRadius, style.borderTopRightRadius,
          style.borderBottomLeftRadius, style.borderBottomRightRadius].map(parseFloat)),
      };
    });
  });

  expect(ringed.length, `${ringed.length} boxes are wearing a focus ring`).toBe(1);
  expect(ringed[0].height, `the ring is ${ringed[0].height}px tall inside a ${ringed[0].panelHeight}px panel`)
    .toBe(ringed[0].panelHeight);
  expect(ringed[0].radius, 'the ring has square corners inside a rounded panel').toBeGreaterThan(8);

  /**
   * And it is on the screen, which the three assertions above cannot tell you.
   *
   * The first version of this fix drew the ring inside the panel and every one of those passed
   * — `getComputedStyle` reported a solid 2px accent outline the whole time, and not one pixel
   * of it was visible, because the panel's glass layers are positioned children and paint over
   * their parent's outline. Asking the stylesheet what it declared is not the same question as
   * asking the screen what it drew.
   */
  /* The whole viewport, cropped inside the page from the panel's own client rect. A `clip` on
     `page.screenshot` and a `getBoundingClientRect` do not agree about scrolling, and a strip
     taken from the wrong place is a strip with no ring in it either way. */
  const shot = (await page.screenshot()).toString('base64');
  const { accent, box } = await panel.evaluate(node => ({
    accent: getComputedStyle(node).outlineColor,
    box: { left: node.getBoundingClientRect().left, top: node.getBoundingClientRect().top,
      width: node.getBoundingClientRect().width },
  }));
  const hits = await page.evaluate(async ([data, colour, box]) => {
    const want = (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('2d')!;
    context.drawImage(bitmap, 0, 0);
    /* A band from just outside the top edge to just inside it, so the assertion does not depend
       on which side of the edge the ring is drawn — only on whether it is drawn. In device
       pixels: the screenshot is not necessarily one pixel per CSS pixel, and reading CSS
       coordinates out of a 2x bitmap samples the top-left corner of the page instead. */
    const scale = bitmap.width / window.innerWidth;
    const top = Math.max(0, Math.round((box.top - 8) * scale));
    const { data: px } = context.getImageData(Math.round(box.left * scale), top,
      Math.round(box.width * scale), Math.min(Math.round(16 * scale), bitmap.height - top));
    let near = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (Math.abs(px[i] - want[0]) + Math.abs(px[i + 1] - want[1]) + Math.abs(px[i + 2] - want[2]) < 90) near++;
    }
    return { near, of: px.length / 4 };
  }, [shot, accent, box] as const);
  expect(hits.near, `${accent} appears on ${hits.near} of ${hits.of} pixels across the panel's top edge`)
    .toBeGreaterThan(hits.of * 0.05);
});

test('focus stays in the field while the arrow keys move the highlight', async ({ page }) => {
  const panel = await openPalette(page);
  await expect(input(panel)).toBeFocused();
  await expect(highlighted(panel)).toHaveText(/新建文稿/);

  await page.keyboard.press('ArrowDown');
  await expect(highlighted(panel)).toHaveText(/打开…/);
  /* The whole point of virtual focus: this is what a hand-rolled listbox breaks, because
     moving real focus into the list means the next character never reaches the field. */
  await expect(input(panel), 'the arrow key took focus out of the field').toBeFocused();

  const active = await input(panel).getAttribute('aria-activedescendant');
  expect(active, 'the highlighted row is not named to a screen reader').toBeTruthy();
  await expect(panel.locator(`#${active}`)).toHaveAttribute('aria-selected', 'true');
});

test('typing filters, and the highlight lands on something that still exists', async ({ page }) => {
  const panel = await openPalette(page);
  /* Moved well down the list first: a highlight left where it was would now be pointing past
     the end of a shorter list, and `aria-activedescendant` would name a row nobody can see. */
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(highlighted(panel)).toHaveText(/显示侧边栏/);

  await input(panel).fill('深色');
  await expect(panel.locator('[role="option"]')).toHaveCount(1);
  await expect(highlighted(panel)).toHaveText(/切换深色外观/);
  const named = await input(panel).getAttribute('aria-activedescendant');
  await expect(panel.locator(`#${named}`)).toHaveCount(1);

  // Matched on `keywords`, which are searched and never drawn.
  await input(panel).fill('dark');
  await expect(highlighted(panel)).toHaveText(/切换深色外观/);
});

test('Return runs the highlighted command and closes', async ({ page }) => {
  const panel = await openPalette(page);
  await input(panel).fill('导出');
  await expect(highlighted(panel)).toHaveText(/导出为 PDF/);
  await page.keyboard.press('Enter');
  await expect(panel).toBeHidden();
  await expect(page.locator('#palette-last')).toHaveText('导出为 PDF');
});

test('a disabled command is drawn, highlighted by nothing, and cannot be run', async ({ page }) => {
  const panel = await openPalette(page);
  const publish = panel.locator('[role="option"]', { hasText: '发布' });
  await expect(publish).toBeVisible();
  await expect(publish).toHaveAttribute('aria-disabled', 'true');

  /* Six commands, the last one disabled: walking down five times from the first has to land
     back on the first rather than on the one that does nothing. */
  for (let step = 0; step < 5; step++) await page.keyboard.press('ArrowDown');
  await expect(highlighted(panel)).toHaveText(/新建文稿/);

  // Forced past the actionability check, because that check is one of the assertions:
  // Playwright refuses to click an `aria-disabled` element, and a real pointer will not care.
  await publish.click({ force: true });
  await expect(panel).toBeVisible();
  await expect(page.locator('#palette-last')).toHaveText('还没执行命令');
  /* And the press did not cost the field its focus. A press that lands on a row is still a
     press inside the palette, and if it took focus with it the next character would go
     nowhere — which is the whole thing this control is for. */
  await expect(input(panel)).toBeFocused();
});

test('nothing matching says so, and says what would', async ({ page }) => {
  const panel = await openPalette(page);
  await input(panel).fill('qqqq');
  await expect(panel.locator('[role="option"]')).toHaveCount(0);
  // The provider's own words, not the library's English default.
  await expect(panel.locator('.lg-palette-empty')).toHaveText('没有匹配的命令');
});

test('Escape closes and gives focus back to whatever opened it', async ({ page }) => {
  const panel = await openPalette(page);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.locator('#palette-basic').getByRole('button', { name: '打开命令面板' })).toBeFocused();
});

test('what was typed does not survive the panel closing', async ({ page }) => {
  const panel = await openPalette(page);
  await input(panel).fill('导出');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await page.locator('#palette-basic').getByRole('button', { name: '打开命令面板' }).click();
  await expect(input(panel)).toHaveValue('');
});

/**
 * The shortcut opens it, and the same keys close it.
 *
 * Two bindings rather than a toggle, and the reason is the rule: an application shortcut must
 * not fire while a modal is up. The one that closes the palette is scoped inside the dialog,
 * which is what makes it the exception.
 */
test('the shortcut the page prints opens the palette, and closes it again', async ({ page }) => {
  const panel = await openPalette(page);
  /* Which physical modifier `mod` is depends on the machine, so it is read off the page rather
     than assumed: this is the same resolution the binding used, which is the point of the two
     coming from one parse. Guessing here is how `shortcut.spec.ts` was wrong the first time. */
  const spoken = await panel.locator('.lg-palette-option-shortcut').first().getAttribute('aria-label');
  expect(spoken, 'the palette prints no shortcut at all').toBeTruthy();
  const press = spoken!.startsWith('Command') ? 'Meta' : 'Control';
  expect(spoken!.startsWith('Command') || spoken!.startsWith('Control'), `it reads "${spoken}"`).toBe(true);

  // Scoped inside the dialog, which is the exception to "a modal takes the keyboard with it".
  await page.keyboard.press(`${press}+j`);
  await expect(panel).toBeHidden();
  // And the unscoped one, which is the application's and only fires with no modal up.
  await page.keyboard.press(`${press}+j`);
  await expect(panel).toBeVisible();
});

test('shortcut={null} binds nothing at all', async ({ page }) => {
  await page.goto('/#/components/command-palette');
  const demo = page.locator('#palette-filter-demo');
  await demo.scrollIntoViewIfNeeded();
  const panel = page.locator('.lg-palette', { has: page.locator('h2', { hasText: '段落命令' }) });
  /* Both, so this does not depend on which one `mod` resolves to here. One of them is the
     documentation site's own ⌘K, which opens the site's palette — that is the point: the
     default combination is live on this page and still does not open this one. */
  await page.keyboard.press('Meta+k');
  await page.keyboard.press('Control+k');
  await expect(panel).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('.lg-palette[open]')).toHaveCount(0);

  await demo.getByRole('button', { name: '自己过滤' }).click();
  await expect(panel).toBeVisible();
});

test('filter={false} draws the list it was handed, in the order it was handed it', async ({ page }) => {
  await page.goto('/#/components/command-palette');
  const demo = page.locator('#palette-filter-demo');
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '自己过滤' }).click();
  const panel = page.locator('.lg-palette', { has: page.locator('h2', { hasText: '段落命令' }) });
  await expect(panel.locator('[role="option"]')).toHaveCount(5);

  await panel.locator('.lg-palette-input').fill('对齐');
  /* Three matches, and only because the caller's own filter produced them: the library's
     default would have been asked about the same query and is not running here. */
  await expect(panel.locator('[role="option"]')).toHaveCount(3);
  await expect(panel.locator('[role="option"]').first()).toHaveText('对齐左边');
});

/**
 * The half of that this test was always for: whatever wears the ring, only one thing does.
 *
 * It used to name the field row, because that is where the ring was — and the geometry test
 * above is why it is not there any more. Worth saying plainly: this test passed the whole time
 * the ring looked broken, because it asked which element had an outline and never asked what
 * shape that outline came out as.
 */
test('one thing wears the focus ring, not two', async ({ page }) => {
  const panel = await openPalette(page);
  await expect(input(panel)).toBeFocused();
  const rings = await panel.evaluate(node => [node, ...node.querySelectorAll('*')]
    .filter(element => getComputedStyle(element).outlineStyle !== 'none')
    .map(element => (element as HTMLElement).className));
  expect(rings.length, `rings on ${rings.join(', ') || 'nothing'}`).toBe(1);
  expect(rings[0]).toContain('lg-palette');
});
