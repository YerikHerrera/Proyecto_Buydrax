import { apiRequest } from "./apiClient";

export type Empleado = {
  id_empleado: number;
  id_usuario: number;
  id_supervisor?: number | null;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  calle: string;
  barrio?: string | null;
  ciudad: string;
  telefono: string;
  correo_personal?: string | null;
  cargo: string;
  fecha_ingreso: string;
  salario: number | string;
  forma_pago: string;
  banco?: string | null;
  numero_cuenta?: string | null;
  estado_laboral: string;
  nombres?: string;
  apellidos?: string;
};

export type EmpleadoCreate = {
  id_usuario: number;
  id_supervisor?: number | null;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  calle: string;
  barrio?: string | null;
  ciudad: string;
  telefono: string;
  correo_personal?: string | null;
  cargo: string;
  fecha_ingreso: string;
  salario: number;
  forma_pago: string;
  banco?: string | null;
  numero_cuenta?: string | null;
  estado_laboral?: string;
};

export type EmpleadoUpdate = Partial<{
  id_supervisor: number | null;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  calle: string;
  barrio: string | null;
  ciudad: string;
  telefono: string;
  correo_personal: string | null;
  cargo: string;
  fecha_ingreso: string;
  salario: number;
  forma_pago: string;
  banco: string | null;
  numero_cuenta: string | null;
  estado_laboral: string;
}>;

export type AfiliacionUpsert = {
  eps: string;
  fondo_pension: string;
  arl: string;
  caja_compensacion: string;
  nivel_riesgo_arl: number;
  estado_afiliacion?: string;
};

export function listarEmpleados(params?: {
  documento?: string;
  estado?: string;
}) {
  const q = new URLSearchParams();
  if (params?.documento) q.set("documento", params.documento);
  if (params?.estado) q.set("estado", params.estado);
  const qs = q.toString();
  return apiRequest<Empleado[]>(`/empleados${qs ? `?${qs}` : ""}`);
}

export function obtenerEmpleado(id: number) {
  return apiRequest<Empleado>(`/empleados/${id}`);
}

export function crearEmpleado(body: EmpleadoCreate) {
  return apiRequest<Empleado>("/empleados", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function actualizarEmpleado(id: number, body: EmpleadoUpdate) {
  return apiRequest<Empleado>(`/empleados/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** Retiro lógico vía API (PATCH estado_laboral = RETIRADO). */
export function retirarEmpleado(id: number) {
  return actualizarEmpleado(id, { estado_laboral: "RETIRADO" });
}

export function guardarAfiliacion(idEmpleado: number, body: AfiliacionUpsert) {
  return apiRequest(`/empleados/${idEmpleado}/afiliacion`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function exportarEmpleados() {
  return apiRequest<{ items: Empleado[]; count: number }>("/empleados/export");
}


/** Descarga CSV (compatible Excel) desde lista en memoria o endpoint export. */
export async function exportarEmpleadosExcel(
  empleados: Empleado[],
  nombrePorIdUsuario?: Record<number, string>
): Promise<void> {
  const headers = [
    "id_empleado",
    "nombre",
    "tipo_documento",
    "numero_documento",
    "cargo",
    "telefono",
    "ciudad",
    "estado_laboral",
    "salario",
    "fecha_ingreso",
  ];
  const rows = empleados.map((e) => {
    const nombre =
      (nombrePorIdUsuario && nombrePorIdUsuario[e.id_usuario]) ||
      e.cargo ||
      "";
    return [
      e.id_empleado,
      `"${String(nombre).replace(/"/g, '""')}"`,
      e.tipo_documento,
      e.numero_documento,
      `"${String(e.cargo || "").replace(/"/g, '""')}"`,
      e.telefono,
      e.ciudad,
      e.estado_laboral,
      e.salario,
      e.fecha_ingreso,
    ].join(",");
  });
  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `empleados_buydrax_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
