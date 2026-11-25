import { useEffect, useState, type CSSProperties } from "react";
import { misTurnos, misAsignacionesActivas } from "../../services/portalService";
import type { Proyecto } from "../../services/proyectosService";

export default function PortalMisTurnos() {
  const [rows, setRows] = useState<any[]>([]);
  const [proys, setProys] = useState<Record<number, Proyecto>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([misTurnos(), misAsignacionesActivas()])
      .then(([t, a]) => {
        setRows(t || []);
        setProys(a.proyectos);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#78716c" }}>Cargando turnos…</p>;
  if (err) return <p style={{ color: "#b91c1c" }}>{err}</p>;
  if (!rows.length) return <p style={{ color: "#78716c" }}>No tienes turnos registrados.</p>;

  const sorted = [...rows].sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#fff7ed", textAlign: "left" }}>
            <th style={th}>Fecha</th>
            <th style={th}>Proyecto</th>
            <th style={th}>Tipo</th>
            <th style={th}>Inicio</th>
            <th style={th}>Fin</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => (
            <tr key={t.id_turno || i} style={{ borderTop: "1px solid #f5f5f4" }}>
              <td style={td}>{t.fecha}</td>
              <td style={td}>{proys[t.id_proyecto]?.nombre || (t.id_proyecto ? `#${t.id_proyecto}` : "—")}</td>
              <td style={td}>{t.tipo_turno || "—"}</td>
              <td style={td}>{String(t.hora_inicio || "").slice(0, 5)}</td>
              <td style={td}>{String(t.hora_fin || "").slice(0, 5)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th: CSSProperties = { padding: "10px 8px", color: "#9a3412" };
const td: CSSProperties = { padding: "10px 8px" };
