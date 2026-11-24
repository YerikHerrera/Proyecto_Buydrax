import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Empleado } from "../../services/empleadosService";
import type { Proyecto } from "../../services/proyectosService";
import type { UsuarioPublic } from "../../services/usuariosService";

export default function AsignacionEmpleadoForm({
  empleados,
  proyectos,
  usuariosMap,
  empleadoId,
  setEmpleadoId,
  proyectoId,
  setProyectoId,
  rol,
  setRol,
  cuadrilla,
  setCuadrilla,
  fechaInicio,
  setFechaInicio,
  cuadrillasOpts,
  loading,
  saving,
  onGuardar,
  afterEmpleado,
  errorFecha,
}: {
  empleados: Empleado[];
  proyectos: Proyecto[];
  usuariosMap: Record<number, UsuarioPublic>;
  empleadoId: string;
  setEmpleadoId: (v: string) => void;
  proyectoId: string;
  setProyectoId: (v: string) => void;
  rol: string;
  setRol: (v: string) => void;
  cuadrilla: string;
  setCuadrilla: (v: string) => void;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  cuadrillasOpts: string[];
  loading: boolean;
  saving: boolean;
  onGuardar: () => void;
  afterEmpleado?: ReactNode;
  errorFecha?: string;
}) {
  const [busqueda, setBusqueda] = useState("");

  const nombre = (e: Empleado) =>
    usuariosMap[e.id_usuario]
      ? `${usuariosMap[e.id_usuario].nombres} ${usuariosMap[e.id_usuario].apellidos}`
      : `${e.cargo} · Doc. ${e.numero_documento}`;

  const empleadoSel = useMemo(
    () => empleados.find((e) => String(e.id_empleado) === String(empleadoId)),
    [empleados, empleadoId]
  );

  useEffect(() => {
    setRol(empleadoSel?.cargo?.trim() || "");
  }, [empleadoSel, setRol]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return empleados;
    return empleados.filter((e) => {
      const n = nombre(e).toLowerCase();
      const cargo = (e.cargo || "").toLowerCase();
      const doc = String(e.numero_documento || "").toLowerCase();
      return n.includes(q) || cargo.includes(q) || doc.includes(q);
    });
  }, [empleados, busqueda, usuariosMap]);

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="asignacion-grid">
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="agregar-label" htmlFor="asig-buscar">
            Buscar empleado
          </label>
          <div className="asignacion-field asignacion-search">
            <i className="bi bi-search" style={{ color: "#64748b" }} />
            <input
              id="asig-buscar"
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
                aria-label="Limpiar búsqueda"
              >
                <i className="bi bi-x-lg" />
              </button>
            ) : null}
          </div>
          <small className="field-hint">
            {filtrados.length} de {empleados.length} empleados
          </small>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="agregar-label" htmlFor="asig-empleado">
            Nombre del empleado *
          </label>
          <div className="asignacion-field">
            <i className="bi bi-person" />
            <select
              id="asig-empleado"
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar empleado</option>
              {filtrados.map((e) => (
                <option key={e.id_empleado} value={e.id_empleado}>
                  {nombre(e)} — {e.cargo}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down" aria-hidden />
          </div>
        </div>
      </div>

      {afterEmpleado}

      <div className="asignacion-grid" style={{ marginTop: afterEmpleado ? 8 : 0 }}>
        <div>
          <label className="agregar-label" htmlFor="asig-proyecto">
            Proyecto *
          </label>
          <div className="asignacion-field">
            <i className="bi bi-folder" />
            <select
              id="asig-proyecto"
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar proyecto</option>
              {proyectos.map((p) => (
                <option key={p.id_proyecto} value={p.id_proyecto}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down" aria-hidden />
          </div>
        </div>

        <div>
          <label className="agregar-label" htmlFor="asig-funcion">
            Función en el proyecto
          </label>
          <div className="asignacion-field" style={{ background: "#f8fafc" }}>
            <i className="bi bi-briefcase" />
            <input
              id="asig-funcion"
              type="text"
              value={rol || ""}
              readOnly
              disabled
              placeholder="Se completa al elegir el empleado"
              style={{ fontWeight: 600, cursor: "not-allowed" }}
            />
            <i className="bi bi-lock-fill" style={{ color: "#94a3b8" }} aria-hidden />
          </div>
          <small className="field-hint">Cargo del empleado (no editable)</small>
        </div>

        <div>
          <label className="agregar-label" htmlFor="asig-cuadrilla">
            Cuadrilla
          </label>
          <div className="asignacion-field">
            <i className="bi bi-people" />
            <select
              id="asig-cuadrilla"
              value={cuadrilla}
              onChange={(e) => setCuadrilla(e.target.value)}
            >
              <option value="">Seleccionar cuadrilla</option>
              {cuadrillasOpts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down" aria-hidden />
          </div>
        </div>

        <div>
          <label className="agregar-label" htmlFor="asig-fecha">
            Fecha de asignación *
          </label>
          <div className="asignacion-field">
            <i className="bi bi-calendar" />
            <input
              id="asig-fecha"
              type="date"
              value={fechaInicio}
              max={hoy}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          {errorFecha && (
            <span style={{ color: "#b00020", fontSize: 12 }}>{errorFecha}</span>
          )}
          <small className="field-hint">No puede ser una fecha futura</small>
        </div>
      </div>

      
      <div className="tip-box" style={{ marginTop: 8, marginBottom: 4 }}>
        <strong>Reglas de cuadrilla / multi-proyecto</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 13, color: "#475569" }}>
          <li>Un empleado = <strong>una cuadrilla por proyecto</strong>.</li>
          <li>Puede estar en <strong>varios proyectos</strong> a la vez (cada uno con su cuadrilla).</li>
          <li>Para cambiar de cuadrilla en el mismo proyecto: <strong>Retirar</strong> y reasignar.</li>
          <li>Los turnos del mismo día no se cruzan entre proyectos (validado al agendar turnos).</li>
        </ul>
      </div>

      <div className="agregar-botones" style={{ marginTop: 20 }}>
        <button
          className="agregar-btn-primario"
          type="button"
          onClick={onGuardar}
          disabled={saving || loading || !empleadoId || !rol || !proyectoId || !fechaInicio}
        >
          {saving ? "Guardando…" : "Guardar asignación"}
        </button>
      </div>
    </>
  );
}
