import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import jsPDF from "jspdf";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import CertificacionForm, {
  type CertificacionFormData,
} from "../components/certificaciones/CertificacionForm";
import "../styles/Certifaciones.css";

const initialState: CertificacionFormData = {
  nombreCertificacion: "",
  fechaVencimiento: "",
  entidadCertifica: "SENA",
  estadoCertificacion: "",
  fechaObtencion: "",
  hojaDeVida: null,
};

/** Calcula estado según BD: ACTIVO | PROXIMO_VENCER | VENCIDO */
export function estadoPorFechas(obtencion: string, vencimiento: string): string {
  if (!obtencion || !vencimiento) return "";
  if (obtencion > vencimiento) return "";
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(vencimiento + "T00:00:00");
  if (fin < hoy) return "VENCIDO";
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + 30);
  if (fin <= limite) return "PROXIMO_VENCER";
  return "ACTIVO";
}

export default function Certificaciones() {
  const [form, setForm] = useState<CertificacionFormData>(initialState);
  const [errores, setErrores] = useState<Partial<Record<keyof CertificacionFormData, string>>>({});

  const estadoCalculado = useMemo(
    () => estadoPorFechas(form.fechaObtencion, form.fechaVencimiento),
    [form.fechaObtencion, form.fechaVencimiento]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, hojaDeVida: e.target.files?.[0] || null }));

  const validar = () => {
    const n: Partial<Record<keyof CertificacionFormData, string>> = {};
    if (!form.nombreCertificacion) n.nombreCertificacion = "Selecciona una certificación";
    if (!form.entidadCertifica) n.entidadCertifica = "Selecciona la entidad";
    if (!form.fechaObtencion) n.fechaObtencion = "Ingresa la fecha de obtención";
    if (!form.fechaVencimiento) n.fechaVencimiento = "Ingresa la fecha de vencimiento";
    if (form.fechaObtencion && form.fechaVencimiento && form.fechaObtencion > form.fechaVencimiento) {
      n.fechaObtencion = "La obtención no puede ser posterior al vencimiento";
      n.fechaVencimiento = "El vencimiento debe ser igual o posterior a la obtención";
    }
    setErrores(n);
    return Object.keys(n).length === 0;
  };

  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return "—";
    const [anio, mes, dia] = fechaISO.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const generarPDF = () => {
    const estado = estadoPorFechas(form.fechaObtencion, form.fechaVencimiento) || "ACTIVO";
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
      `Estado: ${estado}`,
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
    doc.text(`Generado ${new Date().toLocaleDateString("es-CO")}`, w / 2, h - 15, {
      align: "center",
    });
    const nombreArchivo = (form.nombreCertificacion || "certificacion")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
    doc.save(`certificado-${nombreArchivo}.pdf`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validar()) generarPDF();
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Empleados", to: "/empleados" }, { label: "Certificaciones" }]} />
      <div className="page-card">
        <h1 className="page-title">Certificación de empleado</h1>
        <p className="page-subtitle">
          La fecha de obtención debe ser ≤ fecha de vencimiento. El estado se calcula solo (ACTIVO /
          PROXIMO_VENCER / VENCIDO).
        </p>
        <CertificacionForm
          form={form}
          errores={errores}
          onChange={handleChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          estadoCalculado={estadoCalculado}
        />
      </div>
    </AppShell>
  );
}
