import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import Button from "../components/ui/Button";
import { EMPLEADOS_MOCK } from "../data/empleados";
import { motivosHorasExtras } from "../data/motivosExtras";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/HorasExtras.css";

type HorasExtraForm = {
  empleadoId: string;
  motivo: string;
  fecha: string;
  certificado: string;
  cantidadHoras: string;
};

const CERTIFICADO_OPCIONES = [
  { id: "si", nombre: "Sí" },
  { id: "no", nombre: "No" },
];

export default function HorasExtras() {
  const navigate = useNavigate();
  const { values, setField } = useForm<HorasExtraForm>({
    empleadoId: "",
    motivo: "",
    fecha: "",
    certificado: "",
    cantidadHoras: "",
  });

  const handleGuardar = () => {
    if (!values.empleadoId || !values.fecha || !values.cantidadHoras) {
      alert("Completa empleado, fecha y cantidad de horas");
      return;
    }
    console.log("Horas extra a guardar:", values);
    // luego: aquí va la llamada al servicio/API que guarde el registro
  };

  const handleCancelar = () => {
    navigate("/asistencia");
  };

  return (
    <div className="agregar-page">
      <Navbar />
      <div className="agregar-body">
        <Sidebar />

        <main className="agregar-main">
          {/* Breadcrumb */}
          <nav style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="bi bi-house-fill" style={{ color: "#1E3A8A" }}></i>
            <span>›</span>
            <span>Asistencia</span>
            <span>›</span>
            <span style={{ color: "#1E3A8A", fontWeight: 600 }}>Horas Extras</span>
          </nav>

          {/* HEADER con barra de degradado arriba de la card, como en el mockup */}
          <div className="horas-extra-card">
            <div className="agregar-header">
              <div className="agregar-icono-circulo">
                <i className="bi bi-clock-history" style={{ fontSize: "22px", color: "#1E3A8A" }}></i>
              </div>
              <div>
                <h2 className="agregar-titulo">Horas Extras</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                  Registra las horas extras realizadas por el empleado.
                </p>
              </div>
            </div>

            <hr style={{ marginBottom: "32px", borderColor: "#e0e0e0" }} />

            <div className="agregar-form">
              <SelectField
                label="Nombre del Empleado"
                icon="bi-person"
                value={values.empleadoId}
                onChange={(v) => setField("empleadoId", v)}
                options={EMPLEADOS_MOCK.map((e) => ({ value: String(e.id), label: e.nombre }))}
                placeholder="Selecciona un empleado"
              />

              <SelectField
                label="Motivo"
                icon="bi-file-earmark-text"
                value={values.motivo}
                onChange={(v) => setField("motivo", v)}
                options={motivosHorasExtras.map((m) => ({ value: m.id, label: m.nombre }))}
                placeholder="Selecciona un motivo"
              />

              <FormField
                label="Fecha"
                icon="bi-calendar"
                type="date"
                value={values.fecha}
                onChange={(e) => setField("fecha", e.target.value)}
              />

              <SelectField
                label="Certificado horas extra"
                icon="bi-file-earmark-text"
                value={values.certificado}
                onChange={(v) => setField("certificado", v)}
                options={CERTIFICADO_OPCIONES.map((c) => ({ value: c.id, label: c.nombre }))}
                placeholder="Selecciona una opción"
              />

              <FormField
                label="Cantidad de horas"
                icon="bi-clock"
                type="number"
                min={0}
                placeholder="Ingresa la cantidad de horas"
                value={values.cantidadHoras}
                onChange={(e) => setField("cantidadHoras", e.target.value)}
              />
            </div>

            {/* Aviso informativo */}
            <div className="horas-extra-aviso">
              <i className="bi bi-info-circle-fill"></i>
              <div>
                <strong>Importante:</strong> Asegúrate de que la información sea correcta antes de guardar el registro.
              </div>
            </div>

            <div className="agregar-botones">
              <Button text="Cancelar" icon="bi-arrow-left" variant="secundario" onClick={handleCancelar} />
              <Button text="Guardar registro horas extras" icon="bi-floppy" onClick={handleGuardar} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}