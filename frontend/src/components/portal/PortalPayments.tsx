export default function PortalPayments() {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ color: "#64748b" }}>
        Historial de desprendibles (vista previa). Cuando el backend exponga los endpoints, aquí
        verás período, neto y descarga PDF.
      </p>
      <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 12, marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#fff7ed" }}>
              {["Período", "Tipo", "Fecha pago", "Neto (COP)", "Acción"].map((h) => (
                <th key={h} style={{ padding: 12, textAlign: "left", color: "#9a3412" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 12 }}>2026-08 Q2</td>
              <td style={{ padding: 12 }}>Quincenal</td>
              <td style={{ padding: 12 }}>2026-08-30</td>
              <td style={{ padding: 12, fontWeight: 700 }}>$ 1.850.000</td>
              <td style={{ padding: 12 }}>
                <button type="button" style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#f97316", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                  Descargar PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
