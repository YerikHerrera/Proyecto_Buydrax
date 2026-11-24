import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import RegistrarUsuarioForm from "../components/usuarios/RegistrarUsuarioForm";
import { crearUsuario } from "../services/usuariosService";

export default function RegistrarEmpleado() {
  return (
    <RoleGate require="admin">
      <RegistrarEmpleadoInner />
    </RoleGate>
  );
}

function RegistrarEmpleadoInner() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("EMPLEADO");
  const [areaResponsable, setAreaResponsable] = useState("Gestión humana");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cuadrilla, setCuadrilla] = useState("");
  const [areaNomina, setAreaNomina] = useState("Nómina");
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
    if (rol === "ADMIN_RRHH" && !areaResponsable.trim()) {
      setError("Área responsable es obligatoria para ADMIN_RRHH.");
      return;
    }
    if ((rol === "SUPERVISOR" || rol === "CONTADOR") && !numeroTarjeta.trim()) {
      setError("Número de tarjeta profesional es obligatorio para este rol.");
      return;
    }
    if (rol === "CONTADOR" && !areaNomina.trim()) {
      setError("Área de nómina es obligatoria para CONTADOR.");
      return;
    }
    try {
      setLoading(true);
      const u = await crearUsuario({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena,
        rol,
        estado: true,
        area_responsable: rol === "ADMIN_RRHH" ? areaResponsable.trim() : undefined,
        numero_tarjeta_profesional:
          rol === "SUPERVISOR" || rol === "CONTADOR" ? numeroTarjeta.trim() : undefined,
        cuadrilla_asignada: rol === "SUPERVISOR" ? cuadrilla.trim() || undefined : undefined,
        area_nomina: rol === "CONTADOR" ? areaNomina.trim() : undefined,
      });
      navigate(`/empleados/agregar?id_usuario=${u.id_usuario}`, {
        state: { nuevoUsuario: u, rolElegido: rol },
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
          Crea el acceso al sistema (tabla <code>usuarios</code>) y elige el{" "}
          <strong>rol</strong>. Después completarás el perfil laboral en el paso 2.
        </p>
        {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
        <RegistrarUsuarioForm
          nombres={nombres}
          apellidos={apellidos}
          correo={correo}
          contrasena={contrasena}
          rol={rol}
          areaResponsable={areaResponsable}
          numeroTarjeta={numeroTarjeta}
          cuadrilla={cuadrilla}
          areaNomina={areaNomina}
          loading={loading}
          onNombresChange={setNombres}
          onApellidosChange={setApellidos}
          onCorreoChange={setCorreo}
          onContrasenaChange={setContrasena}
          onRolChange={setRol}
          onAreaResponsableChange={setAreaResponsable}
          onNumeroTarjetaChange={setNumeroTarjeta}
          onCuadrillaChange={setCuadrilla}
          onAreaNominaChange={setAreaNomina}
          onSubmit={guardar}
        />
        <p style={{ marginTop: 16, fontSize: 13, color: "#64748b" }}>
          ¿El usuario ya existe?{" "}
          <Link to="/empleados/agregar">Ir directo al perfil laboral (paso 2)</Link>
        </p>
      </div>
    </AppShell>
  );
}
