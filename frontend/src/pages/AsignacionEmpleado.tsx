import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { apiRequest } from "../services/apiClient";
import { listarAsignaciones } from "../services/asignacionesService";
import "../styles/AsignacionEmpleado.css";

const ROLES_PROYECTO = [
  "Supervisor de cuadrilla",
  "Oficial",
  "Ayudante",
  "Operario",
  "Auxiliar",
  "Maestro de obra",
];

export default function AsignacionEmpleado() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [empleadoId, setEmpleadoId] = useState("");
  const [proyectoId, setProyectoId] = useState("");
  const [rol, setRol] = useState("");
  const [cuadrilla, setCuadrilla] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [cuadrillasOpts, setCuadrillasOpts] = useState<string[]>(["General", "Cuadrilla A", "Cuadrilla B", "Cuadrilla C"]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [emps, proys, users, asigs] = await Promise.all([
          listarEmpleados({ estado: "ACTIVO" }),
          listarProyectos("ACTIVO"),
          listarUsuarios({ limit: 200 }),
          listarAsignaciones().catch(() => []),
        ]);
        if (!cancelled) {
          setEmpleados(Array.isArray(emps) ? emps : []);
          setProyectos(Array.isArray(proys) ? proys : []);
          const map: Record<number, UsuarioPublic> = {};
          for (const u of users) map[u.id_usuario] = u;
          setUsuariosMap(map);
          const setC = new Set<string>(["General", "Cuadrilla A", "Cuadrilla B", "Cuadrilla C"]);
          for (const a of asigs || []) {
            if (a.cuadrilla) setC.add(a.cuadrilla);
          }
          setCuadrillasOpts([...setC].sort());
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar empleados/proyectos"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const guardar = async () => {
    if (!empleadoId || !proyectoId || !rol || !fechaInicio) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      // Backend: POST /proyectos/{id_proyecto}/asignaciones (no existe POST /asignaciones)
      await apiRequest(`/proyectos/${Number(proyectoId)}/asignaciones`, {
        method: "POST",
        body: JSON.stringify({
          id_empleado: Number(empleadoId),
          rol_en_proyecto: rol,
          cuadrilla: cuadrilla.trim() || "General",
          fecha_asignacion: fechaInicio,
        }),
      });
      setOk("Asignación registrada correctamente.");
      setEmpleadoId("");
      setProyectoId("");
      setRol("");
      setCuadrilla("");
      setFechaInicio("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la asignación"
      );
    } finally {
      setSaving(false);
    }
  };

  const nombreEmpleado = (e: Empleado) => {
    const u = usuariosMap[e.id_usuario];
    if (u) return nombreUsuario(u);
    const n = (e as any).nombres || (e as any).nombre || "";
    const a = (e as any).apellidos || "";
    return `${n} ${a}`.trim() || `${e.cargo} · Doc. ${e.numero_documento}`;
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Proyectos", to: "/proyectos" }, { label: "Asignación" }]} />
          <section className="asignacion-card page-card">
            <div className="asignacion-header">
              <div className="asignacion-icono">
                <i className="bi bi-person-workspace"></i>
              </div>
              <div>
                <h1>ASIGNACIÓN DE EMPLEADO</h1>
                <p>
                  Asigna un empleado a un proyecto (datos desde API / base de
                  datos).
                </p>
              </div>
            </div>

            <hr />

            {loading && <p>Cargando catálogos...</p>}
            {error && (
              <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>
            )}
            {ok && (
              <div style={{ color: "#047857", marginBottom: 12 }}>{ok}</div>
            )}

            <div className="asignacion-grid">
              <label>
                Nombre del empleado *
                <div className="asignacion-field">
                  <i className="bi bi-person"></i>
                  <select
                    value={empleadoId}
                    onChange={(e) => setEmpleadoId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Seleccionar empleado</option>
                    {empleados.map((e) => (
                      <option key={e.id_empleado} value={e.id_empleado}>
                        {nombreEmpleado(e)} — {e.cargo}
                      </option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Proyecto *
                <div className="asignacion-field">
                  <i className="bi bi-folder"></i>
                  <select
                    value={proyectoId}
                    onChange={(e) => setProyectoId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Seleccionar proyecto</option>
                    {proyectos.map((p) => (
                      <option key={p.id_proyecto} value={p.id_proyecto}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Función en el proyecto *
                <div className="asignacion-field">
                  <i className="bi bi-briefcase"></i>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                  >
                    <option value="">Seleccionar función</option>
                    {ROLES_PROYECTO.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Cuadrilla
                <div className="asignacion-field">
                  <i className="bi bi-people"></i>
                  <select value={cuadrilla} onChange={(e) => setCuadrilla(e.target.value)}>
                    <option value="">Seleccionar cuadrilla</option>
                    {cuadrillasOpts.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>
                Fecha de asignación *
                <div className="asignacion-field">
                  <i className="bi bi-calendar"></i>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
              </label>
            </div>

            <div className="asignacion-info">
              <i className="bi bi-info-circle-fill"></i>
              <span>
                Los listados provienen de la API (empleados activos y proyectos
                activos). Solo se permiten valores del catálogo.
              </span>
            </div>

            <div className="asignacion-actions">
              <button
                className="asignacion-btn"
                onClick={guardar}
                disabled={saving || loading}
              >
                <i className="bi bi-floppy"></i>{" "}
                {saving ? "Guardando..." : "Guardar y asignar empleado"}
              </button>
            </div>
          </section>
    </AppShell>
  );
}
