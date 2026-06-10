import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function AgregarEmpleados() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "40px" }}>

          {/* HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              backgroundColor: "#e8eeff", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <i className="bi bi-person-badge" style={{ fontSize: "22px", color: "#1E3A8A" }}></i>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#111" }}>
                REGISTRO DE PERFIL DE EMPLEADO
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                Completa la información del perfil del empleado.
              </p>
            </div>
          </div>

          <hr style={{ marginBottom: "32px", borderColor: "#e0e0e0" }} />

          {/* FORMULARIO */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            maxWidth: "860px"
          }}>

            {/* Nacionalidad */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
                Nacionalidad
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-globe" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "15px" }}></i>
                <select style={{
                  width: "100%", padding: "12px 16px 12px 40px",
                  borderRadius: "10px", border: "1.5px solid #e0e0e0",
                  fontSize: "14px", color: "#333", backgroundColor: "#fff",
                  appearance: "none", cursor: "pointer", outline: "none"
                }}>
                  <option>Colombiana</option>
                  <option>Venezolana</option>
                  <option>Ecuatoriana</option>
                  <option>Peruana</option>
                  <option>Otra</option>
                </select>
                <i className="bi bi-chevron-down" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none" }}></i>
              </div>
            </div>

            {/* Contacto de emergencia */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
                Contacto de emergencia
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-telephone" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "15px" }}></i>
                <input
                  type="tel"
                  placeholder="300 000 0000"
                  style={{
                    width: "100%", padding: "12px 16px 12px 40px",
                    borderRadius: "10px", border: "1.5px solid #e0e0e0",
                    fontSize: "14px", color: "#333", backgroundColor: "#fff",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Estado Civil */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
                Estado Civil
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-people" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "15px" }}></i>
                <select style={{
                  width: "100%", padding: "12px 16px 12px 40px",
                  borderRadius: "10px", border: "1.5px solid #e0e0e0",
                  fontSize: "14px", color: "#888", backgroundColor: "#fff",
                  appearance: "none", cursor: "pointer", outline: "none"
                }}>
                  <option value="" disabled selected>Seleccionar estado civil</option>
                  <option>Soltero/a</option>
                  <option>Casado/a</option>
                  <option>Unión libre</option>
                  <option>Divorciado/a</option>
                  <option>Viudo/a</option>
                </select>
                <i className="bi bi-chevron-down" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none" }}></i>
              </div>
            </div>

            {/* Tipo de sangre */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
                Tipo de sangre
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-droplet" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "15px" }}></i>
                <select style={{
                  width: "100%", padding: "12px 16px 12px 40px",
                  borderRadius: "10px", border: "1.5px solid #e0e0e0",
                  fontSize: "14px", color: "#333", backgroundColor: "#fff",
                  appearance: "none", cursor: "pointer", outline: "none"
                }}>
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
                <i className="bi bi-chevron-down" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none" }}></i>
              </div>
            </div>

            {/* EPS */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
                EPS
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-shield-plus" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "15px" }}></i>
                <select style={{
                  width: "100%", padding: "12px 16px 12px 40px",
                  borderRadius: "10px", border: "1.5px solid #e0e0e0",
                  fontSize: "14px", color: "#333", backgroundColor: "#fff",
                  appearance: "none", cursor: "pointer", outline: "none"
                }}>
                  <option>Nueva EPS</option>
                  <option>Sura</option>
                  <option>Sanitas</option>
                  <option>Compensar</option>
                  <option>Famisanar</option>
                  <option>Coosalud</option>
                </select>
                <i className="bi bi-chevron-down" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", pointerEvents: "none" }}></i>
              </div>
            </div>

            {/* Nombre completo */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
                Nombre completo
              </label>
              <div style={{ position: "relative" }}>
                <i className="bi bi-person" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "15px" }}></i>
                <input
                  type="text"
                  placeholder="Nombre del empleado"
                  style={{
                    width: "100%", padding: "12px 16px 12px 40px",
                    borderRadius: "10px", border: "1.5px solid #e0e0e0",
                    fontSize: "14px", color: "#333", backgroundColor: "#fff",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

          </div>

          {/* BOTONES */}
          <div style={{
            display: "flex", justifyContent: "flex-end", gap: "12px",
            marginTop: "40px", maxWidth: "860px"
          }}>
            <button
              onClick={() => navigate("/empleados")}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "12px 28px", borderRadius: "10px",
                border: "1.5px solid #e0e0e0", background: "#fff",
                fontSize: "14px", fontWeight: "600", color: "#333",
                cursor: "pointer"
              }}
            >
              <i className="bi bi-arrow-left"></i> Anterior
            </button>

            <button
              onClick={() => alert("Empleado guardado")}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "12px 28px", borderRadius: "10px",
                border: "none", background: "#1E3A8A",
                fontSize: "14px", fontWeight: "600", color: "#fff",
                cursor: "pointer"
              }}
            >
              <i className="bi bi-floppy"></i> Guardar registro
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}