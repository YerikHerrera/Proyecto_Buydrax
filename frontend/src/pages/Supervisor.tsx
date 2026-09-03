import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/Supervisor.css";

function Supervisor() {
  const [supervisor, setSupervisor] = useState("");
  const [motivo, setMotivo] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [telefono, setTelefono] = useState("");

  const guardarSupervisor = () => {
    if (!supervisor || !motivo || !proyecto || !telefono) {
      alert("Por favor completa todos los campos.");
      return;
    }

    alert("Supervisor guardado correctamente.");
  };

  const buscarSupervisor = () => {
    alert("Búsqueda de supervisor.");
  };

  return (
    <div className="supervisor-page">

      <Navbar />

      <div className="supervisor-body">

        <Sidebar />

        <main className="supervisor-main">

          {/* BREADCRUMB */}
          <div className="breadcrumb-supervisor">
            <span>Inicio</span>
            <i className="bi bi-chevron-right"></i>

            <span>Empleados</span>
            <i className="bi bi-chevron-right"></i>

            <span>Registro</span>
            <i className="bi bi-chevron-right"></i>

            <strong>Supervisores</strong>
          </div>

          {/* STEPPER */}
          <div className="stepper-supervisor">

            <div className="stepper-supervisor-item completado">
              <div className="stepper-supervisor-circle">
                <i className="bi bi-check"></i>
              </div>

              <span>Información básica</span>
            </div>

            <div className="stepper-supervisor-line"></div>

            <div className="stepper-supervisor-item activo">
              <div className="stepper-supervisor-circle">
                2
              </div>

              <span>Supervisor</span>
            </div>

            <div className="stepper-supervisor-line"></div>

            <div className="stepper-supervisor-item">
              <div className="stepper-supervisor-circle">
                3
              </div>

              <span>Resumen</span>
            </div>

          </div>

          {/* ENCABEZADO */}
          <div className="supervisor-header">

            <div className="supervisor-avatar">
              NV
              <span>Nuevo</span>
            </div>

            <div>
              <h1>Registrar Supervisor</h1>

              <p>
                Completa la información del supervisor asignado al proyecto.
              </p>
            </div>

          </div>

          {/* FORMULARIO */}
          <div className="supervisor-card">

            {/* SUPERVISOR */}
            <div className="supervisor-field">

              <label>Nombre del Supervisor</label>

              <div className="supervisor-input-wrapper">

                <i className="bi bi-person"></i>

                <select
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                >
                  <option value="">
                    Selecciona un supervisor
                  </option>

                  <option value="Juan Pérez">
                    Juan Pérez
                  </option>

                  <option value="Carlos Rodríguez">
                    Carlos Rodríguez
                  </option>

                  <option value="María González">
                    María González
                  </option>

                </select>

              </div>

            </div>

            {/* MOTIVO */}
            <div className="supervisor-field">

              <label>Motivo</label>

              <div className="supervisor-input-wrapper">

                <i className="bi bi-file-earmark-text"></i>

                <select
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                >
                  <option value="">
                    Selecciona el motivo
                  </option>

                  <option value="Asignación de proyecto">
                    Asignación de proyecto
                  </option>

                  <option value="Cambio de supervisor">
                    Cambio de supervisor
                  </option>

                  <option value="Nuevo proyecto">
                    Nuevo proyecto
                  </option>

                </select>

              </div>

            </div>

            {/* PROYECTO */}
            <div className="supervisor-field">

              <label>Proyecto Asignado</label>

              <div className="supervisor-input-wrapper">

                <i className="bi bi-folder"></i>

                <select
                  value={proyecto}
                  onChange={(e) => setProyecto(e.target.value)}
                >
                  <option value="">
                    Selecciona un proyecto
                  </option>

                  <option value="Proyecto Buydrax">
                    Proyecto Buydrax
                  </option>

                  <option value="Proyecto Administrativo">
                    Proyecto Administrativo
                  </option>

                  <option value="Proyecto de Desarrollo">
                    Proyecto de Desarrollo
                  </option>

                </select>

              </div>

            </div>

            {/* TELÉFONO */}
            <div className="supervisor-field">

              <label>Teléfono</label>

              <div className="supervisor-input-wrapper">

                <i className="bi bi-telephone"></i>

                <input
                  type="text"
                  placeholder="Ingresa el número de teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />

              </div>

            </div>

            {/* AVISO */}
            <div className="supervisor-info">

              <div className="supervisor-info-icon">
                <i className="bi bi-info-circle"></i>
              </div>

              <div>
                <strong>Información:</strong>

                <span>
                  Asegúrate de seleccionar el supervisor correcto.
                  Esta información estará vinculada al proyecto asignado.
                </span>
              </div>

            </div>

          </div>

          {/* BOTONES */}
          <div className="supervisor-actions">

            <button className="btn-volver-supervisor">
              <i className="bi bi-arrow-left"></i>
              Volver
            </button>

            <button
              className="btn-buscar-supervisor"
              onClick={buscarSupervisor}
            >
              <i className="bi bi-search"></i>
              Buscar supervisor
            </button>

            <button
              className="btn-guardar-supervisor"
              onClick={guardarSupervisor}
            >
              <i className="bi bi-save"></i>
              Guardar supervisor
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Supervisor;