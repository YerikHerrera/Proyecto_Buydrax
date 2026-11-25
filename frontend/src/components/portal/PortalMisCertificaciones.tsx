import { useEffect, useState, type CSSProperties } from "react";
import { misCertificaciones } from "../../services/portalService";

export default function PortalMisCertificaciones() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    misCertificaciones()
      .then((r) => setRows(r || []))
      .catch((e) => setErr(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#78716c" }}>Cargando certificaciones…</p>;
  if (err) return <p style={{ color: "#b91c1c" }}>{err}</p>;
  if (!rows.length) return <p style={{ color: "#78716c" }}>No tienes certificaciones registradas.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#fff7ed", textAlign: "left" }}>
            <th style={th}>Nombre / tipo</th>
            <th style={th}>Obtención</th>
            <th style={th}>Vencimiento</th>
            <th style={th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.id_certificacion || i} style={{ borderTop: "1px solid #f5f5f4" }}>
              <td style={td}>{c.nombre || c.tipo_certificacion || c.descripcion || "—"}</td>
              <td style={td}>{c.fecha_obtencion || "—"}</td>
              <td style={td}>{c.fecha_vencimiento || "—"}</td>
              <td style={td}>{c.estado || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th: CSSProperties = { padding: "10px 8px", color: "#9a3412" };
const td: CSSProperties = { padding: "10px 8px" };
