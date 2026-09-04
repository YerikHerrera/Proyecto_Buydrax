import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AppShell from "./layout/AppShell";
import { esAdminRrhh, esAdminOSupervisor, leerSesion, rolActual } from "../services/session";

type Props = {
  children: ReactNode;
  /** admin = solo ADMIN_RRHH; aprobar = ADMIN o SUPERVISOR */
  require?: "admin" | "aprobar";
};

export default function RoleGate({ children, require = "admin" }: Props) {
  const ok =
    require === "admin" ? esAdminRrhh() : esAdminOSupervisor();

  if (ok) return <>{children}</>;

  const sesion = leerSesion();
  return (
    <AppShell>
      <div className="page-card" style={{ maxWidth: 560 }}>
        <h1 className="page-title">Acceso restringido</h1>
        <p className="page-subtitle">
          Estás autenticado como <strong>{sesion?.nombre || "Usuario"}</strong>
          {sesion?.rol ? ` (${sesion.rol})` : ""}.
        </p>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          {require === "admin" ? (
            <>
              Esta función es solo para el rol <strong>ADMIN_RRHH</strong>.
              Con tu perfil actual puedes consultar el panel y, según tu rol,
              registrar asistencia u otras tareas operativas, pero no gestionar
              alta/edición masiva de personal o nómina de administración.
            </>
          ) : (
            <>
              Solo <strong>ADMIN_RRHH</strong> o <strong>SUPERVISOR</strong> pueden
              validar asistencias, turnos y horas extras.
            </>
          )}
        </p>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>Rol detectado: {rolActual() || "—"}</p>
        <Link to="/dashboard" className="agregar-btn-primario" style={{ display: "inline-block", marginTop: 12, textDecoration: "none" }}>
          Volver al inicio
        </Link>
      </div>
    </AppShell>
  );
}
