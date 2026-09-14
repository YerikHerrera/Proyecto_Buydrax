export type SupervisorRow = {
  id_supervisor: number;
  numero_tarjeta_profesional: string;
  cuadrilla_asignada?: string | null;
};

export default function SupervisoresTable({
  items,
  proyectos
}: {
  items: SupervisorRow[];
  proyectos: { id_supervisor?: number | null; nombre: string }[];
}) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 4 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#fff7ed', textAlign: 'left' }}>
            <th style={{ padding: 10, color: '#9a3412' }}>ID</th>
            <th style={{ padding: 10, color: '#9a3412' }}>Tarjeta profesional</th>
            <th style={{ padding: 10, color: '#9a3412' }}>Cuadrilla</th>
            <th style={{ padding: 10, color: '#9a3412' }}>Proyectos (ref.)</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}
              >
                Sin supervisores con los filtros actuales o sin respuesta de la
                API.
              </td>
            </tr>
          ) : (
            items.map((s) => {
              const names = proyectos
                .filter((p) => Number(p.id_supervisor) === s.id_supervisor)
                .map((p) => p.nombre)
                .join(', ');

              return (
                <tr
                  key={s.id_supervisor}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <td style={{ padding: 10 }}>#{s.id_supervisor}</td>
                  <td style={{ padding: 10 }}>{s.numero_tarjeta_profesional}</td>
                  <td style={{ padding: 10 }}>{s.cuadrilla_asignada || '—'}</td>
                  <td style={{ padding: 10 }}>{names || '—'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
