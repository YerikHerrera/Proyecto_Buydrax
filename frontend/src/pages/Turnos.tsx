import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { apiRequest } from "../services/apiClient";
import "../styles/Turnos.css";

export default function Turnos() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
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

  useEffect(() => {
    Promise.all([listarEmpleados({ estado: "ACTIVO" }), listarProyectos("ACTIVO"), listarUsuarios({ limit: 200 })])
      .then(([e, p, users]) => {
        setEmpleados(Array.isArray(e) ? e : []);
        setProyectos(Array.isArray(p) ? p : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users) map[u.id_usuario] = u;
        setUsuariosMap(map);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const labelEmp = (e: Empleado) => {
    const u = usuariosMap[e.id_usuario];
    if (u) return nombreUsuario(u);
    return `${e.cargo} · ${e.numero_documento}`;
  };

  const guardar = async () => {
    if (!empleadoId || !proyectoId || !fecha) {
      setError("Completa empleado, proyecto y fecha.");
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
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          fecha,
        }),
      });
      setOk("Turno asignado.");
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
          { label: "Turnos" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Asignar turno</h1>
        <p className="page-subtitle">Turnos diurnos/nocturnos por proyecto.</p>
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
            <label className="agregar-label">Proyecto *</label>
            <select className="agregar-input" value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} disabled={loading}>
              <option value="">Seleccionar</option>
              {proyectos.map((p) => (
                <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Tipo de turno</label>
            <select className="agregar-input" value={tipoTurno} onChange={(e) => setTipoTurno(e.target.value)}>
              <option value="Diurno">Diurno</option>
              <option value="Nocturno">Nocturno</option>
            </select>
          </div>
          <div>
            <label className="agregar-label">Fecha *</label>
            <input className="agregar-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Hora inicio</label>
            <input className="agregar-input" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Hora fin</label>
            <input className="agregar-input" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
          </div>
        </div>
        <div className="agregar-botones" style={{ marginTop: 20 }}>
          <button className="agregar-btn-primario" type="button" onClick={guardar} disabled={saving || loading}>
            {saving ? "Guardando…" : "Guardar turno"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
