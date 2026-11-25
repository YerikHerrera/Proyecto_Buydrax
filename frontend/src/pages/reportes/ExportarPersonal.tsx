import { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "../../components/layout/AppShell";
import Breadcrumb from "../../components/layout/Breadcrumb";
import {
  listarAsignaciones,
  crearAsignacion,
  type AsignacionOut,
} from "../../services/asignacionesService";
import { listarEmpleados, type Empleado } from "../../services/empleadosService";
import { listarProyectos, type Proyecto } from "../../services/proyectosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../../services/usuariosService";
import {
  parseCsv,
  validarFilasImport,
  type CatalogosImport,
  type FilaValidada,
} from "../../utils/importPersonalCsv";
import { descargarExcel } from "../../utils/exportExcel";
import "../../styles/ExportarPersonal.css";

const CAMPOS = [
  { key: "empleado", label: "Empleado" },
  { key: "documento", label: "Documento" },
  { key: "cargo", label: "Cargo" },
  { key: "cuadrilla", label: "Cuadrilla" },
  { key: "proyecto", label: "Proyecto" },
  { key: "fecha", label: "Fecha asignación" },
  { key: "telefono", label: "Teléfono" },
] as const;

type CampoKey = (typeof CAMPOS)[number]["key"];

type Fila = {
  empleado: string;
  documento: string;
  cargo: string;
  cuadrilla: string;
  proyecto: string;
  idProyecto: number;
  fecha: string;
  telefono: string;
};

const ROWS_PER_GROUP = 5;
const GROUPS_PER_PAGE = 2;

function CheckboxDropdown({
  label,
  options,
  selected,
  onChange,
  allLabel = "Todos",
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
  allLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(q.trim().toLowerCase())
  );

  const toggle = (value: string) => {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
    else onChange([...selected, value]);
  };

  const summary =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label || "1 elegido"
        : `${selected.length} seleccionados`;

  return (
    <div className="export-toolbar__field">
      <span className="label">{label}</span>
      <div className="ms-dd" ref={rootRef}>
        <button
          type="button"
          className={`ms-dd__btn${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="ms-dd__btn-text">{summary}</span>
          <i
            className={`bi bi-chevron-${open ? "up" : "down"}`}
            style={{ fontSize: 12, color: "#94a3b8" }}
          />
        </button>
        {open && (
          <div className="ms-dd__panel">
            <input
              className="ms-dd__search"
              placeholder="Buscar…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
            />
            {filtered.length === 0 ? (
              <div style={{ padding: 8, fontSize: 12, color: "#94a3b8" }}>Sin resultados</div>
            ) : (
              filtered.map((o) => (
                <label key={o.value} className="ms-dd__opt">
                  <input
                    type="checkbox"
                    checked={selected.includes(o.value)}
                    onChange={() => toggle(o.value)}
                  />
                  <span>{o.label}</span>
                </label>
              ))
            )}
            <div className="ms-dd__actions">
              <button type="button" onClick={() => onChange(options.map((o) => o.value))}>
                Todos
              </button>
              <button type="button" onClick={() => onChange([])}>
                Ninguno
              </button>
              <button type="button" onClick={() => setOpen(false)}>
                Listo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupTable({
  titulo,
  items,
  camposActivos,
}: {
  titulo: string;
  items: Fila[];
  camposActivos: CampoKey[];
}) {
  const [page, setPage] = useState(1);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const totalPages = Math.max(1, Math.ceil(items.length / ROWS_PER_GROUP));
  const pageSafe = Math.min(page, totalPages);
  const slice = items.slice((pageSafe - 1) * ROWS_PER_GROUP, pageSafe * ROWS_PER_GROUP);

  useEffect(() => {
    setPage(1);
    setOpenCard(null);
  }, [items.length, titulo]);

  const labelOf = (k: CampoKey) => CAMPOS.find((c) => c.key === k)?.label || k;

  return (
    <div className="export-group">
      <div className="export-group__head">
        <div>
          {titulo}{" "}
          <span>
            · {items.length} registro{items.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Desktop */}
      <div className="export-table-wrap">
        <table>
          <thead>
            <tr>
              {camposActivos.map((k) => (
                <th key={k}>{labelOf(k)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={Math.max(camposActivos.length, 1)} style={{ padding: 16, color: "#94a3b8" }}>
                  Sin filas
                </td>
              </tr>
            ) : (
              slice.map((f, i) => (
                <tr key={`${f.documento}-${f.proyecto}-${i}`}>
                  {camposActivos.map((k) => (
                    <td key={k}>{String((f as Record<string, unknown>)[k] ?? "") || "—"}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: tarjeta + detalle desplegable */}
      <div className="export-cards">
        {slice.length === 0 ? (
          <div style={{ padding: 16, color: "#94a3b8", fontSize: 13 }}>Sin filas</div>
        ) : (
          slice.map((f, i) => {
            const primary =
              (camposActivos.includes("empleado") && f.empleado) ||
              (camposActivos.includes("documento") && f.documento) ||
              f.cargo ||
              "Registro";
            const secondary = [f.cargo, f.cuadrilla].filter(Boolean).join(" · ");
            const expanded = openCard === i;
            return (
              <div className="export-card" key={`${f.documento}-${i}`}>
                <div className="export-card__main">
                  <div>
                    <p className="export-card__title">{primary}</p>
                    {secondary && <p className="export-card__sub">{secondary}</p>}
                  </div>
                  <button
                    type="button"
                    className="export-card__toggle"
                    onClick={() => setOpenCard(expanded ? null : i)}
                  >
                    {expanded ? "Ocultar" : "Ver más"}
                  </button>
                </div>
                {expanded && (
                  <div className="export-card__details">
                    {camposActivos.map((k) => (
                      <div key={k}>
                        <strong>{labelOf(k)}</strong>
                        {String((f as Record<string, unknown>)[k] ?? "") || "—"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {items.length > ROWS_PER_GROUP && (
        <div className="export-group__foot">
          <button type="button" disabled={pageSafe <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Anterior
          </button>
          <span>
            {pageSafe} / {totalPages}
          </span>
          <button
            type="button"
            disabled={pageSafe >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExportarPersonal() {
  const [asignaciones, setAsignaciones] = useState<AsignacionOut[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroProyectos, setFiltroProyectos] = useState<string[]>([]);
  const [filtroCuadrillas, setFiltroCuadrillas] = useState<string[]>([]);
  const [agruparPor, setAgruparPor] = useState<"proyecto" | "cuadrilla">("proyecto");
  const [campos, setCampos] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CAMPOS.map((c) => [c.key, true]))
  );

  const [groupPage, setGroupPage] = useState(1);
  const [importResultados, setImportResultados] = useState<FilaValidada[]>([]);
  const [importMsg, setImportMsg] = useState("");
  const [importing, setImporting] = useState(false);
  const [importFileName, setImportFileName] = useState("");

  useEffect(() => {
    Promise.all([
      listarAsignaciones().catch(() => []),
      listarEmpleados().catch(() => []),
      listarProyectos().catch(() => []),
      listarUsuarios({ limit: 300 }).catch(() => []),
    ])
      .then(([asigs, emps, proys, users]) => {
        setAsignaciones(Array.isArray(asigs) ? asigs : []);
        setEmpleados(Array.isArray(emps) ? emps : []);
        setProyectos(Array.isArray(proys) ? proys : []);
        const map: Record<number, UsuarioPublic> = {};
        for (const u of users || []) map[u.id_usuario] = u;
        setUsuariosMap(map);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const empleadosMap = useMemo(() => {
    const m: Record<number, Empleado> = {};
    empleados.forEach((e) => (m[e.id_empleado] = e));
    return m;
  }, [empleados]);

  const proyectosMap = useMemo(() => {
    const m: Record<number, Proyecto> = {};
    proyectos.forEach((p) => (m[p.id_proyecto] = p));
    return m;
  }, [proyectos]);

  const cuadrillasOpts = useMemo(() => {
    const s = new Set<string>();
    asignaciones.forEach((a) => {
      if (a.cuadrilla) s.add(a.cuadrilla);
    });
    return Array.from(s).sort();
  }, [asignaciones]);

  const filas: Fila[] = useMemo(() => {
    const proySet = new Set(filtroProyectos.filter(Boolean));
    const cuaSet = new Set(filtroCuadrillas.filter(Boolean));
    return asignaciones
      .filter((a) => a.activo !== false)
      .filter((a) => proySet.size === 0 || proySet.has(String(a.id_proyecto)))
      .filter((a) => cuaSet.size === 0 || cuaSet.has(a.cuadrilla || ""))
      .map((a) => {
        const emp = empleadosMap[a.id_empleado];
        const u = emp ? usuariosMap[emp.id_usuario] : undefined;
        return {
          empleado: u ? nombreUsuario(u) : emp?.cargo || `#${a.id_empleado}`,
          documento: emp
            ? `${emp.tipo_documento || ""} ${emp.numero_documento || ""}`.trim()
            : "",
          cargo: emp?.cargo || "",
          cuadrilla: a.cuadrilla || "—",
          proyecto: proyectosMap[a.id_proyecto]?.nombre || `#${a.id_proyecto}`,
          idProyecto: a.id_proyecto,
          fecha: a.fecha_asignacion || "",
          telefono: emp?.telefono || "",
        };
      })
      .sort((a, b) =>
        agruparPor === "proyecto"
          ? a.proyecto.localeCompare(b.proyecto) || a.cuadrilla.localeCompare(b.cuadrilla)
          : a.cuadrilla.localeCompare(b.cuadrilla) || a.proyecto.localeCompare(b.proyecto)
      );
  }, [
    asignaciones,
    filtroProyectos,
    filtroCuadrillas,
    empleadosMap,
    usuariosMap,
    proyectosMap,
    agruparPor,
  ]);

  const gruposAll = useMemo(() => {
    const key = agruparPor === "proyecto" ? "proyecto" : "cuadrilla";
    const map = new Map<string, Fila[]>();
    for (const f of filas) {
      const k = f[key] || "—";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(f);
    }
    return Array.from(map.entries()).map(([titulo, items]) => ({ titulo, items }));
  }, [filas, agruparPor]);

  const showGlobalPag = gruposAll.length > GROUPS_PER_PAGE;
  const totalGroupPages = Math.max(1, Math.ceil(gruposAll.length / GROUPS_PER_PAGE));
  const groupPageSafe = Math.min(groupPage, totalGroupPages);
  const gruposVisibles = showGlobalPag
    ? gruposAll.slice(
        (groupPageSafe - 1) * GROUPS_PER_PAGE,
        groupPageSafe * GROUPS_PER_PAGE
      )
    : gruposAll;

  useEffect(() => {
    setGroupPage(1);
  }, [filtroProyectos, filtroCuadrillas, agruparPor]);

  const camposActivos = CAMPOS.filter((c) => campos[c.key]).map((c) => c.key);

  const catalogos: CatalogosImport = useMemo(() => {
    const empleadosPorDoc = new Map<
      string,
      { id_empleado: number; cargo: string; estado: string }
    >();
    for (const e of empleados) {
      const doc = String(e.numero_documento || "")
        .replace(/\s+/g, "")
        .replace(/\./g, "");
      if (doc) {
        empleadosPorDoc.set(doc, {
          id_empleado: e.id_empleado,
          cargo: e.cargo || "",
          estado: e.estado_laboral || "ACTIVO",
        });
      }
    }
    const proyectosPorNombre = new Map<
      string,
      { id_proyecto: number; fecha_inicio: string; fecha_fin: string }
    >();
    for (const p of proyectos) {
      proyectosPorNombre.set(p.nombre.trim().toLowerCase(), {
        id_proyecto: p.id_proyecto,
        fecha_inicio: String(p.fecha_inicio || "").slice(0, 10),
        fecha_fin: String(p.fecha_fin || "").slice(0, 10),
      });
    }
    const asignacionesActivas = new Set<string>();
    for (const a of asignaciones) {
      if (a.activo !== false) asignacionesActivas.add(`${a.id_empleado}:${a.id_proyecto}`);
    }
    return { empleadosPorDoc, proyectosPorNombre, asignacionesActivas };
  }, [empleados, proyectos, asignaciones]);

  const exportar = () => {
    if (camposActivos.length === 0) {
      alert("Elige al menos un campo.");
      return;
    }
    const columns = camposActivos.map((k) => ({
      key: k,
      label: CAMPOS.find((c) => c.key === k)?.label || k,
      width: k === "proyecto" || k === "empleado" ? 28 : k === "documento" ? 18 : 14,
    }));
    const data = filas.map((f) => {
      const row: Record<string, string> = {};
      for (const k of camposActivos) row[k] = String((f as Record<string, unknown>)[k] ?? "");
      return row;
    });
    descargarExcel("personal_export", columns, data, "Personal");
  };

  const onFileImport = async (file: File | null) => {
    setImportMsg("");
    setImportResultados([]);
    if (!file) return;
    setImportFileName(file.name);
    if (!/\.csv$/i.test(file.name) && !/\.txt$/i.test(file.name)) {
      setImportMsg("Usa CSV UTF-8 (Excel → Guardar como → CSV).");
      return;
    }
    try {
      const text = await file.text();
      const { rows } = parseCsv(text);
      if (!rows.length) {
        setImportMsg("Sin filas de datos.");
        return;
      }
      const validados = validarFilasImport(rows, catalogos);
      setImportResultados(validados);
      const ok = validados.filter((v) => v.ok).length;
      setImportMsg(`${validados.length} filas → ${ok} válidas, ${validados.length - ok} con error.`);
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "No se pudo leer el archivo");
    }
  };

  const importarValidos = async () => {
    const okRows = importResultados.filter((r) => r.ok && r.payload);
    if (!okRows.length) return;
    if (!window.confirm(`¿Importar ${okRows.length} asignación(es) a la BD?`)) return;
    setImporting(true);
    let ok = 0;
    let fail = 0;
    const next = [...importResultados];
    for (const row of okRows) {
      const p = row.payload!;
      try {
        await crearAsignacion(p.id_proyecto, {
          id_empleado: p.id_empleado,
          cuadrilla: p.cuadrilla,
          rol_en_proyecto: p.rol_en_proyecto,
          fecha_asignacion: p.fecha_asignacion,
        });
        ok++;
        const idx = next.findIndex((x) => x.fila === row.fila);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            ok: false,
            errores: ["Importada correctamente"],
            payload: undefined,
          };
        }
      } catch (e) {
        fail++;
        const idx = next.findIndex((x) => x.fila === row.fila);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            ok: false,
            errores: [e instanceof Error ? e.message : "Error"],
            payload: undefined,
          };
        }
      }
    }
    setImportResultados(next);
    setImportMsg(`Listo: ${ok} importadas, ${fail} fallidas.`);
    setImporting(false);
    try {
      const asigs = await listarAsignaciones();
      setAsignaciones(Array.isArray(asigs) ? asigs : []);
    } catch {
      /* ignore */
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Reportes", to: "/reportes" },
          { label: "Exportar personal / cuadrillas" },
        ]}
      />
      <div className="page-card export-page">
        <h1 className="page-title">Exportar personal por proyecto / cuadrilla</h1>
        <p className="page-subtitle">
          Filtra con listas de casillas, revisa por grupos y descarga solo los campos marcados.
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {loading && <p style={{ color: "#64748b" }}>Cargando…</p>}

        <div className="export-toolbar">
          <CheckboxDropdown
            label="Proyectos"
            allLabel="Todos los proyectos"
            selected={filtroProyectos}
            onChange={setFiltroProyectos}
            options={proyectos.map((p) => ({
              value: String(p.id_proyecto),
              label: p.nombre,
            }))}
          />
          <CheckboxDropdown
            label="Cuadrillas"
            allLabel="Todas las cuadrillas"
            selected={filtroCuadrillas}
            onChange={setFiltroCuadrillas}
            options={cuadrillasOpts.map((c) => ({ value: c, label: c }))}
          />
          <div className="export-toolbar__field">
            <label>Agrupar por</label>
            <select
              value={agruparPor}
              onChange={(e) => setAgruparPor(e.target.value as "proyecto" | "cuadrilla")}
            >
              <option value="proyecto">Proyecto</option>
              <option value="cuadrilla">Cuadrilla</option>
            </select>
          </div>
          <div className="export-toolbar__field">
            <label>&nbsp;</label>
            <button
              type="button"
              className="agregar-btn-secundario"
              style={{ height: 40 }}
              onClick={() => {
                setFiltroProyectos([]);
                setFiltroCuadrillas([]);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="export-layout">
          <aside className="export-side">
            <h3>Campos a exportar</h3>
            <p className="hint">Marca solo lo necesario</p>
            <div className="export-checks">
              {CAMPOS.map((c) => (
                <label key={c.key} className="export-check">
                  <input
                    type="checkbox"
                    checked={!!campos[c.key]}
                    onChange={() =>
                      setCampos((prev) => ({ ...prev, [c.key]: !prev[c.key] }))
                    }
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
            <button type="button" className="agregar-btn-primario btn-block" onClick={exportar}>
              Descargar Excel
            </button>
            <p className="meta">{filas.length} fila(s) filtradas</p>

            <hr />
            <h3>Importar CSV</h3>
            <p className="hint">
              Obligatorios: Documento, Proyecto, Cuadrilla, Fecha. Excel → CSV UTF-8.
            </p>
            <div className="export-import">
              <input
                type="file"
                accept=".csv,text/csv,.txt"
                onChange={(e) => void onFileImport(e.target.files?.[0] || null)}
              />
            </div>
            {importFileName && <p className="meta">{importFileName}</p>}
            {importMsg && <p className="import-msg">{importMsg}</p>}
            {importResultados.length > 0 && (
              <>
                <button
                  type="button"
                  className="agregar-btn-primario btn-block"
                  style={{ marginTop: 10 }}
                  disabled={importing || !importResultados.some((r) => r.ok)}
                  onClick={() => void importarValidos()}
                >
                  {importing ? "Importando…" : "Importar válidas a la BD"}
                </button>
                <div className="import-log">
                  {importResultados.map((r) => {
                    const cls =
                      r.errores[0] === "Importada correctamente"
                        ? "done"
                        : r.ok
                          ? "ok"
                          : "bad";
                    return (
                      <div key={r.fila} className={`import-log__item ${cls}`}>
                        <strong>Fila {r.fila}</strong>
                        {r.ok ? " · OK" : ` · ${r.errores.join("; ")}`}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </aside>

          <section>
            {gruposVisibles.length === 0 ? (
              <div className="export-empty">No hay asignaciones con esos filtros.</div>
            ) : (
              <div className="export-groups">
                {gruposVisibles.map((g) => (
                  <GroupTable
                    key={g.titulo}
                    titulo={`${agruparPor === "proyecto" ? "Proyecto" : "Cuadrilla"}: ${g.titulo}`}
                    items={g.items}
                    camposActivos={camposActivos}
                  />
                ))}
              </div>
            )}

            {showGlobalPag && (
              <div className="export-global-pag">
                <button
                  type="button"
                  disabled={groupPageSafe <= 1}
                  onClick={() => setGroupPage((p) => p - 1)}
                >
                  ← Grupos anteriores
                </button>
                <span>
                  Grupos {groupPageSafe} / {totalGroupPages} · {gruposAll.length} en total
                </span>
                <button
                  type="button"
                  disabled={groupPageSafe >= totalGroupPages}
                  onClick={() => setGroupPage((p) => p + 1)}
                >
                  Grupos siguientes →
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
