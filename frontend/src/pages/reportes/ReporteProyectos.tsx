import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  MOCK_PROYECTOS_DET,
  badgeEstado,
  formatoCOP,
} from "../../data/mockReportes";

function BarraAvance({ pct }: { pct: number }) {
  const color = pct >= 90 ? "#16a34a" : pct >= 50 ? "#f59e0b" : "#ea580c";
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 4 }}>
        <span>Avance</span>
        <strong style={{ color }}>{pct}%</strong>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

export default function ReporteProyectos() {
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");

  const filas = useMemo(() => {
    return MOCK_PROYECTOS_DET.filter((r) => {
      if (estado && r.estado !== estado) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !r.nombre.toLowerCase().includes(s) &&
          !r.supervisor.toLowerCase().includes(s) &&
          !r.ubicacion.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [estado, q]);

  return (
    <ReporteShell
      titulo="Reporte general de proyectos"
      subtitulo="Nombre, empleados, supervisor, presupuesto, fechas y % de finalización."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Proyectos", to: "/proyectos" },
        { label: "Reporte" },
      ]}
      accionHref="/proyectos"
      accionLabel="Crear / listar proyectos"
    >
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Proyecto, supervisor o ubicación…"
        onLimpiar={() => {
          setEstado("");
          setQ("");
        }}
        filtros={[
          {
            key: "estado",
            label: "Estado",
            value: estado,
            onChange: setEstado,
            options: [
              { value: "", label: "Todos" },
              { value: "En curso", label: "En curso" },
              { value: "Finalizado", label: "Finalizado" },
              { value: "Suspendido", label: "Suspendido" },
            ],
          },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 20 }}>
        {filas.map((p) => {
          const b = badgeEstado(p.estado);
          return (
            <div
              key={p.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 16,
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(15,23,42,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{p.nombre}</h3>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: b.bg, color: b.color }}>
                  {p.estado}
                </span>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b" }}>
                <i className="bi bi-geo-alt" /> {p.ubicacion}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: 13 }}>
                <strong>Supervisor:</strong> {p.supervisor}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: 13 }}>
                <strong>Empleados:</strong> {p.empleados}
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 13 }}>
                <strong>Presupuesto:</strong> {formatoCOP(p.presupuesto)}
              </p>
              <BarraAvance pct={p.avance} />
              <p style={{ margin: "10px 0 0", fontSize: 11, color: "#94a3b8" }}>
                {p.fechaInicio} → {p.fechaFin}
              </p>
            </div>
          );
        })}
      </div>

      {filas.length === 0 && (
        <p style={{ textAlign: "center", color: "#64748b", padding: 24 }}>No hay proyectos con esos filtros.</p>
      )}

      <p style={{ fontSize: 13 }}>
        <Link to="/proyectos/supervisor" style={{ color: "#ea580c", fontWeight: 600 }}>
          Ver supervisores y cuadrillas →
        </Link>
      </p>
    </ReporteShell>
  );
}
