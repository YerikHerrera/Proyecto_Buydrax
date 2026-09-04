import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarSupervisores } from "../services/proyectosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import "../styles/Supervisor.css";

export default function Supervisor() {
  const [supervisores, setSupervisores] = useState<
    { id_supervisor: number; numero_tarjeta_profesional: string; cuadrilla_asignada?: string | null }[]
  >([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listarSupervisores()
      .then(setSupervisores)
      .catch((e) => setError(e instanceof Error ? e.message : "Error supervisores"));
    listarProyectos()
      .then(setProyectos)
      .catch(() => setProyectos([]));
  }, []);

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Proyectos", to: "/proyectos" },
          { label: "Supervisores" },
        ]}
      />
      <div className="page-card" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Supervisores</h1>
        <p className="page-subtitle">Listado real desde GET /supervisores (sin nombres inventados).</p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 10 }}>ID</th>
                <th style={{ padding: 10 }}>Tarjeta profesional</th>
                <th style={{ padding: 10 }}>Cuadrilla</th>
              </tr>
            </thead>
            <tbody>
              {supervisores.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
                    Sin supervisores o sin respuesta de la API.
                  </td>
                </tr>
              ) : (
                supervisores.map((s) => (
                  <tr key={s.id_supervisor} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 10 }}>#{s.id_supervisor}</td>
                    <td style={{ padding: 10 }}>{s.numero_tarjeta_profesional}</td>
                    <td style={{ padding: 10 }}>{s.cuadrilla_asignada || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <h2 className="page-title" style={{ fontSize: 16 }}>Proyectos por supervisor (referencia)</h2>
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, color: "#475569" }}>
          {proyectos.map((p) => (
            <li key={p.id_proyecto}>
              {p.nombre} — supervisor #{p.id_supervisor} — {p.estado_proyecto}
            </li>
          ))}
          {proyectos.length === 0 && <li>No hay proyectos cargados.</li>}
        </ul>
      </div>
    </AppShell>
  );
}
