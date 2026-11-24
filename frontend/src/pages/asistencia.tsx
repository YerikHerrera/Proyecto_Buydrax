import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import AsistenciaForm from "../components/operaciones/AsistenciaForm";
import { listarAsignaciones, type AsignacionOut } from "../services/asignacionesService";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { listarUsuarios, type UsuarioPublic } from "../services/usuariosService";
import { apiRequest } from "../services/apiClient";
import "../styles/asistencia.css";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function ahoraHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function Asistencia() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionOut[]>([]);
  const [empleadoId, setEmpleadoId] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [horaEntrada, setHoraEntrada] = useState(ahoraHHMM());
  const [horaSalida, setHoraSalida] = useState("");
  const [estado, setEstado] = useState("PRESENTE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    Promise.all([
      listarEmpleados({ estado: "ACTIVO" }),
      listarUsuarios({ limit: 200 }),
      listarProyectos().catch(() => [] as Proyecto[]),
      listarAsignaciones().catch(() => [] as AsignacionOut[]),
    ])
      .then(([d, users, proys, asigs]) => {
        setEmpleados(Array.isArray(d) ? d : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users || []) map[u.id_usuario] = u;
        setUsuariosMap(map);
        setProyectos(Array.isArray(proys) ? proys : []);
        setAsignaciones(Array.isArray(asigs) ? asigs : []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const proyectosMap = useMemo(() => {
    const m: Record<number, Proyecto> = {};
    proyectos.forEach((p) => (m[p.id_proyecto] = p));
    return m;
  }, [proyectos]);

  /** Valida que la fecha esté dentro del rango de al menos un proyecto activo del empleado. */
  const validarFechaEnProyectos = (idEmp: string, fechaStr: string): string | null => {
    const activas = asignaciones.filter(
      (a) => a.activo !== false && String(a.id_empleado) === String(idEmp)
    );
    if (activas.length === 0) {
      // Sin obra asignada: se permite (personal de oficina / RRHH)
      return null;
    }
    const okEnAlguno = activas.some((a) => {
      const p = proyectosMap[a.id_proyecto];
      if (!p) return false;
      const ini = String(p.fecha_inicio || "").slice(0, 10);
      const fin = String(p.fecha_fin || "").slice(0, 10);
      if (ini && fechaStr < ini) return false;
      if (fin && fechaStr > fin) return false;
      return true;
    });
    if (!okEnAlguno) {
      const rangos = activas
        .map((a) => {
          const p = proyectosMap[a.id_proyecto];
          if (!p) return null;
          return `${p.nombre}: ${String(p.fecha_inicio).slice(0, 10)} → ${String(p.fecha_fin).slice(0, 10)}`;
        })
        .filter(Boolean)
        .join("; ");
      return (
        "No se puede registrar asistencia fuera de las fechas del proyecto. " +
        (rangos ? `Rangos: ${rangos}` : "Revisa inicio/fin de la obra.")
      );
    }
    return null;
  };

  const guardar = async () => {
    if (!empleadoId) {
      setError("Selecciona un empleado.");
      return;
    }
    const hoy = hoyISO();
    const esExcusa = estado === "EXCUSA";
    const esInasistencia = estado === "INASISTENCIA";
    const sinHoras = esExcusa || esInasistencia;

    if (!fecha) {
      setError("La fecha es obligatoria.");
      return;
    }
    if (fecha > hoy) {
      setError("No se permiten fechas futuras.");
      return;
    }
    if (!esExcusa && fecha !== hoy) {
      setError("Solo con Excusa se puede usar una fecha distinta de hoy.");
      return;
    }
    if (!sinHoras && !horaEntrada) {
      setError("Falta la hora de entrada.");
      return;
    }
    if (horaSalida && horaEntrada && horaSalida < horaEntrada) {
      setError("La hora de salida no puede ser anterior a la de entrada.");
      return;
    }

    const errProy = validarFechaEnProyectos(empleadoId, fecha);
    if (errProy) {
      setError(errProy);
      return;
    }

    const estadoApi = esExcusa ? "INASISTENCIA" : estado;
    const entrada = sinHoras ? "00:00:00" : horaEntrada.length === 5 ? `${horaEntrada}:00` : horaEntrada;
    const salida = sinHoras
      ? null
      : horaSalida
        ? horaSalida.length === 5
          ? `${horaSalida}:00`
          : horaSalida
        : null;
    const observacion = esExcusa ? "EXCUSA" : esInasistencia ? "INASISTENCIA" : null;

    try {
      setSaving(true);
      setError("");
      setOk("");
      await apiRequest(`/empleados/${empleadoId}/asistencias`, {
        method: "POST",
        body: JSON.stringify({
          fecha,
          hora_entrada: entrada,
          hora_salida: salida,
          estado_asistencia: estadoApi,
          observacion,
        }),
      });
      setOk(
        esExcusa
          ? "Excusa registrada (sin horas de jornada)."
          : esInasistencia
            ? "Inasistencia registrada (día no trabajado)."
            : "Asistencia registrada."
      );
      if (estado === "PRESENTE" || estado === "RETARDO") {
        setHoraEntrada(ahoraHHMM());
        setHoraSalida("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Asistencia", to: "/asistencia" }, { label: "Registrar" }]} />
      <div className="page-card">
        <h1 className="page-title">Registrar asistencia</h1>
        <p className="page-subtitle">
          Presente/Retardo: hora = ahora. No se registra fuera de las fechas de inicio/fin del
          proyecto al que esté asignado el empleado.
        </p>
        {loading && <p style={{ marginTop: 12 }}>Cargando empleados…</p>}
        {ok && <p style={{ color: "#047857", marginTop: 12 }}>{ok}</p>}
        <AsistenciaForm
          errorMsg={error}
          empleados={empleados}
          usuariosMap={usuariosMap}
          empleadoId={empleadoId}
          setEmpleadoId={setEmpleadoId}
          fecha={fecha}
          setFecha={setFecha}
          horaEntrada={horaEntrada}
          setHoraEntrada={setHoraEntrada}
          horaSalida={horaSalida}
          setHoraSalida={setHoraSalida}
          estado={estado}
          setEstado={setEstado}
          loading={loading}
          saving={saving}
          onGuardar={guardar}
        />
      </div>
    </AppShell>
  );
}
