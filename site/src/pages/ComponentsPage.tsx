import { useMemo, useState } from 'react';
import { GlassSurface, Input } from '@ttq/liquid-glass-react';
import { COMPONENT_DOCS } from '../demos/registry';
import { SITE_COPY, useSiteLocale, useT } from '../site-i18n';

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

  return (
    <div className="site-container site-page">
      <div className="site-toolbar">
        <div>
          <h1 className="site-section__title">{t(SITE_COPY.componentsTitle)}</h1>
          <p className="site-section__subtitle" style={{ marginBottom: 0 }}>
            {t(SITE_COPY.componentsSubtitle)}
          </p>
        </div>
        <Input
          prefix="🔍"
          placeholder={t(SITE_COPY.searchPlaceholder)}
          aria-label={t(SITE_COPY.searchPlaceholder)}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <GlassSurface className="site-empty">{t(SITE_COPY.searchEmpty)}</GlassSurface>
      ) : (
        <div className="site-card-grid">
          {filtered.map((doc) => (
            <a
              key={doc.slug}
              className="site-card-link"
              href={`#/components/${doc.slug}`}
              data-testid={`component-card-${doc.slug}`}
            >
              <GlassSurface interactive className="site-card">
                <div className="site-card__preview" inert>
                  {doc.renderPreview()}
                </div>
                <h3>
                  {doc.name} {t(doc.title)}
                </h3>
                <p>{t(doc.description)}</p>
              </GlassSurface>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
