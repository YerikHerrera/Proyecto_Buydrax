import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import "../styles/Dashboard.css";
import DashboardRoleBanner from "../components/dashboard/DashboardRoleBanner";
import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCards, { type CardDef } from "../components/dashboard/DashboardCards";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
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
      <DashboardRoleBanner
        admin={admin}
        nombre={sesion?.nombre}
        rol={sesion?.rol}
        supervisor={esSupervisor()}
        contador={esContador()}
        empleado={esEmpleado()}
      />
      <DashboardHero roleLabel={etiquetaRol(sesion?.rol)} />
      {error && <p style={{ color: "#b00020", marginBottom: 16 }}>{error}</p>}
      {stats && <DashboardStats stats={stats} hidden={esEmpleado()} />}
      <DashboardCards cards={cards} />
      {admin && <DashboardQuickActions mostrarRegistrarEmpleado={Boolean(perms.empleadosGestion)} />}
    </AppShell>
  );
}
