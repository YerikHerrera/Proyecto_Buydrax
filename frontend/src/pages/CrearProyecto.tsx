import { useForm } from "../hooks/useForm";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import Button from "../components/ui/Button";
import { EMPLEADOS_MOCK } from "../data/empleados";
import { localidades } from "../data/localidades";
import { PROYECTOS_MOCK } from "../data/proyectos";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/CrearProyecto.css";

type ProyectoForm = {
  nombre: string;
  supervisorId: string;
  localidadID: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
};

const MAX_DESCRIPCION = 500;

const supervisoresDisponibles = EMPLEADOS_MOCK.filter(
  (e) => e.cargo === "Supervisor" || e.cargo === "Supervisora"
);

export default function CrearProyecto() {
  const { values, setField } = useForm<ProyectoForm>({
    nombre: "",
    supervisorId: "",
    localidadID: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
  });

  const handleGuardar = () => {
    if (!values.nombre || !values.localidadID) {
      alert("Completa al menos el nombre del proyecto y la localidad");
      return;
    }
    console.log("Proyecto a guardar:", values);
    // luego: aquí va la llamada al servicio/API que guarde el proyecto
  };

  const handleEditar = () => {
    console.log("Editar proyecto:", values);
  };

  return (
    <div className="proyecto-page">
      <Navbar />
      <div className="proyecto-body">
        <Sidebar />

        <main className="proyecto-main">
          {/* Breadcrumb */}
          <nav style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="bi bi-house-fill" style={{ color: "#1E3A8A" }}></i>
            <span>›</span>
            <span>Proyectos</span>
            <span>›</span>
            <span style={{ color: "#1E3A8A", fontWeight: 600 }}>Crear proyecto</span>
          </nav>

          {/* TABLA: proyectos existentes */}
          <h1 style={{ fontSize: "18px", marginBottom: "8px" }}>Proyectos registrados</h1>
          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Localidad</th>
                <th>Supervisor</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
              </tr>
            </thead>
            <tbody>
              {PROYECTOS_MOCK.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.localidad}</td>
                  <td>{p.supervisor}</td>
                  <td>{p.fechaInicio}</td>
                  <td>{p.fechaFin}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr style={{ margin: "32px 0", borderColor: "#e0e0e0" }} />

          {/* FORMULARIO: crear proyecto nuevo */}
          <div className="agregar-header">
            <div className="agregar-icono-circulo">
              <i className="bi bi-folder-plus" style={{ fontSize: "22px", color: "#1E3A8A" }}></i>
            </div>
            <div>
              <h2 className="agregar-titulo">Crear Proyecto</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                Completa la información para crear un nuevo proyecto.
              </p>
            </div>
          </div>

          <hr style={{ marginBottom: "32px", borderColor: "#e0e0e0" }} />

          <div className="agregar-form">
            <FormField
              label="Nombre del proyecto"
              icon="bi-folder"
              type="text"
              placeholder="Nombre del proyecto"
              value={values.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
            />
            <SelectField
              label="Supervisor"
              icon="bi-person"
              value={values.supervisorId}
              onChange={(v) => setField("supervisorId", v)}
              options={supervisoresDisponibles.map((s) => ({ value: String(s.id), label: s.nombre }))}
              placeholder="Seleccionar supervisor"
            />
            <SelectField
              label="Localidad"
              icon="bi-geo-alt"
              value={values.localidadID}
              onChange={(v) => setField("localidadID", v)}
              options={localidades.map((l) => ({ value: l.id, label: l.nombre }))}
              placeholder="Seleccionar localidad"
            />
            <div>
              <label className="agregar-label">Descripción</label>
              <div className="agregar-field-wrapper">
                <i className="bi bi-file-earmark-text agregar-icon-left agregar-icon-left--top"></i>
                <textarea
                  className="agregar-input agregar-textarea"
                  maxLength={MAX_DESCRIPCION}
                  value={values.descripcion}
                  onChange={(e) => setField("descripcion", e.target.value)}
                />
                <span className="agregar-contador">
                  {values.descripcion.length} / {MAX_DESCRIPCION}
                </span>
              </div>
            </div>
            <FormField
              label="Fecha de inicio"
              icon="bi-calendar"
              type="date"
              value={values.fechaInicio}
              onChange={(e) => setField("fechaInicio", e.target.value)}
            />
            <FormField
              label="Fecha de finalización"
              icon="bi-calendar"
              type="date"
              value={values.fechaFin}
              onChange={(e) => setField("fechaFin", e.target.value)}
            />
          </div>

          <div className="agregar-botones">
            <Button text="Guardar Proyecto" icon="bi-floppy" onClick={handleGuardar} />
            <Button text="Editar Proyecto" icon="bi-pencil" variant="secundario" onClick={handleEditar} />
          </div>
        </main>
      </div>
    </div>
  );
}