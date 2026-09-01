export interface Empleado {
  id: number;
  nombre: string;
  tipoDoc: string;
  numDoc: string;
  cargo: string;
  telefono: string;
  estrato: number;
  color: string;
}

export const EMPLEADOS_MOCK: Empleado[] = [
  { id: 1,  nombre: "Kevin Rondon",     tipoDoc: "CC", numDoc: "1024511530", cargo: "Distribuidor", telefono: "3013821025", estrato: 2, color: "#F97316" },
  { id: 2,  nombre: "Samuel Castro",    tipoDoc: "CC", numDoc: "1022251350", cargo: "Arquitecto",   telefono: "3203567180", estrato: 3, color: "#8B5CF6" },
  { id: 3,  nombre: "Rodney Marin",     tipoDoc: "CC", numDoc: "1023374580", cargo: "Supervisor",   telefono: "3217939324", estrato: 3, color: "#6366F1" },
  { id: 4,  nombre: "Yerik Castañeda",  tipoDoc: "CC", numDoc: "1025701606", cargo: "Ayudante",     telefono: "3212513535", estrato: 1, color: "#EC4899" },
  { id: 5,  nombre: "Juan David",       tipoDoc: "CC", numDoc: "1024671808", cargo: "Marketing",    telefono: "3015879030", estrato: 4, color: "#10B981" },
  { id: 6,  nombre: "Hanna Nausa",      tipoDoc: "CC", numDoc: "1031445512", cargo: "Ingeniero",    telefono: "3006512340", estrato: 4, color: "#1E3A8A" },
  { id: 7,  nombre: "Julian Garcia",    tipoDoc: "TI", numDoc: "1020034512", cargo: "Auxiliar",     telefono: "3145678912", estrato: 2, color: "#EF4444" },
  { id: 8,  nombre: "Hernán Ospina",    tipoDoc: "CC", numDoc: "1019872345", cargo: "Electricista", telefono: "3224456789", estrato: 2, color: "#F59E0B" },
  { id: 9,  nombre: "Patricia Gómez",   tipoDoc: "CC", numDoc: "1022345671", cargo: "Supervisora",  telefono: "3187654321", estrato: 5, color: "#14B8A6" },
  { id: 10, nombre: "Miguel Ángel",     tipoDoc: "CC", numDoc: "1033123456", cargo: "Obrero",       telefono: "3209871234", estrato: 1, color: "#64748B" },
];