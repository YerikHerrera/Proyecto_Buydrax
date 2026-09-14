import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logobuydrax.png";
import { clearSession, getToken } from "../../services/apiClient";
import { logout as apiLogout } from "../../services/authService";
import { etiquetaRol, esAdminRrhh, leerSesion } from "../../services/session";

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
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => leerUsuario());
  const perfilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsuario(leerUsuario());
    setPerfilAbierto(false);
    setBusquedaAbierta(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) {
        setPerfilAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

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

  /** Búsqueda global: empleados, proyectos, reportes (no solo empleado) */
  const buscarGlobal = () => {
    const q = busqueda.trim();
    if (!q) {
      navigate("/empleados/buscar");
      return;
    }
    const lower = q.toLowerCase();
    // Heurística simple de destinos similares
    if (lower.includes("proyecto") || lower.includes("obra")) {
      navigate(`/reportes/proyectos?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("asistencia") || lower.includes("turno")) {
      navigate(`/reportes/asistencia?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("hora") || lower.includes("extra")) {
      navigate(`/reportes/horas-extra?q=${encodeURIComponent(q)}`);
    } else if (lower.includes("nomina") || lower.includes("nómina") || lower.includes("pago")) {
      navigate(`/nomina?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/empleados/buscar?nombre=${encodeURIComponent(q)}`);
    }
    setBusquedaAbierta(false);
    setBusqueda("");
  };

  const iniciales = (usuario?.nombre || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  const rolLabel = etiquetaRol(usuario?.rol || usuario?.cargo);
  const admin = esAdminRrhh();
  const cargoMostrar = usuario?.cargo && usuario.cargo !== usuario?.rol
    ? usuario.cargo
    : null;

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <Link to="/dashboard" className="app-navbar__brand">
          <img src={logo} alt="Buydrax" style={{ height: '50px', width: 'auto' }}/>
        </Link>

        <div className="app-navbar__actions">
          <button
            type="button"
            className="app-navbar__icon-btn"
            aria-label="Búsqueda global"
            onClick={() => setBusquedaAbierta((v) => !v)}
            title="Buscar en el sistema"
          >
            <i className="bi bi-search"></i>
          </button>

          <div className="app-navbar__perfil" ref={perfilRef}>
            <button
              type="button"
              className="app-navbar__user"
              onClick={() => setPerfilAbierto((v) => !v)}
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
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 0.6,
                        color: "#92400e",
                        background: "linear-gradient(135deg, #fde68a, #fbbf24)",
                        padding: "2px 7px",
                        borderRadius: 999,
                        border: "1px solid #f59e0b",
                      }}
                      title="Administrador RRHH"
                    >
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
              <i className="bi bi-chevron-down"></i>
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
                  <i className="bi bi-person"></i> Mi información personal
                </button>
                <button type="button" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {busquedaAbierta && (
        <div className="app-navbar__search">
          <input
            type="search"
            placeholder="Buscar empleados, proyectos, asistencia, nómina…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarGlobal()}
            autoFocus
          />
          <button type="button" onClick={buscarGlobal}>
            Buscar
          </button>
        </div>
      )}
    </header>
  );
}
