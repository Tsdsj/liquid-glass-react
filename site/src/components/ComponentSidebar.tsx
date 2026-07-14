import { useState } from 'react';
import type { LiquidGlassLocale } from '@ttq/liquid-glass-react';
import { COMPONENT_DOCS } from '../demos/registry';
import type { ComponentDoc } from '../demos/types';
import { SITE_COPY, useSiteLocale, useT } from '../site-i18n';

export interface ComponentGroup {
  id: string;
  title: string;
  docs: ComponentDoc[];
}

export function getComponentGroups(locale: LiquidGlassLocale): ComponentGroup[] {
  const groups: ComponentGroup[] = [];

  for (const doc of COMPONENT_DOCS) {
    const categoryKey = doc.category['en-US'];
    let group = groups.find((item) => item.id === categoryKey);

    if (!group) {
      group = {
        id: categoryKey,
        title: doc.category[locale],
        docs: [],
      };
      groups.push(group);
    }

    group.docs.push(doc);
  }

  return groups;
}

export interface ComponentSidebarProps {
  activeSlug?: string;
}

export function ComponentSidebar({ activeSlug }: ComponentSidebarProps) {
  const t = useT();
  const locale = useSiteLocale();
  const groups = getComponentGroups(locale);
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className="site-docs-sidebar"
      aria-label={t(SITE_COPY.componentsTitle)}
      data-expanded={expanded ? '' : undefined}
    >
      <a
        className="site-docs-sidebar__overview"
        href="#/components"
        data-active={activeSlug === undefined ? '' : undefined}
      >
        {t(SITE_COPY.overviewLabel)}
      </a>
      <button
        className="site-docs-sidebar__toggle"
        type="button"
        aria-controls="site-component-navigation-groups"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? t(SITE_COPY.hideComponentNav) : t(SITE_COPY.showComponentNav)}
      </button>
      <div id="site-component-navigation-groups" className="site-docs-sidebar__groups">
        {groups.map((group) => (
          <section key={group.id} className="site-docs-sidebar__group">
            <h2 className="site-docs-sidebar__group-title">{group.title}</h2>
            <div className="site-docs-sidebar__links">
              {group.docs.map((doc) => (
                <a
                  key={doc.slug}
                  className="site-docs-sidebar__link"
                  href={`#/components/${doc.slug}`}
                  data-active={doc.slug === activeSlug ? '' : undefined}
                >
                  <span className="site-docs-sidebar__name">{doc.name}</span>
                  <span className="site-docs-sidebar__translation">{t(doc.title)}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
