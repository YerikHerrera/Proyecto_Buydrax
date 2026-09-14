import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import FiltrosBar from "../components/reportes/FiltrosBar";
import { listarSupervisores } from "../services/proyectosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { MOCK_PERSONAL, MOCK_PROYECTOS } from "../data/mockReportes";
import "../styles/Supervisor.css";

export default function Supervisor() {
  const [supervisores, setSupervisores] = useState<
    { id_supervisor: number; numero_tarjeta_profesional: string; cuadrilla_asignada?: string | null }[]
  >([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [error, setError] = useState("");
  const [filtroProyecto, setFiltroProyecto] = useState("");
  const [filtroCuadrilla, setFiltroCuadrilla] = useState("");

  useEffect(() => {
    listarSupervisores()
      .then(setSupervisores)
      .catch((e) => setError(e instanceof Error ? e.message : "Error supervisores"));
    listarProyectos()
      .then(setProyectos)
      .catch(() => setProyectos([]));
  }, []);

  const cuadrillas = useMemo(() => {
    const set = new Set<string>();
    supervisores.forEach((s) => {
      if (s.cuadrilla_asignada) set.add(s.cuadrilla_asignada);
    });
    return Array.from(set).sort();
  }, [supervisores]);

  const supervisoresFiltrados = useMemo(() => {
    return supervisores.filter((s) => {
      if (filtroCuadrilla && (s.cuadrilla_asignada || "") !== filtroCuadrilla) return false;
      if (filtroProyecto) {
        // referencia por nombre de proyecto en listado de proyectos
        const match = proyectos.some(
          (p) => p.nombre === filtroProyecto && Number(p.id_supervisor) === s.id_supervisor
        );
        // si no hay match API, no ocultamos todo: solo filtramos cuando hay datos
        if (proyectos.length > 0 && !match) return false;
      }
      return true;
    });
  }, [supervisores, filtroCuadrilla, filtroProyecto, proyectos]);

  const empleadosMock = useMemo(() => {
    return MOCK_PERSONAL.filter((e) => !filtroProyecto || e.proyecto === filtroProyecto);
  }, [filtroProyecto]);

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Proyectos", to: "/proyectos" },
          { label: "Supervisores" },
        ]}
      />
      <div className="page-card" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Supervisores y cuadrillas</h1>
        <p className="page-subtitle">
          Filtros por proyecto y cuadrilla. Listado real desde API; empleados asignados en vista previa mock.
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}

        <FiltrosBar
          onLimpiar={() => {
            setFiltroProyecto("");
            setFiltroCuadrilla("");
          }}
          filtros={[
            {
              key: "proyecto",
              label: "Proyecto",
              value: filtroProyecto,
              onChange: setFiltroProyecto,
              options: [
                { value: "", label: "Todos" },
                ...Array.from(
                  new Set([
                    ...MOCK_PROYECTOS,
                    ...proyectos.map((p) => p.nombre),
                  ])
                ).map((p) => ({ value: p, label: p })),
              ],
            },
            {
              key: "cuadrilla",
              label: "Cuadrilla",
              value: filtroCuadrilla,
              onChange: setFiltroCuadrilla,
              options: [
                { value: "", label: "Todas" },
                ...cuadrillas.map((c) => ({ value: c, label: c })),
              ],
            },
          ]}
        />

        <div style={{ overflowX: "auto", marginTop: 4 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#fff7ed", textAlign: "left" }}>
                <th style={{ padding: 10, color: "#9a3412" }}>ID</th>
                <th style={{ padding: 10, color: "#9a3412" }}>Tarjeta profesional</th>
                <th style={{ padding: 10, color: "#9a3412" }}>Cuadrilla</th>
                <th style={{ padding: 10, color: "#9a3412" }}>Proyectos (ref.)</th>
              </tr>
            </thead>
            <tbody>
              {supervisoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
                    Sin supervisores con los filtros actuales o sin respuesta de la API.
                  </td>
                </tr>
              ) : (
                supervisoresFiltrados.map((s) => {
                  const proySup = proyectos
                    .filter((p) => Number(p.id_supervisor) === s.id_supervisor)
                    .map((p) => p.nombre)
                    .join(", ");
                  return (
                    <tr key={s.id_supervisor} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: 10 }}>#{s.id_supervisor}</td>
                      <td style={{ padding: 10 }}>{s.numero_tarjeta_profesional}</td>
                      <td style={{ padding: 10 }}>{s.cuadrilla_asignada || "—"}</td>
                      <td style={{ padding: 10 }}>{proySup || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <h2 className="page-title" style={{ fontSize: 16 }}>
          Empleados asignados (vista previa)
        </h2>
        <p className="page-subtitle">Datos mock: especialidad/cargo, estado y proyecto.</p>
        <div style={{ overflowX: "auto", marginTop: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 10 }}>Nombre</th>
                <th style={{ padding: 10 }}>Documento</th>
                <th style={{ padding: 10 }}>Cargo / especialidad</th>
                <th style={{ padding: 10 }}>Proyecto</th>
                <th style={{ padding: 10 }}>Supervisor</th>
                <th style={{ padding: 10 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {empleadosMock.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10, fontWeight: 600 }}>{e.nombre}</td>
                  <td style={{ padding: 10 }}>{e.documento}</td>
                  <td style={{ padding: 10 }}>{e.cargo}</td>
                  <td style={{ padding: 10 }}>{e.proyecto}</td>
                  <td style={{ padding: 10 }}>{e.supervisor}</td>
                  <td style={{ padding: 10 }}>{e.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
