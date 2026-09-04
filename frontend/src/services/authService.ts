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

export async function login(correo: string, contrasena: string) {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });

  const rol =
    data.usuario.rol ||
    data.usuario.perfil?.nombre ||
    null;

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

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    // ignorar si el token ya expiró
  } finally {
    clearSession();
  }
}
