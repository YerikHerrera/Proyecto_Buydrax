import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { apiRequest } from "../services/apiClient";

type UsuarioRow = {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol?: string | null;
  estado: boolean;
};

export default function Users() {
  const [rows, setRows] = useState<UsuarioRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // GET /usuarios (paginado o lista según backend)
        const data = await apiRequest<UsuarioRow[] | { items: UsuarioRow[] }>("/usuarios");
        const list = Array.isArray(data) ? data : data.items || [];
        setRows(list);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "No se pudieron cargar usuarios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Usuarios" }]} />
      <div className="page-card">
        <h1 className="page-title">Usuarios del sistema</h1>
        <p className="page-subtitle">Cuentas de acceso (roles ADMIN_RRHH, SUPERVISOR, CONTADOR, EMPLEADO).</p>
        {loading && <p style={{ marginTop: 16 }}>Cargando…</p>}
        {error && <p style={{ marginTop: 16, color: "#b00020" }}>{error}</p>}
        {!loading && !error && (
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
                  <tr>
                    <td colSpan={4} style={{ padding: 24, color: "#94a3b8", textAlign: "center" }}>
                      No hay usuarios o el endpoint no devolvió datos.
                    </td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr key={u.id_usuario} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: 10 }}>
                        {u.nombres} {u.apellidos}
                      </td>
                      <td style={{ padding: 10 }}>{u.correo}</td>
                      <td style={{ padding: 10 }}>{u.rol || "—"}</td>
                      <td style={{ padding: 10 }}>{u.estado ? "Activo" : "Inactivo"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
