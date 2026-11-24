import { useEffect, useMemo, useState } from "react";
import type { Empleado } from "../../services/empleadosService";
import type { UsuarioPublic } from "../../services/usuariosService";

const ESTADOS = [
  { value: "PRESENTE", label: "Presente" },
  { value: "RETARDO", label: "Retardo" },
  { value: "INASISTENCIA", label: "Inasistencia" },
  { value: "EXCUSA", label: "Excusa" },
];

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function ahoraHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AsistenciaForm({
  empleados,
  usuariosMap,
  empleadoId,
  setEmpleadoId,
  fecha,
  setFecha,
  horaEntrada,
  setHoraEntrada,
  horaSalida,
  setHoraSalida,
  estado,
  setEstado,
  loading,
  saving,
  onGuardar,
  errorMsg,
}: {
  empleados: Empleado[];
  usuariosMap: Record<number, UsuarioPublic>;
  empleadoId: string;
  setEmpleadoId: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  horaEntrada: string;
  setHoraEntrada: (v: string) => void;
  horaSalida: string;
  setHoraSalida: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  loading: boolean;
  saving: boolean;
  onGuardar: () => void;
  errorMsg?: string;
}) {
  const [busqueda, setBusqueda] = useState("");
  const hoy = hoyISO();
  const esExcusa = estado === "EXCUSA";
  const esInasistencia = estado === "INASISTENCIA";
  const esPresencia = estado === "PRESENTE" || estado === "RETARDO";
  // Inasistencia/Excusa: no cuentan horas de jornada
  const sinHoras = esInasistencia || esExcusa;

  // Fecha: siempre hoy salvo Excusa
  useEffect(() => {
    if (!esExcusa) setFecha(hoy);
  }, [esExcusa, hoy, setFecha]);

  // Presente/Retardo: hora entrada = ahora (bloqueada), se refresca al cambiar estado
  useEffect(() => {
    if (esPresencia) {
      setHoraEntrada(ahoraHHMM());
      setHoraSalida("");
    } else if (sinHoras) {
      setHoraEntrada("");
      setHoraSalida("");
    }
  }, [estado, esPresencia, sinHoras, setHoraEntrada, setHoraSalida]);

  // Mantener hora actual en Presente/Retardo (cada 30s)
  useEffect(() => {
    if (!esPresencia) return;
    const t = setInterval(() => setHoraEntrada(ahoraHHMM()), 30000);
    return () => clearInterval(t);
  }, [esPresencia, setHoraEntrada]);

  const nombre = (e: Empleado) =>
    usuariosMap[e.id_usuario]
      ? `${usuariosMap[e.id_usuario].nombres} ${usuariosMap[e.id_usuario].apellidos}`
      : `${e.cargo} · ${e.numero_documento}`;

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return empleados;
    return empleados.filter((e) => {
      const n = nombre(e).toLowerCase();
      return (
        n.includes(q) ||
        (e.cargo || "").toLowerCase().includes(q) ||
        String(e.numero_documento || "").includes(q)
      );
    });
  }, [empleados, busqueda, usuariosMap]);

  return (
    <div className="agregar-form" style={{ marginTop: 16 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="agregar-label">Buscar empleado</label>
        <div className="emp-search">
          <i className="bi bi-search" aria-hidden />
          <input
            type="text"
            inputMode="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre, documento o cargo…"
            disabled={loading}
            autoComplete="off"
          />
        </div>
        <small className="emp-search__meta">
          {filtrados.length} de {empleados.length}
        </small>
      </div>

      <div>
        <label className="agregar-label">Empleado *</label>
        <select
          className="agregar-input"
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccionar</option>
          {filtrados.map((e) => (
            <option key={e.id_empleado} value={e.id_empleado}>
              {nombre(e)} — {e.cargo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Estado *</label>
        <select
          className="agregar-input"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          {ESTADOS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <small className="field-hint">
          {esPresencia && "Presente/Retardo: hora de entrada fija = hora actual (no editable)."}
          {esInasistencia &&
            "Inasistencia: sin horas. No suma jornada para nómina / reporte."}
          {esExcusa && "Excusa: puedes cambiar la fecha. Sin horas de trabajo."}
        </small>
      </div>

      <div>
        <label className="agregar-label">Fecha *</label>
        <input
          className="agregar-input"
          type="date"
          value={fecha || hoy}
          max={hoy}
          readOnly={!esExcusa}
          disabled={!esExcusa}
          onChange={(e) => setFecha(e.target.value)}
          style={!esExcusa ? { background: "#f8fafc", cursor: "not-allowed" } : undefined}
        />
        <small className="field-hint">
          {esExcusa ? "Editable solo en Excusa (sin fechas futuras)" : "Siempre hoy"}
        </small>
      </div>

      {!sinHoras && (
        <>
          <div>
            <label className="agregar-label">Hora entrada *</label>
            <input
              className="agregar-input"
              type="time"
              value={horaEntrada}
              readOnly
              disabled
              style={{ background: "#f8fafc", cursor: "not-allowed", fontWeight: 600 }}
            />
            <small className="field-hint">Bloqueada en la hora actual del sistema</small>
          </div>
          <div>
            <label className="agregar-label">Hora salida</label>
            <input
              className="agregar-input"
              type="time"
              value={horaSalida}
              min={horaEntrada || undefined}
              onChange={(e) => setHoraSalida(e.target.value)}
            />
            <small className="field-hint">Opcional · debe ser ≥ entrada</small>
          </div>
        </>
      )}

      {sinHoras && (
        <div style={{ gridColumn: "1 / -1" }}>
          <div
            className="tip-box"
            style={{ margin: 0, borderLeftColor: esInasistencia ? "#94a3b8" : "#f97316" }}
          >
            <strong>{esInasistencia ? "Inasistencia" : "Excusa"}:</strong> no se registran horas de
            entrada/salida. En reportes y nómina ese día no cuenta como jornada trabajada
            {esExcusa ? " (justificada)." : "."}
          </div>
        </div>
      )}

      {errorMsg && (
        <p style={{ gridColumn: "1 / -1", color: "#b00020", margin: 0 }}>{errorMsg}</p>
      )}

      <div className="agregar-botones" style={{ gridColumn: "1 / -1" }}>
        <button
          type="button"
          className="agregar-btn-primario"
          onClick={onGuardar}
          disabled={saving || loading || !empleadoId}
        >
          {saving ? "Guardando…" : "Registrar asistencia"}
        </button>
      </div>
    </div>
  );
}
