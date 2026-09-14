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
};

const CERTIFICACIONES = ["Trabajo en alturas", "Espacios confinados", "Manejo de equipos", "Primeros auxilios", "Seguridad industrial SST"];
const ENTIDADES = ["SENA", "ICONTEC", "ARL", "Empresa", "Otro"];
const ESTADOS = ["ACTIVO", "PROXIMO_VENCER", "VENCIDO"];

export default function CertificacionForm({ form, errores, onChange, onFileChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
      <div className="agregar-form">
        <div>
          <label className="agregar-label">Nombre certificación</label>
          <select className="agregar-input" name="nombreCertificacion" value={form.nombreCertificacion} onChange={onChange}>
            <option value="">Seleccionar</option>
            {CERTIFICACIONES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errores.nombreCertificacion && <span style={{ color: "#b00020", fontSize: 12 }}>{errores.nombreCertificacion}</span>}
        </div>
        <div>
          <label className="agregar-label">Fecha vencimiento</label>
          <input className="agregar-input" type="date" name="fechaVencimiento" value={form.fechaVencimiento} onChange={onChange} />
          {errores.fechaVencimiento && <span style={{ color: "#b00020", fontSize: 12 }}>{errores.fechaVencimiento}</span>}
        </div>
        <div>
          <label className="agregar-label">Entidad</label>
          <select className="agregar-input" name="entidadCertifica" value={form.entidadCertifica} onChange={onChange}>
            {ENTIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          {errores.entidadCertifica && <span style={{ color: "#b00020", fontSize: 12 }}>{errores.entidadCertifica}</span>}
        </div>
        <div>
          <label className="agregar-label">Estado</label>
          <select className="agregar-input" name="estadoCertificacion" value={form.estadoCertificacion} onChange={onChange}>
            <option value="">Seleccionar</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          {errores.estadoCertificacion && <span style={{ color: "#b00020", fontSize: 12 }}>{errores.estadoCertificacion}</span>}
        </div>
        <div>
          <label className="agregar-label">Fecha obtención</label>
          <input className="agregar-input" type="date" name="fechaObtencion" value={form.fechaObtencion} onChange={onChange} />
          {errores.fechaObtencion && <span style={{ color: "#b00020", fontSize: 12 }}>{errores.fechaObtencion}</span>}
        </div>
        <div>
          <label className="agregar-label">Soporte PDF</label>
          <input className="agregar-input" type="file" accept="application/pdf" onChange={onFileChange} />
        </div>
      </div>
      <div className="agregar-botones" style={{ marginTop: 20 }}>
        <button type="submit" className="agregar-btn-primario">Descargar certificado PDF</button>
      </div>
    </form>
  );
}
