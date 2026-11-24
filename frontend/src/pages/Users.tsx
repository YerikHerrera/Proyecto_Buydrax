import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import UsuariosTable, { type UsuarioRow } from "../components/usuarios/UsuariosTable";
import { apiRequest } from "../services/apiClient";

export default function Users() {
  const [rows, setRows] = useState<UsuarioRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiRequest<UsuarioRow[] | { items: UsuarioRow[] }>("/usuarios");
        setRows(Array.isArray(data) ? data : data.items || []);
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
        {!loading && !error && <UsuariosTable rows={rows} />}
      </div>
    </AppShell>
  );
}
