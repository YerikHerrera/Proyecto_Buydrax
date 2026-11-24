/** Parseo y validación de CSV de personal / asignaciones (import Excel). */

export type FilaImportRaw = Record<string, string>;

export type FilaValidada = {
  fila: number;
  raw: FilaImportRaw;
  ok: boolean;
  errores: string[];
  payload?: {
    id_empleado: number;
    id_proyecto: number;
    cuadrilla: string;
    rol_en_proyecto: string;
    fecha_asignacion: string;
  };
};

const ALIASES: Record<string, string[]> = {
  empleado: ["empleado", "nombre", "nombre empleado", "nombre_empleado"],
  documento: [
    "documento",
    "numero documento",
    "número de documento",
    "numero_documento",
    "doc",
    "cedula",
    "cédula",
  ],
  cargo: ["cargo", "rol", "funcion", "función", "rol_en_proyecto"],
  cuadrilla: ["cuadrilla", "crew", "grupo"],
  proyecto: ["proyecto", "obra", "nombre proyecto", "nombre_proyecto"],
  fecha: [
    "fecha",
    "fecha asignacion",
    "fecha_asignacion",
    "fecha de asignación",
    "desde",
  ],
  telefono: ["telefono", "teléfono", "celular", "phone"],
};

function normHeader(h: string) {
  return h
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ");
}

function mapHeader(h: string): string | null {
  const n = normHeader(h);
  for (const [key, list] of Object.entries(ALIASES)) {
    if (list.includes(n) || n === key) return key;
  }
  return null;
}

export function parseCsv(text: string): { headers: string[]; rows: FilaImportRaw[] } {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const splitLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        out.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  const rawHeaders = splitLine(lines[0]);
  const headers = rawHeaders.map((h) => mapHeader(h) || normHeader(h));
  const rows: FilaImportRaw[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitLine(lines[i]);
    const obj: FilaImportRaw = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? "").trim();
    });
    rows.push(obj);
  }
  return { headers, rows };
}

function parseFecha(s: string): string | null {
  const t = (s || "").trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const d = m[1].padStart(2, "0");
    const mo = m[2].padStart(2, "0");
    return `${m[3]}-${mo}-${d}`;
  }
  return null;
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export type CatalogosImport = {
  empleadosPorDoc: Map<string, { id_empleado: number; cargo: string; estado: string }>;
  proyectosPorNombre: Map<
    string,
    { id_proyecto: number; fecha_inicio: string; fecha_fin: string }
  >;
  asignacionesActivas: Set<string>;
};

export function validarFilasImport(
  rows: FilaImportRaw[],
  cat: CatalogosImport
): FilaValidada[] {
  const hoy = hoyISO();
  return rows.map((raw, idx) => {
    const errores: string[] = [];
    const fila = idx + 2;

    const doc = (raw.documento || "").replace(/\s+/g, "").replace(/\./g, "");
    const proyectoNom = (raw.proyecto || "").trim();
    const cuadrilla = (raw.cuadrilla || "").trim();
    const fechaRaw = raw.fecha || "";
    const fecha = parseFecha(fechaRaw);

    if (!doc) errores.push("Falta documento del empleado");
    if (!proyectoNom) errores.push("Falta nombre del proyecto");
    if (!cuadrilla) errores.push("Falta cuadrilla");
    if (!fechaRaw) errores.push("Falta fecha de asignación");
    else if (!fecha) errores.push(`Fecha inválida «${fechaRaw}» (YYYY-MM-DD o DD/MM/YYYY)`);
    else if (fecha > hoy) errores.push("La fecha no puede ser futura");

    const emp = doc ? cat.empleadosPorDoc.get(doc) : undefined;
    if (doc && !emp) errores.push(`Documento «${doc}» no existe en la BD`);
    else if (emp && emp.estado && !["ACTIVO", "ACTIVE"].includes(emp.estado.toUpperCase())) {
      errores.push(`Empleado no activo (${emp.estado})`);
    }

    const proy = proyectoNom
      ? cat.proyectosPorNombre.get(proyectoNom.toLowerCase())
      : undefined;
    if (proyectoNom && !proy) errores.push(`Proyecto «${proyectoNom}» no encontrado en la BD`);

    if (emp && proy && fecha) {
      const ini = String(proy.fecha_inicio || "").slice(0, 10);
      const fin = String(proy.fecha_fin || "").slice(0, 10);
      if (ini && fecha < ini) errores.push(`Fecha anterior al inicio del proyecto (${ini})`);
      if (fin && fecha > fin) errores.push(`Fecha posterior al fin del proyecto (${fin})`);
      const k = `${emp.id_empleado}:${proy.id_proyecto}`;
      if (cat.asignacionesActivas.has(k)) {
        errores.push("Ya tiene asignación activa en ese proyecto");
      }
    }

    const ok = errores.length === 0;
    return {
      fila,
      raw,
      ok,
      errores,
      payload:
        ok && emp && proy && fecha
          ? {
              id_empleado: emp.id_empleado,
              id_proyecto: proy.id_proyecto,
              cuadrilla,
              rol_en_proyecto: emp.cargo,
              fecha_asignacion: fecha,
            }
          : undefined,
    };
  });
}
