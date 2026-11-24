import { localidades } from "../../data/localidades";

interface Supervisor {
  id_supervisor: number;
  numero_tarjeta_profesional: string;
}

interface Props {
  editId: number | null;
  nombre: string;
  setNombre: (value: string) => void;
  supervisorId: string;
  setSupervisorId: (value: string) => void;
  localidad: string;
  setLocalidad: (value: string) => void;
  fechaInicio: string;
  setFechaInicio: (value: string) => void;
  fechaFin: string;
  setFechaFin: (value: string) => void;
  descripcion: string;
  setDescripcion: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  supervisores: Supervisor[];
  loading: boolean;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function ProyectoForm({
  editId,
  nombre,
  setNombre,
  supervisorId,
  setSupervisorId,
  localidad,
  setLocalidad,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  descripcion,
  setDescripcion,
  estado,
  setEstado,
  supervisores,
  loading,
  onGuardar,
  onCancelar,
}: Props) {
  return (
    <>
      <div className="agregar-form" style={{ marginTop: 16 }}>
        <div>
          <label className="agregar-label">Nombre *</label>
          <input
            className="agregar-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Supervisor *</label>
          <select
            className="agregar-input"
            value={supervisorId}
            onChange={(e) => setSupervisorId(e.target.value)}
          >
            <option value="">Seleccionar</option>

            {supervisores.map((supervisor) => (
              <option
                key={supervisor.id_supervisor}
                value={supervisor.id_supervisor}
              >
                #{supervisor.id_supervisor} (
                {supervisor.numero_tarjeta_profesional})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="agregar-label">
            Localidad / ubicación
          </label>

          <select
            className="agregar-input"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
          >
            <option value="">Seleccionar</option>

            {localidades.map((localidadItem) => (
              <option key={localidadItem.id} value={localidadItem.id}>
                {localidadItem.nombre}
              </option>
            ))}
          </select>

          {editId && (
            <input
              className="agregar-input"
              style={{ marginTop: 8 }}
              placeholder="O escribe ubicación libre"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
            />
          )}
        </div>

        <div>
          <label className="agregar-label">Descripción</label>

          <textarea
            className="agregar-input"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
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

        {editId && (
          <div>
            <label className="agregar-label">Estado</label>

            <select
              className="agregar-input"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="SUSPENDIDO">SUSPENDIDO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          </div>
        )}
      </div>

      <div
        className="agregar-botones"
        style={{ marginTop: 20 }}
      >
        {editId && (
          <button
            type="button"
            className="agregar-btn-secundario"
            onClick={onCancelar}
          >
            Cancelar edición
          </button>
        )}

        <button
          type="button"
          className="agregar-btn-primario"
          onClick={onGuardar}
          disabled={loading}
        >
          {loading
            ? "Guardando…"
            : editId
              ? "Guardar cambios"
              : "Crear proyecto"}
        </button>
      </div>
    </>
  );
}