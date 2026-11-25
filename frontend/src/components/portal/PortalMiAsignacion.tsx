import { useEffect, useState, type CSSProperties } from "react";
import { misAsignacionesActivas } from "../../services/portalService";
import type { AsignacionOut } from "../../services/asignacionesService";
import type { Proyecto } from "../../services/proyectosService";
import type { Empleado } from "../../services/empleadosService";

export default function PortalMiAsignacion() {
  const [asigs, setAsigs] = useState<AsignacionOut[]>([]);
  const [proys, setProys] = useState<Record<number, Proyecto>>({});
  const [emp, setEmp] = useState<Empleado | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    misAsignacionesActivas()
      .then((r) => {
        setAsigs(r.asignaciones);
        setProys(r.proyectos);
        setEmp(r.empleado);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#78716c" }}>Cargando…</p>;
  if (err) return <p style={{ color: "#b91c1c" }}>{err}</p>;
  if (!emp) {
    return (
      <p style={{ color: "#78716c" }}>
        No hay ficha de empleado vinculada a tu usuario. Contacta a RRHH.
      </p>
    );
  }

  return (
    <div>
      <p style={{ marginBottom: 12, color: "#57534e" }}>
        Cargo: <strong>{emp.cargo}</strong>
        {emp.numero_documento ? ` · Doc. ${emp.numero_documento}` : ""}
      </p>
      {asigs.length === 0 ? (
        <p style={{ color: "#78716c" }}>No tienes asignaciones activas a proyectos/cuadrillas.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#fff7ed", textAlign: "left" }}>
                <th style={th}>Proyecto</th>
                <th style={th}>Cuadrilla</th>
                <th style={th}>Función</th>
                <th style={th}>Desde</th>
              </tr>
            </thead>
            <tbody>
              {asigs.map((a) => (
                <tr key={a.id_asignacion} style={{ borderTop: "1px solid #f5f5f4" }}>
                  <td style={td}>{proys[a.id_proyecto]?.nombre || `Proyecto #${a.id_proyecto}`}</td>
                  <td style={td}>{a.cuadrilla || "—"}</td>
                  <td style={td}>{a.rol_en_proyecto}</td>
                  <td style={td}>{a.fecha_asignacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: CSSProperties = { padding: "10px 8px", color: "#9a3412" };
const td: CSSProperties = { padding: "10px 8px" };
