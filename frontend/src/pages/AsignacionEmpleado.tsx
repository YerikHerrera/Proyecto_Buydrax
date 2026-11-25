import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import AsignacionEmpleadoForm from "../components/operaciones/AsignacionEmpleadoForm";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { listarUsuarios, type UsuarioPublic } from "../services/usuariosService";
import {
  listarAsignaciones,
  retirarAsignacion,
  cambiarCuadrillaAsignacion,
  type AsignacionOut,
} from "../services/asignacionesService";
import { listarVinculos } from "../services/cuadrillasService";
import { apiRequest } from "../services/apiClient";
import "../styles/AsignacionEmpleado.css";

export default function AsignacionEmpleado() {
  const [searchParams] = useSearchParams();
  const empleadoFromUrl = searchParams.get("empleado") || "";

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionOut[]>([]);
  const [empleadoId, setEmpleadoId] = useState(empleadoFromUrl);
  const [proyectoId, setProyectoId] = useState("");
  const [rol, setRol] = useState("");
  const [cuadrilla, setCuadrilla] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [confirmarGuardado, setConfirmarGuardado] = useState(false);
  const [cambiarId, setCambiarId] = useState<number | null>(null);
  const [nuevaCuadrilla, setNuevaCuadrilla] = useState("");
  const [cuadrillasOpts, setCuadrillasOpts] = useState<string[]>([
    "General",
    "Cuadrilla A",
    "Cuadrilla B",
    "Cuadrilla C",
  ]);

  const cargarAsignaciones = async () => {
    try {
      const asigs = await listarAsignaciones();
      setAsignaciones(Array.isArray(asigs) ? asigs : []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [emps, proys, users, asigs] = await Promise.all([
          listarEmpleados({ estado: "ACTIVO" }),
          listarProyectos(),
          listarUsuarios({ limit: 200 }).catch(() => [] as UsuarioPublic[]),
          listarAsignaciones().catch(() => [] as AsignacionOut[]),
        ]);
        if (cancelled) return;
        setEmpleados(Array.isArray(emps) ? emps : []);
        setProyectos(Array.isArray(proys) ? proys : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users || []) map[u.id_usuario] = u;
        setUsuariosMap(map);
        setAsignaciones(Array.isArray(asigs) ? asigs : []);
        const setC = new Set<string>(["General", "Cuadrilla A", "Cuadrilla B", "Cuadrilla C"]);
        for (const a of asigs || []) {
          if (a.cuadrilla) setC.add(a.cuadrilla);
        }
        setCuadrillasOpts([...setC].sort());
        if (empleadoFromUrl) setEmpleadoId(empleadoFromUrl);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar datos");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [empleadoFromUrl]);

  useEffect(() => {
    setConfirmarGuardado(false);
  }, [empleadoId, proyectoId, rol, cuadrilla, fechaInicio]);

  const proyectosDisponibles = useMemo(() => {
    if (!empleadoId) return proyectos;
    const ya = new Set(
      asignaciones
        .filter((a) => a.activo !== false && String(a.id_empleado) === String(empleadoId))
        .map((a) => Number(a.id_proyecto))
    );
    return proyectos.filter((p) => !ya.has(Number(p.id_proyecto)));
  }, [proyectos, asignaciones, empleadoId]);

  useEffect(() => {
    if (!proyectoId) return;
    const disponible = proyectosDisponibles.some((p) => String(p.id_proyecto) === String(proyectoId));
    if (!disponible) setProyectoId("");
  }, [proyectoId, proyectosDisponibles]);

  const nombreProyecto = (id: number) =>
    proyectos.find((p) => p.id_proyecto === id)?.nombre || `Proyecto #${id}`;

  const nombreEmpleadoSeleccionado = useMemo(() => {
    if (!empleadoId) return "";
    const emp = empleados.find((e) => String(e.id_empleado) === String(empleadoId));
    if (!emp) return `Empleado #${empleadoId}`;

    const usr = emp.id_usuario ? usuariosMap[emp.id_usuario] : undefined;
    const empRecord = emp as unknown as Record<string, unknown>;
    const usrRecord = usr as unknown as Record<string, unknown> | undefined;

    const nombreDesdeUsuario = [usr?.nombres, usr?.apellidos].filter(Boolean).join(" ").trim();
    const nombreFallback =
      nombreDesdeUsuario ||
      String(usrRecord?.nombre_completo ?? "") ||
      String(usrRecord?.nombre ?? "") ||
      String(empRecord?.nombre ?? "") ||
      `Empleado #${emp.id_empleado}`;

    return emp.cargo ? `${nombreFallback} (${emp.cargo})` : nombreFallback;
  }, [empleadoId, empleados, usuariosMap]);

  const activasDelEmpleado = useMemo(() => {
    if (!empleadoId) return [];
    return asignaciones.filter(
      (a) => String(a.id_empleado) === String(empleadoId) && a.activo !== false
    );
  }, [asignaciones, empleadoId]);

  const ejecutarGuardado = async () => {
    const cuadrillaFinal = cuadrilla.trim() || "General";
    const nombreProy = nombreProyecto(Number(proyectoId));

    try {
      setSaving(true);
      setError("");
      setOk("");
      setConfirmarGuardado(false);
      await apiRequest(`/proyectos/${Number(proyectoId)}/asignaciones`, {
        method: "POST",
        body: JSON.stringify({
          id_empleado: Number(empleadoId),
          rol_en_proyecto: rol,
          cuadrilla: cuadrillaFinal,
          fecha_asignacion: fechaInicio,
        }),
      });
      setOk(
        `Asignación registrada: ${nombreEmpleadoSeleccionado} quedó vinculado a "${nombreProy}" como ${rol} en ${cuadrillaFinal} desde ${fechaInicio}.`
      );
      setProyectoId("");
      setCuadrilla("");
      await cargarAsignaciones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const guardar = async () => {
    setErrorFecha("");
    setError("");
    setOk("");

    if (!empleadoId || !proyectoId || !rol || !fechaInicio) {
      setConfirmarGuardado(false);
      setError("Completa todos los campos obligatorios antes de asignar.");
      return;
    }

    const hoy = new Date().toISOString().slice(0, 10);
    if (fechaInicio > hoy) {
      setConfirmarGuardado(false);
      setErrorFecha("La fecha de asignación no puede ser futura.");
      setError("Revisa la fecha de asignación.");
      return;
    }

    if (!confirmarGuardado) {
      setConfirmarGuardado(true);
      return;
    }

    await ejecutarGuardado();
  };

  const retirar = async (id: number) => {
    try {
      await retirarAsignacion(id);
      setOk("Asignación retirada.");
      await cargarAsignaciones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo retirar");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!proyectoId) return;
      try {
        const vins = await listarVinculos({ id_proyecto: Number(proyectoId), solo_activos: true });
        if (cancelled) return;
        const names = vins.map((v) => v.nombre_cuadrilla).filter(Boolean) as string[];
        if (names.length) {
          setCuadrillasOpts([...new Set(names)].sort());
          setCuadrilla((prev) => (names.includes(prev) ? prev : names[0]));
        }
      } catch {
        /* keep previous opts */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [proyectoId]);

  const onCambiarCuadrilla = async (idAsig: number) => {
    if (!nuevaCuadrilla.trim()) {
      setError("Elige la nueva cuadrilla");
      return;
    }
    setError("");
    setOk("");
    try {
      await cambiarCuadrillaAsignacion(idAsig, { cuadrilla: nuevaCuadrilla.trim() });
      setOk("Cuadrilla actualizada (mismo proyecto).");
      setCambiarId(null);
      setNuevaCuadrilla("");
      await cargarAsignaciones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la cuadrilla");
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Proyectos", to: "/proyectos" },
          { label: "Asignación de empleado" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Asignación de empleado</h1>
        <p className="page-subtitle">
          Vincula personal a proyectos. Las cuadrillas del proyecto se gestionan en{" "}
          <Link to="/proyectos/cuadrillas">Gestión de cuadrillas</Link>. Un empleado puede estar en varias obras; en{" "}
          <Link to="/asistencia/turno">Asignar turnos</Link> eliges el proyecto de cada día.
        </p>

        {empleadoFromUrl && (
          <p className="preselect-hint">Preseleccionado desde Asignar turno.</p>
        )}

        {error && <p style={{ color: "#b00020", fontWeight: 500 }}>{error}</p>}
        {ok && (
          <div
            role="status"
            style={{
              background: "#ecfdf5",
              border: "1px solid #6ee7b7",
              color: "#065f46",
              padding: "10px 14px",
              borderRadius: 10,
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {ok}
          </div>
        )}

        {confirmarGuardado && (
          <div
            role="alert"
            style={{
              background: "#fffbeb",
              border: "1px solid #f59e0b",
              color: "#92400e",
              padding: "12px 14px",
              borderRadius: 10,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              Advertencia: confirma los datos de asignación
            </div>
            <div style={{ lineHeight: 1.45 }}>
              Vas a asignar a <strong>{nombreEmpleadoSeleccionado}</strong> al proyecto{" "}
              <strong>{nombreProyecto(Number(proyectoId))}</strong> con rol <strong>{rol}</strong>, en{" "}
              <strong>{cuadrilla.trim() || "General"}</strong> a partir del <strong>{fechaInicio}</strong>.
              {activasDelEmpleado.length > 0 && (
                <span>
                  {" "}
                  Este empleado ya cuenta con {activasDelEmpleado.length} asignación(es) activa(s).
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={saving}
                onClick={() => void ejecutarGuardado()}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#d97706",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {saving ? "Guardando..." : "Confirmar y guardar"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setConfirmarGuardado(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #d6d3d1",
                  background: "#fff",
                  color: "#44403c",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Revisar campos
              </button>
            </div>
          </div>
        )}

        <AsignacionEmpleadoForm
          empleados={empleados}
          proyectos={proyectosDisponibles}
          usuariosMap={usuariosMap}
          empleadoId={empleadoId}
          setEmpleadoId={setEmpleadoId}
          proyectoId={proyectoId}
          setProyectoId={setProyectoId}
          rol={rol}
          setRol={setRol}
          cuadrilla={cuadrilla}
          setCuadrilla={setCuadrilla}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          cuadrillasOpts={cuadrillasOpts}
          loading={loading}
          saving={saving}
          onGuardar={guardar}
          errorFecha={errorFecha}
          afterEmpleado={
            empleadoId ? (
              <div className="activas-block">
                <h3 className="activas-title">Asignaciones activas</h3>
                {activasDelEmpleado.length === 0 ? (
                  <p className="activas-empty">Aún sin proyectos. Completa el formulario.</p>
                ) : (
                  <ul className="asig-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                    {activasDelEmpleado.map((a) => (
                      <li
                        key={a.id_asignacion}
                        style={{
                          border: "1px solid #e7e5e4",
                          borderRadius: 10,
                          padding: "10px 12px",
                          background: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          alignItems: "stretch",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: "#1c1917", lineHeight: 1.3, fontSize: 14 }}>
                            {nombreProyecto(a.id_proyecto)}
                          </div>
                          <div style={{ fontSize: 12, color: "#78716c", marginTop: 2 }}>
                            {a.rol_en_proyecto}
                            {" · "}
                            <span style={{ color: "#9a3412", fontWeight: 600 }}>{a.cuadrilla || "Sin cuadrilla"}</span>
                            {" · desde "}
                            {a.fecha_asignacion}
                          </div>
                        </div>

                        {cambiarId !== a.id_asignacion ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => {
                                setCambiarId(a.id_asignacion);
                                setNuevaCuadrilla(a.cuadrilla || "");
                              }}
                              style={{
                                padding: "6px 10px",
                                fontSize: 12,
                                borderRadius: 8,
                                border: "1px solid #c4b5fd",
                                background: "#f5f3ff",
                                color: "#5b21b6",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Cambiar cuadrilla
                            </button>
                            <button
                              type="button"
                              onClick={() => void retirar(a.id_asignacion)}
                              style={{
                                padding: "6px 10px",
                                fontSize: 12,
                                borderRadius: 8,
                                border: "1px solid #fecdd3",
                                background: "#fff1f2",
                                color: "#9f1239",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Retirar del proyecto
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                              alignItems: "center",
                              padding: 8,
                              background: "#fff7ed",
                              borderRadius: 8,
                              border: "1px solid #fed7aa",
                            }}
                          >
                            <label style={{ fontSize: 12, color: "#9a3412", fontWeight: 600, width: "100%" }}>
                              Nueva cuadrilla
                            </label>
                            <select
                              value={nuevaCuadrilla}
                              onChange={(e) => setNuevaCuadrilla(e.target.value)}
                              style={{
                                flex: "1 1 160px",
                                minWidth: 140,
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid #d6d3d1",
                                fontSize: 14,
                              }}
                            >
                              <option value="">Seleccionar…</option>
                              {cuadrillasOpts.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => void onCambiarCuadrilla(a.id_asignacion)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                background: "#ea580c",
                                color: "#fff",
                                border: "none",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: 13,
                              }}
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setCambiarId(null)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                border: "1px solid #d6d3d1",
                                background: "#fff",
                                color: "#44403c",
                                cursor: "pointer",
                                fontSize: 13,
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null
          }
        />
      </div>
    </AppShell>
  );
}