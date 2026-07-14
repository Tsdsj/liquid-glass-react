import { GlassSurface } from '@ttq/liquid-glass-react';
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
    <GlassSurface className="site-table-wrap">
      {title ? <h3 style={{ margin: '8px 12px' }}>{title}</h3> : null}
      <table className="site-table">
        <thead>
          <tr>
            <th>{t(SITE_COPY.propColumn)}</th>
            <th>{t(SITE_COPY.typeColumn)}</th>
            <th>{t(SITE_COPY.defaultColumn)}</th>
            <th>{t(SITE_COPY.descColumn)}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop}>
              <td>
                <code>{row.prop}</code>
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.defaultValue ? <code>{row.defaultValue}</code> : '-'}</td>
              <td>{t(row.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassSurface>
  );
}
