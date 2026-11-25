import { apiRequest } from "./apiClient";

export type AsignacionCreate = {
  id_empleado: number;
  cuadrilla: string;
  rol_en_proyecto: string;
  fecha_asignacion: string; // YYYY-MM-DD
};

export type AsignacionOut = {
  id_asignacion: number;
  id_proyecto: number;
  id_empleado: number;
  cuadrilla: string;
  rol_en_proyecto: string;
  fecha_asignacion: string;
  activo: boolean;
};

/** POST /proyectos/{id_proyecto}/asignaciones */
export function crearAsignacion(idProyecto: number, body: AsignacionCreate) {
  return apiRequest<AsignacionOut>(`/proyectos/${idProyecto}/asignaciones`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /proyectos/{id_proyecto}/asignaciones */
export function listarAsignacionesProyecto(idProyecto: number) {
  return apiRequest<AsignacionOut[]>(`/proyectos/${idProyecto}/asignaciones`);
}

/** GET /asignaciones-proyecto */
export function listarAsignaciones() {
  return apiRequest<AsignacionOut[]>("/asignaciones-proyecto");
}

/** PATCH /asignaciones-proyecto/{id} → activo=false */
export function retirarAsignacion(idAsignacion: number) {
  return apiRequest<AsignacionOut>(`/asignaciones-proyecto/${idAsignacion}`, {
    method: "PATCH",
  });
}


/** PATCH /asignaciones-proyecto/{id}/cuadrilla — cambia cuadrilla sin retirar del proyecto */
export function cambiarCuadrillaAsignacion(
  idAsignacion: number,
  body: { cuadrilla: string; id_cuadrilla?: number }
) {
  return apiRequest<AsignacionOut>(`/asignaciones-proyecto/${idAsignacion}/cuadrilla`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
