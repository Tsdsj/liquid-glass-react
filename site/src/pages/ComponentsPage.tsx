import { useMemo, useState } from 'react';
import { Input } from '@ttqtt/liquid-glass-react';
import { ComponentSidebar, getComponentGroups } from '../components/ComponentSidebar';
import { COMPONENT_DOCS } from '../demos/registry';
import { getComponentsSubtitle, SITE_COPY, useSiteLocale, useT } from '../site-i18n';
import { PHOTO_WALLPAPER } from '../wallpaper';

function toGroupId(groupName: string): string {
  return `component-group-${groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function ComponentsPage() {
  const t = useT();
  const locale = useSiteLocale();
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) {
      return COMPONENT_DOCS;
    }
    return COMPONENT_DOCS.filter((doc) =>
      [doc.name, doc.title['zh-CN'], doc.title['en-US'], doc.category[locale]]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [keyword, locale]);

  const groups = useMemo(() => {
    const visibleSlugs = new Set(filtered.map((doc) => doc.slug));
    return getComponentGroups(locale)
      .map((group) => ({
        ...group,
        docs: group.docs.filter((doc) => visibleSlugs.has(doc.slug)),
      }))
      .filter((group) => group.docs.length > 0);
  }, [filtered, locale]);

  return (
    <div className="site-container site-page site-docs-layout">
      <ComponentSidebar />

      <div className="site-docs-content">
        <header className="site-page-header">
          <span className="site-page-kicker">{t(SITE_COPY.brand)}</span>
          <h1 className="site-section__title">{t(SITE_COPY.componentsTitle)}</h1>
          <p className="site-page-header__description">
            {t(getComponentsSubtitle(COMPONENT_DOCS.length))}
          </p>
          <Input
            className="site-components-search"
            size="lg"
            prefix={
              <span className="site-components-search__icon" aria-hidden="true">
                ⌕
              </span>
            }
            placeholder={t(SITE_COPY.searchPlaceholder)}
            aria-label={t(SITE_COPY.searchPlaceholder)}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </header>

        {filtered.length === 0 ? (
          <div className="site-empty" role="status">
            {t(SITE_COPY.searchEmpty)}
          </div>
        ) : (
          <div className="site-component-groups">
            {groups.map((group) => (
              <section key={group.id} id={toGroupId(group.id)} className="site-component-group">
                <h2 className="site-component-group__title">{group.title}</h2>
                <div className="site-card-grid">
                  {group.docs.map((doc) => (
                    <article
                      key={doc.slug}
                      className="site-card"
                      data-testid={`component-card-${doc.slug}`}
                    >
                      <div
                        className="site-card__preview"
                        style={{ backgroundImage: PHOTO_WALLPAPER }}
                        inert
                      >
                        {doc.renderPreview()}
                      </div>
                      <div className="site-card__body">
                        <h3 className="site-card__title">
                          <a className="site-card__link" href={`#/components/${doc.slug}`}>
                            {doc.name}{' '}
                            <span className="site-card__translation">{t(doc.title)}</span>
                          </a>
                        </h3>
                        <p className="site-card__description">{t(doc.description)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <nav className="site-page-toc" aria-label={t(SITE_COPY.onThisPage)}>
        <span className="site-page-toc__title">{t(SITE_COPY.onThisPage)}</span>
        {groups.map((group) => (
          <button
            key={group.id}
            className="site-page-toc__link"
            type="button"
            onClick={() => {
              document.getElementById(toGroupId(group.id))?.scrollIntoView({ block: 'start' });
            }}
          >
            {group.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
