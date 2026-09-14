import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { menuPermitidoPorRol, esAdminRrhh, esEmpleado } from "../../services/session";

type SubItem = { to: string; label: string };
type Item = {
  to: string;
  icon: string;
  label: string;
  match: (p: string) => boolean;
  children?: SubItem[];
  visible: boolean;
};

export default function Sidebar() {
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);
  const perms = menuPermitidoPorRol();

  const MENU: Item[] = useMemo(() => {
    const items: Item[] = [
      {
        to: "/dashboard",
        icon: "bi-house-fill",
        label: "Inicio",
        match: (p) => p === "/dashboard",
        visible: perms.inicio,
      },
      {
        to: "/empleados",
        icon: "bi-people-fill",
        label: "Empleados",
        match: (p) => p.startsWith("/empleados") || p === "/perfiles",
        visible: perms.empleados,
        children: [
          { to: "/empleados", label: "Lista / Personal activo" },
          ...(perms.empleadosGestion
            ? [
                { to: "/empleados/registrar", label: "1. Cuenta de usuario" },
                { to: "/empleados/agregar", label: "2. Perfil laboral" },
              ]
            : []),
          { to: "/empleados/buscar", label: "Buscar empleado" },
          { to: "/empleados/documentos", label: "Certificaciones" },
          { to: "/perfiles", label: "Ficha del empleado" },
        ],
      },
      {
        to: "/proyectos",
        icon: "bi-folder-fill",
        label: "Proyectos",
        match: (p) => p.startsWith("/proyectos") || p.startsWith("/reportes/proyectos"),
        visible: perms.proyectos,
        children: [
          { to: "/proyectos", label: "Listado / Crear" },
          { to: "/proyectos/asignacion", label: "Asignación de empleado" },
          { to: "/proyectos/supervisor", label: "Supervisores" },
          { to: "/reportes/proyectos", label: "Reporte general" },
        ],
      },
      {
        to: "/asistencia",
        icon: "bi-calendar-check-fill",
        label: "Asistencia",
        match: (p) => p.startsWith("/asistencia") || p.startsWith("/reportes/asistencia") || p.startsWith("/reportes/horas-extra") || p.startsWith("/reportes/turnos"),
        visible: perms.asistencia,
        children: [
          { to: "/asistencia", label: "Registrar asistencia" },
          { to: "/asistencia/turno", label: "Asignar turnos" },
          { to: "/asistencia/reporte", label: "Registrar horas extras" },
          { to: "/asistencia/validaciones", label: "Validar / aprobar" },
          { to: "/reportes/asistencia", label: "Reporte de asistencia" },
          { to: "/reportes/turnos", label: "Reporte de turnos" },
          { to: "/reportes/horas-extra", label: "Reporte horas extra" },
        ],
      },
      {
        to: "/nomina",
        icon: "bi-cash-stack",
        label: "Nómina",
        match: (p) => p.startsWith("/nomina"),
        visible: perms.nomina,
        children: [
          { to: "/nomina", label: "Panel de nómina" },
          { to: "/nomina/generar", label: "Generar nómina" },
        ],
      },
      {
        to: "/reportes",
        icon: "bi-bar-chart-fill",
        label: "Reportes",
        match: (p) => p === "/reportes" || p.startsWith("/reportes/general"),
        visible: perms.reportes,
        children: [
          { to: "/reportes", label: "Centro de reportes" },
          { to: "/reportes/general", label: "Reporte general por proyecto" },
          { to: "/reportes/personal", label: "Personal activo" },
        ],
      },
    ];

    // Portal empleado (solo EMPLEADO)
    if (esEmpleado()) {
      items.push({
        to: "/portal",
        icon: "bi-person-badge",
        label: "Mi portal",
        match: (p) => p.startsWith("/portal"),
        visible: true,
        children: [
          { to: "/portal", label: "Inicio" },
          { to: "/portal/pagos", label: "Mis desprendibles" },
          { to: "/portal/prestamos", label: "Mis préstamos" },
          { to: "/portal/solicitudes", label: "Mis solicitudes" },
        ],
      });
    }

    // Usuarios solo admin
    if (esAdminRrhh()) {
      items.push({
        to: "/users",
        icon: "bi-shield-lock-fill",
        label: "Usuarios",
        match: (p) => p.startsWith("/users"),
        visible: true,
      });
    }

    return items.filter((i) => i.visible);
  }, [perms]);

  const [expandidas, setExpandidas] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MENU.forEach((m) => {
      if (m.children?.length) init[m.to] = true;
    });
    return init;
  });

  useEffect(() => {
    setAbierto(false);
  }, [location.pathname]);

  const toggle = (key: string) => {
    setExpandidas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Abrir menú"
        onClick={() => setAbierto((v) => !v)}
      >
        <i className={`bi ${abierto ? "bi-x-lg" : "bi-list"}`}></i>
      </button>

      {abierto && (
        <div className="sidebar-overlay" onClick={() => setAbierto(false)} aria-hidden />
      )}

      <aside className={`sidebar-nav ${abierto ? "sidebar-nav--open" : ""}`}>
        <div className="sidebar-nav__header">
          <span>Navegación</span>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {MENU.map((item) => {
          const active = item.match(location.pathname);
          const hasChildren = Boolean(item.children?.length);
          const open = expandidas[item.to] ?? true;

          return (
            <div key={item.to} className="sidebar-group">
              <div className="sidebar-group__row">
                <Link
                  to={item.to}
                  className={`sidebar-link ${active ? "sidebar-link--active" : ""}`}
                  onClick={() => setAbierto(false)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
                {hasChildren && (
                  <button
                    type="button"
                    className="sidebar-group__chevron"
                    aria-label={open ? "Contraer" : "Expandir"}
                    onClick={() => toggle(item.to)}
                  >
                    <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                  </button>
                )}
              </div>

              {hasChildren && open && (
                <div className="sidebar-sub">
                  {item.children!.map((sub) => {
                    const subActive = location.pathname === sub.to;
                    return (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className={`sidebar-sublink ${subActive ? "sidebar-sublink--active" : ""}`}
                        onClick={() => setAbierto(false)}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </aside>
    </>
  );
}
