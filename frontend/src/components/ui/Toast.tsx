type ToastProps = {
  message: string;
  type?: "error" | "success" | "info";
};

const COLORES = {
  error:   { bg: "#FDECEA", borde: "#F5C6CB", texto: "#B91C1C", icono: "bi-exclamation-circle-fill" },
  success: { bg: "#E6F4EA", borde: "#BEE5C1", texto: "#1E7E34", icono: "bi-check-circle-fill" },
  info:    { bg: "#E8F0FE", borde: "#C6DAFC", texto: "#1A73E8", icono: "bi-info-circle-fill" },
};

export default function Toast({ message, type = "error" }: ToastProps) {
  const c = COLORES[type];
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: c.bg,
        border: `1px solid ${c.borde}`,
        color: c.texto,
        padding: "12px 20px",
        borderRadius: "10px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        fontWeight: 500,
        zIndex: 9999,
        animation: "toast-slide-down 0.25s ease-out",
      }}
    >
      <i className={`bi ${c.icono}`} style={{ fontSize: "18px" }}></i>
      {message}
    </div>
  );
}