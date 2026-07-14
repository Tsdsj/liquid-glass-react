import { Button } from '@ttq/liquid-glass-react';
import { ComponentSidebar } from '../components/ComponentSidebar';
import { DemoBlock } from '../components/DemoBlock';
import { PropsTable } from '../components/PropsTable';
import { findComponentDoc } from '../demos/registry';
import { SITE_COPY, useT } from '../site-i18n';

export interface ComponentDetailPageProps {
  slug: string;
}

export function ComponentDetailPage({ slug }: ComponentDetailPageProps) {
  const t = useT();
  const doc = findComponentDoc(slug);

  if (!doc) {
    return (
      <div className="site-container site-page">
        <div className="site-empty">
          <p>{t(SITE_COPY.notFoundTitle)}</p>
          <Button
            onClick={() => {
              window.location.hash = '#/components';
            }}
          >
            {t(SITE_COPY.backToOverview)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-container site-page site-docs-layout">
      <ComponentSidebar activeSlug={doc.slug} />

      <article className="site-docs-content site-detail">
        <header className="site-page-header site-detail__header">
          <div className="site-breadcrumb">
            <a className="site-breadcrumb__link" href="#/components">
              {t(SITE_COPY.componentsTitle)}
            </a>
            <span className="site-breadcrumb__separator" aria-hidden="true">
              /
            </span>
            <span className="site-breadcrumb__current">{doc.name}</span>
          </div>
          <h1 className="site-detail__title">
            {doc.name} {t(doc.title)}
          </h1>
          <p className="site-page-header__description">{t(doc.description)}</p>
        </header>

        <section className="site-detail__section" aria-labelledby="examples-title">
          <h2 id="examples-title" className="site-detail__section-title">
            {t(SITE_COPY.demosTitle)}
          </h2>
          {doc.demos.map((demo) => (
            <DemoBlock key={demo.id} title={demo.title} description={demo.description} code={demo.code}>
              {demo.render()}
            </DemoBlock>
          ))}
        </section>

        <section className="site-detail__section" aria-labelledby="api-title">
          <h2 id="api-title" className="site-detail__section-title">
            {t(SITE_COPY.apiTitle)}
          </h2>
          <div className="site-api-stack">
            {doc.api.map((section) => (
              <PropsTable key={section.title} title={section.title} rows={section.rows} />
            ))}
          </div>
        </section>
      </article>

      <nav className="site-page-toc" aria-label={t(SITE_COPY.onThisPage)}>
        <span className="site-page-toc__title">{t(SITE_COPY.onThisPage)}</span>
        <button
          className="site-page-toc__link"
          type="button"
          onClick={() => {
            document.getElementById('examples-title')?.scrollIntoView({ block: 'start' });
          }}
        >
          {t(SITE_COPY.demosTitle)}
        </button>
        <button
          className="site-page-toc__link"
          type="button"
          onClick={() => {
            document.getElementById('api-title')?.scrollIntoView({ block: 'start' });
          }}
        >
          {t(SITE_COPY.apiTitle)}
        </button>
      </nav>
    </div>
  );
}
