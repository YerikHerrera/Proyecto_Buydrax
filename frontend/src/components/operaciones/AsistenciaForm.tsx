import type { Empleado } from '../../services/empleadosService';
import type { UsuarioPublic } from '../../services/usuariosService';

const ESTADOS = [
  { value: 'PRESENTE', label: 'Presente' },
  { value: 'RETARDO', label: 'Retardo' },
  { value: 'INASISTENCIA', label: 'Inasistencia' }
];

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
  onGuardar
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
}) {
  return (
    <>
      <div className="agregar-form" style={{ marginTop: 20 }}>
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
                {usuariosMap[e.id_usuario]
                  ? `${usuariosMap[e.id_usuario].nombres} ${usuariosMap[e.id_usuario].apellidos}`
                  : `${e.cargo} · ${e.numero_documento}`}{' '}
                — {e.cargo}
              </option>
            ))}
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
          <label className="agregar-label">Hora entrada *</label>
          <input
            className="agregar-input"
            type="time"
            value={horaEntrada}
            onChange={(e) => setHoraEntrada(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Hora salida</label>
          <input
            className="agregar-input"
            type="time"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Estado</label>
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
        </div>
      </div>

      <div className="agregar-botones" style={{ marginTop: 20 }}>
        <button
          className="agregar-btn-primario"
          type="button"
          onClick={onGuardar}
          disabled={saving || loading}
        >
          {saving ? 'Guardando…' : 'Guardar asistencia'}
        </button>
      </div>
    </>
  );
}
