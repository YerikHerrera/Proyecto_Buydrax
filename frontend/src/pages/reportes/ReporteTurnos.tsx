import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  cargarDatosReportes,
  nombreEmpleado,
  type ReportesBundle,
} from "../../services/reportesService";

export default function ReporteTurnos() {
  const [data, setData] = useState<ReportesBundle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    cargarDatosReportes()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const filas = useMemo(() => {
    if (!data) return [];
    const empById = new Map(data.empleados.map((e) => [e.id_empleado, e]));
    return data.turnos.map((t) => {
      const emp = empById.get(t.id_empleado);
      const proy = data.proyectosMap[t.id_proyecto];
      return {
        id: t.id_turno,
        idProyecto: t.id_proyecto,
        proyecto: proy?.nombre || `Proyecto #${t.id_proyecto}`,
        nombre: emp ? nombreEmpleado(emp, data.usuariosMap) : `Empleado #${t.id_empleado}`,
        cargo: emp?.cargo || "—",
        tipoTurno: t.tipo_turno,
        horaInicio: String(t.hora_inicio).slice(0, 5),
        horaFin: String(t.hora_fin).slice(0, 5),
        fecha: t.fecha,
      };
    });
  }, [data]);

  const filtradas = useMemo(() => {
    return filas.filter((r) => {
      if (proyecto && String(r.idProyecto) !== proyecto) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.nombre.toLowerCase().includes(s) && !r.cargo.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [filas, proyecto, q]);

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
      titulo="Reporte de turnos"
      subtitulo="Turnos reales de la BD · proyecto, empleado, cargo y horario."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Asistencia", to: "/asistencia" },
        { label: "Turnos" },
      ]}
      accionHref="/asistencia/turno"
      accionLabel="Asignar turnos"
    >
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Nombre o cargo…"
        onLimpiar={() => {
          setProyecto("");
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
        ]}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              {["Proyecto", "Empleado", "Cargo", "Fecha", "Tipo", "Inicio", "Fin"].map((h) => (
                <th key={h} style={{ padding: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filasPagina.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                  {loading ? "Cargando…" : "No hay turnos registrados o no coinciden con el filtro."}
                </td>
              </tr>
            ) : (
              filasPagina.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>{r.proyecto}</td>
                  <td style={{ padding: 10 }}>{r.nombre}</td>
                  <td style={{ padding: 10 }}>{r.cargo}</td>
                  <td style={{ padding: 10 }}>{r.fecha}</td>
                  <td style={{ padding: 10 }}>{r.tipoTurno}</td>
                  <td style={{ padding: 10 }}>{r.horaInicio}</td>
                  <td style={{ padding: 10 }}>{r.horaFin}</td>
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
        etiqueta="turnos"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </ReporteShell>
  );
}
