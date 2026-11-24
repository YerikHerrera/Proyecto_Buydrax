/**
 * Carga y cruza datos reales de la API para reportes
 * (empleados, usuarios, proyectos, asignaciones, asistencias, turnos, HE).
 */
import { apiRequest } from "./apiClient";
import { listarEmpleados, type Empleado } from "./empleadosService";
import { listarProyectos, type Proyecto } from "./proyectosService";
import { listarUsuarios, type UsuarioPublic } from "./usuariosService";
import { listarAsignaciones, type AsignacionOut } from "./asignacionesService";

export type AsistenciaApi = {
  id_asistencia: number;
  id_empleado: number;
  fecha: string;
  hora_entrada?: string;
  hora_salida?: string | null;
  estado_asistencia: string;
  observacion?: string | null;
};

export type TurnoApi = {
  id_turno: number;
  id_empleado: number;
  id_proyecto: number;
  tipo_turno: string;
  hora_inicio: string;
  hora_fin: string;
  fecha: string;
};

export type HoraExtraApi = {
  id_hora_extra: number;
  id_empleado: number;
  motivo: string;
  fecha_inicio: string;
  fecha_fin: string;
  cantidad_horas: number;
  tipo_hora: string;
  estado_he: string;
};

export type ReportesBundle = {
  empleados: Empleado[];
  usuariosMap: Record<number, UsuarioPublic>;
  proyectos: Proyecto[];
  proyectosMap: Record<number, Proyecto>;
  asignaciones: AsignacionOut[];
  asistencias: AsistenciaApi[];
  turnos: TurnoApi[];
  horasExtra: HoraExtraApi[];
};

export function nombreEmpleado(
  e: Empleado,
  usuariosMap: Record<number, UsuarioPublic>
): string {
  const u = usuariosMap[e.id_usuario];
  if (u) return `${u.nombres} ${u.apellidos}`.trim();
  return e.nombres && e.apellidos
    ? `${e.nombres} ${e.apellidos}`
    : `Empleado #${e.id_empleado}`;
}

/** Proyecto principal del empleado (primera asignación activa). */
export function proyectoDeEmpleado(
  idEmpleado: number,
  asignaciones: AsignacionOut[],
  proyectosMap: Record<number, Proyecto>
): { id: number | null; nombre: string } {
  const a = asignaciones.find(
    (x) => x.id_empleado === idEmpleado && x.activo !== false
  );
  if (!a) return { id: null, nombre: "Sin proyecto" };
  const p = proyectosMap[a.id_proyecto];
  return {
    id: a.id_proyecto,
    nombre: p?.nombre || `Proyecto #${a.id_proyecto}`,
  };
}

export async function cargarDatosReportes(): Promise<ReportesBundle> {
  const [empleados, proyectos, users, asignaciones, asistencias, turnos, horasExtra] =
    await Promise.all([
      listarEmpleados().catch(() => [] as Empleado[]),
      listarProyectos().catch(() => [] as Proyecto[]),
      listarUsuarios({ limit: 200 }).catch(() => [] as UsuarioPublic[]),
      listarAsignaciones().catch(() => [] as AsignacionOut[]),
      apiRequest<AsistenciaApi[]>("/asistencias").catch(() => [] as AsistenciaApi[]),
      apiRequest<TurnoApi[]>("/turnos").catch(() => [] as TurnoApi[]),
      apiRequest<HoraExtraApi[]>("/horas-extra").catch(() => [] as HoraExtraApi[]),
    ]);

  const usuariosMap: Record<number, UsuarioPublic> = {};
  for (const u of users || []) usuariosMap[u.id_usuario] = u;

  const proyectosMap: Record<number, Proyecto> = {};
  for (const p of proyectos || []) proyectosMap[p.id_proyecto] = p;

  return {
    empleados: Array.isArray(empleados) ? empleados : [],
    usuariosMap,
    proyectos: Array.isArray(proyectos) ? proyectos : [],
    proyectosMap,
    asignaciones: Array.isArray(asignaciones) ? asignaciones : [],
    asistencias: Array.isArray(asistencias) ? asistencias : [],
    turnos: Array.isArray(turnos) ? turnos : [],
    horasExtra: Array.isArray(horasExtra) ? horasExtra : [],
  };
}

/** Tope de horas extra según rango de fechas (misma lógica que backend). */
export function maxHorasExtraPermitidas(fechaInicio: string, fechaFin: string): number {
  if (!fechaInicio || !fechaFin || fechaInicio > fechaFin) return 0;
  const a = new Date(fechaInicio + "T00:00:00");
  const b = new Date(fechaFin + "T00:00:00");
  const dias = Math.floor((b.getTime() - a.getTime()) / 86400000) + 1;
  if (dias <= 1) return 16; // un solo día / jornada
  return dias * 12; // varios días: 12 h/día de tope
}
