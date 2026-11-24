import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import NominaSummary from "../components/nomina/NominaSummary";
import NominaTable, { type NominaRow } from "../components/nomina/NominaTable";
import { apiRequest } from "../services/apiClient";
import { getDashboard, type DashboardData } from "../services/dashboardService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import "../styles/Nomina.css";

type DetalleRow = {
  id_detalle_nomina: number;
  id_empleado: number;
  horas_ordinarias: number;
  horas_extra: number;
  neto_pagar: number;
};

export default function Nomina() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [nominas, setNominas] = useState<NominaRow[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [detalles, setDetalles] = useState<DetalleRow[]>([]);
  const [nominaSel, setNominaSel] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  const cargar = useCallback(() => {
    getDashboard().then(setStats).catch(() => {});
    listarProyectos().then((p) => setProyectos(Array.isArray(p) ? p : [])).catch(() => {});
    apiRequest<NominaRow[]>("/nominas")
      .then((d) => setNominas(Array.isArray(d) ? d : []))
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudo cargar nómina"));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const verDetalles = async (id: number) => {
    try {
      setError("");
      setNominaSel(id);
      const d = await apiRequest<DetalleRow[]>(`/nominas/${id}/detalles`);
      setDetalles(Array.isArray(d) ? d : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar detalles");
    }
  };

  const calcular = async (id: number) => {
    try {
      setBusyId(id);
      setError("");
      setMsg("");
      const r = await apiRequest<{ message?: string; total_pagado?: number }>(
        `/nominas/${id}/calcular`,
        { method: "POST" }
      );
      setMsg(r.message || `Nómina #${id} calculada.`);
      cargar();
      await verDetalles(id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al calcular");
    } finally {
      setBusyId(null);
    }
  };

  const cambiarEstado = async (id: number, estado_nomina: string) => {
    try {
      setBusyId(id);
      setError("");
      await apiRequest(`/nominas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado_nomina }),
      });
      setMsg(`Nómina #${id} → ${estado_nomina}`);
      cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar estado");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Nómina" }]} />
      <div className="page-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="page-title">Panel de nómina</h1>
            <p className="page-subtitle">
              Listado, cálculo y aprobación. Para un nuevo periodo usa Generar nómina.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link
              to="/nomina/generar"
              className="agregar-btn-primario"
              style={{ textDecoration: "none", whiteSpace: "nowrap" }}
            >
              + Generar nómina
            </Link>
            <Link
              to="/pila"
              className="agregar-btn-secundario"
              style={{ textDecoration: "none", whiteSpace: "nowrap" }}
            >
              PILA
            </Link>
          </div>
        </div>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {msg && <p style={{ color: "#047857" }}>{msg}</p>}
        <NominaSummary stats={stats} />
      </div>

      <div className="page-card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Nóminas registradas</h2>
        <NominaTable
          rows={nominas}
          busyId={busyId}
          onVerDetalles={verDetalles}
          onCalcular={calcular}
          onAprobar={(id) => void cambiarEstado(id, "APROBADA")}
          onPagar={(id) => void cambiarEstado(id, "PAGADA")}
        />
      </div>


      <div className="page-card" style={{ marginTop: 20 }} id="consumo-obras">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Consumo de nómina por obra</h2>
        <p className="page-subtitle" style={{ marginTop: 0 }}>
          Total liquidado por proyecto (suma de nóminas con obra asociada). Útil para el rol contador.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                {["Obra", "Nóminas", "Empleados (última)", "Total pagado"].map((h) => (
                  <th key={h} style={{ padding: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const map = new Map<string, { nombre: string; count: number; total: number; emps: number }>();
                for (const n of nominas) {
                  const key = n.id_obra != null ? String(n.id_obra) : "sin-obra";
                  const nombre =
                    n.id_obra != null
                      ? proyectos.find((p) => p.id_proyecto === n.id_obra)?.nombre || `Proyecto #${n.id_obra}`
                      : "Sin obra (todos / general)";
                  const prev = map.get(key) || { nombre, count: 0, total: 0, emps: 0 };
                  prev.count += 1;
                  prev.total += Number(n.total_pagado || 0);
                  prev.emps = Math.max(prev.emps, Number(n.cantidad_empleados || 0));
                  map.set(key, prev);
                }
                const rows = [...map.values()];
                if (rows.length === 0) {
                  return (
                    <tr>
                      <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                        Aún no hay nóminas para agrupar por obra.
                      </td>
                    </tr>
                  );
                }
                return rows.map((r) => (
                  <tr key={r.nombre} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 10 }}>{r.nombre}</td>
                    <td style={{ padding: 10 }}>{r.count}</td>
                    <td style={{ padding: 10 }}>{r.emps || "—"}</td>
                    <td style={{ padding: 10 }}>
                      {r.total.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {nominaSel != null && (
        <div className="page-card" style={{ marginTop: 20 }}>
          <h2 style={{ marginTop: 0, fontSize: 16 }}>
            Detalles — nómina #{nominaSel}
          </h2>
          {detalles.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              Sin líneas. Usa <strong>Calcular</strong> en la tabla.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                    {["Detalle", "Empleado", "Horas ord.", "Horas extra", "Neto"].map((h) => (
                      <th key={h} style={{ padding: 10 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((d) => (
                    <tr key={d.id_detalle_nomina} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: 10 }}>{d.id_detalle_nomina}</td>
                      <td style={{ padding: 10 }}>#{d.id_empleado}</td>
                      <td style={{ padding: 10 }}>{d.horas_ordinarias}</td>
                      <td style={{ padding: 10 }}>{d.horas_extra}</td>
                      <td style={{ padding: 10 }}>
                        {Number(d.neto_pagar).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
