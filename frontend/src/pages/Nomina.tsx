import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { apiRequest } from "../services/apiClient";
import { getDashboard, type DashboardData } from "../services/dashboardService";
import "../styles/Nomina.css";

type NominaRow = {
  id_nomina: number;
  periodo_inicio: string;
  periodo_fin: string;
  tipo_nomina: string;
  estado_nomina: string;
  total_pagado?: number;
  cantidad_empleados?: number;
};

export default function Nomina() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [nominas, setNominas] = useState<NominaRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard().then(setStats).catch(() => {});
    apiRequest<NominaRow[]>("/nominas")
      .then((d) => setNominas(Array.isArray(d) ? d : []))
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudo cargar nómina"));
  }, []);

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Nómina" }]} />
      <div className="page-card" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Gestión de nómina</h1>
        <p className="page-subtitle">Datos desde API (no mock).</p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        <div className="nomina-summary-grid" style={{ marginTop: 16 }}>
          <div className="nomina-summary-card">
            <div className="nomina-summary-icon blue"><i className="bi bi-people-fill"></i></div>
            <div>
              <span>Empleados activos</span>
              <strong>{stats?.empleados_activos ?? "—"}</strong>
              <Link to="/empleados"><small>Ver empleados →</small></Link>
            </div>
          </div>
          <div className="nomina-summary-card">
            <div className="nomina-summary-icon orange"><i className="bi bi-clock-fill"></i></div>
            <div>
              <span>Horas extra pend.</span>
              <strong>{stats?.horas_extra_pendientes ?? "—"}</strong>
              <Link to="/asistencia/reporte"><small>Ver horas extra →</small></Link>
            </div>
          </div>
          <div className="nomina-summary-card">
            <div className="nomina-summary-icon purple"><i className="bi bi-file-earmark-text-fill"></i></div>
            <div>
              <span>Nóminas borrador</span>
              <strong>{stats?.nominas_borrador ?? "—"}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="page-card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Nóminas registradas</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 10 }}>ID</th>
                <th style={{ padding: 10 }}>Periodo</th>
                <th style={{ padding: 10 }}>Tipo</th>
                <th style={{ padding: 10 }}>Estado</th>
                <th style={{ padding: 10 }}>Empleados</th>
                <th style={{ padding: 10 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {nominas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                    No hay nóminas o el endpoint no respondió datos.
                  </td>
                </tr>
              ) : (
                nominas.map((n) => (
                  <tr key={n.id_nomina} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 10 }}>{n.id_nomina}</td>
                    <td style={{ padding: 10 }}>{n.periodo_inicio} → {n.periodo_fin}</td>
                    <td style={{ padding: 10 }}>{n.tipo_nomina}</td>
                    <td style={{ padding: 10 }}>{n.estado_nomina}</td>
                    <td style={{ padding: 10 }}>{n.cantidad_empleados ?? "—"}</td>
                    <td style={{ padding: 10 }}>
                      {n.total_pagado != null
                        ? Number(n.total_pagado).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
