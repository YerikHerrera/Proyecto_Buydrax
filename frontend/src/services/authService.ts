import { apiRequest, clearSession } from "./apiClient";

export type LoginResponse = {
  access_token: string;
  token_type: string;
  usuario: {
    id_usuario: number;
    nombres: string;
    apellidos: string;
    correo: string;
    rol?: string | null;
    perfil?: { id_perfil: number; nombre: string; descripcion?: string | null } | null;
    estado: boolean;
  };
};

export type RolDemo = "ADMIN_RRHH" | "SUPERVISOR" | "CONTADOR" | "EMPLEADO";

/** Login real contra el backend */
export async function login(correo: string, contrasena: string) {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });

  const rol = data.usuario.rol || data.usuario.perfil?.nombre || null;

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem(
    "usuario",
    JSON.stringify({
      id: data.usuario.id_usuario,
      nombre: `${data.usuario.nombres} ${data.usuario.apellidos}`.trim(),
      cargo: rol || "Usuario",
      email: data.usuario.correo,
      rol,
    })
  );

  return data;
}

/**
 * Login demo local (sin backend).
 * Permite navegar todas las interfaces visuales.
 */
export function loginDemo(rol: RolDemo = "ADMIN_RRHH", nombre?: string) {
  const nombres: Record<RolDemo, string> = {
    ADMIN_RRHH: "Admin Demo RRHH",
    SUPERVISOR: "Supervisor Demo",
    CONTADOR: "Contador Demo",
    EMPLEADO: "Empleado Demo",
  };
  const token = `demo-token-${rol}-${Date.now()}`;
  localStorage.setItem("access_token", token);
  localStorage.setItem(
    "usuario",
    JSON.stringify({
      id: 0,
      nombre: nombre || nombres[rol],
      cargo: rol === "ADMIN_RRHH" ? "Administrador RRHH" : rol,
      email: `demo.${rol.toLowerCase()}@buydrax.local`,
      rol,
    })
  );
  localStorage.setItem("buydrax_demo_mode", "1");
  return { access_token: token, rol };
}

export function esModoDemo(): boolean {
  return localStorage.getItem("buydrax_demo_mode") === "1";
}

export async function logout() {
  try {
    if (!esModoDemo()) {
      await apiRequest("/auth/logout", { method: "POST" });
    }
  } catch {
    // ignorar
  } finally {
    clearSession();
    localStorage.removeItem("buydrax_demo_mode");
  }
}
