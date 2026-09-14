import { Text } from '@liquid-glass-ui/react';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

/**
 * Hand-authored rows mirroring the TypeScript interfaces. Deliberately not generated at
 * runtime: reflection would ship the type metadata to every visitor and still could not
 * explain *why* a prop exists, which is the part worth reading.
 */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  if (rows.length === 0) return null;
  return <div className="props-table-wrap">
    <table className="props-table">
      <caption className="lg-visually-hidden">组件属性</caption>
      <thead><tr>
        <th scope="col">属性</th><th scope="col">类型</th><th scope="col">默认值</th><th scope="col">说明</th>
      </tr></thead>
      <tbody>
        {rows.map(row => <tr key={row.name}>
          <th scope="row">
            <code>{row.name}</code>
            {row.required && <Text as="span" variant="caption2" tone="destructive" className="props-required">必填</Text>}
          </th>
          <td><code className="props-type">{row.type}</code></td>
          <td>{row.default ? <code>{row.default}</code> : <span aria-hidden="true">—</span>}</td>
          <td>{row.description}</td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}
