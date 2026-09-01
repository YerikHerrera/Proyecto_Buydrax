import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logobuydrax.png";

export default function Navbar() {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [menuAbierto, setMenuAbierto] = useState(false);

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

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  backgroundColor: "#f5a623",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {usuario.nombre?.charAt(0) || "U"}
              </div>
              <span style={{ fontSize: "13px" }}>{usuario.nombre || "Usuario"}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}