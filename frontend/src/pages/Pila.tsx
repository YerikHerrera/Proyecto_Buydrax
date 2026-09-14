import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PilaTable from "../components/nomina/PilaTable";
import "../styles/Dashboard.css";
import "../styles/Nomina.css";


export default function Pila() {
  return (
    <div className="ContenedorDashboard">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main page-fade" style={{ alignItems: "stretch", textAlign: "left" }}>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#f5a623" }}>— Tesorería —</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 8 }}>PILA</h1>
          <p style={{ color: "#64748b", marginBottom: 24, maxWidth: 640 }}>
            Se genera desde una nómina validada. Si hay inconsistencias, el proceso se bloquea.
            El formato del archivo plano no se inventa (regla del proyecto).
          </p>
          <PilaTable />
        </main>
      </div>
    </div>
  );
}
