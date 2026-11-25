import { useEffect, useState, type CSSProperties } from "react";
import { miAsistencia } from "../../services/portalService";

export default function PortalMiAsistencia() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    miAsistencia()
      .then((r) => setRows(r || []))
      .catch((e) => setErr(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#78716c" }}>Cargando asistencia…</p>;
  if (err) return <p style={{ color: "#b91c1c" }}>{err}</p>;
  if (!rows.length) return <p style={{ color: "#78716c" }}>Sin registros de asistencia.</p>;

  const sorted = [...rows].sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#fff7ed", textAlign: "left" }}>
            <th style={th}>Fecha</th>
            <th style={th}>Estado</th>
            <th style={th}>Entrada</th>
            <th style={th}>Salida</th>
            <th style={th}>Obs.</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, i) => (
            <tr key={a.id_asistencia || i} style={{ borderTop: "1px solid #f5f5f4" }}>
              <td style={td}>{a.fecha}</td>
              <td style={td}>{a.estado_asistencia || a.estado || "—"}</td>
              <td style={td}>{String(a.hora_entrada || "").slice(0, 5) || "—"}</td>
              <td style={td}>{String(a.hora_salida || "").slice(0, 5) || "—"}</td>
              <td style={td}>{a.observacion || a.observaciones || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th: CSSProperties = { padding: "10px 8px", color: "#9a3412" };
const td: CSSProperties = { padding: "10px 8px" };
