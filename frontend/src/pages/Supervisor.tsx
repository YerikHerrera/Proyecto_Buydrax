import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import FiltrosBar from "../components/reportes/FiltrosBar";
import { listarAsignaciones, type AsignacionOut } from "../services/asignacionesService";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import {
  listarProyectos,
  listarSupervisores,
  type Proyecto,
} from "../services/proyectosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { esSupervisor, leerSesion } from "../services/session";
import Pagination from "../components/ui/Pagination";
import { useClientPagination } from "../hooks/useClientPagination";

export default function Supervisor() {
  const sesion = leerSesion();
  const [supervisores, setSupervisores] = useState<
    {
      id_supervisor: number;
      id_usuario: number;
      numero_tarjeta_profesional: string;
      cuadrilla_asignada?: string | null;
    }[]
  >([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionOut[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtroProyecto, setFiltroProyecto] = useState("");
  const [filtroCuadrilla, setFiltroCuadrilla] = useState("");

  useEffect(() => {
    Promise.all([
      listarSupervisores().catch(() => []),
      listarProyectos().catch(() => []),
      listarAsignaciones().catch(() => []),
      listarEmpleados().catch(() => []),
      listarUsuarios({ limit: 200 }).catch(() => []),
    ])
      .then(([sups, proys, asigs, emps, users]) => {
        setSupervisores(Array.isArray(sups) ? sups : []);
        setProyectos(Array.isArray(proys) ? proys : []);
        setAsignaciones(Array.isArray(asigs) ? asigs : []);
        setEmpleados(Array.isArray(emps) ? emps : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users || []) map[u.id_usuario] = u;
        setUsuariosMap(map);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const proyectosMap = useMemo(() => {
    const m: Record<number, Proyecto> = {};
    proyectos.forEach((p) => (m[p.id_proyecto] = p));
    return m;
  }, [proyectos]);

  const empleadosMap = useMemo(() => {
    const m: Record<number, Empleado> = {};
    empleados.forEach((e) => (m[e.id_empleado] = e));
    return m;
  }, [empleados]);

  const cuadrillas = useMemo(() => {
    const set = new Set<string>();
    supervisores.forEach((s) => {
      if (s.cuadrilla_asignada) set.add(s.cuadrilla_asignada);
    });
    asignaciones.forEach((a) => {
      if (a.cuadrilla) set.add(a.cuadrilla);
    });
    return Array.from(set).sort();
  }, [supervisores, asignaciones]);

  // Supervisor logueado (por id_usuario de sesión)
  const miSupervisor = useMemo(() => {
    if (!sesion?.id) return null;
    return supervisores.find((s) => Number(s.id_usuario) === Number(sesion.id)) || null;
  }, [supervisores, sesion]);

  const misProyectos = useMemo(() => {
    if (!miSupervisor) return [];
    return proyectos.filter((p) => Number(p.id_supervisor) === miSupervisor.id_supervisor);
  }, [proyectos, miSupervisor]);

  const misAsignaciones = useMemo(() => {
    if (!miSupervisor) return [];
    const idsProy = new Set(misProyectos.map((p) => p.id_proyecto));
    return asignaciones.filter(
      (a) =>
        a.activo !== false &&
        (idsProy.has(a.id_proyecto) ||
          (miSupervisor.cuadrilla_asignada && a.cuadrilla === miSupervisor.cuadrilla_asignada))
    );
  }, [asignaciones, miSupervisor, misProyectos]);

  const supervisoresFiltrados = useMemo(() => {
    return supervisores.filter((s) => {
      if (filtroCuadrilla && (s.cuadrilla_asignada || "") !== filtroCuadrilla) return false;
      if (filtroProyecto) {
        const match = proyectos.some(
          (p) =>
            String(p.id_proyecto) === filtroProyecto &&
            Number(p.id_supervisor) === s.id_supervisor
        );
        if (proyectos.length > 0 && !match) return false;
      }
      return true;
    });
  }, [supervisores, filtroCuadrilla, filtroProyecto, proyectos]);

  const asignacionesFiltradas = useMemo(() => {
    return asignaciones.filter((a) => {
      if (a.activo === false) return false;
      if (filtroProyecto && String(a.id_proyecto) !== filtroProyecto) return false;
      if (filtroCuadrilla && (a.cuadrilla || "") !== filtroCuadrilla) return false;
      return true;
    });
  }, [asignaciones, filtroProyecto, filtroCuadrilla]);

  
  const pagSup = useClientPagination(supervisoresFiltrados, 8);
  const pagAsig = useClientPagination(asignacionesFiltradas, 8);

  const exportarExcel = (modo: "filtrado" | "todo") => {
    const rows = modo === "filtrado" ? asignacionesFiltradas : asignaciones.filter((a) => a.activo !== false);
    const header = ["Empleado", "Cargo", "Cuadrilla", "Proyecto", "Fecha_asignacion"];
    const lines = [header.join(",")];
    for (const a of rows) {
      const emp = empleadosMap[a.id_empleado];
      const nom = nombreEmp(a.id_empleado).replace(/,/g, " ");
      const cargo = (emp?.cargo || "").replace(/,/g, " ");
      const proy = (proyectosMap[a.id_proyecto]?.nombre || "").replace(/,/g, " ");
      lines.push([nom, cargo, a.cuadrilla || "", proy, a.fecha_asignacion || ""].join(","));
    }
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = modo === "filtrado" ? "personal_cuadrilla_filtrado.csv" : "personal_cuadrillas_todo.csv";
    el.click();
    URL.revokeObjectURL(url);
  };

  const nombreEmp = (id: number) => {
    const e = empleadosMap[id];
    if (e) {
      const u = usuariosMap[e.id_usuario];
      if (u) {
        const n = `${u.nombres || ""} ${u.apellidos || ""}`.trim();
        if (n) return n;
      }
      return `Empleado #${id}`;
    }
    return `#${id}`;
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Proyectos", to: "/proyectos" },
          { label: "Supervisores y cuadrillas" },
        ]}
      />

      {/* Bloque "Mi cuadrilla" si el usuario es supervisor */}
      {(esSupervisor() || miSupervisor) && (
        <div className="page-card" style={{ marginBottom: 16, borderLeft: "4px solid #f97316" }}>
          <h2 className="page-title" style={{ fontSize: 18 }}>
            Mi cuadrilla y proyectos
          </h2>
          {!miSupervisor ? (
            <p className="page-subtitle">
              Tu usuario no está registrado como supervisor en la tabla de supervisores.
              Pide a RRHH que te asocie una tarjeta profesional y cuadrilla.
            </p>
          ) : (
            <>
              <p className="page-subtitle" style={{ marginBottom: 12 }}>
                Cuadrilla asignada:{" "}
                <strong>{miSupervisor.cuadrilla_asignada || "Sin cuadrilla"}</strong>
                {" · "}
                Tarjeta: {miSupervisor.numero_tarjeta_profesional || "—"}
              </p>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                {misProyectos.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: 13 }}>No tienes proyectos a cargo.</p>
                ) : (
                  misProyectos.map((p) => (
                    <div
                      key={p.id_proyecto}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                      }}
                    >
                      <strong style={{ color: "#0f172a" }}>{p.nombre}</strong>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                        {p.ubicacion_calle} · {p.estado_proyecto}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <h3 style={{ marginTop: 16, fontSize: 14, color: "#334155" }}>
                Personal de mi cuadrilla / proyectos ({misAsignaciones.length})
              </h3>
              <div style={{ overflowX: "auto", marginTop: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                      <th style={{ padding: 8 }}>Empleado</th>
                      <th style={{ padding: 8 }}>Cuadrilla</th>
                      <th style={{ padding: 8 }}>Proyecto</th>
                      <th style={{ padding: 8 }}>Desde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misAsignaciones.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: 12, color: "#94a3b8" }}>
                          Sin empleados asignados aún. Usa Asignar empleado a obra.
                        </td>
                      </tr>
                    ) : (
                      misAsignaciones.map((a) => (
                        <tr key={a.id_asignacion} style={{ borderTop: "1px solid #e2e8f0" }}>
                          <td style={{ padding: 8 }}>{nombreEmp(a.id_empleado)}</td>
                          <td style={{ padding: 8 }}>{a.cuadrilla || "—"}</td>
                          <td style={{ padding: 8 }}>
                            {proyectosMap[a.id_proyecto]?.nombre || `#${a.id_proyecto}`}
                          </td>
                          <td style={{ padding: 8 }}>{a.fecha_asignacion}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <div className="page-card" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Mi cuadrilla, proyectos y personal</h1>
        <p className="page-subtitle">
          Vista de supervisores, proyectos a cargo y empleados por cuadrilla.
          Una misma cuadrilla puede estar en varios proyectos (distintos equipos de obra).
          Para <strong>asignar o destituir</strong> personal: usa{" "}
          <a href="/proyectos/asignacion">Asignar empleado a obra</a> → Retirar quita al
          empleado de esa cuadrilla/proyecto (no elimina la cuadrilla).
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {loading && <p style={{ color: "#64748b" }}>Cargando…</p>}

        <FiltrosBar
          onLimpiar={() => {
            setFiltroProyecto("");
            setFiltroCuadrilla("");
          }}
          filtros={[
            {
              key: "proyecto",
              label: "Proyecto",
              value: filtroProyecto,
              onChange: setFiltroProyecto,
              options: [
                { value: "", label: "Todos" },
                ...proyectos.map((p) => ({
                  value: String(p.id_proyecto),
                  label: p.nombre,
                })),
              ],
            },
            {
              key: "cuadrilla",
              label: "Cuadrilla",
              value: filtroCuadrilla,
              onChange: setFiltroCuadrilla,
              options: [
                { value: "", label: "Todas" },
                ...cuadrillas.map((c) => ({ value: c, label: c })),
              ],
            },
          ]}
        />

        <h3 style={{ fontSize: 14, margin: "12px 0 8px", color: "#334155" }}>Supervisores</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: 10 }}>ID</th>
                <th style={{ padding: 10 }}>Supervisor</th>
                <th style={{ padding: 10 }}>Tarjeta</th>
                <th style={{ padding: 10 }}>Cuadrilla</th>
                <th style={{ padding: 10 }}>Proyectos a cargo</th>
              </tr>
            </thead>
            <tbody>
              {pagSup.filas.map((s) => {
                const u = usuariosMap[s.id_usuario];
                const proys = proyectos.filter(
                  (p) => Number(p.id_supervisor) === s.id_supervisor
                );
                return (
                  <tr key={s.id_supervisor} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: 10 }}>{s.id_supervisor}</td>
                    <td style={{ padding: 10 }}>
                      {u ? nombreUsuario(u) : `Usuario #${s.id_usuario}`}
                    </td>
                    <td style={{ padding: 10 }}>{s.numero_tarjeta_profesional || "—"}</td>
                    <td style={{ padding: 10 }}>{s.cuadrilla_asignada || "—"}</td>
                    <td style={{ padding: 10 }}>
                      {proys.length
                        ? proys.map((p) => p.nombre).join(", ")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          pagina={pagSup.pagina}
          totalPaginas={pagSup.totalPaginas}
          total={pagSup.total}
          onAnterior={pagSup.onAnterior}
          onSiguiente={pagSup.onSiguiente}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", margin: "20px 0 8px", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 14, margin: 0, color: "#334155" }}>
            Empleados por cuadrilla / proyecto ({asignacionesFiltradas.length})
          </h3>
          <Link to="/reportes/exportar-personal" className="agregar-btn-secundario" style={{ padding: "8px 12px", fontSize: 13, textDecoration: "none" }}>
            Exportar / elegir campos →
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: 10 }}>Empleado</th>
                <th style={{ padding: 10 }}>Cargo</th>
                <th style={{ padding: 10 }}>Cuadrilla</th>
                <th style={{ padding: 10 }}>Proyecto</th>
                <th style={{ padding: 10 }}>Fecha asignación</th>
              </tr>
            </thead>
            <tbody>
              {asignacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: "#94a3b8" }}>
                    No hay asignaciones activas con estos filtros.
                  </td>
                </tr>
              ) : (
                pagAsig.filas.map((a) => {
                  const emp = empleadosMap[a.id_empleado];
                  return (
                    <tr key={a.id_asignacion} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: 10 }}>{nombreEmp(a.id_empleado)}</td>
                      <td style={{ padding: 10 }}>
                        <span className="cargo-pill">{emp?.cargo || "—"}</span>
                      </td>
                      <td style={{ padding: 10 }}>{a.cuadrilla || "—"}</td>
                      <td style={{ padding: 10 }}>
                        {proyectosMap[a.id_proyecto]?.nombre || `#${a.id_proyecto}`}
                      </td>
                      <td style={{ padding: 10 }}>{a.fecha_asignacion}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        <Pagination
          pagina={pagAsig.pagina}
          totalPaginas={pagAsig.totalPaginas}
          total={pagAsig.total}
          onAnterior={pagAsig.onAnterior}
          onSiguiente={pagAsig.onSiguiente}
        />

        </div>
      </div>
    </AppShell>
  );
}
