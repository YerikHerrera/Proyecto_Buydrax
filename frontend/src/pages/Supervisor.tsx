import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import FiltrosBar from "../components/reportes/FiltrosBar";
import { listarSupervisores } from "../services/proyectosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { MOCK_PERSONAL, MOCK_PROYECTOS } from "../data/mockReportes";
import "../styles/Supervisor.css";
import SupervisoresTable from "../components/supervisor/SupervisoresTable";
import EmpleadosAsignadosPreview from "../components/supervisor/EmpleadosAsignadosPreview";

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

        <SupervisoresTable items={supervisoresFiltrados} proyectos={proyectos} />
      </div>

      <div className="page-card">
        <h2 className="page-title" style={{ fontSize: 16 }}>
          Empleados asignados (vista previa)
        </h2>
        <p className="page-subtitle">Datos mock: especialidad/cargo, estado y proyecto.</p>
        <EmpleadosAsignadosPreview empleados={empleadosMock} />
      </div>
    </AppShell>
  );
}
