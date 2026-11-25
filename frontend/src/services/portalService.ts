import { apiRequest } from "./apiClient";
import { listarEmpleados, type Empleado } from "./empleadosService";
import { listarAsignaciones, type AsignacionOut } from "./asignacionesService";
import { listarProyectos, type Proyecto } from "./proyectosService";
import { leerSesion } from "./session";

/** Resuelve el empleado ligado al usuario de la sesión (id_usuario). */
export async function miEmpleado(): Promise<Empleado | null> {
  const s = leerSesion();
  if (!s?.id) return null;
  try {
    const emps = await listarEmpleados();
    const found = (emps || []).find((e) => Number(e.id_usuario) === Number(s.id));
    return found || null;
  } catch {
    return null;
  }
}

export async function misAsignacionesActivas(): Promise<{
  asignaciones: AsignacionOut[];
  proyectos: Record<number, Proyecto>;
  empleado: Empleado | null;
}> {
  const emp = await miEmpleado();
  const proys = await listarProyectos().catch(() => [] as Proyecto[]);
  const mapa: Record<number, Proyecto> = {};
  proys.forEach((p) => (mapa[p.id_proyecto] = p));
  if (!emp) return { asignaciones: [], proyectos: mapa, empleado: null };
  const asigs = await listarAsignaciones().catch(() => [] as AsignacionOut[]);
  const mias = (asigs || []).filter(
    (a) => Number(a.id_empleado) === Number(emp.id_empleado) && a.activo !== false
  );
  return { asignaciones: mias, proyectos: mapa, empleado: emp };
}

export async function misTurnos() {
  const emp = await miEmpleado();
  if (!emp) return [];
  try {
    const all = await apiRequest<any[]>("/turnos");
    return (all || []).filter((t) => Number(t.id_empleado) === Number(emp.id_empleado));
  } catch {
    return [];
  }
}

export async function miAsistencia() {
  const emp = await miEmpleado();
  if (!emp) return [];
  try {
    return await apiRequest<any[]>(`/empleados/${emp.id_empleado}/asistencias`);
  } catch {
    try {
      const all = await apiRequest<any[]>("/asistencias");
      return (all || []).filter((a) => Number(a.id_empleado) === Number(emp.id_empleado));
    } catch {
      return [];
    }
  }
}

export async function misHorasExtra() {
  const emp = await miEmpleado();
  if (!emp) return [];
  try {
    return await apiRequest<any[]>(`/horas-extra?id_empleado=${emp.id_empleado}`);
  } catch {
    return [];
  }
}

export async function misCertificaciones() {
  const emp = await miEmpleado();
  if (!emp) return [];
  try {
    return await apiRequest<any[]>(`/empleados/${emp.id_empleado}/certificaciones`);
  } catch {
    return [];
  }
}

export async function misDesprendibles() {
  const emp = await miEmpleado();
  if (!emp) return [];
  try {
    return await apiRequest<any[]>(`/empleados/${emp.id_empleado}/desprendibles`);
  } catch {
    return [];
  }
}
