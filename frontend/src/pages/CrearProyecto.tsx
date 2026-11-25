import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import ProyectoForm from "../components/proyectos/ProyectoForm";
import { localidades } from "../data/localidades";
import {
  crearProyecto,
  actualizarProyecto,
  listarProyectos,
  listarSupervisores,
  obtenerProyecto,
} from "../services/proyectosService";

export default function CrearProyecto() {
  return (
    <RoleGate require="admin">
      <CrearProyectoInner />
    </RoleGate>
  );
}

function CrearProyectoInner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editParam = searchParams.get("edit");

  const [editId, setEditId] = useState<number | null>(
    editParam ? Number(editParam) : null
  );
  const [nombre, setNombre] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("ACTIVO");
  const [supervisores, setSupervisores] = useState<
    { id_supervisor: number; numero_tarjeta_profesional: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(Boolean(editParam));
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    listarSupervisores().then(setSupervisores).catch(() => setSupervisores([]));
  }, []);

  useEffect(() => {
    if (!editParam) return;
    const id = Number(editParam);
    if (!id) return;
    setCargando(true);
    (async () => {
      try {
        let p;
        try {
          p = await obtenerProyecto(id);
        } catch {
          const list = await listarProyectos();
          p = (list || []).find((x) => x.id_proyecto === id);
        }
        if (!p) {
          setError(`No se encontró el proyecto #${id}`);
          setEditId(null);
          return;
        }
        setEditId(p.id_proyecto);
        setNombre(p.nombre);
        setSupervisorId(String(p.id_supervisor));
        const match = localidades.find(
          (l) => l.nombre === p.ubicacion_calle || l.id === p.ubicacion_calle
        );
        setLocalidad(match ? match.id : p.ubicacion_calle || "");
        setFechaInicio((p.fecha_inicio || "").slice(0, 10));
        setFechaFin((p.fecha_fin || "").slice(0, 10));
        setDescripcion(p.descripcion || "");
        setEstado(p.estado_proyecto || "ACTIVO");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar proyecto");
      } finally {
        setCargando(false);
      }
    })();
  }, [editParam]);

  const limpiar = () => {
    setEditId(null);
    setNombre("");
    setSupervisorId("");
    setLocalidad("");
    setFechaInicio("");
    setFechaFin("");
    setDescripcion("");
    setEstado("ACTIVO");
    navigate("/proyectos/crear", { replace: true });
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
        setTimeout(() => navigate("/proyectos"), 800);
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
        setTimeout(() => navigate("/proyectos"), 800);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Proyectos", to: "/proyectos" },
          { label: editId ? `Editar #${editId}` : "Crear" },
        ]}
      />
      <div className="page-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1 className="page-title">
              {editId ? `Editar proyecto #${editId}` : "Crear proyecto"}
            </h1>
            <p className="page-subtitle">
              {editId
                ? "Modifica los datos y guarda. Luego puedes volver al listado."
                : "Completa los datos de la nueva obra."}
            </p>
          </div>
          <Link
            to="/proyectos"
            className="agregar-btn-secundario"
            style={{ textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Ver listado →
          </Link>
        </div>
        {cargando && <p style={{ color: "#64748b" }}>Cargando proyecto…</p>}
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        {!cargando && (
          <ProyectoForm
            editId={editId}
            nombre={nombre}
            setNombre={setNombre}
            supervisorId={supervisorId}
            setSupervisorId={setSupervisorId}
            localidad={localidad}
            setLocalidad={setLocalidad}
            fechaInicio={fechaInicio}
            setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}
            setFechaFin={setFechaFin}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            estado={estado}
            setEstado={setEstado}
            supervisores={supervisores}
            loading={loading}
            onGuardar={handleGuardar}
            onCancelar={limpiar}
          />
        )}
      </div>
    </AppShell>
  );
}
