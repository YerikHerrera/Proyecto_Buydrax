export type SesionUsuario = {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
  rol: string | null;
};

export type RolOficial = "ADMIN_RRHH" | "SUPERVISOR" | "CONTADOR" | "EMPLEADO";

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
  return (leerSesion()?.rol || "").toUpperCase().replace(/\s+/g, "_");
}

export function esAdminRrhh(): boolean {
  const r = rolActual();
  return r === "ADMIN_RRHH" || r === "ADMINISTRADOR" || r === "ADMIN" || r === "RRHH";
}

export function esSupervisor(): boolean {
  return rolActual() === "SUPERVISOR";
}

export function esContador(): boolean {
  return rolActual() === "CONTADOR";
}

export function esEmpleado(): boolean {
  const r = rolActual();
  return r === "EMPLEADO" || r === "EMPLEADO_PORTAL";
}

export function esAdminOSupervisor(): boolean {
  return esAdminRrhh() || esSupervisor();
}

/** Gestión pesada de personal solo ADMIN_RRHH */
export function puedeGestionarPersonal(): boolean {
  return esAdminRrhh();
}

export function puedeAprobar(): boolean {
  return esAdminOSupervisor();
}

/** Etiqueta legible del rol para UI */
export function etiquetaRol(rol?: string | null): string {
  const r = (rol || rolActual() || "").toUpperCase().replace(/\s+/g, "_");
  switch (r) {
    case "ADMIN_RRHH":
    case "ADMINISTRADOR":
    case "ADMIN":
    case "RRHH":
      return "ADMIN_RRHH";
    case "SUPERVISOR":
      return "SUPERVISOR";
    case "CONTADOR":
      return "CONTADOR";
    case "EMPLEADO":
    case "EMPLEADO_PORTAL":
      return "EMPLEADO";
    default:
      return r || "—";
  }
}

/**
 * Menú visible por rol (matriz Buydrax).
 * Solo ADMIN_RRHH ve todo.
 */
export function menuPermitidoPorRol(): {
  inicio: boolean;
  empleados: boolean;
  empleadosGestion: boolean; // alta/edición
  proyectos: boolean;
  asistencia: boolean;
  nomina: boolean;
  reportes: boolean;
  usuarios: boolean;
  portalEmpleado: boolean;
} {
  if (esAdminRrhh()) {
    return {
      inicio: true,
      empleados: true,
      empleadosGestion: true,
      proyectos: true,
      asistencia: true,
      nomina: true,
      reportes: true,
      usuarios: true,
      portalEmpleado: false,
    };
  }
  if (esSupervisor()) {
    return {
      inicio: true,
      empleados: true, // consulta limitada
      empleadosGestion: false,
      proyectos: true,
      asistencia: true,
      nomina: false, // consulta parcial vía reportes si aplica
      reportes: true,
      usuarios: false,
      portalEmpleado: false,
    };
  }
  if (esContador()) {
    return {
      inicio: true,
      empleados: true, // consulta
      empleadosGestion: false,
      proyectos: false,
      asistencia: false,
      nomina: true,
      reportes: true,
      usuarios: false,
      portalEmpleado: false,
    };
  }
  // EMPLEADO / default: portal reducido
  return {
    inicio: true,
    empleados: false,
    empleadosGestion: false,
    proyectos: false,
    asistencia: false,
    nomina: false,
    reportes: false,
    usuarios: false,
    portalEmpleado: true,
  };
}
