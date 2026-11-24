import { apiRequest } from "./apiClient";

export type Empresa = {
  id_empresa: number;
  nombre: string;
  dominio: string;
  tipo: "EMPRESA" | "EXTERNO" | string;
  activo: boolean;
  creado_en?: string;
};

export async function listarEmpresas(): Promise<Empresa[]> {
  return apiRequest<Empresa[]>("/empresas");
}

export async function crearEmpresa(body: {
  nombre: string;
  dominio: string;
  tipo?: "EMPRESA" | "EXTERNO";
}): Promise<Empresa> {
  return apiRequest<Empresa>("/empresas", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function actualizarEmpresa(
  id: number,
  body: { nombre?: string; activo?: boolean; tipo?: "EMPRESA" | "EXTERNO" }
): Promise<Empresa> {
  return apiRequest<Empresa>(`/empresas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function crearAdminParaDominio(body: {
  id_empresa: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  area_responsable?: string;
}): Promise<{ mensaje: string; correo: string; dominio: string }> {
  return apiRequest<{ mensaje: string; correo: string; dominio: string }>(
    "/empresas/admin",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
}