import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/AgregarEmpleados.css"; // ✅ asegúrate de importar el CSS

export default function AgregarEmpleados() {
  const navigate = useNavigate();

  return (
    <div className="agregar-page">
      <Navbar />
      <div className="agregar-body">
        <Sidebar />

        <main className="agregar-main">

          {/* HEADER */}
          <div className="agregar-header">
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
              backgroundColor: "#e8eeff", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <i className="bi bi-person-badge" style={{ fontSize: "22px", color: "#1E3A8A" }}></i>
            </div>
            <div style={{ minWidth: 0 }}>
              {/* ✅ clase en lugar de inline fontSize para que el responsive funcione */}
              <h2 className="agregar-titulo">REGISTRO DE PERFIL DE EMPLEADO</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                Completa la información del perfil del empleado.
              </p>
            </div>
          </div>

          <hr style={{ marginBottom: "32px", borderColor: "#e0e0e0" }} />

          {/* FORMULARIO — ahora usa la clase CSS */}
          <div className="agregar-form">

            {/* Nacionalidad */}
            <div>
              <label className="agregar-label">Nacionalidad</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-globe agregar-icon-left"></i>
                <select className="agregar-input">
                  <option>Colombiana</option>
                  <option>Venezolana</option>
                  <option>Ecuatoriana</option>
                  <option>Peruana</option>
                  <option>Otra</option>
                </select>
                <i className="bi bi-chevron-down agregar-icon-right"></i>
              </div>
            </div>

            {/* Contacto de emergencia */}
            <div>
              <label className="agregar-label">Contacto de emergencia</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-telephone agregar-icon-left"></i>
                <input type="tel" placeholder="300 000 0000" className="agregar-input" />
              </div>
            </div>

            {/* Estado Civil */}
            <div>
              <label className="agregar-label">Estado Civil</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-people agregar-icon-left"></i>
                <select className="agregar-input agregar-input--placeholder">
                  <option value="" disabled>Seleccionar estado civil</option>
                  <option>Soltero/a</option>
                  <option>Casado/a</option>
                  <option>Unión libre</option>
                  <option>Divorciado/a</option>
                  <option>Viudo/a</option>
                </select>
                <i className="bi bi-chevron-down agregar-icon-right"></i>
              </div>
            </div>

            {/* Tipo de sangre */}
            <div>
              <label className="agregar-label">Tipo de sangre</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-droplet agregar-icon-left"></i>
                <select className="agregar-input">
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
                <i className="bi bi-chevron-down agregar-icon-right"></i>
              </div>
            </div>

            {/* EPS */}
            <div>
              <label className="agregar-label">EPS</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-shield-plus agregar-icon-left"></i>
                <select className="agregar-input">
                  <option>Nueva EPS</option>
                  <option>Sura</option>
                  <option>Sanitas</option>
                  <option>Compensar</option>
                  <option>Famisanar</option>
                  <option>Coosalud</option>
                </select>
                <i className="bi bi-chevron-down agregar-icon-right"></i>
              </div>
            </div>

            {/* Nombre completo */}
            <div>
              <label className="agregar-label">Nombre completo</label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-person agregar-icon-left"></i>
                <input type="text" placeholder="Nombre del empleado" className="agregar-input" />
              </div>
            </div>

          </div>

          {/* BOTONES */}
          <div className="agregar-botones">
            <button className="agregar-btn-secundario" onClick={() => navigate("/empleados")}>
              <i className="bi bi-arrow-left"></i> Anterior
            </button>
            <button className="agregar-btn-primario" onClick={() => alert("Empleado guardado")}>
              <i className="bi bi-floppy"></i> Guardar registro
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}