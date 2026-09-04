import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { crearUsuario } from "../services/usuariosService";

/**
 * Paso 1: crear USUARIO del sistema (cuenta de acceso).
 * Paso 2: /empleados/agregar → perfil laboral (tabla empleado).
 */
export default function RegistrarEmpleado() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const guardar = async () => {
    setError("");
    if (!nombres.trim() || !apellidos.trim() || !correo.trim() || !contrasena.trim()) {
      setError("Completa nombres, apellidos, correo y contraseña.");
      return;
    }
    if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    try {
      setLoading(true);
      const u = await crearUsuario({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena,
        rol: "EMPLEADO",
        estado: true,
      });
      // Continuar al perfil laboral con el id recién creado
      navigate(`/empleados/agregar?id_usuario=${u.id_usuario}`, {
        state: { nuevoUsuario: u },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Empleados", to: "/empleados" },
          { label: "1. Registrar cuenta" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Paso 1 — Registrar cuenta de usuario</h1>
        <p className="page-subtitle">
          Crea el acceso al sistema (tabla <code>usuarios</code>). Después completarás el
          perfil laboral (documento, cargo, salario…) en el paso 2.
        </p>
        {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
        <div className="agregar-form" style={{ marginTop: 16 }}>
          <div>
            <label className="agregar-label">Nombres *</label>
            <input className="agregar-input" value={nombres} onChange={(e) => setNombres(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Apellidos *</label>
            <input className="agregar-input" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Correo corporativo *</label>
            <input className="agregar-input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Contraseña temporal *</label>
            <input
              className="agregar-input"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
        </div>
        <div className="agregar-botones" style={{ marginTop: 20 }}>
          <Link to="/empleados" className="agregar-btn-secundario" style={{ textDecoration: "none" }}>
            Cancelar
          </Link>
          <button className="agregar-btn-primario" type="button" onClick={guardar} disabled={loading}>
            {loading ? "Creando…" : "Crear cuenta y continuar →"}
          </button>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: "#64748b" }}>
          ¿El usuario ya existe?{" "}
          <Link to="/empleados/agregar">Ir directo al perfil laboral (paso 2)</Link>
        </p>
      </div>
    </AppShell>
  );
}
