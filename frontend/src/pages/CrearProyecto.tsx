import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import { localidades } from "../data/localidades";
import {
  crearProyecto,
  actualizarProyecto,
  listarProyectos,
  listarSupervisores,
  type Proyecto,
} from "../services/proyectosService";

export default function CrearProyecto() {
  return (
    <RoleGate require="admin">
      <CrearProyectoInner />
    </RoleGate>
  );
}

function CrearProyectoInner() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [supervisores, setSupervisores] = useState<
    { id_supervisor: number; numero_tarjeta_profesional: string }[]
  >([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("ACTIVO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const cargar = () => {
    listarProyectos().then(setProyectos).catch(() => setProyectos([]));
    listarSupervisores().then(setSupervisores).catch(() => setSupervisores([]));
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiar = () => {
    setEditId(null);
    setNombre("");
    setSupervisorId("");
    setLocalidad("");
    setFechaInicio("");
    setFechaFin("");
    setDescripcion("");
    setEstado("ACTIVO");
  };

  const cargarEdicion = (p: Proyecto) => {
    setEditId(p.id_proyecto);
    setNombre(p.nombre);
    setSupervisorId(String(p.id_supervisor));
    setLocalidad(p.ubicacion_calle || "");
    setFechaInicio((p.fecha_inicio || "").slice(0, 10));
    setFechaFin((p.fecha_fin || "").slice(0, 10));
    setDescripcion(p.descripcion || "");
    setEstado(p.estado_proyecto || "ACTIVO");
    setOk("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGuardar = async () => {
    if (!nombre || !supervisorId || !fechaInicio || !fechaFin) {
      setError("Completa nombre, supervisor y fechas.");
      return;
    }
    if (fechaFin <= fechaInicio) {
      setError("La fecha fin debe ser posterior a la de inicio.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setOk("");
      const ubic =
        localidades.find((l) => l.id === localidad)?.nombre ||
        localidad ||
        "Sin especificar";
      if (editId) {
        await actualizarProyecto(editId, {
          id_supervisor: Number(supervisorId),
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          ubicacion_calle: ubic,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado_proyecto: estado,
        });
        setOk(`Proyecto #${editId} actualizado.`);
      } else {
        await crearProyecto({
          id_supervisor: Number(supervisorId),
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          ubicacion_calle: ubic,
          ubicacion_referencia: null,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado_proyecto: "ACTIVO",
        });
        setOk("Proyecto creado.");
      }
      limpiar();
      cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Proyectos", to: "/proyectos" }, { label: editId ? "Editar" : "Crear" }]} />

      <div className="page-card" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Proyectos</h1>
        <p className="page-subtitle">Listado y edición (PATCH /proyectos/&#123;id&#125;).</p>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 10 }}>Nombre</th>
                <th style={{ padding: 10 }}>Ubicación</th>
                <th style={{ padding: 10 }}>Supervisor</th>
                <th style={{ padding: 10 }}>Fechas</th>
                <th style={{ padding: 10 }}>Estado</th>
                <th style={{ padding: 10 }}></th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id_proyecto} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>{p.nombre}</td>
                  <td style={{ padding: 10 }}>{p.ubicacion_calle}</td>
                  <td style={{ padding: 10 }}>#{p.id_supervisor}</td>
                  <td style={{ padding: 10 }}>
                    {p.fecha_inicio} → {p.fecha_fin}
                  </td>
                  <td style={{ padding: 10 }}>{p.estado_proyecto}</td>
                  <td style={{ padding: 10 }}>
                    <button
                      type="button"
                      className="agregar-btn-secundario"
                      onClick={() => cargarEdicion(p)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {proyectos.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
                    Sin proyectos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <h2 className="page-title">{editId ? `Editar proyecto #${editId}` : "Crear proyecto"}</h2>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        <div className="agregar-form" style={{ marginTop: 16 }}>
          <div>
            <label className="agregar-label">Nombre *</label>
            <input className="agregar-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Supervisor *</label>
            <select className="agregar-input" value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)}>
              <option value="">Seleccionar</option>
              {supervisores.map((s) => (
                <option key={s.id_supervisor} value={s.id_supervisor}>
                  #{s.id_supervisor} ({s.numero_tarjeta_profesional})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Localidad / ubicación</label>
            <select className="agregar-input" value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
              <option value="">Seleccionar</option>
              {localidades.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
            {editId && (
              <input
                className="agregar-input"
                style={{ marginTop: 8 }}
                placeholder="O escribe ubicación libre"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="agregar-label">Descripción</label>
            <textarea className="agregar-input" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Fecha inicio *</label>
            <input className="agregar-input" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Fecha fin *</label>
            <input className="agregar-input" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
          {editId && (
            <div>
              <label className="agregar-label">Estado</label>
              <select className="agregar-input" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="ACTIVO">ACTIVO</option>
                <option value="SUSPENDIDO">SUSPENDIDO</option>
                <option value="FINALIZADO">FINALIZADO</option>
              </select>
            </div>
          )}
        </div>
        <div className="agregar-botones" style={{ marginTop: 20 }}>
          {editId && (
            <button type="button" className="agregar-btn-secundario" onClick={limpiar}>
              Cancelar edición
            </button>
          )}
          <button type="button" className="agregar-btn-primario" onClick={handleGuardar} disabled={loading}>
            {loading ? "Guardando…" : editId ? "Guardar cambios" : "Crear proyecto"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
