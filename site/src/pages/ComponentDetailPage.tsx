import { Fragment } from 'react';
import { Button, GlassSurface } from '@ttq/liquid-glass-react';
import { DemoBlock } from '../components/DemoBlock';
import { PropsTable } from '../components/PropsTable';
import { COMPONENT_DOCS, findComponentDoc } from '../demos/registry';
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
        <GlassSurface className="site-empty">
          <p>{t(SITE_COPY.notFoundTitle)}</p>
          <Button
            onClick={() => {
              window.location.hash = '#/components';
            }}
          >
            {t(SITE_COPY.backToOverview)}
          </Button>
        </GlassSurface>
      </div>
    );
  }

  return (
    <div className="site-container site-page site-detail">
      <GlassSurface as="nav" className="site-detail__menu" aria-label={t(SITE_COPY.componentsTitle)}>
        {COMPONENT_DOCS.map((item) => (
          <a
            key={item.slug}
            className="site-detail__menu-link"
            href={`#/components/${item.slug}`}
            data-active={item.slug === doc.slug ? '' : undefined}
          >
            {item.name} {t(item.title)}
          </a>
        ))}
      </GlassSurface>

      <article>
        <header className="site-detail__header">
          <h1>
            {doc.name} {t(doc.title)}
          </h1>
          <p>{t(doc.description)}</p>
        </header>

        <h2>{t(SITE_COPY.demosTitle)}</h2>
        {doc.demos.map((demo) => (
          <DemoBlock key={demo.id} title={demo.title} description={demo.description} code={demo.code}>
            {demo.render()}
          </DemoBlock>
        ))}

        <h2>{t(SITE_COPY.apiTitle)}</h2>
        {doc.api.map((section) => (
          <Fragment key={section.title}>
            <PropsTable title={section.title} rows={section.rows} />
            <div style={{ height: 16 }} />
          </Fragment>
        ))}
      </article>
    </div>
  );
}
