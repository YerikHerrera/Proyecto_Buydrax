import Navbar from "../components/layout/Navbar";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import logo from "../assets/logoo.png";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="ContenedorDashboard">

      <Navbar />

      <div className="dashboard-body">

        <div className="dashboard-sidebar">
          <Sidebar />
        </div>

        <main className="dashboard-main">
          <img
            src={logo}
            alt="Logo de Buydrax"
            style={{ width: "125px", height: "auto", marginBottom: "24px" }}
          />

          <p style={{ fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", color: "#f5a623", marginBottom: "10px" }}>
            — Panel principal —
          </p>

          <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#111", marginBottom: "10px" }}>
            ¡Bienvenido a Buydrax!
          </h1>

          <p style={{ fontSize: "15px", color: "#888", marginBottom: "52px", lineHeight: "1.7" }}>
            Gestión de personal y operaciones para empresas del sector construcción
          </p>

          <div className="dashboard-grid">
            {[
              { titulo: "Personal activo", desc: "Consulta y gestiona tus trabajadores en obra", color: "#ff0000", path: "/empleados" },
              { titulo: "Obras en curso", desc: "Proyectos activos y asignación de cuadrillas", color: "#f5a623", path: "/proyectos" },
              { titulo: "Nómina", desc: "Pagos, horas extras y liquidaciones", color: "#ff0000", path: "/nomina" },
              { titulo: "Seguridad SST", desc: "Registros de incidentes y dotaciones", color: "#f5a623", path: "/reportes" },
              { titulo: "Asistencia", desc: "Control de turnos y ausencias del personal", color: "#ff0000", path: "/asistencia" },
              { titulo: "Reportes", desc: "Indicadores y seguimiento por proyecto", color: "#f5a623", path: "/reportes" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="dashboard-card"
                style={{
                  background: "#fbeeee",
                  border: "1.5px solid #0004ff",
                  borderRadius: "14px",
                  padding: "28px 22px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  borderTop: `3px solid ${item.color}`,
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <p style={{ fontWeight: "700", fontSize: "15px", color: "#111", marginBottom: "6px" }}>
                  {item.titulo}
                </p>
                <p style={{ fontSize: "13px", color: "#000000", lineHeight: "1.5" }}>
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;