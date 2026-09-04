import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

type SubItem = { to: string; label: string };
type Item = {
  to: string;
  icon: string;
  label: string;
  match: (p: string) => boolean;
  children?: SubItem[];
};

/**
 * Menú único en toda la app:
 * - mismas secciones siempre
 * - subpáginas siempre accesibles (no desaparecen al navegar)
 */
const MENU: Item[] = [
  {
    to: "/dashboard",
    icon: "bi-house-fill",
    label: "Inicio",
    match: (p) => p === "/dashboard",
  },
  {
    to: "/empleados",
    icon: "bi-people-fill",
    label: "Empleados",
    match: (p) => p.startsWith("/empleados") || p === "/perfiles",
    children: [
      { to: "/empleados", label: "Lista" },
      { to: "/empleados/registrar", label: "1. Cuenta usuario" },
      { to: "/empleados/agregar", label: "2. Perfil laboral" },
      { to: "/empleados/buscar", label: "Buscar" },
      { to: "/empleados/documentos", label: "Certificaciones" },
      { to: "/perfiles", label: "Ficha rápida" },
    ],
  },
  {
    to: "/proyectos",
    icon: "bi-folder-fill",
    label: "Proyectos",
    match: (p) => p.startsWith("/proyectos"),
    children: [
      { to: "/proyectos", label: "Listar / crear" },
      { to: "/proyectos/asignacion", label: "Asignación" },
      { to: "/proyectos/supervisor", label: "Supervisores" },
    ],
  },
  {
    to: "/asistencia",
    icon: "bi-calendar-check-fill",
    label: "Asistencia",
    match: (p) => p.startsWith("/asistencia"),
    children: [
      { to: "/asistencia", label: "Registrar asistencia" },
      { to: "/asistencia/turno", label: "Turnos" },
      { to: "/asistencia/reporte", label: "Horas extras" },
      { to: "/asistencia/validaciones", label: "Validar / aprobar" },
    ],
  },
  {
    to: "/nomina",
    icon: "bi-cash-stack",
    label: "Nómina",
    match: (p) => p.startsWith("/nomina"),
  },
  {
    to: "/reportes",
    icon: "bi-bar-chart-fill",
    label: "Reportes",
    match: (p) => p.startsWith("/reportes"),
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);
  /** Secciones expandidas: por defecto la activa + todas las que tengan hijos visibles */
  const [expandidas, setExpandidas] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MENU.forEach((m) => {
      if (m.children?.length) init[m.to] = true; // todas abiertas para no “perder” subpáginas
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
