import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  cargarDatosReportes,
  type ReportesBundle,
} from "../../services/reportesService";

export default function ReporteGeneral() {
  const [data, setData] = useState<ReportesBundle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("");

  useEffect(() => {
    cargarDatosReportes()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const resumen = useMemo(() => {
    if (!data) {
      return {
        personal: 0,
        activos: 0,
        asistencia: 0,
        hePend: 0,
        horas: 0,
        turnos: 0,
        proyectos: 0,
        asignaciones: 0,
      };
    }
    const idProy = proyecto ? Number(proyecto) : null;
    const asigs = idProy
      ? data.asignaciones.filter((a) => a.id_proyecto === idProy && a.activo !== false)
      : data.asignaciones.filter((a) => a.activo !== false);
    const empIds = idProy ? new Set(asigs.map((a) => a.id_empleado)) : null;
    const personal = empIds
      ? data.empleados.filter((e) => empIds.has(e.id_empleado))
      : data.empleados;
    const activos = personal.filter((e) => e.estado_laboral === "ACTIVO").length;
    const turnos = idProy
      ? data.turnos.filter((t) => t.id_proyecto === idProy)
      : data.turnos;
    const he = empIds
      ? data.horasExtra.filter((h) => empIds.has(h.id_empleado))
      : data.horasExtra;
    const hePend = he.filter((h) => (h.estado_he || "").toUpperCase().includes("PEND")).length;
    const horas = he.reduce((a, h) => a + Number(h.cantidad_horas || 0), 0);
    const asistencia = empIds
      ? data.asistencias.filter((a) => empIds.has(a.id_empleado))
      : data.asistencias;

    return {
      personal: personal.length,
      activos,
      asistencia: asistencia.length,
      hePend,
      horas,
      turnos: turnos.length,
      proyectos: data.proyectos.length,
      asignaciones: asigs.length,
    };
  }, [data, proyecto]);

  const opcionesProyecto = useMemo(() => {
    if (!data) return [];
    return data.proyectos.map((p) => ({
      value: String(p.id_proyecto),
      label: p.nombre,
    }));
  }, [data]);

  const cards = [
    { label: "Empleados", value: resumen.personal, to: "/reportes/personal" },
    { label: "Activos", value: resumen.activos, to: "/reportes/personal" },
    { label: "Asignaciones", value: resumen.asignaciones, to: "/proyectos/asignacion" },
    { label: "Registros asistencia", value: resumen.asistencia, to: "/reportes/asistencia" },
    { label: "Turnos", value: resumen.turnos, to: "/reportes/turnos" },
    { label: "HE pendientes", value: resumen.hePend, to: "/reportes/horas-extra" },
    { label: "Horas extra (suma)", value: `${resumen.horas} h`, to: "/reportes/horas-extra" },
    { label: "Proyectos", value: resumen.proyectos, to: "/reportes/proyectos" },
  ];

  return (
    <ReporteShell
      titulo="Reporte general por proyecto"
      subtitulo="Resumen con datos reales de la API (empleados, asignaciones, asistencia, turnos y HE)."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Reportes", to: "/reportes" },
        { label: "General" },
      ]}
    >
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {loading && <p style={{ color: "#64748b" }}>Cargando…</p>}
      <FiltrosBar
        busqueda=""
        onBusqueda={() => {}}
        placeholderBusqueda=""
        onLimpiar={() => setProyecto("")}
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 14,
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b" }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{c.value}</div>
          </Link>
        ))}
      </div>
    </ReporteShell>
  );
}
