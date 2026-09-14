import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import AsignacionEmpleadoForm from "../components/operaciones/AsignacionEmpleadoForm";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { apiRequest } from "../services/apiClient";
import { listarAsignaciones } from "../services/asignacionesService";
import "../styles/AsignacionEmpleado.css";

const ROLES_PROYECTO = [
  "Supervisor de cuadrilla",
  "Oficial",
  "Ayudante",
  "Operario",
  "Auxiliar",
  "Maestro de obra",
];

export default function AsignacionEmpleado() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [empleadoId, setEmpleadoId] = useState("");
  const [proyectoId, setProyectoId] = useState("");
  const [rol, setRol] = useState("");
  const [cuadrilla, setCuadrilla] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [cuadrillasOpts, setCuadrillasOpts] = useState<string[]>(["General", "Cuadrilla A", "Cuadrilla B", "Cuadrilla C"]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [emps, proys, users, asigs] = await Promise.all([
          listarEmpleados({ estado: "ACTIVO" }),
          listarProyectos("ACTIVO"),
          listarUsuarios({ limit: 200 }),
          listarAsignaciones().catch(() => []),
        ]);
        if (!cancelled) {
          setEmpleados(Array.isArray(emps) ? emps : []);
          setProyectos(Array.isArray(proys) ? proys : []);
          const map: Record<number, UsuarioPublic> = {};
          for (const u of users) map[u.id_usuario] = u;
          setUsuariosMap(map);
          const setC = new Set<string>(["General", "Cuadrilla A", "Cuadrilla B", "Cuadrilla C"]);
          for (const a of asigs || []) {
            if (a.cuadrilla) setC.add(a.cuadrilla);
          }
          setCuadrillasOpts([...setC].sort());
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar empleados/proyectos"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const guardar = async () => {
    if (!empleadoId || !proyectoId || !rol || !fechaInicio) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      // Backend: POST /proyectos/{id_proyecto}/asignaciones (no existe POST /asignaciones)
      await apiRequest(`/proyectos/${Number(proyectoId)}/asignaciones`, {
        method: "POST",
        body: JSON.stringify({
          id_empleado: Number(empleadoId),
          rol_en_proyecto: rol,
          cuadrilla: cuadrilla.trim() || "General",
          fecha_asignacion: fechaInicio,
        }),
      });
      setOk("Asignación registrada correctamente.");
      setEmpleadoId("");
      setProyectoId("");
      setRol("");
      setCuadrilla("");
      setFechaInicio("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la asignación"
      );
    } finally {
      setSaving(false);
    }
  };

  const nombreEmpleado = (e: Empleado) => {
    const u = usuariosMap[e.id_usuario];
    if (u) return nombreUsuario(u);
    const n = (e as any).nombres || (e as any).nombre || "";
    const a = (e as any).apellidos || "";
    return `${n} ${a}`.trim() || `${e.cargo} · Doc. ${e.numero_documento}`;
  };

  return (<AppShell><Breadcrumb items={[{label:"Proyectos",to:"/proyectos"},{label:"Asignación"}]}/><section className="asignacion-card page-card"><div className="asignacion-header"><div className="asignacion-icono"><i className="bi bi-person-workspace"></i></div><div><h1>ASIGNACIÓN DE EMPLEADO</h1><p>Asigna un empleado a un proyecto (datos desde API / base de datos).</p></div></div><hr/>{loading&&<p>Cargando catálogos...</p>}{error&&<div style={{color:"#b00020",marginBottom:12}}>{error}</div>}{ok&&<div style={{color:"#047857",marginBottom:12}}>{ok}</div>}<AsignacionEmpleadoForm empleados={empleados} proyectos={proyectos} usuariosMap={usuariosMap} empleadoId={empleadoId} setEmpleadoId={setEmpleadoId} proyectoId={proyectoId} setProyectoId={setProyectoId} rol={rol} setRol={setRol} cuadrilla={cuadrilla} setCuadrilla={setCuadrilla} fechaInicio={fechaInicio} setFechaInicio={setFechaInicio} cuadrillasOpts={cuadrillasOpts} loading={loading} saving={saving} onGuardar={guardar}/><div className="asignacion-info"><i className="bi bi-info-circle-fill"></i><span>Los listados provienen de la API (empleados activos y proyectos activos). Solo se permiten valores del catálogo.</span></div></section></AppShell>);
}
