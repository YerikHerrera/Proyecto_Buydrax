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

type Fila = {
  id: number;
  proyecto: string;
  idProyecto: number | null;
  nombre: string;
  cargo: string;
  mes: string;
  diasAsistidos: number;
  faltas: number;
  justificadas: number;
  sinRegistro: boolean;
  estado: string;
};

function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function ReporteAsistencia() {
  const [data, setData] = useState<ReportesBundle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");
  const [mes, setMes] = useState(mesActual());

  useEffect(() => {
    cargarDatosReportes()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const filas: Fila[] = useMemo(() => {
    if (!data) return [];
    const { empleados, usuariosMap, asignaciones, proyectosMap, asistencias } = data;
    return empleados.map((e) => {
      const proy = proyectoDeEmpleado(e.id_empleado, asignaciones, proyectosMap);
      const delMes = asistencias.filter(
        (a) => a.id_empleado === e.id_empleado && String(a.fecha).startsWith(mes)
      );
      const totalReg = delMes.length;
      // Solo PRESENTE / RETARDO cuentan como días trabajados (suman horas)
      const asistidos = delMes.filter((a) => {
        const e = (a.estado_asistencia || "").toUpperCase();
        return e === "PRESENTE" || e === "RETARDO";
      }).length;
      // INASISTENCIA = falta (no suma horas). Excusa llega como INASISTENCIA + obs EXCUSA
      const faltas = delMes.filter((a) => {
        const e = (a.estado_asistencia || "").toUpperCase();
        return e === "INASISTENCIA" || e.includes("FALTA");
      }).length;
      const justificadas = delMes.filter((a) => {
        const e = (a.estado_asistencia || "").toUpperCase();
        const obs = String((a as { observacion?: string }).observacion || "").toUpperCase();
        return (
          obs.includes("EXCUSA") ||
          /JUSTIFIC|INCAPAC|PERMISO|EXCUSA/i.test(e + " " + obs)
        );
      }).length;
      const sinRegistro = totalReg === 0;
      let est = "Sin registros";
      if (!sinRegistro) {
        if (faltas > 0 && justificadas >= faltas) est = "Incapacidad / justificado";
        else if (faltas > 0) est = "Con faltas";
        else est = "Al día";
      }
      return {
        id: e.id_empleado,
        proyecto: proy.nombre,
        idProyecto: proy.id,
        nombre: nombreEmpleado(e, usuariosMap),
        cargo: e.cargo || "—",
        mes,
        diasAsistidos: asistidos,
        faltas,
        justificadas,
        sinRegistro,
        estado: est,
      };
    });
  }, [data, mes]);

  const filtradas = useMemo(() => {
    return filas.filter((r) => {
      if (proyecto && String(r.idProyecto) !== proyecto && r.proyecto !== proyecto) return false;
      if (estado && r.estado !== estado) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.nombre.toLowerCase().includes(s) && !r.cargo.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [filas, proyecto, estado, q]);

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
      titulo="Reporte de asistencia"
      subtitulo="Datos reales de la BD. Empleados sin registros del mes aparecen como «Sin registros»."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Asistencia", to: "/asistencia" },
        { label: "Reporte asistencia" },
      ]}
      accionHref="/asistencia"
      accionLabel="Registrar asistencia"
    >
      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {loading && <p style={{ color: "#64748b" }}>Cargando…</p>}
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Nombre o cargo…"
        onLimpiar={() => {
          setProyecto("");
          setEstado("");
          setQ("");
          setMes(mesActual());
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
            key: "estado",
            label: "Estado",
            value: estado,
            onChange: setEstado,
            options: [
              { value: "", label: "Todos" },
              { value: "Al día", label: "Al día" },
              { value: "Con faltas", label: "Con faltas" },
              { value: "Sin registros", label: "Sin registros" },
              { value: "Incapacidad / justificado", label: "Incapacidad / justificado" },
            ],
          },
        ]}
      />
      <div style={{ marginBottom: 12 }}>
        <label className="agregar-label">Mes</label>
        <input
          className="agregar-input"
          type="month"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          style={{ maxWidth: 220 }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              {["Proyecto", "Empleado", "Cargo", "Mes", "Asistidos", "Faltas", "Justif.", "Estado"].map(
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
                <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                  {loading ? "Cargando…" : "Sin empleados o sin coincidencias con el filtro."}
                </td>
              </tr>
            ) : (
              filasPagina.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>{r.proyecto}</td>
                  <td style={{ padding: 10 }}>{r.nombre}</td>
                  <td style={{ padding: 10 }}>{r.cargo}</td>
                  <td style={{ padding: 10 }}>{r.mes}</td>
                  <td style={{ padding: 10 }}>{r.sinRegistro ? "—" : r.diasAsistidos}</td>
                  <td style={{ padding: 10 }}>{r.sinRegistro ? "—" : r.faltas}</td>
                  <td style={{ padding: 10 }}>{r.sinRegistro ? "—" : r.justificadas}</td>
                  <td style={{ padding: 10 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: r.sinRegistro
                          ? "#f1f5f9"
                          : r.estado === "Al día"
                            ? "#d1fae5"
                            : r.estado === "Con faltas"
                              ? "#fef3c7"
                              : "#e0e7ff",
                        color: "#334155",
                      }}
                    >
                      {r.estado}
                    </span>
                  </td>
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
