import { useMemo, useState } from "react";
import type { Empleado } from "../../services/empleadosService";
import type { Proyecto } from "../../services/proyectosService";
import type { UsuarioPublic } from "../../services/usuariosService";
import TimeSelect from "../ui/TimeSelect";

const PRESETS = [
  { label: "Diurno 07–15", inicio: "07:00", fin: "15:00", tipo: "Diurno" },
  { label: "Diurno 08–16", inicio: "08:00", fin: "16:00", tipo: "Diurno" },
  { label: "Tarde 14–22", inicio: "14:00", fin: "22:00", tipo: "Diurno" },
  { label: "Nocturno 22–06", inicio: "22:00", fin: "06:00", tipo: "Nocturno" },
];

export default function TurnoForm({
  empleados,
  proyectos,
  usuariosMap,
  empleadoId,
  setEmpleadoId,
  proyectoId,
  setProyectoId,
  tipoTurno,
  setTipoTurno,
  fecha,
  setFecha,
  horaInicio,
  setHoraInicio,
  horaFin,
  setHoraFin,
  loading,
  saving,
  onGuardar,
  sinAsignacion,
}: {
  empleados: Empleado[];
  proyectos: Proyecto[];
  usuariosMap: Record<number, UsuarioPublic>;
  empleadoId: string;
  setEmpleadoId: (v: string) => void;
  proyectoId: string;
  setProyectoId: (v: string) => void;
  tipoTurno: string;
  setTipoTurno: (v: string) => void;
  fecha: string;
  setFecha: (v: string) => void;
  horaInicio: string;
  setHoraInicio: (v: string) => void;
  horaFin: string;
  setHoraFin: (v: string) => void;
  loading: boolean;
  saving: boolean;
  onGuardar: () => void;
  sinAsignacion?: boolean;
}) {
  const [busqueda, setBusqueda] = useState("");

  const nombre = (e: Empleado) => {
    const u = usuariosMap[e.id_usuario];
    if (u) return `${u.nombres} ${u.apellidos}`.trim();
    return `${e.cargo} · ${e.numero_documento}`;
  };

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

  const aplicarPreset = (p: (typeof PRESETS)[0]) => {
    setHoraInicio(p.inicio);
    setHoraFin(p.fin);
    setTipoTurno(p.tipo);
  };

  return (
    <div className="agregar-form" style={{ marginTop: 16 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="agregar-label">Buscar empleado</label>
        <div className="emp-search">
          <i className="bi bi-search" />
          <input
            type="text"
            inputMode="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre, documento o cargo…"
            disabled={loading}
            autoComplete="off"
          />
          {busqueda ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setBusqueda("")}
              aria-label="Limpiar"
            >
              <i className="bi bi-x-lg" />
            </button>
          ) : null}
        </div>
        <span className="emp-search__meta">
          {filtrados.length} de {empleados.length} empleados
        </span>
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
        <label className="agregar-label">Proyecto *</label>
        <select
          className="agregar-input"
          value={proyectoId}
          onChange={(e) => setProyectoId(e.target.value)}
          disabled={loading || !empleadoId || sinAsignacion}
        >
          <option value="">
            {!empleadoId
              ? "Primero elige empleado"
              : sinAsignacion
                ? "Sin proyectos asignados"
                : "Seleccionar"}
          </option>
          {proyectos.map((p) => (
            <option key={p.id_proyecto} value={p.id_proyecto}>
              {p.nombre}
            </option>
          ))}
        </select>
        {empleadoId && !sinAsignacion && proyectos.length > 1 && (
          <small className="field-hint">
            {proyectos.length} proyectos activos — elige el del día.
          </small>
        )}
      </div>

      <div>
        <label className="agregar-label">Tipo de turno</label>
        <select
          className="agregar-input"
          value={tipoTurno}
          onChange={(e) => setTipoTurno(e.target.value)}
        >
          <option value="Diurno">Diurno</option>
          <option value="Nocturno">Nocturno</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">Fecha *</label>
        <input
          className="agregar-input"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label className="agregar-label">Horarios sugeridos</label>
        <div className="time-presets">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="time-preset-btn"
              onClick={() => aplicarPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <TimeSelect
        label="Hora inicio *"
        value={horaInicio}
        onChange={setHoraInicio}
        disabled={loading}
      />
      <TimeSelect
        label="Hora fin *"
        value={horaFin}
        onChange={setHoraFin}
        disabled={loading}
      />

      <p className="field-hint" style={{ gridColumn: "1 / -1", margin: 0 }}>
        No se permiten las mismas horas en otro proyecto ni turnos el mismo día con menos de 2 h de
        diferencia.
      </p>

      <div className="agregar-botones" style={{ gridColumn: "1 / -1" }}>
        <button
          type="button"
          className="agregar-btn-primario"
          onClick={onGuardar}
          disabled={saving || loading || sinAsignacion}
        >
          {saving ? "Guardando…" : "Guardar turno"}
        </button>
      </div>
    </div>
  );
}
