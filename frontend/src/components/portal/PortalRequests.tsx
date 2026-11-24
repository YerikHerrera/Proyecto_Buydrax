type Props = { onNewRequest?: () => void };

export default function PortalRequests({ onNewRequest }: Props) {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ color: "#64748b" }}>
        Aquí podrás crear solicitudes de permiso o vacaciones. Módulo visual listo para conectar API.
      </p>
      <button
        type="button"
        onClick={onNewRequest}
        style={{
          marginTop: 12, padding: "10px 16px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg,#ea580c,#f59e0b)", color: "#fff",
          fontWeight: 700, cursor: "pointer",
        }}
      >
        + Nueva solicitud
      </button>
    </div>
  );
}
