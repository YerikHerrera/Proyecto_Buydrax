export default function PortalLoan() {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ color: "#64748b" }}>Saldo de préstamo activo (vista previa).</p>
      <div style={{ marginTop: 12, padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", maxWidth: 360 }}>
        <div style={{ fontSize: 12, color: "#64748b" }}>Saldo pendiente</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>$ 420.000</div>
        <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999, margin: "10px 0" }}>
          <div style={{ width: "58%", height: "100%", background: "#f59e0b", borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 12, color: "#64748b" }}>Próxima cuota: $ 70.000 · 15/09/2026</div>
      </div>
    </div>
  );
}
