import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import logo from "../assets/logoo.png";
import "../styles/Dashboard.css";
import { getDashboard, type DashboardData } from "../services/dashboardService";
import { esAdminRrhh, leerSesion } from "../services/session";

const CARDS = [
  { titulo: "Personal activo", path: "/empleados", color: "#ef4444", key: "empleados" as const },
  { titulo: "Obras en curso", path: "/proyectos", color: "#f59e0b", key: "proyectos" as const },
  { titulo: "Nómina", path: "/nomina", color: "#ef4444", key: "nominas" as const },
  { titulo: "Asistencia", path: "/asistencia", color: "#f59e0b", key: "asistencia" as const },
  { titulo: "Horas extras", path: "/asistencia/reporte", color: "#ef4444", key: "he" as const },
  { titulo: "Reportes", path: "/reportes", color: "#f59e0b", key: "reportes" as const },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard")
      );
  }, []);

  const desc = (key: (typeof CARDS)[number]["key"]) => {
    if (!stats) return "Cargando…";
    switch (key) {
      case "empleados":
        return `${stats.empleados_activos} activos`;
      case "proyectos":
        return `${stats.proyectos_activos} proyectos`;
      case "nominas":
        return `${stats.nominas_borrador} en borrador`;
      case "asistencia":
        return `${stats.novedades_pendientes} novedades pend.`;
      case "he":
        return `${stats.horas_extra_pendientes} pendientes`;
      default:
        return "Indicadores y seguimiento";
    }
  };

  return (
    <AppShell mainClassName="dashboard-main">
      {(() => {
        const s = leerSesion();
        const admin = esAdminRrhh();
        return (
          <div style={{
            marginBottom: 16, padding: "12px 16px", borderRadius: 12,
            background: admin ? "#ecfdf5" : "#fff7ed",
            border: `1px solid ${admin ? "#a7f3d0" : "#fed7aa"}`,
            fontSize: 14, color: "#0f172a",
          }}>
            {admin ? (
              <>Sesión <strong>ADMIN_RRHH</strong> — tienes acceso completo de gestión.</>
            ) : (
              <>
                Hola <strong>{s?.nombre || "usuario"}</strong>
                {s?.rol ? ` (${s.rol})` : ""}. Tu rol no es administrador de RRHH:
                verás el panel informativo; altas/ediciones de personal y algunas
                configuraciones quedan reservadas a <strong>ADMIN_RRHH</strong>.
                Los supervisores pueden validar asistencia y horas extras desde el menú Asistencia.
              </>
            )}
          </div>
        );
      })()}
      <div className="dashboard-hero">
        <img src={logo} alt="Buydrax" />
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#f59e0b", margin: "0 0 6px" }}>
          Panel principal
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", color: "#0f172a" }}>
          ¡Bienvenido a Buydrax!
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Gestión de personal y operaciones para el sector construcción
        </p>
      </div>

      {error && <p style={{ color: "#b00020", marginBottom: 16 }}>{error}</p>}

      {stats && (
        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <span>Empleados activos</span>
            <strong>{stats.empleados_activos}</strong>
          </div>
          <div className="dashboard-stat">
            <span>Proyectos activos</span>
            <strong>{stats.proyectos_activos}</strong>
          </div>
          <div className="dashboard-stat">
            <span>Horas extra pend.</span>
            <strong>{stats.horas_extra_pendientes}</strong>
          </div>
          <div className="dashboard-stat">
            <span>Novedades pend.</span>
            <strong>{stats.novedades_pendientes}</strong>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {CARDS.map((item) => (
          <Link
            key={item.path + item.titulo}
            to={item.path}
            className="dashboard-card"
            style={{ borderTop: `3px solid ${item.color}` }}
          >
            <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", margin: "0 0 6px" }}>
              {item.titulo}
            </p>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.45 }}>
              {desc(item.key)}
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
