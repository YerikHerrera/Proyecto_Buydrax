/** Datos mock para reportes visuales (sin endpoints reales aún). */

export type FilaPersonal = {
  id: number;
  proyecto: string;
  nombre: string;
  documento: string;
  cargo: string;
  estado: "Activo" | "Inactivo" | "Vacaciones";
  supervisor: string;
};

export type FilaAsistencia = {
  id: number;
  proyecto: string;
  nombre: string;
  cargo: string;
  mes: string;
  diasAsistidos: number;
  faltas: number;
  justificadas: number;
  estado: "Al día" | "Con faltas" | "Incapacidad";
};

export type FilaHorasExtra = {
  id: number;
  proyecto: string;
  nombre: string;
  cargo: string;
  horas: number;
  tipo: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
  fecha: string;
};

export type FilaTurno = {
  id: number;
  proyecto: string;
  nombre: string;
  cargo: string;
  tipoTurno: string;
  horaInicio: string;
  horaFin: string;
  estado: "Programado" | "En curso" | "Finalizado";
  fecha: string;
};

export type FilaProyecto = {
  id: number;
  nombre: string;
  ubicacion: string;
  supervisor: string;
  empleados: number;
  presupuesto: number;
  avance: number; // 0-100
  estado: "En curso" | "Finalizado" | "Suspendido";
  fechaInicio: string;
  fechaFin: string;
};

export const MOCK_PROYECTOS = ["Obra Norte", "Torre Centro", "Ampliación Sur", "Puente Oriente"];

export const MOCK_PERSONAL: FilaPersonal[] = [
  { id: 1, proyecto: "Obra Norte", nombre: "Carlos Pérez", documento: "10101010", cargo: "Oficial de obra", estado: "Activo", supervisor: "Ana Ruiz" },
  { id: 2, proyecto: "Obra Norte", nombre: "María López", documento: "20202020", cargo: "Ayudante", estado: "Activo", supervisor: "Ana Ruiz" },
  { id: 3, proyecto: "Torre Centro", nombre: "José Gómez", documento: "30303030", cargo: "Ingeniero", estado: "Vacaciones", supervisor: "Luis Mora" },
  { id: 4, proyecto: "Ampliación Sur", nombre: "Laura Díaz", documento: "40404040", cargo: "Topógrafo", estado: "Activo", supervisor: "Ana Ruiz" },
  { id: 5, proyecto: "Puente Oriente", nombre: "Pedro Sánchez", documento: "50505050", cargo: "Soldador", estado: "Inactivo", supervisor: "Luis Mora" },
  { id: 6, proyecto: "Torre Centro", nombre: "Sofía Ramírez", documento: "60606060", cargo: "Electricista", estado: "Activo", supervisor: "Luis Mora" },
];

export const MOCK_ASISTENCIA: FilaAsistencia[] = [
  { id: 1, proyecto: "Obra Norte", nombre: "Carlos Pérez", cargo: "Oficial de obra", mes: "2026-09", diasAsistidos: 18, faltas: 1, justificadas: 1, estado: "Con faltas" },
  { id: 2, proyecto: "Obra Norte", nombre: "María López", cargo: "Ayudante", mes: "2026-09", diasAsistidos: 20, faltas: 0, justificadas: 0, estado: "Al día" },
  { id: 3, proyecto: "Torre Centro", nombre: "José Gómez", cargo: "Ingeniero", mes: "2026-09", diasAsistidos: 12, faltas: 0, justificadas: 8, estado: "Incapacidad" },
  { id: 4, proyecto: "Ampliación Sur", nombre: "Laura Díaz", cargo: "Topógrafo", mes: "2026-09", diasAsistidos: 19, faltas: 1, justificadas: 0, estado: "Con faltas" },
  { id: 5, proyecto: "Puente Oriente", nombre: "Pedro Sánchez", cargo: "Soldador", mes: "2026-09", diasAsistidos: 15, faltas: 5, justificadas: 0, estado: "Con faltas" },
];

export const MOCK_HE: FilaHorasExtra[] = [
  { id: 1, proyecto: "Obra Norte", nombre: "Carlos Pérez", cargo: "Oficial de obra", horas: 4, tipo: "Diurna", estado: "Pendiente", fecha: "2026-09-05" },
  { id: 2, proyecto: "Torre Centro", nombre: "Sofía Ramírez", cargo: "Electricista", horas: 6, tipo: "Nocturna", estado: "Aprobada", fecha: "2026-09-04" },
  { id: 3, proyecto: "Ampliación Sur", nombre: "Laura Díaz", cargo: "Topógrafo", horas: 3, tipo: "Dominical", estado: "Pendiente", fecha: "2026-09-07" },
  { id: 4, proyecto: "Obra Norte", nombre: "María López", cargo: "Ayudante", horas: 2, tipo: "Diurna", estado: "Rechazada", fecha: "2026-09-03" },
];

export const MOCK_TURNOS: FilaTurno[] = [
  { id: 1, proyecto: "Obra Norte", nombre: "Carlos Pérez", cargo: "Oficial de obra", tipoTurno: "Diurno", horaInicio: "07:00", horaFin: "16:00", estado: "Programado", fecha: "2026-09-10" },
  { id: 2, proyecto: "Torre Centro", nombre: "Sofía Ramírez", cargo: "Electricista", tipoTurno: "Nocturno", horaInicio: "18:00", horaFin: "02:00", estado: "En curso", fecha: "2026-09-10" },
  { id: 3, proyecto: "Ampliación Sur", nombre: "Laura Díaz", cargo: "Topógrafo", tipoTurno: "Diurno", horaInicio: "06:30", horaFin: "15:30", estado: "Finalizado", fecha: "2026-09-09" },
  { id: 4, proyecto: "Puente Oriente", nombre: "Pedro Sánchez", cargo: "Soldador", tipoTurno: "Rotativo", horaInicio: "08:00", horaFin: "17:00", estado: "Programado", fecha: "2026-09-11" },
];

export const MOCK_PROYECTOS_DET: FilaProyecto[] = [
  { id: 1, nombre: "Obra Norte", ubicacion: "Calle 45 #12-30", supervisor: "Ana Ruiz", empleados: 24, presupuesto: 450000000, avance: 62, estado: "En curso", fechaInicio: "2026-01-15", fechaFin: "2026-12-20" },
  { id: 2, nombre: "Torre Centro", ubicacion: "Cra 7 #80-10", supervisor: "Luis Mora", empleados: 48, presupuesto: 1200000000, avance: 35, estado: "En curso", fechaInicio: "2026-03-01", fechaFin: "2027-06-30" },
  { id: 3, nombre: "Ampliación Sur", ubicacion: "Av. Sur Km 8", supervisor: "Ana Ruiz", empleados: 16, presupuesto: 280000000, avance: 88, estado: "En curso", fechaInicio: "2025-11-01", fechaFin: "2026-10-15" },
  { id: 4, nombre: "Puente Oriente", ubicacion: "Vía Oriente", supervisor: "Luis Mora", empleados: 32, presupuesto: 890000000, avance: 100, estado: "Finalizado", fechaInicio: "2025-02-01", fechaFin: "2026-08-30" },
];

export function badgeEstado(estado: string): { bg: string; color: string } {
  const e = estado.toLowerCase();
  if (["activo", "al día", "aprobada", "en curso", "programado"].includes(e))
    return { bg: "#dcfce7", color: "#166534" };
  if (["pendiente", "vacaciones", "con faltas"].includes(e))
    return { bg: "#fef3c7", color: "#92400e" };
  if (["inactivo", "rechazada", "suspendido", "incapacidad"].includes(e))
    return { bg: "#fee2e2", color: "#991b1b" };
  if (["finalizado"].includes(e)) return { bg: "#e0e7ff", color: "#3730a3" };
  return { bg: "#f1f5f9", color: "#475569" };
}

export function formatoCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}
