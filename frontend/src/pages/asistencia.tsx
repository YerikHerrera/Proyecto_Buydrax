import { useForm } from "../hooks/useForm";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import Button from "../components/ui/Button";
import { EMPLEADOS_MOCK } from "../data/empleados";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/Asistencia.css";

type AsistenciaForm = {
  empleadoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
};

export default function Asistencia() {
  const { values, setField } = useForm<AsistenciaForm>({
    empleadoId: "",
    fecha: "",
    horaEntrada: "",
    horaSalida: "",
  });

  const handleGuardar = () => {
    if (!values.empleadoId || !values.fecha) {
      alert("Completa empleado y fecha");
      return;
    }

    console.log("Asistencia a guardar:", values);
  };

  return (
    <div className="asistencia-page">
      <Navbar />

      <div className="asistencia-body">
        <Sidebar />

        <main className="asistencia-main">

          {/* Breadcrumb */}
          <nav
            style={{
              fontSize: "13px",
              color: "#94A3B8",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i
              className="bi bi-house-fill"
              style={{ color: "#1E3A8A" }}
            ></i>

            <span>›</span>
            <span>Asistencia</span>
            <span>›</span>

            <span style={{ color: "#1E3A8A", fontWeight: 600 }}>
              Registrar asistencia
            </span>
          </nav>

          <div className="agregar-header">
            <h2 className="agregar-titulo">Asistencia</h2>
            <p>
              Registra tu entrada y salida de manera rápida y segura.
            </p>
          </div>

          <hr />

          <div className="agregar-form">

            <SelectField
              label="Nombre del empleado"
              icon="bi-person"
              value={values.empleadoId}
              onChange={(v) => setField("empleadoId", v)}
              options={EMPLEADOS_MOCK.map((e) => ({
                value: String(e.id),
                label: e.nombre,
              }))}
              placeholder="Seleccionar empleado"
            />

            <FormField
              label="Fecha"
              icon="bi-calendar"
              type="date"
              value={values.fecha}
              onChange={(e) =>
                setField("fecha", e.target.value)
              }
            />

            <FormField
              label="Hora entrada"
              icon="bi-clock"
              type="time"
              value={values.horaEntrada}
              onChange={(e) =>
                setField("horaEntrada", e.target.value)
              }
            />

            <FormField
              label="Hora salida"
              icon="bi-clock"
              type="time"
              value={values.horaSalida}
              onChange={(e) =>
                setField("horaSalida", e.target.value)
              }
            />

          </div>

          <div className="agregar-botones">
            <Button
              text="Guardar Asistencia"
              icon="bi-floppy"
              onClick={handleGuardar}
            />
          </div>

        </main>
      </div>
    </div>
  );
}