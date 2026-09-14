import { useMemo, useState } from "react";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import { MOCK_ASISTENCIA, MOCK_PROYECTOS, badgeEstado } from "../../data/mockReportes";

/** Mini calendario visual: días asistidos (verde), faltas (rojo), justificadas (amarillo) */
function MiniCal({ asistidos, faltas, justificadas }: { asistidos: number; faltas: number; justificadas: number }) {
  const total = Math.max(asistidos + faltas + justificadas, 1);
  const cells: ("ok" | "falta" | "just")[] = [];
  for (let i = 0; i < asistidos; i++) cells.push("ok");
  for (let i = 0; i < justificadas; i++) cells.push("just");
  for (let i = 0; i < faltas; i++) cells.push("falta");
  while (cells.length < 20) cells.push("ok");
  const show = cells.slice(0, 20);
  const color = (t: string) =>
    t === "ok" ? "#22c55e" : t === "falta" ? "#ef4444" : "#eab308";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 88 }} title={`Asistidos ${asistidos} · Faltas ${faltas} · Just. ${justificadas}`}>
      {show.map((t, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: color(t),
            opacity: i < total ? 1 : 0.25,
          }}
        />
      ))}
    </div>
  );
}

export default function ReporteAsistencia() {
  const [proyecto, setProyecto] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");

  const filas = useMemo(() => {
    return MOCK_ASISTENCIA.filter((r) => {
      if (proyecto && r.proyecto !== proyecto) return false;
      if (estado && r.estado !== estado) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.nombre.toLowerCase().includes(s) && !r.cargo.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [proyecto, estado, q]);

  return (
    <ReporteShell
      titulo="Reporte de asistencia"
      subtitulo="Por proyecto · nombre, cargo y estado. Vista mensual/quincenal con mini representación gráfica."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Asistencia", to: "/asistencia" },
        { label: "Reporte" },
      ]}
      accionHref="/asistencia"
      accionLabel="Registrar asistencia"
    >
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Nombre o cargo…"
        onLimpiar={() => {
          setProyecto("");
          setEstado("");
          setQ("");
        }}
        filtros={[
          {
            key: "proyecto",
            label: "Proyecto",
            value: proyecto,
            onChange: setProyecto,
            options: [
              { value: "", label: "Todos" },
              ...MOCK_PROYECTOS.map((p) => ({ value: p, label: p })),
            ],
          },
          {
            key: "estado",
            label: "Estado",
            value: estado,
            onChange: setEstado,
            options: [
              { value: "", label: "Todos" },
              { value: "Al día", label: "Al día" },
              { value: "Con faltas", label: "Con faltas" },
              { value: "Incapacidad", label: "Incapacidad" },
            ],
          },
        ]}
      />

      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#fff7ed", textAlign: "left" }}>
              {["Proyecto", "Empleado", "Cargo", "Periodo", "Asistencia (mes)", "Estado"].map((h) => (
                <th key={h} style={{ padding: "12px 14px", fontWeight: 700, color: "#9a3412" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                  Sin registros con los filtros actuales.
                </td>
              </tr>
            ) : (
              filas.map((r, idx) => {
                const b = badgeEstado(r.estado);
                return (
                  <tr
                    key={r.id}
                    style={{ background: idx % 2 === 0 ? "#fff" : "#fafbfc", borderTop: "1px solid #f1f5f9" }}
                  >
                    <td style={{ padding: "12px 14px" }}>{r.proyecto}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{r.nombre}</td>
                    <td style={{ padding: "12px 14px" }}>{r.cargo}</td>
                    <td style={{ padding: "12px 14px" }}>{r.mes}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <MiniCal
                          asistidos={r.diasAsistidos}
                          faltas={r.faltas}
                          justificadas={r.justificadas}
                        />
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {r.diasAsistidos}A · {r.faltas}F · {r.justificadas}J
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: b.bg,
                          color: b.color,
                        }}
                      >
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 12, color: "#64748b" }}>
        <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#22c55e", borderRadius: 2, marginRight: 4 }} /> Asistido</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#ef4444", borderRadius: 2, marginRight: 4 }} /> Falta</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#eab308", borderRadius: 2, marginRight: 4 }} /> Justificada</span>
      </div>
    </ReporteShell>
  );
}
