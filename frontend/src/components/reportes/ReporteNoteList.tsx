export type Reporte = {
  id: number;
  nombre: string;
  proyecto: string;
  tipo: string;
  fecha: string;
  descripcion: string;
};

export default function ReporteNoteList({
  reportes,
  onEliminar
}: {
  reportes: Reporte[];
  onEliminar: (id: number) => void;
}) {
  if (!reportes.length) {
    return (
      <p style={{ color: '#94a3b8', marginTop: 12 }}>
        Aún no hay reportes guardados en este navegador.
      </p>
    );
  }

  return (
    <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
      {reportes.map((r) => (
        <li
          key={r.id}
          style={{
            padding: 12,
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <strong>{r.nombre}</strong> · {r.tipo} · {r.proyecto}
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {r.fecha} — {r.descripcion}
            </div>
          </div>
          <button
            type="button"
            className="agregar-btn-secundario btn-cancel-hover"
            onClick={() => onEliminar(r.id)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
