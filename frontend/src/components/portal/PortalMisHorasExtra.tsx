import { useEffect, useState, type CSSProperties } from "react";
import { misHorasExtra } from "../../services/portalService";

export default function PortalMisHorasExtra() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    misHorasExtra()
      .then((r) => setRows(r || []))
      .catch((e) => setErr(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#78716c" }}>Cargando horas extra…</p>;
  if (err) return <p style={{ color: "#b91c1c" }}>{err}</p>;
  if (!rows.length) return <p style={{ color: "#78716c" }}>No tienes horas extra registradas.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#fff7ed", textAlign: "left" }}>
            <th style={th}>Inicio</th>
            <th style={th}>Fin</th>
            <th style={th}>Horas</th>
            <th style={th}>Tipo</th>
            <th style={th}>Estado</th>
            <th style={th}>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h, i) => (
            <tr key={h.id_hora_extra || i} style={{ borderTop: "1px solid #f5f5f4" }}>
              <td style={td}>{h.fecha_inicio}</td>
              <td style={td}>{h.fecha_fin}</td>
              <td style={td}>{h.cantidad_horas}</td>
              <td style={td}>{h.tipo_hora || "—"}</td>
              <td style={td}>{h.estado_he || h.estado || "—"}</td>
              <td style={td}>{h.motivo || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th: CSSProperties = { padding: "10px 8px", color: "#9a3412" };
const td: CSSProperties = { padding: "10px 8px" };
