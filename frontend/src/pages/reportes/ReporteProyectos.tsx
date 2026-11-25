import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  cargarDatosReportes,
  type ReportesBundle,
} from "../../services/reportesService";

export default function ReporteProyectos() {
  const [data, setData] = useState<ReportesBundle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
    return data.proyectos.map((p) => {
      const asignados = data.asignaciones.filter(
        (a) => a.id_proyecto === p.id_proyecto && a.activo !== false
      );
      return {
        id: p.id_proyecto,
        nombre: p.nombre,
        ubicacion: p.ubicacion_calle || "—",
        estado: p.estado_proyecto || "—",
        fechaInicio: p.fecha_inicio,
        fechaFin: p.fecha_fin,
        empleados: asignados.length,
        descripcion: p.descripcion || "",
      };
    });
  }, [data]);

  const estadosOpts = useMemo(() => {
    const set = new Set<string>();
    for (const f of filas) if (f.estado) set.add(f.estado);
    return [...set].sort();
  }, [filas]);

  const filtradas = useMemo(() => {
    return filas.filter((r) => {
      if (estado && r.estado !== estado) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !r.nombre.toLowerCase().includes(s) &&
          !r.ubicacion.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [filas, estado, q]);

  const { filas: filasPagina, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(filtradas, 8);

  return (
    <ReporteShell
      titulo="Reporte de proyectos / obras"
      subtitulo="Proyectos reales de la BD. Personal = asignaciones activas. (No hay presupuesto en el modelo actual.)"
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Proyectos", to: "/proyectos" },
        { label: "Reporte" },
      ]}
      accionHref="/proyectos"
      accionLabel="Crear / listar proyectos"
    >
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Proyecto o ubicación…"
        onLimpiar={() => {
          setEstado("");
          setQ("");
        }}
        filtros={[
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
              {["Proyecto", "Ubicación", "Estado", "Inicio", "Fin", "Personal asignado"].map(
                (h) => (
                  <th key={h} style={{ padding: 10 }}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filasPagina.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                  {loading ? "Cargando…" : "No hay proyectos."}
                </td>
              </tr>
            ) : (
              filasPagina.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>
                    <strong>{r.nombre}</strong>
                  </td>
                  <td style={{ padding: 10 }}>{r.ubicacion}</td>
                  <td style={{ padding: 10 }}>{r.estado}</td>
                  <td style={{ padding: 10 }}>{r.fechaInicio}</td>
                  <td style={{ padding: 10 }}>{r.fechaFin}</td>
                  <td style={{ padding: 10 }}>{r.empleados}</td>
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
        etiqueta="proyectos"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </ReporteShell>
  );
}
