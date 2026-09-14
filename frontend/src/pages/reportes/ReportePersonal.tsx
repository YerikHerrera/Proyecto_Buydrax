import { useMemo, useState } from "react";
import FiltrosBar from "../../components/reportes/FiltrosBar";
import ReporteShell from "../../components/reportes/ReporteShell";
import {
  MOCK_PERSONAL,
  MOCK_PROYECTOS,
  badgeEstado,
} from "../../data/mockReportes";

export default function ReportePersonal() {
  const [proyecto, setProyecto] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("");
  const [q, setQ] = useState("");

  const cargos = useMemo(
    () => Array.from(new Set(MOCK_PERSONAL.map((r) => r.cargo))).sort(),
    []
  );

  const filas = useMemo(() => {
    return MOCK_PERSONAL.filter((r) => {
      if (proyecto && r.proyecto !== proyecto) return false;
      if (cargo && r.cargo !== cargo) return false;
      if (estado && r.estado !== estado) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !r.nombre.toLowerCase().includes(s) &&
          !r.documento.includes(s) &&
          !r.cargo.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [proyecto, cargo, estado, q]);

  return (
    <ReporteShell
      titulo="Personal activo"
      subtitulo="Reporte general por proyecto, nombre, cargo y estado (datos de vista previa)."
      crumbs={[
        { label: "Inicio", to: "/dashboard" },
        { label: "Reportes", to: "/reportes" },
        { label: "Personal activo" },
      ]}
      accionHref="/empleados"
      accionLabel="Ir a lista de empleados"
    >
      <FiltrosBar
        busqueda={q}
        onBusqueda={setQ}
        placeholderBusqueda="Nombre o documento…"
        onLimpiar={() => {
          setProyecto("");
          setCargo("");
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
            key: "cargo",
            label: "Cargo",
            value: cargo,
            onChange: setCargo,
            options: [
              { value: "", label: "Todos" },
              ...cargos.map((c) => ({ value: c, label: c })),
            ],
          },
          {
            key: "estado",
            label: "Estado",
            value: estado,
            onChange: setEstado,
            options: [
              { value: "", label: "Todos" },
              { value: "Activo", label: "Activo" },
              { value: "Inactivo", label: "Inactivo" },
              { value: "Vacaciones", label: "Vacaciones" },
            ],
          },
        ]}
      />

      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#fff7ed", textAlign: "left" }}>
              {["Proyecto", "Nombre", "Documento", "Cargo", "Supervisor", "Estado"].map((h) => (
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
                  No se encontraron empleados con los criterios seleccionados.
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
                    <td style={{ padding: "12px 14px" }}>{r.documento}</td>
                    <td style={{ padding: "12px 14px" }}>{r.cargo}</td>
                    <td style={{ padding: "12px 14px" }}>{r.supervisor}</td>
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
      <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
        Vista previa con datos mock. Los endpoints se conectarán después.
      </p>
    </ReporteShell>
  );
}
