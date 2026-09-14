import type { Empleado } from '../../services/empleadosService';
import type { Proyecto } from '../../services/proyectosService';
import type { UsuarioPublic } from '../../services/usuariosService';

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
  onGuardar
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
}) {
  const nombre = (e: Empleado) =>
    usuariosMap[e.id_usuario]
      ? `${usuariosMap[e.id_usuario].nombres} ${usuariosMap[e.id_usuario].apellidos}`
      : `${e.cargo} · ${e.numero_documento}`;

  return (
    <>
      <div className="agregar-form" style={{ marginTop: 16 }}>
        <div>
          <label className="agregar-label">Empleado *</label>
          <select
            className="agregar-input"
            value={empleadoId}
            onChange={(e) => setEmpleadoId(e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccionar</option>
            {empleados.map((e) => (
              <option key={e.id_empleado} value={e.id_empleado}>
                {nombre(e)}
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
            disabled={loading}
          >
            <option value="">Seleccionar</option>
            {proyectos.map((p) => (
              <option key={p.id_proyecto} value={p.id_proyecto}>
                {p.nombre}
              </option>
            ))}
          </select>
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

        <div>
          <label className="agregar-label">Hora inicio</label>
          <input
            className="agregar-input"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Hora fin</label>
          <input
            className="agregar-input"
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
          />
        </div>
      </div>

      <div className="agregar-botones" style={{ marginTop: 20 }}>
        <button
          className="agregar-btn-primario"
          type="button"
          onClick={onGuardar}
          disabled={saving || loading}
        >
          {saving ? 'Guardando…' : 'Guardar turno'}
        </button>
      </div>
    </>
  );
}
