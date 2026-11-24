import type { Proyecto } from '../../services/proyectosService';

type Props = {
  nombre: string;
  proyecto: string;
  tipo: string;
  fecha: string;
  descripcion: string;
  proyectos: Proyecto[];
  tipos: string[];
  setNombre: (v: string) => void;
  setProyecto: (v: string) => void;
  setTipo: (v: string) => void;
  setFecha: (v: string) => void;
  setDescripcion: (v: string) => void;
  onGuardar: () => void;
  onCancelar: () => void;
};

export default function ReporteNoteForm(p: Props) {
  return (
    <>
      <div className="agregar-form" style={{ marginTop: 16 }}>
        <div>
          <label className="agregar-label">Nombre</label>
          <input
            className="agregar-input"
            value={p.nombre}
            onChange={(e) => p.setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="agregar-label">Proyecto</label>
          <select
            className="agregar-input"
            value={p.proyecto}
            onChange={(e) => p.setProyecto(e.target.value)}
          >
            <option value="">Selecciona…</option>
            {p.proyectos.map((x) => (
              <option key={x.id_proyecto} value={x.nombre}>
                {x.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="agregar-label">Tipo</label>
          <select
            className="agregar-input"
            value={p.tipo}
            onChange={(e) => p.setTipo(e.target.value)}
          >
            <option value="">Selecciona…</option>
            {p.tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="agregar-label">Fecha</label>
          <input
            type="date"
            className="agregar-input"
            value={p.fecha}
            onChange={(e) => p.setFecha(e.target.value)}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="agregar-label">Descripción</label>
          <textarea
            className="agregar-input"
            rows={3}
            value={p.descripcion}
            onChange={(e) => p.setDescripcion(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        <button
          type="button"
          className="agregar-btn-primario"
          onClick={p.onGuardar}
        >
          Guardar
        </button>
        <button
          type="button"
          className="agregar-btn-secundario btn-cancel-hover"
          onClick={p.onCancelar}
        >
          Cancelar
        </button>
      </div>
    </>
  );
}
