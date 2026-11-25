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
  const [idProyecto, setIdProyecto] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [horaEntrada, setHoraEntrada] = useState(ahoraHHMM());
  const [horaSalida, setHoraSalida] = useState("");
  const [estado, setEstado] = useState("AUTO");
  const [archivoExcusa, setArchivoExcusa] = useState<File | null>(null);
  const [confirmarGuardado, setConfirmarGuardado] = useState(false);
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

  // Si cambia el estado y deja de ser EXCUSA, limpia el archivo adjunto
  useEffect(() => {
    if (estado !== "EXCUSA") {
      setArchivoExcusa(null);
    }
  }, [estado]);

  // Si cambian los datos del formulario, reinicia la confirmación previa
  useEffect(() => {
    setConfirmarGuardado(false);
  }, [empleadoId, idProyecto, fecha, horaEntrada, horaSalida, estado, archivoExcusa]);

  const proyectosMap = useMemo(() => {
    const m: Record<number, Proyecto> = {};
    proyectos.forEach((p) => (m[p.id_proyecto] = p));
    return m;
  }, [proyectos]);

  const nombreEmpleadoSeleccionado = useMemo(() => {
    if (!empleadoId) return "";
    const emp = empleados.find((e) => String(e.id_empleado) === String(empleadoId));
    if (!emp) return `Empleado #${empleadoId}`;
    const usr = emp.id_usuario ? usuariosMap[emp.id_usuario] : undefined;
    const usrRec = usr as unknown as Record<string, unknown> | undefined;
    const nombre =
      [usr?.nombres, usr?.apellidos].filter(Boolean).join(" ").trim() ||
      String(usrRec?.nombre_completo ?? "") ||
      String(usrRec?.nombre ?? "") ||
      `Empleado #${emp.id_empleado}`;
    return emp.cargo ? `${nombre} (${emp.cargo})` : nombre;
  }, [empleadoId, empleados, usuariosMap]);

  const nombreProyectoSeleccionado = useMemo(() => {
    if (!idProyecto) return "";
    return proyectosMap[Number(idProyecto)]?.nombre || `Proyecto #${idProyecto}`;
  }, [idProyecto, proyectosMap]);

  /** Valida que la fecha esté dentro del rango de al menos un proyecto activo del empleado. */
  const validarFechaEnProyectos = (idEmp: string, fechaStr: string): string | null => {
    const activas = asignaciones.filter(
      (a) => a.activo !== false && String(a.id_empleado) === String(idEmp)
    );
    if (activas.length === 0) {
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
    const limite = 8 * 60;
    return mins > limite ? "RETARDO" : "PRESENTE";
  }, [estado, horaEntrada]);

  const validarFormulario = (): boolean => {
    setError("");
    if (!empleadoId) {
      setError("Selecciona un empleado.");
      return false;
    }
    const hoy = hoyISO();
    const esExcusa = estado === "EXCUSA";
    const esInasistencia = estado === "INASISTENCIA";
    const sinHoras = esExcusa || esInasistencia;

    if (!fecha) {
      setError("La fecha es obligatoria.");
      return false;
    }
    if (fecha > hoy) {
      setError("No se permiten fechas futuras.");
      return false;
    }
    if (!esExcusa && fecha !== hoy) {
      setError("Solo con Excusa se puede usar una fecha distinta de hoy.");
      return false;
    }
    if (!sinHoras && !horaEntrada) {
      setError("Falta la hora de entrada.");
      return false;
    }
    if (horaSalida && horaEntrada && horaSalida < horaEntrada) {
      setError("La hora de salida no puede ser anterior a la de entrada.");
      return false;
    }

    const errProy = validarFechaEnProyectos(empleadoId, fecha);
    if (errProy) {
      setError(errProy);
      return false;
    }
    if (!idProyecto) {
      setError("Selecciona el proyecto correspondiente del empleado.");
      return false;
    }

    if (esExcusa && archivoExcusa && archivoExcusa.size > 10 * 1024 * 1024) {
      setError("El archivo adjunto no puede superar los 10 MB.");
      return false;
    }

    return true;
  };

  const ejecutarGuardado = async () => {
    const esExcusa = estado === "EXCUSA";
    const esInasistencia = estado === "INASISTENCIA";
    const sinHoras = esExcusa || esInasistencia;

    const estadoApi = esExcusa ? "INASISTENCIA" : estado === "AUTO" ? "AUTO" : estado;
    const estadoFinal = estadoApi === "AUTO" ? estadoCalculado : estadoApi;
    const entrada = sinHoras ? "00:00:00" : horaEntrada.length === 5 ? `${horaEntrada}:00` : horaEntrada;
    const salida = sinHoras
      ? null
      : horaSalida
        ? horaSalida.length === 5
          ? `${horaSalida}:00`
          : horaSalida
        : null;

    const observacion = esExcusa
      ? archivoExcusa
        ? `EXCUSA (Adjunto: ${archivoExcusa.name})`
        : "EXCUSA"
      : esInasistencia
        ? "INASISTENCIA"
        : null;

    try {
      setSaving(true);
      setError("");
      setOk("");
      setConfirmarGuardado(false);

      if (esExcusa && archivoExcusa) {
        const formData = new FormData();
        formData.append("fecha", fecha);
        formData.append("hora_entrada", entrada);
        if (salida) formData.append("hora_salida", salida);
        formData.append("estado_asistencia", estadoFinal);
        formData.append("observacion", observacion || "EXCUSA");
        formData.append("id_proyecto", String(Number(idProyecto)));
        formData.append("archivo", archivoExcusa);

        await apiRequest(`/empleados/${empleadoId}/asistencias`, {
          method: "POST",
          body: formData,
        });
      } else {
        await apiRequest(`/empleados/${empleadoId}/asistencias`, {
          method: "POST",
          body: JSON.stringify({
            fecha,
            hora_entrada: entrada,
            hora_salida: salida,
            estado_asistencia: estadoFinal,
            observacion,
            id_proyecto: idProyecto ? Number(idProyecto) : null,
          }),
        });
      }

      setOk(
        esExcusa
          ? `Excusa registrada para ${nombreEmpleadoSeleccionado} el ${fecha}${
              archivoExcusa ? ` con archivo "${archivoExcusa.name}"` : " (sin horas de jornada)"
            }.`
          : esInasistencia
            ? `Inasistencia registrada para ${nombreEmpleadoSeleccionado} el ${fecha} (día no trabajado).`
            : `Asistencia (${estadoFinal}) registrada para ${nombreEmpleadoSeleccionado} el ${fecha} a las ${entrada.slice(0, 5)}.`
      );

      if (estado === "PRESENTE" || estado === "RETARDO" || estado === "AUTO") {
        setHoraEntrada(ahoraHHMM());
        setHoraSalida("");
      }
      if (esExcusa) {
        setArchivoExcusa(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const guardar = async () => {
    setOk("");
    if (!validarFormulario()) {
      setConfirmarGuardado(false);
      return;
    }

    if (!confirmarGuardado) {
      setConfirmarGuardado(true);
      return;
    }

    await ejecutarGuardado();
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

        {ok && (
          <div
            role="status"
            style={{
              marginTop: 12,
              background: "#ecfdf5",
              border: "1px solid #6ee7b7",
              color: "#065f46",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {ok}
          </div>
        )}

        {estado === "EXCUSA" && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d6d3d1",
              background: "#fafaf9",
            }}
          >
            <label
              htmlFor="archivo-excusa"
              style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1c1917", marginBottom: 6 }}
            >
              Adjuntar soporte de excusa (opcional · PDF, imagen o documento, máx. 10 MB)
            </label>
            <input
              id="archivo-excusa"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setArchivoExcusa(file);
              }}
              style={{ fontSize: 13 }}
            />
            {archivoExcusa && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 13,
                  color: "#292524",
                }}
              >
                <span>
                  Archivo seleccionado: <strong>{archivoExcusa.name}</strong> (
                  {(archivoExcusa.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => setArchivoExcusa(null)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid #d6d3d1",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Quitar
                </button>
              </div>
            )}
          </div>
        )}

        {confirmarGuardado && (
          <div
            role="alert"
            style={{
              marginTop: 12,
              background: "#fffbeb",
              border: "1px solid #f59e0b",
              color: "#92400e",
              padding: "12px 14px",
              borderRadius: 10,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              Advertencia: confirma el registro de asistencia
            </div>
            <div style={{ lineHeight: 1.45 }}>
              Vas a guardar el registro de <strong>{nombreEmpleadoSeleccionado}</strong> en el proyecto{" "}
              <strong>{nombreProyectoSeleccionado}</strong> para la fecha <strong>{fecha}</strong> con
              estado <strong>{estado === "AUTO" ? estadoCalculado : estado}</strong>
              {estado !== "EXCUSA" && estado !== "INASISTENCIA" && (
                <span>
                  {" "}
                  (entrada: <strong>{horaEntrada || "--:--"}</strong>
                  {horaSalida ? `, salida: ${horaSalida}` : ""})
                </span>
              )}
              {estado === "EXCUSA" && (
                <span>
                  {" "}
                  — Soporte adjunto:{" "}
                  <strong>{archivoExcusa ? archivoExcusa.name : "Ninguno"}</strong>
                </span>
              )}
              .
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
                Revisar datos
              </button>
            </div>
          </div>
        )}

        <AsistenciaForm
          errorMsg={error}
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
        />
      </div>
    </AppShell>
  );
}