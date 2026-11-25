import { createPortal } from "react-dom";

type ToastProps = {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
};

const ESTILOS = {
  error:   { color: "#B91C1C", fondo: "#FDECEA", titulo: "No se pudo completar", icono: "bi-x-circle-fill" },
  success: { color: "#1E7E34", fondo: "#E6F4EA", titulo: "¡Proceso exitoso!", icono: "bi-check-circle-fill" },
  info:    { color: "#1A73E8", fondo: "#E8F0FE", titulo: "Información", icono: "bi-info-circle-fill" },
};

export default function Toast({ message, type = "error", onClose }: ToastProps) {
  const e = ESTILOS[type];

  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 9999 }}>
      <div role="alertdialog" aria-modal="true" aria-label={e.titulo} style={{ background: "#fff", borderRadius: "16px", borderTop: `6px solid ${e.color}`, padding: "28px 24px", width: "100%", maxWidth: "380px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ width: "64px", height: "64px", margin: "0 auto 14px", borderRadius: "50%", background: e.fondo, color: e.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
          <i className={`bi ${e.icono}`}></i>
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "19px", color: "#0f172a" }}>{e.titulo}</h3>
        <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#475569" }}>{message}</p>
        <button type="button" autoFocus onClick={onClose} style={{ width: "100%", padding: "11px", border: "none", borderRadius: "10px", background: e.color, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Aceptar
        </button>
      </div>
    </div>,
    document.body
  );
}