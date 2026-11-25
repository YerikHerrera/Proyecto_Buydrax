import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logobuydrax.png";
import { clearSession, getToken } from "../../services/apiClient";
import { logout as apiLogout } from "../../services/authService";
import { etiquetaRol, esAdminRrhh } from "../../services/session";
import { useSidebar } from "./SidebarContext";

type UsuarioSesion = {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
  rol?: string | null;
};

function leerUsuario(): UsuarioSesion | null {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u !== "object") return null;
    return {
      id: Number(u.id) || 0,
      nombre: String(u.nombre || "Usuario"),
      cargo: String(u.cargo || u.rol || "Usuario"),
      email: String(u.email || ""),
      rol: u.rol ?? u.cargo ?? null,
    };
  } catch {
    return null;
  }
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { abierto, toggle: toggleSidebar } = useSidebar();
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => leerUsuario());
  const perfilRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsuario(leerUsuario());
    setPerfilAbierto(false);
    setBusquedaAbierta(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      const t = e.target as Node;
      if (perfilRef.current && !perfilRef.current.contains(t)) setPerfilAbierto(false);
      if (searchRef.current && !searchRef.current.contains(t)) setBusquedaAbierta(false);
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  useEffect(() => {
    if (busquedaAbierta) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [busquedaAbierta]);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    clearSession();
    setUsuario(null);
    navigate("/");
  };

  const buscarGlobal = () => {
    const q = busqueda.trim();
    setBusquedaAbierta(false);
    if (!q) {
      navigate("/empleados/buscar");
      return;
    }
    const lower = q.toLowerCase();
    if (lower.includes("proyecto") || lower.includes("obra")) {
      navigate(`/reportes/proyectos?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("asistencia") || lower.includes("falt")) {
      navigate(`/reportes/asistencia?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("turno")) {
      navigate(`/reportes/turnos?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("hora") || lower.includes("extra")) {
      navigate(`/reportes/horas-extra?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("nomina") || lower.includes("nómina") || lower.includes("pila")) {
      navigate(`/nomina?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/empleados/buscar?q=${encodeURIComponent(q)}`);
    }
  };

  const iniciales = (usuario?.nombre || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  const rolLabel = etiquetaRol(usuario?.rol || usuario?.cargo);
  const admin = esAdminRrhh();
  const cargoMostrar =
    usuario?.cargo && usuario.cargo !== usuario?.rol ? usuario.cargo : null;

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <button
          type="button"
          className="app-navbar__menu-btn"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          onClick={toggleSidebar}
        >
          <i className={`bi ${abierto ? "bi-x-lg" : "bi-list"}`}></i>
        </button>
        <Link to="/dashboard" className="app-navbar__brand">
          <img src={logo} alt="Buydrax" style={{ height: "50px", width: "auto" }} />
        </Link>

        <div className="app-navbar__actions">
          <div className="app-navbar__search-wrap" ref={searchRef}>
            <button
              type="button"
              className={`app-navbar__icon-btn${busquedaAbierta ? " is-active" : ""}`}
              aria-label="Búsqueda global"
              aria-expanded={busquedaAbierta}
              onClick={() => {
                setBusquedaAbierta((v) => !v);
                setPerfilAbierto(false);
              }}
              title="Buscar en el sistema"
            >
              <i className="bi bi-search" />
            </button>

            {busquedaAbierta && (
              <div className="app-navbar__search-panel" role="dialog" aria-label="Búsqueda">
                <div className="app-navbar__search-panel-head">
                  <i className="bi bi-search" />
                  <span>Búsqueda global</span>
                </div>
                <div className="app-navbar__search-panel-body">
                  <input
                    ref={inputRef}
                    type="search"
                    placeholder="Empleados, proyectos, asistencia, nómina…"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && buscarGlobal()}
                  />
                  <button type="button" className="app-navbar__search-go" onClick={buscarGlobal}>
                    Buscar
                  </button>
                </div>
                <p className="app-navbar__search-hint">
                  Enter para buscar · Esc o clic fuera para cerrar
                </p>
              </div>
            )}
          </div>

          <div className="app-navbar__perfil" ref={perfilRef}>
            <button
              type="button"
              className="app-navbar__user"
              onClick={() => {
                setPerfilAbierto((v) => !v);
                setBusquedaAbierta(false);
              }}
            >
              <span
                className="app-navbar__avatar"
                style={
                  admin
                    ? {
                        background: "linear-gradient(135deg, #b45309, #f59e0b)",
                        boxShadow: "0 0 0 2px #fbbf24, 0 0 12px rgba(245, 158, 11, 0.45)",
                      }
                    : undefined
                }
              >
                {iniciales || "U"}
              </span>
              <span className="app-navbar__user-text">
                <strong style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {usuario?.nombre || "Usuario"}
                  {admin && (
                    <span className="app-navbar__admin-pill" title="Administrador RRHH">
                      ADMIN
                    </span>
                  )}
                </strong>
                <small>
                  {cargoMostrar ? (
                    <>
                      <span style={{ opacity: 0.75 }}>C:</span> {cargoMostrar}
                      {" · "}
                    </>
                  ) : null}
                  {rolLabel}
                </small>
              </span>
              <i className="bi bi-chevron-down" />
            </button>

            {perfilAbierto && (
              <div className="app-navbar__dropdown">
                <div className="app-navbar__dropdown-meta">
                  <div>{usuario?.email || "Sin correo"}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
                    Rol: <strong>{rolLabel}</strong>
                    {cargoMostrar ? ` · C: ${cargoMostrar}` : ""}
                  </div>
                  {!getToken() && (
                    <div className="app-navbar__warn">Sin token. Vuelve a iniciar sesión.</div>
                  )}
                </div>
                <button type="button" onClick={() => navigate("/perfiles")}>
                  <i className="bi bi-person" /> Mi información personal
                </button>
                <button type="button" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
