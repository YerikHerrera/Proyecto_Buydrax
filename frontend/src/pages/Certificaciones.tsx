import { useState, FormEvent, ChangeEvent } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/AgregarEmpleados.css"; // clases de layout: agregar-page / agregar-body / agregar-main
import "../styles/Certifaciones.css";

interface CertificacionForm {
  nombreCertificacion: string;
  fechaVencimiento: string;
  entidadCertifica: string;
  estadoCertificacion: string;
  fechaObtencion: string;
  hojaDeVida: File | null;
}

const CERTIFICACIONES_DISPONIBLES = [
  "AWS Certified Solutions Architect",
  "Scrum Master (PSM I)",
  "ISO 9001",
  "Certificación en Seguridad Industrial",
  "Certificación en Manejo de Alturas",
];

const ENTIDADES_CERTIFICADORAS = ["Buydrax", "SENA", "ICONTEC", "AWS", "Scrum.org"];

const ESTADOS_CERTIFICACION = ["Activa", "Vencido"];

const initialState: CertificacionForm = {
  nombreCertificacion: "",
  fechaVencimiento: "",
  entidadCertifica: "Buydrax",
  estadoCertificacion: "",
  fechaObtencion: "",
  hojaDeVida: null,
};

export default function Certificaciones() {
  const [form, setForm] = useState<CertificacionForm>(initialState);
  const [errores, setErrores] = useState<Partial<Record<keyof CertificacionForm, string>>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, hojaDeVida: file }));
  };

  const validar = (): boolean => {
    const nuevosErrores: Partial<Record<keyof CertificacionForm, string>> = {};

    if (!form.nombreCertificacion) nuevosErrores.nombreCertificacion = "Selecciona una certificación";
    if (!form.fechaVencimiento) nuevosErrores.fechaVencimiento = "Ingresa la fecha de vencimiento";
    if (!form.entidadCertifica) nuevosErrores.entidadCertifica = "Selecciona la entidad";
    if (!form.estadoCertificacion) nuevosErrores.estadoCertificacion = "Selecciona un estado";
    if (!form.fechaObtencion) nuevosErrores.fechaObtencion = "Ingresa la fecha de obtención";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validar()) return;

    // TODO: Conectar con el endpoint real de creación/descarga de certificaciones
    console.log("Certificación a registrar/descargar:", form);
  };

  return (
    <div className="agregar-page">
      <Navbar />
      <div className="agregar-body">
        <Sidebar />

        <main className="agregar-main">
          <div className="certificaciones-page">
            {/* Breadcrumb */}
            <div className="certificaciones-breadcrumb">
              <i className="bi bi-house-door-fill"></i>
              <span>&gt;</span>
              <span>Empleados</span>
              <span>&gt;</span>
              <span>Certificaciones</span>
              <span>&gt;</span>
              <span className="certificaciones-breadcrumb-active">Nueva certificación</span>
            </div>

            {/* Card principal */}
            <div className="certificaciones-card">
              <div className="certificaciones-topbar"></div>

              <div className="certificaciones-header">
                <div className="certificaciones-icon">
                  <i className="bi bi-award-fill"></i>
                </div>
                <div>
                  <h2 className="certificaciones-title">Certificación empleado</h2>
                  <p className="certificaciones-subtitle">
                    Registra la información de la certificación del empleado.
                  </p>
                </div>
              </div>

              <hr className="certificaciones-divider" />

              <form onSubmit={handleSubmit}>
                <div className="certificaciones-grid">
                  {/* Nombre Certificación */}
                  <div className="certificaciones-field">
                    <label htmlFor="nombreCertificacion">Nombre Certificación</label>
                    <div className="certificaciones-select-wrapper">
                      <i className="bi bi-file-earmark-text"></i>
                      <select
                        id="nombreCertificacion"
                        name="nombreCertificacion"
                        value={form.nombreCertificacion}
                        onChange={handleChange}
                        className={errores.nombreCertificacion ? "is-invalid" : ""}
                      >
                        <option value="">Seleccionar certificación</option>
                        {CERTIFICACIONES_DISPONIBLES.map((cert) => (
                          <option key={cert} value={cert}>
                            {cert}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errores.nombreCertificacion && (
                      <span className="certificaciones-error">{errores.nombreCertificacion}</span>
                    )}
                  </div>

                  {/* Fecha de vencimiento */}
                  <div className="certificaciones-field">
                    <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
                    <div className="certificaciones-input-wrapper">
                      <i className="bi bi-calendar3"></i>
                      <input
                        id="fechaVencimiento"
                        name="fechaVencimiento"
                        type="date"
                        value={form.fechaVencimiento}
                        onChange={handleChange}
                        placeholder="DD-MM-AA"
                        className={errores.fechaVencimiento ? "is-invalid" : ""}
                      />
                    </div>
                    {errores.fechaVencimiento && (
                      <span className="certificaciones-error">{errores.fechaVencimiento}</span>
                    )}
                  </div>

                  {/* Entidad que certifica */}
                  <div className="certificaciones-field">
                    <label htmlFor="entidadCertifica">Entidad que certifica</label>
                    <div className="certificaciones-select-wrapper">
                      <i className="bi bi-bank2"></i>
                      <select
                        id="entidadCertifica"
                        name="entidadCertifica"
                        value={form.entidadCertifica}
                        onChange={handleChange}
                        className={errores.entidadCertifica ? "is-invalid" : ""}
                      >
                        {ENTIDADES_CERTIFICADORAS.map((entidad) => (
                          <option key={entidad} value={entidad}>
                            {entidad}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errores.entidadCertifica && (
                      <span className="certificaciones-error">{errores.entidadCertifica}</span>
                    )}
                  </div>

                  {/* Estado de certificación */}
                  <div className="certificaciones-field">
                    <label htmlFor="estadoCertificacion">Estado de certificación</label>
                    <div className="certificaciones-select-wrapper">
                      <select
                        id="estadoCertificacion"
                        name="estadoCertificacion"
                        value={form.estadoCertificacion}
                        onChange={handleChange}
                        className={errores.estadoCertificacion ? "is-invalid" : ""}
                      >
                        <option value="">Seleccionar estado</option>
                        {ESTADOS_CERTIFICACION.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errores.estadoCertificacion && (
                      <span className="certificaciones-error">{errores.estadoCertificacion}</span>
                    )}
                  </div>

                  {/* Fecha de obtención */}
                  <div className="certificaciones-field">
                    <label htmlFor="fechaObtencion">Fecha de obtención</label>
                    <div className="certificaciones-input-wrapper">
                      <i className="bi bi-calendar3"></i>
                      <input
                        id="fechaObtencion"
                        name="fechaObtencion"
                        type="date"
                        value={form.fechaObtencion}
                        onChange={handleChange}
                        placeholder="DD-MM-AA"
                        className={errores.fechaObtencion ? "is-invalid" : ""}
                      />
                    </div>
                    {errores.fechaObtencion && (
                      <span className="certificaciones-error">{errores.fechaObtencion}</span>
                    )}
                  </div>

                  {/* Hoja de vida (PDF) */}
                  <div className="certificaciones-field">
                    <label htmlFor="hojaDeVida">Hoja de vida (PDF)</label>
                    <div className="certificaciones-file-wrapper">
                      <i className="bi bi-paperclip"></i>
                      <label htmlFor="hojaDeVida" className="certificaciones-file-label">
                        {form.hojaDeVida ? form.hojaDeVida.name : "Seleccionar archivo"}
                      </label>
                      <input
                        id="hojaDeVida"
                        name="hojaDeVida"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="certificaciones-file-input"
                      />
                      <i className="bi bi-upload certificaciones-upload-icon"></i>
                    </div>
                  </div>
                </div>

                <div className="certificaciones-actions">
                  <button type="submit" className="certificaciones-btn-descargar">
                    <i className="bi bi-download"></i>
                    Descargar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}