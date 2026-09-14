import { useMemo, useState } from "react";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import { MOCK_TURNOS, MOCK_PROYECTOS, badgeEstado } from "../../data/mockReportes";

export default function ReporteTurnos() {
  const [proyecto, setProyecto] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");

  const filas = useMemo(() => {
    return MOCK_TURNOS.filter((r) => {
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
      titulo="Reporte de turnos"
      subtitulo="Turnos asignados por proyecto · nombre, cargo, estado y horario."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Asistencia", to: "/asistencia" },
        { label: "Turnos" },
      ]}
      accionHref="/asistencia/turno"
      accionLabel="Asignar turnos"
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
              { value: "Programado", label: "Programado" },
              { value: "En curso", label: "En curso" },
              { value: "Finalizado", label: "Finalizado" },
            ],
          },
        ]}
      />

      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#fff7ed", textAlign: "left" }}>
              {["Proyecto", "Empleado", "Cargo", "Fecha", "Tipo", "Inicio", "Fin", "Estado"].map((h) => (
                <th key={h} style={{ padding: "12px 14px", fontWeight: 700, color: "#9a3412" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                  Sin turnos con los filtros actuales.
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
                    <td style={{ padding: "12px 14px" }}>{r.fecha}</td>
                    <td style={{ padding: "12px 14px" }}>{r.tipoTurno}</td>
                    <td style={{ padding: "12px 14px" }}>{r.horaInicio}</td>
                    <td style={{ padding: "12px 14px" }}>{r.horaFin}</td>
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
    </ReporteShell>
  );
}
