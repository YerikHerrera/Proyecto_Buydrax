import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 7f376fa (Resolver conflicto de merge en el Dashboard (estructura y layout principal))
import Card from "../components/ui/Card";
=======
import logo from "../assets/logoo.png";
>>>>>>> 39b5048 (- Login: se reemplazó imagen de fondo, se ajustó layout visual del)

function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          padding: "40px",
          textAlign: "center"
        }}>

          <img
            src={logo}
            alt="Logo de Buydrax"
            style={{ width: "110px", height: "auto", marginBottom: "24px" }}
          />


          <p style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#f5a623",
            marginBottom: "10px"
          }}>
            — Panel principal —
          </p>

          <h1 style={{
            fontSize: "36px",
            fontWeight: "800",
            color: "#111",
            marginBottom: "10px"
          }}>
            ¡Bienvenido a Buydrax!
          </h1>

          <p style={{
            fontSize: "14px",
            color: "#888",
            marginBottom: "48px",
            lineHeight: "1.7"
          }}>
            Gestión de personal y operaciones para empresas del sector construcción
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            width: "100%",
            maxWidth: "720px"
          }}>

            {[
              { emoji: "", titulo: "Personal activo", desc: "Consulta y gestiona tus trabajadores en obra", color: "#ff0000" },
              { emoji: "", titulo: "Obras en curso", desc: "Proyectos activos y asignación de cuadrillas", color: "#f5a623" },
              { emoji: "", titulo: "Nómina", desc: "Pagos, horas extras y liquidaciones", color: "#ff0000" },
              { emoji: "", titulo: "Seguridad SST", desc: "Registros de incidentes y dotaciones", color: "#f5a623" },
              { emoji: "", titulo: "Asistencia", desc: "Control de turnos y ausencias del personal", color: "#ff0000" },
              { emoji: "", titulo: "Reportes", desc: "Indicadores y seguimiento por proyecto", color: "#f5a623" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fbeeee",
                  border: "1.5px solid #0004ff",
                  borderRadius: "14px",
                  padding: "24px 20px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  borderTop: `3px solid ${item.color}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.emoji}</div>
                <p style={{ fontWeight: "700", fontSize: "14px", color: "#111", marginBottom: "6px" }}>{item.titulo}</p>
                <p style={{ fontSize: "12px", color: "#000000", lineHeight: "1.5" }}>{item.desc}</p>
              </div>
            ))}

          </div>

        </main>
<<<<<<< HEAD
>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> 7f376fa (Resolver conflicto de merge en el Dashboard (estructura y layout principal))
      </div>
    </div>
  );
}

export default Dashboard;