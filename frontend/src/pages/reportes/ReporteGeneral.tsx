import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  MOCK_ASISTENCIA,
  MOCK_HE,
  MOCK_PERSONAL,
  MOCK_PROYECTOS,
  MOCK_PROYECTOS_DET,
  MOCK_TURNOS,
  formatoCOP,
} from "../../data/mockReportes";

export default function ReporteGeneral() {
  const [proyecto, setProyecto] = useState("");

  const resumen = useMemo(() => {
    const proy = proyecto || null;
    const personal = MOCK_PERSONAL.filter((r) => !proy || r.proyecto === proy);
    const asistencia = MOCK_ASISTENCIA.filter((r) => !proy || r.proyecto === proy);
    const he = MOCK_HE.filter((r) => !proy || r.proyecto === proy);
    const turnos = MOCK_TURNOS.filter((r) => !proy || r.proyecto === proy);
    const det = MOCK_PROYECTOS_DET.filter((r) => !proy || r.nombre === proy);

    const activos = personal.filter((p) => p.estado === "Activo").length;
    const hePend = he.filter((h) => h.estado === "Pendiente").length;
    const horas = he.reduce((a, h) => a + h.horas, 0);
    const presupuesto = det.reduce((a, p) => a + p.presupuesto, 0);
    const avanceProm =
      det.length > 0 ? Math.round(det.reduce((a, p) => a + p.avance, 0) / det.length) : 0;

    return {
      personal: personal.length,
      activos,
      asistencia: asistencia.length,
      hePend,
      horas,
      turnos: turnos.length,
      presupuesto,
      avanceProm,
      det,
    };
  }, [proyecto]);

  return (
    <ReporteShell
      titulo="Reporte general por proyecto"
      subtitulo="Resumen consolidado de personal, asistencia, turnos, horas extra y avance."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Reportes", to: "/reportes" },
        { label: "General por proyecto" },
      ]}
    >
      <FiltrosBar
        onLimpiar={() => setProyecto("")}
        filtros={[
          {
            key: "proyecto",
            label: "Proyecto",
            value: proyecto,
            onChange: setProyecto,
            options: [
              { value: "", label: "Todos los proyectos" },
              ...MOCK_PROYECTOS.map((p) => ({ value: p, label: p })),
            ],
          },
        ]}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 22,
        }}
      >
        {[
          { label: "Personal", value: resumen.personal, sub: `${resumen.activos} activos` },
          { label: "Registros asistencia", value: resumen.asistencia, sub: "periodo mock" },
          { label: "Horas extra", value: `${resumen.horas} h`, sub: `${resumen.hePend} pend.` },
          { label: "Turnos", value: resumen.turnos, sub: "programados" },
          { label: "Presupuesto", value: formatoCOP(resumen.presupuesto), sub: "acumulado" },
          { label: "Avance promedio", value: `${resumen.avanceProm}%`, sub: "proyectos filtrados" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Mini gráfica de avance por proyecto */}
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Avance por proyecto</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {(proyecto ? resumen.det : MOCK_PROYECTOS_DET).map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 140, fontSize: 13, fontWeight: 600 }}>{p.nombre}</span>
            <div style={{ flex: 1, height: 12, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${p.avance}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #ea580c, #f59e0b)",
                  borderRadius: 999,
                }}
              />
            </div>
            <span style={{ width: 40, textAlign: "right", fontSize: 13, fontWeight: 700 }}>{p.avance}%</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Link to="/reportes/personal" className="dash-action-btn">Personal</Link>
        <Link to="/reportes/asistencia" className="dash-action-btn">Asistencia</Link>
        <Link to="/reportes/horas-extra" className="dash-action-btn">Horas extra</Link>
        <Link to="/reportes/turnos" className="dash-action-btn">Turnos</Link>
        <Link to="/reportes/proyectos" className="dash-action-btn">Proyectos</Link>
      </div>
      <style>{`
        .dash-action-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 14px; border-radius: 10px; background: #fff;
          border: 1px solid #e2e8f0; color: #0f172a; font-weight: 600;
          font-size: 13px; text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        .dash-action-btn:hover { background: #fff7ed; border-color: #f59e0b; }
      `}</style>
    </ReporteShell>
  );
}
