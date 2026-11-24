import type { ChangeEvent, FormEvent } from "react";

export interface CertificacionFormData {
  nombreCertificacion: string;
  fechaVencimiento: string;
  entidadCertifica: string;
  estadoCertificacion: string;
  fechaObtencion: string;
  hojaDeVida: File | null;
}

type Props = {
  form: CertificacionFormData;
  errores: Partial<Record<keyof CertificacionFormData, string>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  /** Estado calculado por fechas (solo lectura en UI). */
  estadoCalculado?: string;
};

const CERTIFICACIONES = [
  "Trabajo en alturas",
  "Espacios confinados",
  "Manejo de equipos",
  "Primeros auxilios",
  "Seguridad industrial SST",
  "Izaje de cargas",
  "Trabajo en caliente",
];
const ENTIDADES = ["SENA", "ICONTEC", "ARL", "Empresa", "Otro"];

export default function CertificacionForm({
  form,
  errores,
  onChange,
  onFileChange,
  onSubmit,
  estadoCalculado,
}: Props) {
  const estadoMostrar = estadoCalculado || form.estadoCertificacion || "—";

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
      <div className="agregar-form">
        <div>
          <label className="agregar-label">Nombre certificación *</label>
          <select
            className="agregar-input"
            name="nombreCertificacion"
            value={form.nombreCertificacion}
            onChange={onChange}
          >
            <option value="">Seleccionar</option>
            {CERTIFICACIONES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errores.nombreCertificacion && (
            <span style={{ color: "#b00020", fontSize: 12 }}>{errores.nombreCertificacion}</span>
          )}
        </div>

        <div>
          <label className="agregar-label">Entidad que certifica *</label>
          <select
            className="agregar-input"
            name="entidadCertifica"
            value={form.entidadCertifica}
            onChange={onChange}
          >
            {ENTIDADES.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          {errores.entidadCertifica && (
            <span style={{ color: "#b00020", fontSize: 12 }}>{errores.entidadCertifica}</span>
          )}
        </div>

        <div>
          <label className="agregar-label">Fecha de obtención *</label>
          <input
            className="agregar-input"
            type="date"
            name="fechaObtencion"
            value={form.fechaObtencion}
            onChange={onChange}
            max={form.fechaVencimiento || undefined}
          />
          {errores.fechaObtencion && (
            <span style={{ color: "#b00020", fontSize: 12 }}>{errores.fechaObtencion}</span>
          )}
          <small className="field-hint">Debe ser igual o anterior a la fecha de vencimiento</small>
        </div>

        <div>
          <label className="agregar-label">Fecha de vencimiento *</label>
          <input
            className="agregar-input"
            type="date"
            name="fechaVencimiento"
            value={form.fechaVencimiento}
            onChange={onChange}
            min={form.fechaObtencion || undefined}
          />
          {errores.fechaVencimiento && (
            <span style={{ color: "#b00020", fontSize: 12 }}>{errores.fechaVencimiento}</span>
          )}
        </div>

        <div>
          <label className="agregar-label">Estado (automático)</label>
          <input
            className="agregar-input"
            type="text"
            value={estadoMostrar}
            readOnly
            disabled
            style={{ background: "#f8fafc", fontWeight: 600, cursor: "not-allowed" }}
          />
          <small className="field-hint">
            ACTIVO · PROXIMO_VENCER (≤30 días) · VENCIDO — según fechas
          </small>
        </div>

        <div>
          <label className="agregar-label">Soporte PDF (opcional)</label>
          <div
            style={{
              marginTop: 6,
              padding: "12px 14px",
              border: "1.5px dashed #cbd5e1",
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              style={{ fontSize: 13, width: "100%" }}
            />
            {form.hojaDeVida && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#047857" }}>
                Archivo: {form.hojaDeVida.name}
              </p>
            )}
          </div>
          <small className="field-hint">Solo PDF. No es un listado desplegable.</small>
        </div>
      </div>

      <div className="agregar-botones" style={{ marginTop: 20 }}>
        <button type="submit" className="agregar-btn-primario">
          Generar / descargar certificado PDF
        </button>
      </div>
    </form>
  );
}
