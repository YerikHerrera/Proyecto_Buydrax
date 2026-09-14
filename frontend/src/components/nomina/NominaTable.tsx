export type NominaRow = {
  id_nomina: number;
  periodo_inicio: string;
  periodo_fin: string;
  tipo_nomina: string;
  estado_nomina: string;
  total_pagado?: number;
  cantidad_empleados?: number;
};

export default function NominaTable({ rows }: { rows: NominaRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
            {['ID', 'Periodo', 'Tipo', 'Estado', 'Empleados', 'Total'].map((h) => (
              <th key={h} style={{ padding: 10 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}
              >
                No hay nóminas o el endpoint no respondió datos.
              </td>
            </tr>
          ) : (
            rows.map((n) => (
              <tr key={n.id_nomina} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 10 }}>{n.id_nomina}</td>
                <td style={{ padding: 10 }}>
                  {n.periodo_inicio} → {n.periodo_fin}
                </td>
                <td style={{ padding: 10 }}>{n.tipo_nomina}</td>
                <td style={{ padding: 10 }}>{n.estado_nomina}</td>
                <td style={{ padding: 10 }}>{n.cantidad_empleados ?? '—'}</td>
                <td style={{ padding: 10 }}>
                  {n.total_pagado != null
                    ? Number(n.total_pagado).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        maximumFractionDigits: 0
                      })
                    : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
