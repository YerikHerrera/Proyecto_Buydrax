import { Link, useLocation } from "react-router-dom";

const menus: Record<string, { to: string; icon: string; label: string }[]> = {
  "/dashboard": [
    { to: "/dashboard", icon: "bi-house-fill", label: "Inicio" },
    { to: "/reportes", icon: "bi-bar-chart-fill", label: "Reportes" },
  ],
  "/empleados": [
    { to: "/empleados", icon: "bi-people-fill", label: "Lista de empleados" },
    { to: "/empleados/agregar", icon: "bi-person-plus-fill", label: "Registro Empleados" },
    { to: "/empleados/cargos", icon: "bi-briefcase-fill", label: "Perfiles" },
    { to: "/empleados/documentos", icon: "bi-folder-fill", label: "Certificaciones" },
  ],

  "/proyectos": [
  { to: "/proyectos", icon: "bi-folder-plus", label: "Crear proyecto" },
  { to: "/proyectos/asignacion", icon: "bi-people-fill", label: "Asignación empleado" },
  { to: "/proyectos/supervisor", icon: "bi-person-check-fill", label: "Supervisor" },
  ],

  //"/proyectos": [
    //{ to: "/proyectos", icon: "bi-building", label: "Lista de proyectos" },
    //{ to: "/proyectos/agregar", icon: "bi-plus-circle-fill", label: "Nuevo proyecto" },
    //{ to: "/proyectos/asignar", icon: "bi-person-check-fill", label: "Asignar personal" },
  //],

  "/asistencia": [
    { to: "/asistencia", icon: "bi-calendar-check-fill", label: "Ver asistencia" },
    { to: "/asistencia/turno", icon: "bi-clock-fill", label: "Turnos" },
    { to: "/asistencia/reporte", icon: "bi-file-earmark-text-fill", label: "Reporte" },
  ],
};

export default function Sidebar() {
  const location = useLocation();
  const seccion = "/" + location.pathname.split("/")[1];
  const items = menus[seccion] || menus["/dashboard"];

  return (
    // ÚNICO CAMBIO: agregar className="sidebar-nav"
    // y quitar width/minHeight del inline style (los controla el CSS)
    <div className="sidebar-nav">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`sidebar-link ${location.pathname === item.to ? "sidebar-link--active" : ""}`}
        >
          <i className={`bi ${item.icon}`}></i>
          <span className="sidebar-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}