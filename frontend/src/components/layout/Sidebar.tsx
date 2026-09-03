import { Link, useLocation } from "react-router-dom";

const menus: Record<string, { to: string; icon: string; label: string }[]> = {
  "/dashboard": [
    { to: "/dashboard", icon: "bi-house-fill", label: "Inicio" },
    { to: "/reportes", icon: "bi-bar-chart-fill", label: "Reportes" },
  ],

  "/empleados": [
    { to: "/empleados", icon: "bi-people-fill", label: "Lista de empleados" },
    {
      to: "/empleados/agregar",
      icon: "bi-person-plus-fill",
      label: "Registro Empleados",
    },
    {
      to: "/perfiles",
      icon: "bi-briefcase-fill",
      label: "Perfiles",
    },
    {
      to: "/empleados/documentos",
      icon: "bi-folder-fill",
      label: "Certificaciones",
    },
  ],

  "/proyectos": [
    {
      to: "/proyectos",
      icon: "bi-folder-plus",
      label: "Crear proyecto",
    },
    {
      to: "/proyectos/asignacion",
      icon: "bi-people-fill",
      label: "Asignación empleado",
    },
    {
      to: "/proyectos/supervisor",
      icon: "bi-person-check-fill",
      label: "Supervisor",
    },
  ],

  "/asistencia": [
    {
      to: "/asistencia",
      icon: "bi-calendar-check-fill",
      label: "Ver asistencia",
    },
    {
      to: "/asistencia/turno",
      icon: "bi-clock-fill",
      label: "Turnos",
    },
    {
      to: "/asistencia/reporte",
      icon: "bi-file-earmark-text-fill",
      label: "Horas Extras",
    },
  ],
};

export default function Sidebar() {
  const location = useLocation();

  let seccion = "/" + location.pathname.split("/")[1];

  // Perfiles pertenece a la sección de Empleados
  if (location.pathname === "/perfiles") {
    seccion = "/empleados";
  }

  const items = menus[seccion] || menus["/dashboard"];

  return (
    <div className="sidebar-nav">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`sidebar-link ${
            location.pathname === item.to
              ? "sidebar-link--active"
              : ""
          }`}
        >
          <i className={`bi ${item.icon}`}></i>

          <span className="sidebar-label">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}