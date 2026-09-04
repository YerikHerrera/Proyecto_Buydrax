import { apiRequest } from "./apiClient";

export type DashboardData = {
  empleados_activos: number;
  proyectos_activos: number;
  horas_extra_pendientes: number;
  novedades_pendientes: number;
  nominas_borrador: number;
  solicitudes_pendientes: number;
};

export function getDashboard() {
  return apiRequest<DashboardData>("/dashboard");
}
