import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import ProyectoForm from "../components/proyectos/ProyectoForm";
import ProyectoTable from "../components/proyectos/ProyectoTable";
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
        <ProyectoTable proyectos={proyectos} onEditar={cargarEdicion} />
      </div>

      <div className="page-card">
        <h2 className="page-title">{editId ? `Editar proyecto #${editId}` : "Crear proyecto"}</h2>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        <ProyectoForm editId={editId} nombre={nombre} setNombre={setNombre} supervisorId={supervisorId} setSupervisorId={setSupervisorId} localidad={localidad} setLocalidad={setLocalidad} fechaInicio={fechaInicio} setFechaInicio={setFechaInicio} fechaFin={fechaFin} setFechaFin={setFechaFin} descripcion={descripcion} setDescripcion={setDescripcion} estado={estado} setEstado={setEstado} supervisores={supervisores} loading={loading} onGuardar={handleGuardar} onCancelar={limpiar} />

      </div>
    </AppShell>
  );
}
