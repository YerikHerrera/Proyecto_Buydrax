import type { RolDemo } from "../../services/authService";

type Props = {
  visible: boolean;
  onToggle: () => void;
  onSelectRole: (rol: RolDemo) => void;
};

const roles: [RolDemo, string][] = [
  ["ADMIN_RRHH", "Admin RRHH — acceso completo"],
  ["SUPERVISOR", "Supervisor"],
  ["CONTADOR", "Contador"],
  ["EMPLEADO", "Empleado (portal)"],
];

export default function LoginDemo({ visible, onToggle, onSelectRole }: Props) {
  return (
    <div style={{ width: "100%", marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <button
        type="button" onClick={onToggle}
        style={{
          width: "100%", background: "transparent", border: "1px dashed rgba(251, 191, 36, 0.45)",
          color: "#fbbf24", fontSize: 12.5, fontWeight: 600, padding: "10px 12px",
          borderRadius: 10, cursor: "pointer",
        }}
      >
        {visible ? "Ocultar acceso demo" : "Entrar en modo demo (sin backend)"}
      </button>

      {visible && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: 0, textAlign: "center", lineHeight: 1.4 }}>
            El backend no es necesario. Elige un rol para recorrer las interfaces.
            Los datos de reportes son de vista previa.
          </p>
          {roles.map(([rol, label]) => (
            <button
              key={rol} type="button" onClick={() => onSelectRole(rol)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 9,
                border: "1px solid rgba(255,255,255,0.12)",
                background: rol === "ADMIN_RRHH"
                  ? "linear-gradient(135deg, rgba(180,83,9,0.35), rgba(245,158,11,0.25))"
                  : "rgba(255,255,255,0.06)",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
