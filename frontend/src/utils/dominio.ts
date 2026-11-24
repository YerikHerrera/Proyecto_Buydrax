
/** Extrae dominio de un correo (ej. sena.edu.co). */
export function dominioDeCorreo(correo: string | null | undefined): string | null {
  if (!correo || !correo.includes("@")) return null;
  return correo.split("@")[1].trim().toLowerCase() || null;
}

/** Sugiere correo corporativo nombre.apellido@dominio */
export function sugerirCorreo(nombres: string, apellidos: string, dominio: string | null): string {
  if (!dominio) return "";
  const n = (nombres || "").trim().toLowerCase().split(/\s+/)[0] || "usuario";
  const a = (apellidos || "").trim().toLowerCase().split(/\s+/)[0] || "";
  const local = a ? `${n}.${a}` : n;
  return `${local.replace(/[^a-z0-9.]/g, "")}@${dominio}`;
}

export const ROLES_PRINCIPALES = ["ADMIN_RRHH", "CONTADOR", "SUPERVISOR", "EMPLEADO"] as const;
