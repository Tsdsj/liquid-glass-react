import { Page } from '../site/page.js';
import { Markdown } from '../site/markdown.js';

/**
 * The repository's own CHANGELOG.md, inlined at build time.
 *
 * Readers had to go to GitHub to find out what changed, and the release notes on a tag are
 * already this file's matching section — so putting a second, hand-written account on the site
 * would give the same release two descriptions. There is one, and this renders it.
 */
export function ChangelogPage() {
  // Drop the file's own `# Changelog` title: the page already has a heading.
  const body = __LG_CHANGELOG__.replace(/^#\s+.*\n+/, '');
  return <Page title="更新日志" lede="每个版本改了什么、修了什么，以及还没做的。">
    <Markdown source={body} />
  </Page>;
}
