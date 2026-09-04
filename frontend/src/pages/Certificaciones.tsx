import { useState, type FormEvent, type ChangeEvent } from "react";
import jsPDF from "jspdf";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
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
  "Trabajo en alturas",
  "Espacios confinados",
  "Manejo de equipos",
  "Primeros auxilios",
  "Seguridad industrial SST",
];

const ENTIDADES = ["SENA", "ICONTEC", "ARL", "Empresa", "Otro"];
const ESTADOS = ["ACTIVO", "PROXIMO_VENCER", "VENCIDO"];

const initialState: CertificacionForm = {
  nombreCertificacion: "",
  fechaVencimiento: "",
  entidadCertifica: "SENA",
  estadoCertificacion: "",
  fechaObtencion: "",
  hojaDeVida: null,
};

export default function Certificaciones() {
  const [form, setForm] = useState<CertificacionForm>(initialState);
  const [errores, setErrores] = useState<Partial<Record<keyof CertificacionForm, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, hojaDeVida: file }));
  };

  const validar = (): boolean => {
    const n: Partial<Record<keyof CertificacionForm, string>> = {};
    if (!form.nombreCertificacion) n.nombreCertificacion = "Selecciona una certificación";
    if (!form.fechaVencimiento) n.fechaVencimiento = "Ingresa la fecha de vencimiento";
    if (!form.entidadCertifica) n.entidadCertifica = "Selecciona la entidad";
    if (!form.estadoCertificacion) n.estadoCertificacion = "Selecciona un estado";
    if (!form.fechaObtencion) n.fechaObtencion = "Ingresa la fecha de obtención";
    setErrores(n);
    return Object.keys(n).length === 0;
  };

  const formatearFecha = (fechaISO: string): string => {
    if (!fechaISO) return "—";
    const [anio, mes, dia] = fechaISO.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const generarPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1.2);
    doc.rect(8, 8, w - 16, h - 16);
    doc.setTextColor(30, 58, 138);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("BUYDRAX", w / 2, 30, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(245, 166, 35);
    doc.text("Certificado de formación / SST", w / 2, 42, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    const lineas = [
      `Certificación: ${form.nombreCertificacion || "—"}`,
      `Entidad: ${form.entidadCertifica || "—"}`,
      `Estado: ${form.estadoCertificacion || "—"}`,
      `Fecha de obtención: ${formatearFecha(form.fechaObtencion)}`,
      `Fecha de vencimiento: ${formatearFecha(form.fechaVencimiento)}`,
    ];
    let y = 65;
    lineas.forEach((linea) => {
      doc.text(linea, w / 2, y, { align: "center" });
      y += 10;
    });
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Generado ${new Date().toLocaleDateString("es-CO")}`,
      w / 2,
      h - 15,
      { align: "center" }
    );
    const nombreArchivo = (form.nombreCertificacion || "certificacion")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
    doc.save(`certificado-${nombreArchivo}.pdf`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    generarPDF();
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Empleados", to: "/empleados" },
          { label: "Certificaciones" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Certificación de empleado</h1>
        <p className="page-subtitle">
          Estados alineados a la BD (ACTIVO / PROXIMO_VENCER / VENCIDO). La descarga genera un PDF local;
          el alta en API se puede conectar a POST /empleados/&#123;id&#125;/certificaciones.
        </p>
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="agregar-form">
            <div>
              <label className="agregar-label">Nombre certificación</label>
              <select
                className="agregar-input"
                name="nombreCertificacion"
                value={form.nombreCertificacion}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                {CERTIFICACIONES_DISPONIBLES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.nombreCertificacion && (
                <span style={{ color: "#b00020", fontSize: 12 }}>{errores.nombreCertificacion}</span>
              )}
            </div>
            <div>
              <label className="agregar-label">Fecha vencimiento</label>
              <input
                className="agregar-input"
                type="date"
                name="fechaVencimiento"
                value={form.fechaVencimiento}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="agregar-label">Entidad</label>
              <select
                className="agregar-input"
                name="entidadCertifica"
                value={form.entidadCertifica}
                onChange={handleChange}
              >
                {ENTIDADES.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="agregar-label">Estado</label>
              <select
                className="agregar-input"
                name="estadoCertificacion"
                value={form.estadoCertificacion}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="agregar-label">Fecha obtención</label>
              <input
                className="agregar-input"
                type="date"
                name="fechaObtencion"
                value={form.fechaObtencion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="agregar-label">Soporte PDF</label>
              <input className="agregar-input" type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>
          </div>
          <div className="agregar-botones" style={{ marginTop: 20 }}>
            <button type="submit" className="agregar-btn-primario">
              Descargar certificado PDF
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
