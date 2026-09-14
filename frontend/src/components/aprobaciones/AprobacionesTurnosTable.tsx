export type Turno = {
  id_turno: number;
  id_empleado: number;
  id_proyecto: number;
  tipo_turno: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
};

export default function AprobacionesTurnosTable({
  rows,
  nombres,
}: {
  rows: Turno[];
  nombres: Record<number, string>;
}) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 13,
      }}
    >
      <thead>
        <tr
          style={{
            borderBottom: '2px solid #e2e8f0',
            textAlign: 'left',
          }}
        >
          {['Empleado', 'Proyecto', 'Tipo', 'Fecha', 'Horario'].map((h) => (
            <th key={h} style={{ padding: 8 }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((t) => (
          <tr
            key={t.id_turno}
            style={{ borderBottom: '1px solid #f1f5f9' }}
          >
            <td style={{ padding: 8 }}>
              {nombres[t.id_empleado] || `#${t.id_empleado}`}
            </td>
            <td style={{ padding: 8 }}>#{t.id_proyecto}</td>
            <td style={{ padding: 8 }}>{t.tipo_turno}</td>
            <td style={{ padding: 8 }}>{t.fecha}</td>
            <td style={{ padding: 8 }}>
              {t.hora_inicio} – {t.hora_fin}
            </td>
          </tr>
        ))}
        {!rows.length && (
          <tr>
            <td
              colSpan={5}
              style={{ padding: 16, color: '#94a3b8' }}
            >
              Sin turnos
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
