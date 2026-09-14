export type Asistencia = {
  id_asistencia: number;
  id_empleado: number;
  fecha: string;
  hora_entrada: string;
  hora_salida?: string | null;
  estado_asistencia: string;
};

export default function AprobacionesAsistenciaTable({
  rows,
  nombres,
}: {
  rows: Asistencia[];
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
          {['Empleado', 'Fecha', 'Entrada', 'Salida', 'Estado'].map((h) => (
            <th key={h} style={{ padding: 8 }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((a) => (
          <tr
            key={a.id_asistencia}
            style={{ borderBottom: '1px solid #f1f5f9' }}
          >
            <td style={{ padding: 8 }}>
              {nombres[a.id_empleado] || `#${a.id_empleado}`}
            </td>
            <td style={{ padding: 8 }}>{a.fecha}</td>
            <td style={{ padding: 8 }}>{a.hora_entrada}</td>
            <td style={{ padding: 8 }}>{a.hora_salida || '—'}</td>
            <td style={{ padding: 8 }}>{a.estado_asistencia}</td>
          </tr>
        ))}
        {!rows.length && (
          <tr>
            <td
              colSpan={5}
              style={{ padding: 16, color: '#94a3b8' }}
            >
              Sin asistencias
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
