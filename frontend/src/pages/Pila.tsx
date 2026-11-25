import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import PilaTable from "../components/nomina/PilaTable";
import "../styles/Nomina.css";

export default function Pila() {
  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Nómina", to: "/nomina" }, { label: "PILA" }]} />
      <div className="page-card">
        <p
          style={{
            fontSize: 13,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#f5a623",
            margin: 0,
          }}
        >
          — Tesorería —
        </p>
        <h1 className="page-title" style={{ marginTop: 8 }}>
          PILA / Seguridad social
        </h1>
        <p className="page-subtitle">
          Se genera desde una nómina validada. Si hay inconsistencias, el proceso se bloquea. El
          formato del archivo plano no se inventa (regla del proyecto).
        </p>
        <PilaTable />
      </div>
    </AppShell>
  );
}
