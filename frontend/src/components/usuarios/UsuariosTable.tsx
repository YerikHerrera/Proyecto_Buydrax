export type UsuarioRow = {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol?: string | null;
  estado: boolean;
};

type Props = { rows: UsuarioRow[] };

export default function UsuariosTable({ rows }: Props) {
  return (
    <div style={{ overflowX: "auto", marginTop: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
            <th style={{ padding: 10 }}>Nombre</th>
            <th style={{ padding: 10 }}>Correo</th>
            <th style={{ padding: 10 }}>Rol</th>
            <th style={{ padding: 10 }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 24, color: "#94a3b8", textAlign: "center" }}>No hay usuarios o el endpoint no devolvió datos.</td></tr>
          ) : (
            rows.map((u) => (
              <tr key={u.id_usuario} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: 10 }}>{u.nombres} {u.apellidos}</td>
                <td style={{ padding: 10 }}>{u.correo}</td>
                <td style={{ padding: 10 }}>{u.rol || "—"}</td>
                <td style={{ padding: 10 }}>{u.estado ? "Activo" : "Inactivo"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
