import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import TurnoForm from "../components/operaciones/TurnoForm";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, type UsuarioPublic } from "../services/usuariosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { listarAsignaciones, type AsignacionOut } from "../services/asignacionesService";
import { apiRequest } from "../services/apiClient";
import "../styles/Turnos.css";

/** Proyecto mínimo para el select aunque no venga en el listado (ej. no ACTIVO). */
function stubProyecto(id: number): Proyecto {
  return {
    id_proyecto: id,
    id_supervisor: 0,
    nombre: `Proyecto #${id}`,
    ubicacion_calle: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado_proyecto: "DESCONOCIDO",
  };
}

export default function Turnos() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionOut[]>([]);
  const [empleadoId, setEmpleadoId] = useState("");
  const [proyectoId, setProyectoId] = useState("");
  const [tipoTurno, setTipoTurno] = useState("Diurno");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("07:00");
  const [horaFin, setHoraFin] = useState("17:00");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reloadAsignaciones = useCallback(() => {
    return listarAsignaciones()
      .then((a) => setAsignaciones(Array.isArray(a) ? a : []))
      .catch(() => {});
  }, []);

  const reloadProyectos = useCallback(() => {
    // Sin filtro de estado: hace falta el nombre aunque el proyecto no esté ACTIVO
    return listarProyectos()
      .then((p) => setProyectos(Array.isArray(p) ? p : []))
      .catch(() => {});
  }, []);

  const cargarTodo = useCallback(async () => {
    try {
      setLoading(true);
      const [e, p, users, asigs] = await Promise.all([
        listarEmpleados({ estado: "ACTIVO" }),
        listarProyectos().catch(() => [] as Proyecto[]),
        listarUsuarios({ limit: 200 }).catch(() => [] as UsuarioPublic[]),
        listarAsignaciones().catch(() => [] as AsignacionOut[]),
      ]);
      setEmpleados(Array.isArray(e) ? e : []);
      setProyectos(Array.isArray(p) ? p : []);
      const map: Record<number, UsuarioPublic> = {};
      for (const u of users || []) map[u.id_usuario] = u;
      setUsuariosMap(map);
      setAsignaciones(Array.isArray(asigs) ? asigs : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarTodo();
  }, [cargarTodo]);

  // Al volver a la pestaña / ventana: refrescar asignaciones y proyectos
  useEffect(() => {
    const onFocus = () => {
      void reloadAsignaciones();
      void reloadProyectos();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onFocus();
    });
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [reloadAsignaciones, reloadProyectos]);

  // Al cambiar de empleado: refrescar asignaciones por si se acabó de asignar
  useEffect(() => {
    if (empleadoId) void reloadAsignaciones();
  }, [empleadoId, reloadAsignaciones]);

  const activas = useMemo(
    () => asignaciones.filter((a) => a.activo !== false),
    [asignaciones]
  );

  const proyectosDelEmpleado = useMemo(() => {
    if (!empleadoId) return [];
    const ids = [
      ...new Set(
        activas
          .filter((a) => String(a.id_empleado) === String(empleadoId))
          .map((a) => a.id_proyecto)
      ),
    ];
    const byId = new Map(proyectos.map((p) => [p.id_proyecto, p]));
    // Incluir TODOS los id de asignación activa, aunque el proyecto no esté en el listado
    return ids.map((id) => byId.get(id) || stubProyecto(id));
  }, [empleadoId, proyectos, activas]);

  const sinAsignacion =
    Boolean(empleadoId) && !loading && proyectosDelEmpleado.length === 0;

  useEffect(() => {
    if (
      proyectoId &&
      empleadoId &&
      !proyectosDelEmpleado.some((p) => String(p.id_proyecto) === String(proyectoId))
    ) {
      setProyectoId("");
    }
  }, [empleadoId, proyectoId, proyectosDelEmpleado]);

  useEffect(() => {
    if (empleadoId && proyectosDelEmpleado.length === 1) {
      setProyectoId(String(proyectosDelEmpleado[0].id_proyecto));
    }
  }, [empleadoId, proyectosDelEmpleado]);

  const guardar = async () => {
    if (!empleadoId || !proyectoId || !fecha) {
      setError("Completa empleado, proyecto y fecha.");
      return;
    }
    if (sinAsignacion) {
      setError("El empleado no tiene asignación activa. Asígnalo a un proyecto primero.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      await apiRequest("/turnos", {
        method: "POST",
        body: JSON.stringify({
          id_empleado: Number(empleadoId),
          id_proyecto: Number(proyectoId),
          tipo_turno: tipoTurno,
          hora_inicio: horaInicio.length === 5 ? `${horaInicio}:00` : horaInicio,
          hora_fin: horaFin.length === 5 ? `${horaFin}:00` : horaFin,
          fecha,
        }),
      });
      setOk("Turno asignado correctamente.");
      void reloadAsignaciones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Asistencia", to: "/asistencia" }, { label: "Turnos" }]} />
      <div className="page-card">
        <h1 className="page-title">Asignar turno</h1>
        <p className="page-subtitle">
          El proyecto se elige según las asignaciones activas del empleado. Puedes tener varias
          (ej. lun–mié en una obra y jue–sáb en otra). Se validan cruces de horario el mismo día.
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        {sinAsignacion && (
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 12,
              fontSize: 13.5,
              color: "#9a3412",
            }}
          >
            Este empleado no tiene proyecto asignado.{" "}
            <Link
              to={`/proyectos/asignacion?empleado=${empleadoId}`}
              style={{ fontWeight: 700, color: "#c2410c" }}
            >
              Ir a asignarlo →
            </Link>
          </div>
        )}
        {empleadoId && !sinAsignacion && (
          <p className="field-hint" style={{ marginBottom: 8 }}>
            {proyectosDelEmpleado.length} proyecto(s) activo(s) para este empleado.
          </p>
        )}
        <TurnoForm
          empleados={empleados}
          proyectos={proyectosDelEmpleado}
          usuariosMap={usuariosMap}
          empleadoId={empleadoId}
          setEmpleadoId={setEmpleadoId}
          proyectoId={proyectoId}
          setProyectoId={setProyectoId}
          tipoTurno={tipoTurno}
          setTipoTurno={setTipoTurno}
          fecha={fecha}
          setFecha={setFecha}
          horaInicio={horaInicio}
          setHoraInicio={setHoraInicio}
          horaFin={horaFin}
          setHoraFin={setHoraFin}
          loading={loading}
          saving={saving}
          onGuardar={guardar}
          sinAsignacion={sinAsignacion}
        />
      </div>
    </AppShell>
  );
}
