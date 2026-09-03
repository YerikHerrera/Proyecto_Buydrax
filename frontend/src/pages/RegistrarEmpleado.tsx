import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/RegistrarEmpleado.css";

export default function RegistrarEmpleado() {
  const navigate = useNavigate();
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = () => {
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 1800);
  };

  return (
    <div className="registro-page">
      <Navbar />
      <div className="registro-body">
        <Sidebar />
        <main className="registro-main">
          <div className="registro-breadcrumb">
            <i className="bi bi-house-fill"></i><span>›</span><span>Empleados</span><span>›</span><strong>Registrar Empleado</strong>
          </div>

          <div className="registro-stepper">
            <div className="registro-step activo"><span>1</span><b>Información básica</b></div>
            <div className="registro-linea"></div>
            <div className="registro-step"><span>2</span><b>Perfil</b></div>
            <div className="registro-linea"></div>
            <div className="registro-step"><span>3</span><b>Resumen</b></div>
          </div>

          <div className="registro-header">
            <div className="registro-icono"><i className="bi bi-person-plus-fill"></i></div>
            <div>
              <h1>Registrar Empleado</h1>
              <p>Ingresa la información básica del nuevo empleado.</p>
            </div>
          </div>

          <section className="registro-card">
            <div className="registro-grid">
              <label>Nombre completo<input placeholder="Ingresa el nombre completo" /></label>
              <label>Tipo de documento<select defaultValue="CC"><option value="CC">Cédula de ciudadanía</option><option value="CE">Cédula de extranjería</option><option value="TI">Tarjeta de identidad</option></select></label>
              <label>Número de documento<input placeholder="Ingresa el número de documento" /></label>
              <label>Correo electrónico<input type="email" placeholder="correo@empresa.com" /></label>
              <label>Teléfono<input type="tel" placeholder="300 000 0000" /></label>
              <label>Cargo<select defaultValue=""><option value="" disabled>Seleccionar cargo</option><option>Distribuidor</option><option>Arquitecto</option><option>Supervisor</option><option>Ayudante</option><option>Ingeniero</option><option>Obrero</option></select></label>
              <label>Fecha de ingreso<input type="date" /></label>
              <label>Proyecto asignado<select defaultValue=""><option value="" disabled>Seleccionar proyecto</option><option>Proyecto Buydrax</option><option>Proyecto Administrativo</option><option>Proyecto de Desarrollo</option></select></label>
            </div>

            <div className="registro-observacion">
              <i className="bi bi-info-circle-fill"></i>
              <span>Los campos podrán completarse o actualizarse después desde el perfil del empleado.</span>
            </div>
          </section>

          {guardado && <div className="registro-toast"><i className="bi bi-check-circle-fill"></i> Empleado registrado correctamente.</div>}

          <div className="registro-actions">
            <button className="registro-btn secundario" onClick={() => navigate("/empleados")}><i className="bi bi-arrow-left"></i> Anterior</button>
            <button className="registro-btn primario" onClick={handleGuardar}><i className="bi bi-floppy-fill"></i> Guardar empleado</button>
          </div>
        </main>
      </div>
    </div>
  );
}
