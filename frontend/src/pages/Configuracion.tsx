import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/Dashboard.css";

const PARAMS = [
  ["SMMLV 2026", "$ 1.423.500"],
  ["Auxilio de transporte", "$ 200.000"],
  ["% HE diurna", "1.25"],
  ["% HE nocturna", "1.75"],
  ["% salud empleado", "4%"],
  ["% pensión empleado", "4%"],
];

export default function Configuracion() {
  return (
    <div className="ContenedorDashboard">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main page-fade" style={{ alignItems: "stretch", textAlign: "left" }}>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#f5a623" }}>— Sistema —</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 8 }}>Configuración</h1>
          <p style={{ color: "#64748b", marginBottom: 24, maxWidth: 640 }}>
            Parámetros normativos. Cada cambio debe quedar en historial (usuario, campo, valor anterior/nuevo).
          </p>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", maxWidth: 560 }}>
            {PARAMS.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
                <span style={{ color: "#64748b" }}>{k}</span>
                <strong style={{ color: "#1e3a8a" }}>{v}</strong>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
