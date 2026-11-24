import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  cargarDatosReportes,
  nombreEmpleado,
  proyectoDeEmpleado,
  type ReportesBundle,
} from "../../services/reportesService";

export default function ReportePersonal() {
  const [data, setData] = useState<ReportesBundle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("");
  const [estado, setEstado] = useState("");
  const [cargo, setCargo] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    cargarDatosReportes()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const filas = useMemo(() => {
    if (!data) return [];
    return data.empleados.map((e) => {
      const proy = proyectoDeEmpleado(e.id_empleado, data.asignaciones, data.proyectosMap);
      return {
        id: e.id_empleado,
        idProyecto: proy.id,
        proyecto: proy.nombre,
        nombre: nombreEmpleado(e, data.usuariosMap),
        documento: e.numero_documento,
        cargo: e.cargo || "—",
        estado: e.estado_laboral || "—",
      };
    });
  }, [data]);

  const cargosOpts = useMemo(() => {
    const set = new Set<string>();
    for (const f of filas) if (f.cargo && f.cargo !== "—") set.add(f.cargo);
    return [...set].sort();
  }, [filas]);

  const estadosOpts = useMemo(() => {
    const set = new Set<string>();
    for (const f of filas) if (f.estado) set.add(f.estado);
    return [...set].sort();
  }, [filas]);

  const filtradas = useMemo(() => {
    return filas.filter((r) => {
      if (proyecto && String(r.idProyecto) !== proyecto) return false;
      if (estado && r.estado !== estado) return false;
      if (cargo && r.cargo !== cargo) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !r.nombre.toLowerCase().includes(s) &&
          !r.cargo.toLowerCase().includes(s) &&
          !String(r.documento).includes(s)
        )
          return false;
      }
      return true;
    });
  }, [filas, proyecto, estado, cargo, q]);

  const { filas: filasPagina, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(filtradas, 8);

  const opcionesProyecto = useMemo(() => {
    if (!data) return [];
    return data.proyectos.map((p) => ({
      value: String(p.id_proyecto),
      label: p.nombre,
    }));
  }, [data]);

  return (
    <ReporteShell
      titulo="Personal activo / listado"
      subtitulo="Todos los empleados de la BD con su proyecto asignado (si lo tienen)."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Reportes", to: "/reportes" },
        { label: "Personal" },
      ]}
      accionHref="/empleados"
      accionLabel="Lista de empleados"
    >
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Nombre, documento o cargo…"
        onLimpiar={() => {
          setProyecto("");
          setEstado("");
          setCargo("");
          setQ("");
        }}
        filtros={[
          {
            key: "proyecto",
            label: "Proyecto",
            value: proyecto,
            onChange: setProyecto,
            options: [{ value: "", label: "Todos" }, ...opcionesProyecto],
          },
          {
            key: "cargo",
            label: "Cargo",
            value: cargo,
            onChange: setCargo,
            options: [
              { value: "", label: "Todos" },
              ...cargosOpts.map((c) => ({ value: c, label: c })),
            ],
          },
          {
            key: "estado",
            label: "Estado",
            value: estado,
            onChange: setEstado,
            options: [
              { value: "", label: "Todos" },
              ...estadosOpts.map((e) => ({ value: e, label: e })),
            ],
          },
        ]}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              {["Proyecto", "Empleado", "Documento", "Cargo", "Estado"].map((h) => (
                <th key={h} style={{ padding: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filasPagina.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                  {loading ? "Cargando…" : "Sin empleados."}
                </td>
              </tr>
            ) : (
              filasPagina.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>{r.proyecto}</td>
                  <td style={{ padding: 10 }}>{r.nombre}</td>
                  <td style={{ padding: 10 }}>{r.documento}</td>
                  <td style={{ padding: 10 }}>{r.cargo}</td>
                  <td style={{ padding: 10 }}>{r.estado}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pagina={pagina}
        totalPaginas={totalPaginas}
        total={total}
        etiqueta="empleados"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </ReporteShell>
  );
}
