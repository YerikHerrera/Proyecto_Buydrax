import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logobuydrax.png";
import { EMPLEADOS_MOCK, type Empleado } from "../../data/empleados";

const USUARIO_STORAGE_KEY = "usuario";

export default function Navbar() {
  const location = useLocation();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  // Empleado activo: se guarda en localStorage para persistir entre recargas.
  const [empleadoActivo, setEmpleadoActivo] = useState<Empleado>(() => {
    const guardado = localStorage.getItem(USUARIO_STORAGE_KEY);
    if (guardado) {
      try {
        const parseado = JSON.parse(guardado);
        const encontrado = EMPLEADOS_MOCK.find((emp) => emp.id === parseado.id);
        if (encontrado) return encontrado;
      } catch {
        // si el localStorage tiene datos viejos/corruptos, se ignora y se usa el default
      }
    }
    return EMPLEADOS_MOCK[0];
  });

  const perfilRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) {
        setPerfilAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const seleccionarEmpleado = (empleado: Empleado) => {
    setEmpleadoActivo(empleado);
    localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(empleado));
    setPerfilAbierto(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#1E3A8A", padding: "0 20px" }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand text-white fw-bold d-flex align-items-center gap-2"
          to="/dashboard"
        >
          <img
            src={logo}
            alt="Buydrax"
            style={{ width: "190px", height: "60px", objectFit: "contain" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-expanded={menuAbierto}
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}
          id="navbarSupportedContent"
          style={{
            backgroundColor: menuAbierto ? "#1E3A8A" : "transparent",
            padding: menuAbierto ? "10px 0" : "0",
          }}
        >
          <ul
            className="navbar-nav mx-auto mb-2 mb-lg-0"
            style={{ gap: "5px", fontSize: "13px" }}
          >
            {[
              { path: "/dashboard", icon: "bi-house-fill", label: "Inicio" },
              { path: "/empleados", icon: "bi-people-fill", label: "Empleados" },
              { path: "/proyectos", icon: "bi-folder-fill", label: "Proyectos" },
              { path: "/asistencia", icon: "bi-headset", label: "Asistencia" },
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className="nav-link text-white d-flex align-items-center gap-1"
                  to={item.path}
                  onClick={() => setMenuAbierto(false)}
                  style={{
                    borderBottom:
                      location.pathname === item.path
                        ? "2px solid orange"
                        : "none",
                    paddingBottom: "4px",
                  }}
                >
                  <i className={`bi ${item.icon}`}></i> {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="btn text-white" type="button">
              <i className="bi bi-search fs-5"></i>
            </button>

            {/* Selector de perfil */}
            <div ref={perfilRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setPerfilAbierto((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#fff",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    backgroundColor: empleadoActivo.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "14px",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {empleadoActivo.nombre.charAt(0)}
                </div>
                <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                  <div style={{ fontSize: "13px" }}>{empleadoActivo.nombre}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                    {empleadoActivo.cargo}
                  </div>
                </div>
                <i
                  className={`bi ${perfilAbierto ? "bi-chevron-up" : "bi-chevron-down"}`}
                  style={{ fontSize: "11px", marginLeft: "2px" }}
                ></i>
              </button>

              {perfilAbierto && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                    minWidth: "230px",
                    maxHeight: "320px",
                    overflowY: "auto",
                    zIndex: 1000,
                    padding: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      padding: "8px 10px 4px 10px",
                    }}
                  >
                    Cambiar perfil
                  </div>

                  {EMPLEADOS_MOCK.map((empleado) => {
                    const activo = empleado.id === empleadoActivo.id;
                    return (
                      <button
                        key={empleado.id}
                        type="button"
                        onClick={() => seleccionarEmpleado(empleado)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "8px 10px",
                          border: "none",
                          borderRadius: "8px",
                          background: activo ? "#eef2ff" : "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!activo) e.currentTarget.style.background = "#f3f4f6";
                        }}
                        onMouseLeave={(e) => {
                          if (!activo) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            backgroundColor: empleado.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "13px",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          {empleado.nombre.charAt(0)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#1f2937",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {empleado.nombre}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>
                            {empleado.cargo}
                          </div>
                        </div>
                        {activo && (
                          <i
                            className="bi bi-check-circle-fill"
                            style={{ color: "#1E3A8A", marginLeft: "auto", fontSize: "14px" }}
                          ></i>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}