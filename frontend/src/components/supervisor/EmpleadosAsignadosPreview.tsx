import type { FilaPersonal } from '../../data/mockReportes';

export default function EmpleadosAsignadosPreview({
  empleados
}: {
  empleados: FilaPersonal[];
}) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
            <th style={{ padding: 10 }}>Nombre</th>
            <th style={{ padding: 10 }}>Documento</th>
            <th style={{ padding: 10 }}>Cargo / especialidad</th>
            <th style={{ padding: 10 }}>Proyecto</th>
            <th style={{ padding: 10 }}>Supervisor</th>
            <th style={{ padding: 10 }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: 10, fontWeight: 600 }}>{e.nombre}</td>
              <td style={{ padding: 10 }}>{e.documento}</td>
              <td style={{ padding: 10 }}>{e.cargo}</td>
              <td style={{ padding: 10 }}>{e.proyecto}</td>
              <td style={{ padding: 10 }}>{e.supervisor}</td>
              <td style={{ padding: 10 }}>{e.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
