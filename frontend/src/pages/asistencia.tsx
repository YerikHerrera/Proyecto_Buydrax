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
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";

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
  const [idProyecto, setIdProyecto] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [horaEntrada, setHoraEntrada] = useState(ahoraHHMM());
  const [horaSalida, setHoraSalida] = useState("");
  const [estado, setEstado] = useState("AUTO");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [, setOk] = useState("");
  const [archivoExcusa, setArchivoExcusa] = useState<File | null>(null);
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);

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

  const estadoCalculado = useMemo(() => {
    if (estado === "INASISTENCIA" || estado === "EXCUSA") return estado;
    const he = horaEntrada.length >= 5 ? horaEntrada.slice(0, 5) : horaEntrada;
    const [hh, mm] = (he || "08:00").split(":").map(Number);
    const mins = (hh || 0) * 60 + (mm || 0);
    const limite = 8 * 60; // 08:00 default UI; backend usa turno si existe
    return mins > limite ? "RETARDO" : "PRESENTE";
  }, [estado, horaEntrada]);

  const guardar = async () => {
    if (!empleadoId) {
      showToast("Selecciona un empleado.", "error"); setError("Selecciona un empleado.");
      return;
    }
    const hoy = hoyISO();
    const esExcusa = estado === "EXCUSA";
    const esInasistencia = estado === "INASISTENCIA";
    const sinHoras = esExcusa || esInasistencia;

    if (!fecha) {
      showToast("La fecha es obligatoria.", "error"); setError("La fecha es obligatoria.");
      return;
    }
    if (fecha > hoy) {
      showToast("No se permiten fechas futuras.", "error"); setError("No se permiten fechas futuras.");
      return;
    }
    if (!esExcusa && fecha !== hoy) {
      showToast("Solo con Excusa se puede usar una fecha distinta de hoy.", "error"); setError("Solo con Excusa se puede usar una fecha distinta de hoy.");
      return;
    }
    if (!sinHoras && !horaEntrada) {
      showToast("Falta la hora de entrada.", "error"); setError("Falta la hora de entrada.");
      return;
    }
    if (horaSalida && horaEntrada && horaSalida < horaEntrada) {
      showToast("La hora de salida no puede ser anterior a la de entrada.", "error"); setError("La hora de salida no puede ser anterior a la de entrada.");
      return;
    }

    const errProy = validarFechaEnProyectos(empleadoId, fecha);
    if (errProy) {
      showToast(errProy); setError(errProy);
      return;
    }
    if (!idProyecto) {
      showToast("Selecciona el proyecto correspondiente del empleado.", "error"); setError("Selecciona el proyecto correspondiente del empleado.");
      return;
    }

    const estadoApi = esExcusa ? "INASISTENCIA" : estado === "AUTO" ? "AUTO" : estado;
    const entrada = sinHoras ? "00:00:00" : horaEntrada.length === 5 ? `${horaEntrada}:00` : horaEntrada;
    const salida = sinHoras
      ? null
      : horaSalida
        ? horaSalida.length === 5
          ? `${horaSalida}:00`
          : horaSalida
        : null;
    let observacion: string | null = esExcusa ? "EXCUSA" : esInasistencia ? "INASISTENCIA" : null;
    if (esExcusa && archivoExcusa) {
      observacion = `EXCUSA | archivo: ${archivoExcusa.name}`;
    }

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
          estado_asistencia: estadoApi === "AUTO" ? estadoCalculado : estadoApi,
          observacion,
          id_proyecto: idProyecto ? Number(idProyecto) : null,
        }),
      });
      const msg = esExcusa
        ? "Excusa registrada (sin horas de jornada)."
        : esInasistencia
          ? "Inasistencia registrada (día no trabajado)."
          : "Asistencia registrada.";
      setOk(msg);
      showToast(msg, "success");
      setArchivoExcusa(null);
      if (estado === "PRESENTE" || estado === "RETARDO") {
        setHoraEntrada(ahoraHHMM());
        setHoraSalida("");
      }
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "No se pudo guardar"; setError(m); showToast(m, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <Breadcrumb items={[{ label: "Asistencia", to: "/asistencia" }, { label: "Registrar" }]} />
      <div className="page-card">
        <h1 className="page-title">Registrar asistencia</h1>
        <p className="page-subtitle">
          Presente/Retardo: hora = ahora. No se registra fuera de las fechas de inicio/fin del
          proyecto al que esté asignado el empleado.
        </p>
        {loading && <p style={{ marginTop: 12 }}>Cargando empleados…</p>}
        <AsistenciaForm
          errorMsg=""
          empleados={empleados}
          usuariosMap={usuariosMap}
          proyectosMap={proyectosMap}
          asignaciones={asignaciones}
          empleadoId={empleadoId}
          setEmpleadoId={(v) => {
            setEmpleadoId(v);
            setIdProyecto("");
          }}
          idProyecto={idProyecto}
          setIdProyecto={setIdProyecto}
          fecha={fecha}
          setFecha={setFecha}
          horaEntrada={horaEntrada}
          setHoraEntrada={setHoraEntrada}
          horaSalida={horaSalida}
          setHoraSalida={setHoraSalida}
          estado={estado}
          setEstado={setEstado}
          estadoCalculado={estadoCalculado}
          loading={loading}
          saving={saving}
          onGuardar={guardar}
          archivoExcusa={archivoExcusa}
          setArchivoExcusa={setArchivoExcusa}
        />
      </div>
    </AppShell>
  );
}