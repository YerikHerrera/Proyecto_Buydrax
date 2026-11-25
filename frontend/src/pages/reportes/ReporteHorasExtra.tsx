import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

export default function ReporteHorasExtra() {
  const [data, setData] = useState<ReportesBundle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("");
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
    return data.horasExtra.map((h) => {
      const emp = empById.get(h.id_empleado);
      const proy = emp
        ? proyectoDeEmpleado(emp.id_empleado, data.asignaciones, data.proyectosMap)
        : { id: null as number | null, nombre: "—" };
      return {
        id: h.id_hora_extra,
        idProyecto: proy.id,
        proyecto: proy.nombre,
        nombre: emp ? nombreEmpleado(emp, data.usuariosMap) : `Empleado #${h.id_empleado}`,
        cargo: emp?.cargo || "—",
        horas: h.cantidad_horas,
        tipo: h.tipo_hora,
        estado: h.estado_he,
        fecha: h.fecha_inicio,
        fechaFin: h.fecha_fin,
      };
    });
  }, [data]);

  const cargosOpts = useMemo(() => {
    const set = new Set<string>();
    if (data) {
      for (const e of data.empleados) if (e.cargo) set.add(e.cargo);
      for (const f of filas) if (f.cargo && f.cargo !== "—") set.add(f.cargo);
    }
    return [...set].sort();
  }, [data, filas]);

  const filtradas = useMemo(() => {
    return filas.filter((r) => {
      if (proyecto && String(r.idProyecto) !== proyecto) return false;
      if (cargo && r.cargo !== cargo) return false;
      if (estado && r.estado !== estado) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.nombre.toLowerCase().includes(s) && !r.cargo.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [filas, proyecto, cargo, estado, q]);

  const { filas: filasPagina, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(filtradas, 8);

  const opcionesProyecto = useMemo(() => {
    if (!data) return [];
    return data.proyectos.map((p) => ({
      value: String(p.id_proyecto),
      label: p.nombre,
    }));
  }, [data]);

  const badge = (est: string) => {
    const u = (est || "").toUpperCase();
    const bg =
      u.includes("APROB") ? "#d1fae5" : u.includes("RECHAZ") ? "#fee2e2" : "#fef3c7";
    return (
      <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: bg }}>
        {est}
      </span>
    );
  };

  return (
    <ReporteShell
      titulo="Reporte de horas extra"
      subtitulo="Registros reales. Filtros de proyecto y cargo tomados de la BD."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Asistencia", to: "/asistencia" },
        { label: "Horas extra" },
      ]}
      accionHref="/asistencia/reporte"
      accionLabel="Registrar horas extras"
    >
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Nombre del empleado…"
        onLimpiar={() => {
          setProyecto("");
          setCargo("");
          setEstado("");
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
              { value: "PENDIENTE", label: "Pendiente" },
              { value: "APROBADA", label: "Aprobada" },
              { value: "RECHAZADA", label: "Rechazada" },
            ],
          },
        ]}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              {["Proyecto", "Empleado", "Cargo", "Fecha", "Horas", "Tipo", "Estado"].map((h) => (
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
                  {loading ? (
                    "Cargando…"
                  ) : (
                    <>
                      No hay horas extra.{" "}
                      <Link to="/asistencia/reporte">Registrar la primera →</Link>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filasPagina.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>{r.proyecto}</td>
                  <td style={{ padding: 10 }}>{r.nombre}</td>
                  <td style={{ padding: 10 }}>{r.cargo}</td>
                  <td style={{ padding: 10 }}>
                    {r.fecha}
                    {r.fechaFin && r.fechaFin !== r.fecha ? ` → ${r.fechaFin}` : ""}
                  </td>
                  <td style={{ padding: 10 }}>
                    <strong>{r.horas} h</strong>
                  </td>
                  <td style={{ padding: 10 }}>{r.tipo}</td>
                  <td style={{ padding: 10 }}>{badge(r.estado)}</td>
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
        etiqueta="registros"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </ReporteShell>
  );
}
