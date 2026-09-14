import type { Empleado } from '../../services/empleadosService';
import type { UsuarioPublic } from '../../services/usuariosService';

const TIPOS = ['DIURNA', 'NOCTURNA', 'DOMINICAL', 'FESTIVA', 'DIURNA_DOMINICAL'];

export default function HorasExtrasForm({
  empleados,
  usuariosMap,
  empleadoId,
  setEmpleadoId,
  motivo,
  setMotivo,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  cantidad,
  setCantidad,
  tipoHora,
  setTipoHora,
  loading,
  saving,
  onGuardar,
  onVolver
}: {
  empleados: Empleado[];
  usuariosMap: Record<number, UsuarioPublic>;
  empleadoId: string;
  setEmpleadoId: (v: string) => void;
  motivo: string;
  setMotivo: (v: string) => void;
  fechaInicio: string;
  setFechaInicio: (v: string) => void;
  fechaFin: string;
  setFechaFin: (v: string) => void;
  cantidad: string;
  setCantidad: (v: string) => void;
  tipoHora: string;
  setTipoHora: (v: string) => void;
  loading: boolean;
  saving: boolean;
  onGuardar: () => void;
  onVolver: () => void;
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
          <label className="agregar-label">Motivo *</label>
          <input
            className="agregar-input"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            maxLength={255}
          />
        </div>

        <div>
          <label className="agregar-label">Fecha inicio *</label>
          <input
            className="agregar-input"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Fecha fin *</label>
          <input
            className="agregar-input"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Cantidad de horas *</label>
          <input
            className="agregar-input"
            type="number"
            min="0.5"
            step="0.5"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Tipo de hora</label>
          <select
            className="agregar-input"
            value={tipoHora}
            onChange={(e) => setTipoHora(e.target.value)}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="agregar-botones" style={{ marginTop: 20 }}>
        <button
          className="agregar-btn-secundario"
          type="button"
          onClick={onVolver}
        >
          Volver
        </button>
        <button
          className="agregar-btn-primario"
          type="button"
          onClick={onGuardar}
          disabled={saving || loading}
        >
          {saving ? 'Guardando…' : 'Guardar horas extras'}
        </button>
      </div>
    </>
  );
}
