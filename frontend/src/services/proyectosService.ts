import { apiRequest } from "./apiClient";

export type Proyecto = {
  id_proyecto: number;
  id_supervisor: number;
  nombre: string;
  descripcion?: string | null;
  ubicacion_calle: string;
  ubicacion_referencia?: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado_proyecto: string;
};

export type ProyectoCreate = {
  id_supervisor: number;
  nombre: string;
  descripcion?: string | null;
  ubicacion_calle: string;
  ubicacion_referencia?: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado_proyecto?: string;
};

export function listarProyectos(estado?: string) {
  const qs = estado ? `?estado=${encodeURIComponent(estado)}` : "";
  return apiRequest<Proyecto[]>(`/proyectos${qs}`);
}

export function crearProyecto(body: ProyectoCreate) {
  return apiRequest<Proyecto>("/proyectos", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listarSupervisores() {
  return apiRequest<
    {
      id_supervisor: number;
      id_usuario: number;
      numero_tarjeta_profesional: string;
      cuadrilla_asignada?: string | null;
    }[]
  >("/supervisores");
}


export type ProyectoUpdate = Partial<{
  id_supervisor: number;
  nombre: string;
  descripcion: string | null;
  ubicacion_calle: string;
  ubicacion_referencia: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado_proyecto: string;
}>;

export function actualizarProyecto(id: number, body: ProyectoUpdate) {
  return apiRequest<Proyecto>(`/proyectos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function obtenerProyecto(id: number) {
  return apiRequest<Proyecto>(`/proyectos/${id}`);
}
