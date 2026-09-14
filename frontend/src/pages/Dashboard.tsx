import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import logo from "../assets/logoo.png";
import "../styles/Dashboard.css";
import { getDashboard, type DashboardData } from "../services/dashboardService";
import {
  esAdminRrhh,
  esContador,
  esEmpleado,
  esSupervisor,
  etiquetaRol,
  leerSesion,
  menuPermitidoPorRol,
} from "../services/session";

type CardDef = {
  titulo: string;
  path: string;
  color: string;
  icon: string;
  desc: string;
  roles: ("admin" | "supervisor" | "contador" | "empleado")[];
};

const ALL_CARDS: CardDef[] = [
  {
    titulo: "Personal activo",
    path: "/reportes/personal",
    color: "#ef4444",
    icon: "bi-people-fill",
    desc: "Reporte por proyecto, nombre, cargo y estado",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Obras en curso",
    path: "/reportes/proyectos",
    color: "#f59e0b",
    icon: "bi-building",
    desc: "Listado y avance de proyectos",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Nómina",
    path: "/nomina",
    color: "#ea580c",
    icon: "bi-cash-stack",
    desc: "Panel, resúmenes y generación",
    roles: ["admin", "contador"],
  },
  {
    titulo: "Asistencia",
    path: "/reportes/asistencia",
    color: "#f97316",
    icon: "bi-calendar-check",
    desc: "Reporte general por proyecto",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Horas extras",
    path: "/reportes/horas-extra",
    color: "#dc2626",
    icon: "bi-clock-history",
    desc: "Reporte filtrable por proyecto y empleado",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Turnos",
    path: "/reportes/turnos",
    color: "#c2410c",
    icon: "bi-alarm",
    desc: "Turnos asignados por proyecto",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Reportes",
    path: "/reportes",
    color: "#b45309",
    icon: "bi-bar-chart-fill",
    desc: "Centro de reportes y exportaciones",
    roles: ["admin", "supervisor", "contador"],
  },
  {
    titulo: "Registrar asistencia",
    path: "/asistencia",
    color: "#ea580c",
    icon: "bi-pencil-square",
    desc: "Captura de entrada / salida",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Asignar turnos",
    path: "/asistencia/turno",
    color: "#f59e0b",
    icon: "bi-calendar-plus",
    desc: "Asignación de turnos a empleados",
    roles: ["admin", "supervisor"],
  },
  {
    titulo: "Mi portal",
    path: "/portal",
    color: "#f97316",
    icon: "bi-person-badge",
    desc: "Pagos, préstamos y solicitudes",
    roles: ["empleado"],
  },
];

function roleKey(): "admin" | "supervisor" | "contador" | "empleado" {
  if (esAdminRrhh()) return "admin";
  if (esSupervisor()) return "supervisor";
  if (esContador()) return "contador";
  return "empleado";
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const sesion = leerSesion();
  const admin = esAdminRrhh();
  const rk = roleKey();
  const perms = menuPermitidoPorRol();

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard")
      );
  }, []);

  const cards = ALL_CARDS.filter((c) => c.roles.includes(rk));

  return (
    <AppShell mainClassName="dashboard-main">
      <div
        style={{
          marginBottom: 16,
          padding: "12px 16px",
          borderRadius: 12,
          background: admin ? "linear-gradient(90deg, #fffbeb, #fef3c7)" : "#fff7ed",
          border: `1px solid ${admin ? "#fbbf24" : "#fed7aa"}`,
          fontSize: 14,
          color: "#0f172a",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {admin ? (
          <>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.8,
                color: "#78350f",
                background: "linear-gradient(135deg, #fde68a, #f59e0b)",
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid #d97706",
              }}
            >
              ADMIN
            </span>
            <span>
              Sesión <strong>ADMIN_RRHH</strong> — acceso completo de gestión.
            </span>
          </>
        ) : (
          <>
            Hola <strong>{sesion?.nombre || "usuario"}</strong>
            {sesion?.rol ? ` (${etiquetaRol(sesion.rol)})` : ""}.
            {esSupervisor() &&
              " Puedes consultar personal de tu ámbito, validar asistencia y gestionar turnos/proyectos."}
            {esContador() && " Acceso a nómina, liquidaciones y reportes financieros."}
            {esEmpleado() && " Portal del empleado: consulta tus pagos y solicitudes."}
          </>
        )}
      </div>

      <div className="dashboard-hero">
        <img src={logo} alt="Buydrax" />
        <p
          style={{
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#f59e0b",
            margin: "0 0 6px",
          }}
        >
          Panel principal
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", color: "#0f172a" }}>
          ¡Bienvenido a Buydrax!
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Accesos rápidos según tu rol · {etiquetaRol(sesion?.rol)}
        </p>
      </div>

      {error && <p style={{ color: "#b00020", marginBottom: 16 }}>{error}</p>}

      {stats && !esEmpleado() && (
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

      {/* Solo botones interactivos a interfaces / reportes */}
      <div className="dashboard-grid">
        {cards.map((c) => (
          <Link
            key={c.path + c.titulo}
            to={c.path}
            className="dashboard-card"
            style={{ borderTop: `4px solid ${c.color}` }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `${c.color}18`,
                color: c.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                marginBottom: 12,
              }}
            >
              <i className={`bi ${c.icon}`} />
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              {c.titulo}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{c.desc}</p>
          </Link>
        ))}
      </div>

      {admin && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>
            Acciones de gestión
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {perms.empleadosGestion && (
              <Link to="/empleados/registrar" className="dash-action-btn">
                <i className="bi bi-person-plus" /> Nuevo empleado
              </Link>
            )}
            <Link to="/proyectos" className="dash-action-btn">
              <i className="bi bi-folder-plus" /> Crear proyecto
            </Link>
            <Link to="/asistencia/validaciones" className="dash-action-btn">
              <i className="bi bi-check2-square" /> Validar / aprobar
            </Link>
            <Link to="/users" className="dash-action-btn">
              <i className="bi bi-shield-lock" /> Usuarios
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .dash-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-weight: 600;
          font-size: 13px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .dash-action-btn:hover {
          background: #fff7ed;
          border-color: #f59e0b;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(249, 115, 22, 0.12);
        }
        .dashboard-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }
      `}</style>
    </AppShell>
  );
}
