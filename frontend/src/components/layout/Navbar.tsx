import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logobuydrax.png";
import { clearSession, getToken } from "../../services/apiClient";
import { logout as apiLogout } from "../../services/authService";

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

  const buscarEmpleado = () => {
    const q = busqueda.trim();
    if (!q) {
      navigate("/empleados/buscar");
      return;
    }
    navigate(`/empleados/buscar?nombre=${encodeURIComponent(q)}`);
    setBusquedaAbierta(false);
    setBusqueda("");
  };

  const iniciales = (usuario?.nombre || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <Link to="/dashboard" className="app-navbar__brand">
          <img src={logo} alt="Buydrax" />
          <span>Buydrax</span>
        </Link>

        <div className="app-navbar__actions">
          <button
            type="button"
            className="app-navbar__icon-btn"
            aria-label="Buscar empleado"
            onClick={() => setBusquedaAbierta((v) => !v)}
          >
            <i className="bi bi-search"></i>
          </button>

          <div className="app-navbar__perfil" ref={perfilRef}>
            <button
              type="button"
              className="app-navbar__user"
              onClick={() => setPerfilAbierto((v) => !v)}
            >
              <span className="app-navbar__avatar">{iniciales || "U"}</span>
              <span className="app-navbar__user-text">
                <strong>{usuario?.nombre || "Usuario"}</strong>
                <small>{usuario?.rol || usuario?.cargo || "—"}</small>
              </span>
              <i className="bi bi-chevron-down"></i>
            </button>

            {perfilAbierto && (
              <div className="app-navbar__dropdown">
                <div className="app-navbar__dropdown-meta">
                  <div>{usuario?.email || "Sin correo"}</div>
                  {!getToken() && (
                    <div className="app-navbar__warn">Sin token. Vuelve a iniciar sesión.</div>
                  )}
                </div>
                <button type="button" onClick={() => navigate("/perfiles")}>
                  <i className="bi bi-person"></i> Mi ficha
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
            placeholder="Buscar empleado por nombre o documento…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarEmpleado()}
            autoFocus
          />
          <button type="button" onClick={buscarEmpleado}>
            Buscar
          </button>
        </div>
      )}
    </header>
  );
}
