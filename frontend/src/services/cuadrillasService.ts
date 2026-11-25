import { apiRequest } from "./apiClient";

export type CuadrillaOut = {
  id_cuadrilla: number;
  nombre: string;
  descripcion?: string | null;
  id_supervisor?: number | null;
  activo: boolean;
};

export type CuadrillaProyectoOut = {
  id_cuadrilla_proyecto: number;
  id_cuadrilla: number;
  id_proyecto: number;
  activo: boolean;
  fecha_inicio: string;
  fecha_fin?: string | null;
  nombre_cuadrilla?: string | null;
  nombre_proyecto?: string | null;
  empleados_activos?: number | null;
};

export function listarCuadrillas(soloActivas = true) {
  return apiRequest<CuadrillaOut[]>(`/cuadrillas?solo_activas=${soloActivas}`);
}

export function crearCuadrilla(body: { nombre: string; descripcion?: string; id_supervisor?: number }) {
  return apiRequest<CuadrillaOut>("/cuadrillas", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function actualizarCuadrilla(
  id: number,
  body: Partial<{ nombre: string; descripcion: string; id_supervisor: number; activo: boolean }>
) {
  return apiRequest<CuadrillaOut>(`/cuadrillas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function listarVinculos(params?: {
  id_cuadrilla?: number;
  id_proyecto?: number;
  solo_activos?: boolean;
}) {
  const q = new URLSearchParams();
  if (params?.id_cuadrilla != null) q.set("id_cuadrilla", String(params.id_cuadrilla));
  if (params?.id_proyecto != null) q.set("id_proyecto", String(params.id_proyecto));
  if (params?.solo_activos != null) q.set("solo_activos", String(params.solo_activos));
  const qs = q.toString();
  return apiRequest<CuadrillaProyectoOut[]>(`/cuadrillas/vinculos${qs ? `?${qs}` : ""}`);
}

export function vincularCuadrillaAProyecto(idCuadrilla: number, idProyecto: number, fechaInicio?: string) {
  return apiRequest<CuadrillaProyectoOut>(`/cuadrillas/${idCuadrilla}/proyectos`, {
    method: "POST",
    body: JSON.stringify({ id_proyecto: idProyecto, fecha_inicio: fechaInicio }),
  });
}

/** forzar=true retira empleados activos y desvincula */
export function desvincularCuadrillaDeProyecto(idCuadrilla: number, idProyecto: number, forzar = false) {
  return apiRequest<{ ok: boolean; mensaje: string; empleados_retirados: number }>(
    `/cuadrillas/${idCuadrilla}/proyectos/${idProyecto}/desvincular`,
    {
      method: "POST",
      body: JSON.stringify({ forzar }),
    }
  );
}
