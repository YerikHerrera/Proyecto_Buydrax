import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { apiRequest } from "../services/apiClient";
import "../styles/HorasExtras.css";

const TIPOS = ["DIURNA", "NOCTURNA", "DOMINICAL", "FESTIVA", "DIURNA_DOMINICAL"];

export default function HorasExtras() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [empleadoId, setEmpleadoId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tipoHora, setTipoHora] = useState("DIURNA");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listarEmpleados({ estado: "ACTIVO" })
      .then((d) => setEmpleados(Array.isArray(d) ? d : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const labelEmp = (e: Empleado) => {
    const u = usuariosMap[e.id_usuario];
    if (u) return nombreUsuario(u);
    return `${e.cargo} · ${e.numero_documento}`;
  };

  const guardar = async () => {
    if (!empleadoId || !motivo || !fechaInicio || !fechaFin || !cantidad) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      // Backend real: POST /empleados/{id}/horas-extra (no POST /horas-extra)
      await apiRequest(`/empleados/${Number(empleadoId)}/horas-extra`, {
        method: "POST",
        body: JSON.stringify({
          motivo: motivo.trim(),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          cantidad_horas: Number(cantidad),
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
      <Breadcrumb
        items={[
          { label: "Asistencia", to: "/asistencia" },
          { label: "Horas extras" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Horas extras</h1>
        <p className="page-subtitle">Registro alineado a la API (estado PENDIENTE).</p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        <div className="agregar-form" style={{ marginTop: 16 }}>
          <div>
            <label className="agregar-label">Empleado *</label>
            <select className="agregar-input" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} disabled={loading}>
              <option value="">Seleccionar</option>
              {empleados.map((e) => (
                <option key={e.id_empleado} value={e.id_empleado}>{labelEmp(e)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Motivo *</label>
            <input className="agregar-input" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={255} />
          </div>
          <div>
            <label className="agregar-label">Fecha inicio *</label>
            <input className="agregar-input" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Fecha fin *</label>
            <input className="agregar-input" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Cantidad de horas *</label>
            <input className="agregar-input" type="number" min="0.5" step="0.5" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Tipo de hora</label>
            <select className="agregar-input" value={tipoHora} onChange={(e) => setTipoHora(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="agregar-botones" style={{ marginTop: 20 }}>
          <button className="agregar-btn-secundario" type="button" onClick={() => navigate("/asistencia")}>
            Volver
          </button>
          <button className="agregar-btn-primario" type="button" onClick={guardar} disabled={saving || loading}>
            {saving ? "Guardando…" : "Guardar horas extras"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
