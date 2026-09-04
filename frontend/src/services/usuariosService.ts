import { apiRequest } from "./apiClient";

export type UsuarioPublic = {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  estado: boolean;
  rol?: string | null;
};

export type UsuarioCreate = {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  rol: string;
  idioma?: string;
  estado?: boolean;
};

type Paginated<T> = {
  items?: T[];
  data?: T[];
  meta?: { total?: number };
};

function asList(data: UsuarioPublic[] | Paginated<UsuarioPublic> | null | undefined): UsuarioPublic[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

/** GET /usuarios */
export async function listarUsuarios(params?: {
  estado?: boolean;
  rol?: string;
  limit?: number;
}): Promise<UsuarioPublic[]> {
  const q = new URLSearchParams();
  if (params?.estado !== undefined) q.set("estado", String(params.estado));
  if (params?.rol) q.set("rol", params.rol);
  q.set("limit", String(params?.limit ?? 200));
  q.set("skip", "0");
  const data = await apiRequest<UsuarioPublic[] | Paginated<UsuarioPublic>>(
    `/usuarios?${q.toString()}`
  );
  return asList(data);
}

/** GET /usuarios/{id} */
export function obtenerUsuario(id: number) {
  return apiRequest<UsuarioPublic>(`/usuarios/${id}`);
}

/** POST /usuarios */
export function crearUsuario(body: UsuarioCreate) {
  return apiRequest<UsuarioPublic>("/usuarios", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function nombreUsuario(u: Pick<UsuarioPublic, "nombres" | "apellidos" | "correo">): string {
  const full = `${u.nombres || ""} ${u.apellidos || ""}`.trim();
  return full || u.correo || "Usuario";
}

/** Mapa id_usuario → UsuarioPublic */
export async function mapaUsuarios(): Promise<Record<number, UsuarioPublic>> {
  const users = await listarUsuarios({ limit: 200 });
  const map: Record<number, UsuarioPublic> = {};
  for (const u of users) {
    if (u?.id_usuario != null) map[Number(u.id_usuario)] = u;
  }
  return map;
}
