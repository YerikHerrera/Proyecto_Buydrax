import type { Empleado } from '../../services/empleadosService';
import type { Proyecto } from '../../services/proyectosService';
import type { UsuarioPublic } from '../../services/usuariosService';

const ROLES = [
  'Supervisor de cuadrilla',
  'Oficial',
  'Ayudante',
  'Operario',
  'Auxiliar',
  'Maestro de obra'
];

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
  onGuardar
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
}) {
  const nombre = (e: Empleado) =>
    usuariosMap[e.id_usuario]
      ? `${usuariosMap[e.id_usuario].nombres} ${usuariosMap[e.id_usuario].apellidos}`
      : `${e.cargo} · Doc. ${e.numero_documento}`;

  return (
    <>
      <div className="asignacion-grid">
        <label>
          Nombre del empleado *
          <div className="asignacion-field">
            <i className="bi bi-person" />
            <select
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar empleado</option>
              {empleados.map((e) => (
                <option key={e.id_empleado} value={e.id_empleado}>
                  {nombre(e)} — {e.cargo}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down" />
          </div>
        </label>

        <label>
          Proyecto *
          <div className="asignacion-field">
            <i className="bi bi-folder" />
            <select
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
            <i className="bi bi-chevron-down" />
          </div>
        </label>

        <label>
          Función en el proyecto *
          <div className="asignacion-field">
            <i className="bi bi-briefcase" />
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Seleccionar función</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down" />
          </div>
        </label>

        <label>
          Cuadrilla
          <div className="asignacion-field">
            <i className="bi bi-people" />
            <select value={cuadrilla} onChange={(e) => setCuadrilla(e.target.value)}>
              <option value="">Seleccionar cuadrilla</option>
              {cuadrillasOpts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down" />
          </div>
        </label>

        <label>
          Fecha de asignación *
          <div className="asignacion-field">
            <i className="bi bi-calendar" />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
        </label>
      </div>

      <div className="asignacion-actions">
        <button
          className="asignacion-btn"
          onClick={onGuardar}
          disabled={saving || loading}
        >
          <i className="bi bi-floppy" />{' '}
          {saving ? 'Guardando...' : 'Guardar y asignar empleado'}
        </button>
      </div>
    </>
  );
}
