import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { apiRequest } from "../services/apiClient";
import "../styles/asistencia.css";

const ESTADOS = [
  { value: "PRESENTE", label: "Presente" },
  { value: "RETARDO", label: "Retardo" },
  { value: "INASISTENCIA", label: "Inasistencia" },
];

export default function Asistencia() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [empleadoId, setEmpleadoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [estado, setEstado] = useState("PRESENTE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    Promise.all([listarEmpleados({ estado: "ACTIVO" }), listarUsuarios({ limit: 200 })])
      .then(([d, users]) => {
        setEmpleados(Array.isArray(d) ? d : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users) map[u.id_usuario] = u;
        setUsuariosMap(map);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const labelEmp = (e: Empleado) => {
    const u = usuariosMap[e.id_usuario];
    if (u) return nombreUsuario(u);
    return `${e.cargo} · ${e.numero_documento}`;
  };

  const guardar = async () => {
    if (!empleadoId || !fecha || !horaEntrada) {
      setError("Completa empleado, fecha y hora de entrada.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      await apiRequest(`/empleados/${empleadoId}/asistencias`, {
        method: "POST",
        body: JSON.stringify({
          fecha,
          hora_entrada: horaEntrada,
          hora_salida: horaSalida || null,
          estado_asistencia: estado,
        }),
      });
      setOk("Asistencia registrada.");
      setHoraEntrada("");
      setHoraSalida("");
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
          { label: "Registrar" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Registrar asistencia</h1>
        <p className="page-subtitle">Entrada y salida del personal en obra.</p>
        {loading && <p style={{ marginTop: 12 }}>Cargando empleados…</p>}
        {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
        {ok && <p style={{ color: "#047857", marginTop: 12 }}>{ok}</p>}
        <div className="agregar-form" style={{ marginTop: 20 }}>
          <div>
            <label className="agregar-label">Empleado *</label>
            <select
              className="agregar-input"
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar</option>
              {empleados.map((e) => (
                <option key={e.id_empleado} value={e.id_empleado}>
                  {labelEmp(e)} — {e.cargo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Fecha *</label>
            <input className="agregar-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Hora entrada *</label>
            <input className="agregar-input" type="time" value={horaEntrada} onChange={(e) => setHoraEntrada(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Hora salida</label>
            <input className="agregar-input" type="time" value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Estado</label>
            <select className="agregar-input" value={estado} onChange={(e) => setEstado(e.target.value)}>
              {ESTADOS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="agregar-botones" style={{ marginTop: 20 }}>
          <button className="agregar-btn-primario" type="button" onClick={guardar} disabled={saving || loading}>
            {saving ? "Guardando…" : "Guardar asistencia"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
