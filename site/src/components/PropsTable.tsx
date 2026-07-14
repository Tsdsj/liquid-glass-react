import { SITE_COPY, useT, type Bilingual } from '../site-i18n';

export interface PropRow {
  prop: string;
  type: string;
  defaultValue?: string;
  description: Bilingual;
}

export interface PropsTableProps {
  title?: string;
  rows: PropRow[];
}

export function PropsTable({ title, rows }: PropsTableProps) {
  const t = useT();

  return (
    <section className="site-table-section">
      {title ? <h3 className="site-table-section__title">{title}</h3> : null}
      <div className="site-table-wrap">
        <table className="site-table">
          <thead>
            <tr>
              <th className="site-table__head">{t(SITE_COPY.propColumn)}</th>
              <th className="site-table__head">{t(SITE_COPY.typeColumn)}</th>
              <th className="site-table__head">{t(SITE_COPY.defaultColumn)}</th>
              <th className="site-table__head">{t(SITE_COPY.descColumn)}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.prop}>
                <td className="site-table__cell">
                  <code className="site-inline-code">{row.prop}</code>
                </td>
                <td className="site-table__cell">
                  <code className="site-inline-code">{row.type}</code>
                </td>
                <td className="site-table__cell">
                  {row.defaultValue ? (
                    <code className="site-inline-code">{row.defaultValue}</code>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="site-table__cell">{t(row.description)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
