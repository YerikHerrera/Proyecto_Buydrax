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
  type AsignacionOut,
} from "../services/asignacionesService";
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
    const ok = proyectosDisponibles.some((p) => String(p.id_proyecto) === String(proyectoId));
    if (!ok) setProyectoId("");
  }, [proyectoId, proyectosDisponibles]);

  const nombreProyecto = (id: number) =>
    proyectos.find((p) => p.id_proyecto === id)?.nombre || `Proyecto #${id}`;

  const activasDelEmpleado = useMemo(() => {
    if (!empleadoId) return [];
    return asignaciones.filter(
      (a) => String(a.id_empleado) === String(empleadoId) && a.activo !== false
    );
  }, [asignaciones, empleadoId]);

  const guardar = async () => {
    setErrorFecha("");
    if (!empleadoId || !proyectoId || !rol || !fechaInicio) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    const hoy = new Date().toISOString().slice(0, 10);
    if (fechaInicio > hoy) {
      setErrorFecha("La fecha de asignación no puede ser futura.");
      setError("Revisa la fecha de asignación.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      await apiRequest(`/proyectos/${Number(proyectoId)}/asignaciones`, {
        method: "POST",
        body: JSON.stringify({
          id_empleado: Number(empleadoId),
          rol_en_proyecto: rol,
          cuadrilla: cuadrilla.trim() || "General",
          fecha_asignacion: fechaInicio,
        }),
      });
      setOk("Asignación registrada. Puedes vincular el mismo empleado a otro proyecto.");
      setProyectoId("");
      setCuadrilla("");
      await cargarAsignaciones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
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
          Vincula personal a proyectos. Un empleado puede estar en varias obras; en{" "}
          <Link to="/asistencia/turno">Asignar turnos</Link> eliges el proyecto de cada día.
        </p>

        {empleadoFromUrl && (
          <p className="preselect-hint">Preseleccionado desde Asignar turno.</p>
        )}

        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}

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
                  <ul className="asig-list">
                    {activasDelEmpleado.map((a) => (
                      <li key={a.id_asignacion}>
                        <span>
                          <strong>{nombreProyecto(a.id_proyecto)}</strong>
                          <span style={{ color: "#64748b" }}>
                            {" "}
                            · {a.rol_en_proyecto} · {a.cuadrilla || "—"} · desde{" "}
                            {a.fecha_asignacion}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="agregar-btn-secundario"
                          style={{ padding: "6px 12px", fontSize: 12 }}
                          onClick={() => void retirar(a.id_asignacion)}
                        >
                          Retirar
                        </button>
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
