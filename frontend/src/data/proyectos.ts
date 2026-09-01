export interface Proyecto {
  id: number;
  nombre: string;
  ubicacion: string;
  supervisor: string;
  fechaInicio: string;
  fechaFin: string;
}

export const PROYECTOS_MOCK: Proyecto[] = [
  { id: 1, nombre: "Construcción CR 60", ubicacion: "Av. Jimenez", supervisor: "Rodney Marin", fechaInicio: "20/05/2025", fechaFin: "20/11/2025" },
  { id: 2, nombre: "Ampliación Terminal", ubicacion: "Aeropuerto Dorado", supervisor: "Patricia Gómez", fechaInicio: "01/03/2025", fechaFin: "15/09/2025" },
];