import { useState } from "react";
import { EMPLEADOS_MOCK } from "../data/empleados";
import { PROYECTOS_MOCK } from "../data/proyectos";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/AsignacionEmpleado.css";

export default function AsignacionEmpleado() {
  const [empleadoId, setEmpleadoId] = useState("");
  const [proyectoId, setProyectoId] = useState("");
  const [rol, setRol] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  const guardar = () => {
    if (!empleadoId || !proyectoId || !rol || !fechaInicio) {
      alert("Completa todos los campos para realizar la asignación.");
      return;
    }

    const empleado = EMPLEADOS_MOCK.find((e) => String(e.id) === empleadoId)?.nombre;
    const proyecto = PROYECTOS_MOCK.find((p) => String(p.id) === proyectoId)?.nombre;
    alert(`Asignación realizada: ${empleado} → ${proyecto}`);
  };

  return (
    <div className="asignacion-page">
      <Navbar />
      <div className="asignacion-body">
        <Sidebar />
        <main className="asignacion-main">
          <nav className="asignacion-breadcrumb">
            <i className="bi bi-house-fill"></i><span>›</span><span>Proyectos</span><span>›</span>
            <strong>Asignación empleado</strong>
          </nav>

          <section className="asignacion-card">
            <div className="asignacion-header">
              <div className="asignacion-icono"><i className="bi bi-person-workspace"></i></div>
              <div>
                <h1>ASIGNACIÓN DE EMPLEADO</h1>
                <p>Asigna un empleado a un proyecto y define su función.</p>
              </div>
            </div>

            <hr />

            <div className="asignacion-grid">
              <label>
                Nombre del empleado
                <div className="asignacion-field">
                  <i className="bi bi-person"></i>
                  <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
                    <option value="">Seleccionar empleado</option>
                    {EMPLEADOS_MOCK.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Proyecto
                <div className="asignacion-field">
                  <i className="bi bi-folder"></i>
                  <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}>
                    <option value="">Seleccionar proyecto</option>
                    {PROYECTOS_MOCK.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Función en el proyecto
                <div className="asignacion-field">
                  <i className="bi bi-briefcase"></i>
                  <select value={rol} onChange={(e) => setRol(e.target.value)}>
                    <option value="">Seleccionar función</option>
                    <option>Supervisor</option>
                    <option>Oficial</option>
                    <option>Ayudante</option>
                    <option>Operario</option>
                    <option>Auxiliar</option>
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Fecha de inicio
                <div className="asignacion-field">
                  <i className="bi bi-calendar"></i>
                  <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                </div>
              </label>
            </div>

            <div className="asignacion-info">
              <i className="bi bi-info-circle-fill"></i>
              <span>La asignación es visual por ahora; los datos no se guardan en una base de datos.</span>
            </div>

            <div className="asignacion-actions">
              <button className="asignacion-btn" onClick={guardar}>
                <i className="bi bi-floppy"></i> Guardar y asignar empleado
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
