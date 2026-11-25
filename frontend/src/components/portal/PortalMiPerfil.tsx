import { useEffect, useState, type CSSProperties } from "react";
import { miEmpleado } from "../../services/portalService";
import { leerSesion } from "../../services/session";
import type { Empleado } from "../../services/empleadosService";

export default function PortalMiPerfil() {
  const s = leerSesion();
  const [emp, setEmp] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    miEmpleado()
      .then(setEmp)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#78716c" }}>Cargando perfil…</p>;

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <div style={card}>
        <div style={label}>Usuario</div>
        <div>{s?.nombre || "—"}</div>
        <div style={{ color: "#78716c", fontSize: 13 }}>{s?.email}</div>
        <div style={{ color: "#78716c", fontSize: 13 }}>Rol: {s?.rol || "—"}</div>
      </div>
      {emp ? (
        <div style={card}>
          <div style={label}>Ficha laboral</div>
          <div><strong>Cargo:</strong> {emp.cargo}</div>
          <div><strong>Documento:</strong> {emp.numero_documento || "—"}</div>
          <div><strong>Estado:</strong> {emp.estado_laboral || "—"}</div>
          {emp.telefono && <div><strong>Teléfono:</strong> {emp.telefono}</div>}
        </div>
      ) : (
        <p style={{ color: "#78716c" }}>Sin ficha de empleado vinculada a este usuario.</p>
      )}
    </div>
  );
}
const card: CSSProperties = {
  background: "#fff",
  border: "1px solid #e7e5e4",
  borderRadius: 12,
  padding: 16,
  lineHeight: 1.6,
};
const label: CSSProperties = { fontSize: 12, color: "#a8a29e", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 };
