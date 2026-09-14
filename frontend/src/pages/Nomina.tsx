import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import NominaSummary from "../components/nomina/NominaSummary";
import NominaProyectoPreview from "../components/nomina/NominaProyectoPreview";
import NominaTable from "../components/nomina/NominaTable";
import { apiRequest } from "../services/apiClient";
import { getDashboard, type DashboardData } from "../services/dashboardService";
import "../styles/Nomina.css";


export default function Nomina() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [nominas, setNominas] = useState<import("../components/nomina/NominaTable").NominaRow[]>([]);
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
        <p className="page-subtitle">
          Resumen general y listado desde API. Gráficas por proyecto son vista previa visual.
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        <NominaSummary stats={stats} />
        <NominaProyectoPreview />
      </div>

      <div className="page-card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Nóminas registradas</h2>
        <NominaTable rows={nominas} />
      </div>
    </AppShell>
  );
}
