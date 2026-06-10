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
    { to: "/proyectos", icon: "bi-building", label: "Lista de proyectos" },
    { to: "/proyectos/agregar", icon: "bi-plus-circle-fill", label: "Nuevo proyecto" },
    { to: "/proyectos/asignar", icon: "bi-person-check-fill", label: "Asignar personal" },
  ],
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
    <div
      style={{
        width: "220px",
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#F97316",
        borderRight: "1px solid #e0e0e0",
        padding: "20px 12px",
      }}
    >
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "13.5px",
            marginBottom: "4px",
            backgroundColor:
              location.pathname === item.to ? "#1E3A8A" : "transparent",
            color: location.pathname === item.to ? "#fff" : "#333",
            fontWeight: location.pathname === item.to ? "600" : "400",
          }}
        >
          <i className={`bi ${item.icon}`}></i>
          {item.label}
        </Link>
      ))}
    </div>
  );
}