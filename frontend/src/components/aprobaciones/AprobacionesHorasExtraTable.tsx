export type HoraExtra = {
  id_hora_extra: number;
  id_empleado: number;
  motivo: string;
  fecha_inicio: string;
  fecha_fin: string;
  cantidad_horas: number;
  tipo_hora: string;
  estado_he: string;
};

export default function AprobacionesHorasExtraTable({
  rows,
  nombres,
  onDecidir,
}: {
  rows: HoraExtra[];
  nombres: Record<number, string>;
  onDecidir: (
    id: number,
    estado: 'APROBADA' | 'RECHAZADA'
  ) => void;
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
          {['Empleado', 'Motivo', 'Horas', 'Estado', 'Acciones'].map((h) => (
            <th key={h} style={{ padding: 8 }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((h) => (
          <tr
            key={h.id_hora_extra}
            style={{ borderBottom: '1px solid #f1f5f9' }}
          >
            <td style={{ padding: 8 }}>
              {nombres[h.id_empleado] || `#${h.id_empleado}`}
            </td>
            <td style={{ padding: 8 }}>{h.motivo}</td>
            <td style={{ padding: 8 }}>
              {h.cantidad_horas} ({h.tipo_hora})
            </td>
            <td style={{ padding: 8 }}>{h.estado_he}</td>
            <td
              style={{
                padding: 8,
                display: 'flex',
                gap: 6,
              }}
            >
              {h.estado_he === 'PENDIENTE' && (
                <>
                  <button
                    type="button"
                    className="agregar-btn-primario"
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                    }}
                    onClick={() =>
                      onDecidir(h.id_hora_extra, 'APROBADA')
                    }
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="agregar-btn-secundario"
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                    }}
                    onClick={() =>
                      onDecidir(h.id_hora_extra, 'RECHAZADA')
                    }
                  >
                    Rechazar
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
        {!rows.length && (
          <tr>
            <td
              colSpan={5}
              style={{ padding: 16, color: '#94a3b8' }}
            >
              Sin registros de horas extras
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
