export type SesionUsuario = {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
  rol: string | null;
};

export function leerSesion(): SesionUsuario | null {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      id: Number(u.id) || 0,
      nombre: String(u.nombre || "Usuario"),
      cargo: String(u.cargo || u.rol || ""),
      email: String(u.email || ""),
      rol: (u.rol || u.cargo || null) as string | null,
    };
  } catch {
    return null;
  }
}

export function rolActual(): string {
  return (leerSesion()?.rol || "").toUpperCase();
}

export function esAdminRrhh(): boolean {
  return rolActual() === "ADMIN_RRHH";
}

export function esSupervisor(): boolean {
  return rolActual() === "SUPERVISOR";
}

export function esAdminOSupervisor(): boolean {
  return esAdminRrhh() || esSupervisor();
}

/** Rutas de gestión pesada solo RRHH */
export function puedeGestionarPersonal(): boolean {
  return esAdminRrhh();
}

export function puedeAprobar(): boolean {
  return esAdminOSupervisor();
}
