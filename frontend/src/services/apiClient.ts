import { API_BASE_URL } from "../config/api";

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export function clearSession(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("usuario");
}

function mensajeError(data: unknown, status: number): string {
  if (!data || typeof data !== "object") return `Error HTTP ${status}`;
  const d = data as Record<string, unknown>;

  // AppError format { error: { message } }
  const errObj = d.error as { message?: string } | undefined;
  if (errObj?.message) return errObj.message;

  // FastAPI detail string
  if (typeof d.detail === "string") return d.detail;

  // FastAPI validation detail array
  if (Array.isArray(d.detail)) {
    const parts = d.detail.map((item: unknown) => {
      if (!item || typeof item !== "object") return String(item);
      const it = item as { loc?: unknown[]; msg?: string };
      const loc = Array.isArray(it.loc)
        ? it.loc.filter((x) => x !== "body").join(".")
        : "";
      return loc ? `${loc}: ${it.msg || ""}` : it.msg || JSON.stringify(item);
    });
    return parts.filter(Boolean).join(" · ") || "Datos inválidos";
  }

  if (typeof d.message === "string") return d.message;
  return `Error HTTP ${status}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. ¿Está el backend en http://127.0.0.1:8000?"
    );
  }

  if (res.status === 401) {
    clearSession();
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.match(/^\/($|forgot-password)/)
    ) {
      window.location.href = "/";
    }
    throw new Error("Sesión expirada o no autorizada. Inicia sesión de nuevo.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(mensajeError(data, res.status));
  }

  return data as T;
}
