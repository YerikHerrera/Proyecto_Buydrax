import { useEffect, useMemo, useState } from "react";
import type { Empleado } from "../../services/empleadosService";
import type { UsuarioPublic } from "../../services/usuariosService";
import type { Proyecto } from "../../services/proyectosService";
import type { AsignacionOut } from "../../services/asignacionesService";

const ESTADOS_MANUALES = [
  { value: "AUTO", label: "Automático (según hora de llegada)" },
  { value: "INASISTENCIA", label: "Inasistencia" },
  { value: "EXCUSA", label: "Excusa" },
];

type Props = {
  errorMsg?: string;
  empleados: Empleado[];
  usuariosMap: Record<number, UsuarioPublic>;
  proyectosMap: Record<number, Proyecto>;
  asignaciones: AsignacionOut[];
  empleadoId: string;
  setEmpleadoId: (v: string) => void;
  idProyecto: string;
  setIdProyecto: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  horaEntrada: string;
  setHoraEntrada: (v: string) => void;
  horaSalida: string;
  setHoraSalida: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  estadoCalculado?: string;
  loading: boolean;
  saving: boolean;
  onGuardar: () => void;
};

function nombreEmp(
  e: Empleado,
  usuariosMap: Record<number, UsuarioPublic>
): string {
  const u = usuariosMap[e.id_usuario];
  if (u) {
    const n = `${u.nombres || ""} ${u.apellidos || ""}`.trim();
    if (n) return n;
  }
  return `Empleado #${e.id_empleado}`;
}

export default function AsistenciaForm(p: Props) {
  const [busqueda, setBusqueda] = useState("");
  const hoy = new Date().toISOString().slice(0, 10);

  const esManualSinHoras = p.estado === "INASISTENCIA" || p.estado === "EXCUSA";
  const esExcusa = p.estado === "EXCUSA";

  const proyectosEmpleado = useMemo(() => {
    if (!p.empleadoId) return [];
    return p.asignaciones.filter(
      (a) =>
        String(a.id_empleado) === String(p.empleadoId) && a.activo !== false
    );
  }, [p.asignaciones, p.empleadoId]);

  useEffect(() => {
    if (proyectosEmpleado.length === 1) {
      p.setIdProyecto(String(proyectosEmpleado[0].id_proyecto));
    } else if (
      p.idProyecto &&
      !proyectosEmpleado.some((a) => String(a.id_proyecto) === String(p.idProyecto))
    ) {
      p.setIdProyecto("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.empleadoId, proyectosEmpleado.length]);

  const empleadosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return p.empleados;
    return p.empleados.filter((e) => {
      const nom = nombreEmp(e, p.usuariosMap).toLowerCase();
      const doc = (e.numero_documento || "").toLowerCase();
      const cargo = (e.cargo || "").toLowerCase();
      return nom.includes(q) || doc.includes(q) || cargo.includes(q);
    });
  }, [p.empleados, p.usuariosMap, busqueda]);

  return (
    <div className="asistencia-form" style={{ marginTop: 16, maxWidth: 560 }}>
      {p.errorMsg && (
        <p style={{ color: "#b00020", marginBottom: 12 }}>{p.errorMsg}</p>
      )}

      <label className="agregar-label">Buscar empleado</label>
      <div className="emp-search" style={{ marginBottom: 12 }}>
        <span className="emp-search-icon" aria-hidden>
          🔍
        </span>
        <input
          className="agregar-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Nombre, documento o cargo"
          autoComplete="off"
        />
        {busqueda && (
          <button
            type="button"
            className="emp-search-clear"
            onClick={() => setBusqueda("")}
            aria-label="Limpiar"
          >
            ×
          </button>
        )}
      </div>

      <label className="agregar-label">Empleado *</label>
      <select
        className="agregar-input"
        value={p.empleadoId}
        onChange={(e) => p.setEmpleadoId(e.target.value)}
        disabled={p.loading}
      >
        <option value="">Seleccione…</option>
        {empleadosFiltrados.map((e) => (
          <option key={e.id_empleado} value={e.id_empleado}>
            {nombreEmp(e, p.usuariosMap)} — {e.cargo || "Sin cargo"} ·{" "}
            {e.numero_documento || "s/doc"}
          </option>
        ))}
      </select>

      <label className="agregar-label" style={{ marginTop: 12 }}>
        Proyecto *
      </label>
      <select
        className="agregar-input"
        value={p.idProyecto}
        onChange={(e) => p.setIdProyecto(e.target.value)}
        disabled={!p.empleadoId || proyectosEmpleado.length === 0}
      >
        <option value="">
          {!p.empleadoId
            ? "Primero elige empleado"
            : proyectosEmpleado.length === 0
              ? "Sin asignación activa — asígnalo a un proyecto"
              : "Seleccione proyecto…"}
        </option>
        {proyectosEmpleado.map((a) => (
          <option key={a.id_asignacion} value={a.id_proyecto}>
            {p.proyectosMap[a.id_proyecto]?.nombre || `Proyecto #${a.id_proyecto}`}
            {a.cuadrilla ? ` · ${a.cuadrilla}` : ""}
          </option>
        ))}
      </select>
      <small className="field-hint">
        Solo proyectos donde el empleado tiene asignación activa.
      </small>

      <label className="agregar-label" style={{ marginTop: 12 }}>
        Tipo de registro *
      </label>
      <select
        className="agregar-input"
        value={p.estado}
        onChange={(e) => p.setEstado(e.target.value)}
      >
        {ESTADOS_MANUALES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {!esManualSinHoras && (
        <small className="field-hint">
          Estado calculado:{" "}
          <strong>{p.estadoCalculado || "PRESENTE"}</strong> (según hora de
          llegada vs turno o 08:00)
        </small>
      )}

      <label className="agregar-label" style={{ marginTop: 12 }}>
        Fecha *
      </label>
      <input
        className="agregar-input"
        type="date"
        value={p.fecha}
        max={hoy}
        disabled={!esExcusa}
        onChange={(e) => p.setFecha(e.target.value)}
      />
      <small className="field-hint">
        {esExcusa
          ? "Excusa: puedes elegir fecha pasada (no futura)."
          : "Fecha fija = hoy (solo Excusa permite cambiarla)."}
      </small>

      {!esManualSinHoras && (
        <>
          <label className="agregar-label" style={{ marginTop: 12 }}>
            Hora entrada *
          </label>
          <input
            className="agregar-input"
            type="time"
            value={p.horaEntrada}
            readOnly
            disabled
          />
          <small className="field-hint">
            Bloqueada en la hora actual (Presente/Retardo automático).
          </small>

          <label className="agregar-label" style={{ marginTop: 12 }}>
            Hora salida (opcional)
          </label>
          <input
            className="agregar-input"
            type="time"
            value={p.horaSalida}
            onChange={(e) => p.setHoraSalida(e.target.value)}
          />
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          className="agregar-btn-primario"
          onClick={p.onGuardar}
          disabled={p.saving || p.loading || !p.empleadoId}
        >
          {p.saving ? "Guardando…" : "Registrar asistencia"}
        </button>
      </div>
    </div>
  );
}
