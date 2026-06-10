import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logobuydrax.png";

export default function Navbar() {
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

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
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={false}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className="navbar-nav mx-auto mb-2 mb-lg-0"
            style={{ gap: "5px", fontSize: "13px" }}
          >
            <li className="nav-item">
              <Link
                className="nav-link text-white d-flex align-items-center gap-1"
                to="/dashboard"
                style={{
                  borderBottom:
                    location.pathname === "/dashboard"
                      ? "2px solid orange"
                      : "none",
                  paddingBottom: "4px",
                }}
              >
                <i className="bi bi-house-fill"></i> Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-white d-flex align-items-center gap-1"
                to="/empleados"
                style={{
                  borderBottom:
                    location.pathname === "/empleados"
                      ? "2px solid orange"
                      : "none",
                  paddingBottom: "4px",
                }}
              >
                <i className="bi bi-people-fill"></i> Empleados
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-white d-flex align-items-center gap-1"
                to="/proyectos"
                style={{
                  borderBottom:
                    location.pathname === "/proyectos"
                      ? "2px solid orange"
                      : "none",
                  paddingBottom: "4px",
                }}
              >
                <i className="bi bi-folder-fill"></i> Proyectos
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-white d-flex align-items-center gap-1"
                to="/asistencia"
                style={{
                  borderBottom:
                    location.pathname === "/asistencia"
                      ? "2px solid orange"
                      : "none",
                  paddingBottom: "4px",
                }}
              >
                <i className="bi bi-headset"></i> Asistencia
              </Link>
            </li>
          </ul>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button className="btn text-white" type="button">
              <i className="bi bi-search fs-5"></i>
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#fff",
              }}
            >
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

              <span style={{ fontSize: "13px" }}>
                {usuario.nombre || "Usuario"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}