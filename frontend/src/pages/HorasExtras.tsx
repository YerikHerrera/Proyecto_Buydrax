import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import HorasExtrasForm from "../components/operaciones/HorasExtrasForm";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, type UsuarioPublic } from "../services/usuariosService";
import { apiRequest } from "../services/apiClient";
import { maxHorasExtraPermitidas } from "../services/reportesService";
import "../styles/HorasExtras.css";

export default function HorasExtras() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [empleadoId, setEmpleadoId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cantidad, setCantidad] = useState("2");
  const [tipoHora, setTipoHora] = useState("DIURNA");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([listarEmpleados({ estado: "ACTIVO" }), listarUsuarios({ limit: 200 })])
      .then(([emps, users]) => {
        setEmpleados(Array.isArray(emps) ? emps : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users || []) map[u.id_usuario] = u;
        setUsuariosMap(map);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const tope = useMemo(
    () => maxHorasExtraPermitidas(fechaInicio, fechaFin),
    [fechaInicio, fechaFin]
  );

  const onFechaInicio = (v: string) => {
    setFechaInicio(v);
    if (!fechaFin || fechaFin < v) setFechaFin(v);
  };

  const guardar = async () => {
    if (!empleadoId || !motivo.trim() || !fechaInicio || !fechaFin || !cantidad) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (fechaInicio > fechaFin) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }
    const horas = Number(cantidad);
    if (!Number.isFinite(horas) || horas <= 0) {
      setError("La cantidad de horas debe ser mayor que 0.");
      return;
    }
    const max = maxHorasExtraPermitidas(fechaInicio, fechaFin);
    if (horas > max) {
      setError(
        `Máximo ${max} h para ese rango de fechas (16 h el mismo día o 12 h por día).`
      );
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      await apiRequest(`/empleados/${Number(empleadoId)}/horas-extra`, {
        method: "POST",
        body: JSON.stringify({
          motivo: motivo.trim(),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          cantidad_horas: horas,
          tipo_hora: tipoHora,
          archivo_soporte_url: "/soportes/he_pendiente.pdf",
        }),
      });
      setOk("Horas extras registradas (pendientes de aprobación).");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Asistencia", to: "/asistencia" }, { label: "Horas extras" }]} />
      <div className="page-card">
        <h1 className="page-title">Horas extras</h1>
        <p className="page-subtitle">
          Inicio ≤ fin. Mismo día: máx. 16 h. Varios días: máx. 12 h por día. Si es una sola
          jornada, deja la misma fecha en ambos campos.
        </p>
        {fechaInicio && fechaFin && fechaInicio <= fechaFin && (
          <p className="field-hint" style={{ marginBottom: 8 }}>
            Tope para este rango: <strong>{tope} h</strong>
          </p>
        )}
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        <HorasExtrasForm
          empleados={empleados}
          usuariosMap={usuariosMap}
          empleadoId={empleadoId}
          setEmpleadoId={setEmpleadoId}
          motivo={motivo}
          setMotivo={setMotivo}
          fechaInicio={fechaInicio}
          setFechaInicio={onFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          cantidad={cantidad}
          setCantidad={setCantidad}
          tipoHora={tipoHora}
          setTipoHora={setTipoHora}
          loading={loading}
          saving={saving}
          onGuardar={guardar}
          onVolver={() => navigate("/asistencia")}
        />
      </div>
    </AppShell>
  );
}
