import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Pagination from "../components/ui/Pagination";
import { useClientPagination } from "../hooks/useClientPagination";
import {
  crearCuadrilla,
  desvincularCuadrillaDeProyecto,
  listarCuadrillas,
  listarVinculos,
  vincularCuadrillaAProyecto,
  type CuadrillaOut,
  type CuadrillaProyectoOut,
} from "../services/cuadrillasService";
import { listarProyectos, type Proyecto } from "../services/proyectosService";

export default function GestionCuadrillas() {
  const [cuadrillas, setCuadrillas] = useState<CuadrillaOut[]>([]);
  const [vinculos, setVinculos] = useState<CuadrillaProyectoOut[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  const [selCuadrilla, setSelCuadrilla] = useState<number | "">("");
  const [selProyecto, setSelProyecto] = useState<number | "">("");
  const [filtroCuad, setFiltroCuad] = useState("");
  const [filtroProy, setFiltroProy] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mapaProy = useMemo(() => {
    const m = new Map<number, string>();
    proyectos.forEach((p) => m.set(p.id_proyecto, p.nombre));
    return m;
  }, [proyectos]);

  const cargar = useCallback(async () => {
    setErr(null);
    try {
      const [c, v, p] = await Promise.all([
        listarCuadrillas(false),
        listarVinculos({ solo_activos: true }),
        listarProyectos(),
      ]);
      setCuadrillas(Array.isArray(c) ? c : []);
      setVinculos(Array.isArray(v) ? v : []);
      setProyectos(Array.isArray(p) ? p : []);
    } catch (e: any) {
      setErr(e?.message || "No se pudieron cargar cuadrillas");
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const vinculosFiltrados = useMemo(() => {
    const qc = filtroCuad.trim().toLowerCase();
    const qp = filtroProy.trim().toLowerCase();
    return vinculos.filter((v) => {
      const nomC = (v.nombre_cuadrilla || `#${v.id_cuadrilla}`).toLowerCase();
      const nomP = (v.nombre_proyecto || mapaProy.get(v.id_proyecto) || `#${v.id_proyecto}`).toLowerCase();
      if (qc && !nomC.includes(qc)) return false;
      if (qp && !nomP.includes(qp)) return false;
      return true;
    });
  }, [vinculos, filtroCuad, filtroProy, mapaProy]);

  const {
    pagina,
    totalPaginas,
    total,
    filas,
    onAnterior,
    onSiguiente,
  } = useClientPagination(vinculosFiltrados, 8);

  async function onCrear(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      await crearCuadrilla({ nombre: nombre.trim(), descripcion: desc.trim() || undefined });
      setNombre("");
      setDesc("");
      setMsg("Cuadrilla creada");
      await cargar();
    } catch (e: any) {
      setErr(e?.message || "Error al crear");
    } finally {
      setLoading(false);
    }
  }

  async function onVincular(e: React.FormEvent) {
    e.preventDefault();
    if (selCuadrilla === "" || selProyecto === "") {
      setErr("Selecciona cuadrilla y proyecto");
      return;
    }
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      await vincularCuadrillaAProyecto(Number(selCuadrilla), Number(selProyecto));
      setMsg("Cuadrilla asignada al proyecto");
      await cargar();
    } catch (e: any) {
      setErr(e?.message || "Error al vincular");
    } finally {
      setLoading(false);
    }
  }

  async function onDesvincular(idCuad: number, idProy: number, forzar: boolean) {
    const ok = window.confirm(
      forzar
        ? "Se retirarán todos los empleados activos de esta cuadrilla en este proyecto y se desvinculará. ¿Continuar?"
        : "¿Quitar esta cuadrilla solo de este proyecto?"
    );
    if (!ok) return;
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const r = await desvincularCuadrillaDeProyecto(idCuad, idProy, forzar);
      setMsg(r.mensaje || "Listo");
      await cargar();
    } catch (e: any) {
      setErr(e?.message || "No se pudo desvincular");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="page-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="page-title">Gestión de cuadrillas</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              Catálogo, vínculo a obras y retiro por proyecto.{" "}
              <Link to="/proyectos/asignacion">Asignar empleados →</Link>
            </p>
          </div>
        </div>

        {msg && <p style={{ color: "#15803d", marginTop: 12 }}>{msg}</p>}
        {err && <p style={{ color: "#b91c1c", marginTop: 12 }}>{err}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginTop: 16 }}>
          <form onSubmit={onCrear} style={card}>
            <h3 style={h3}>1. Crear cuadrilla</h3>
            <label style={label}>Nombre *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required style={input} placeholder="Ej. Cuadrilla A" />
            <label style={label}>Descripción</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} style={input} placeholder="Opcional" />
            <button type="submit" disabled={loading} style={btnPrimary}>Crear</button>
          </form>

          <form onSubmit={onVincular} style={card}>
            <h3 style={h3}>2. Asignar cuadrilla a proyecto</h3>
            <p style={{ fontSize: 12, color: "#78716c", margin: "0 0 8px" }}>
              Todas las del catálogo (creadas + históricas de asignaciones).
            </p>
            <label style={label}>Cuadrilla *</label>
            <select value={selCuadrilla} onChange={(e) => setSelCuadrilla(e.target.value ? Number(e.target.value) : "")} required style={input}>
              <option value="">Selecciona…</option>
              {cuadrillas.map((c) => (
                <option key={c.id_cuadrilla} value={c.id_cuadrilla}>{c.nombre}</option>
              ))}
            </select>
            <label style={label}>Proyecto *</label>
            <select value={selProyecto} onChange={(e) => setSelProyecto(e.target.value ? Number(e.target.value) : "")} required style={input}>
              <option value="">Selecciona…</option>
              {proyectos.map((p) => (
                <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre}</option>
              ))}
            </select>
            <button type="submit" disabled={loading} style={btnPrimary}>Asignar a proyecto</button>
          </form>
        </div>

        <section style={{ ...card, marginTop: 14 }}>
          <h3 style={h3}>3. Cuadrillas en proyectos</h3>
          <p style={{ fontSize: 12, color: "#78716c", margin: "0 0 10px" }}>
            <strong>Quitar del proyecto</strong> solo desvincula (falla si hay gente activa).{" "}
            <strong>Retirar todos y desvincular</strong> saca empleados y luego desvincula.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={label}>Filtrar por cuadrilla</label>
              <input
                value={filtroCuad}
                onChange={(e) => setFiltroCuad(e.target.value)}
                placeholder="Nombre de cuadrilla…"
                style={input}
              />
            </div>
            <div>
              <label style={label}>Filtrar por proyecto</label>
              <input
                value={filtroProy}
                onChange={(e) => setFiltroProy(e.target.value)}
                placeholder="Nombre de proyecto…"
                style={input}
              />
            </div>
            {(filtroCuad || filtroProy) && (
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => { setFiltroCuad(""); setFiltroProy(""); }}
                  style={{ ...btnGhost, width: "100%", padding: "10px 12px" }}
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#fff7ed", textAlign: "left" }}>
                  <th style={th}>Cuadrilla</th>
                  <th style={th}>Proyecto</th>
                  <th style={th}>Empleados</th>
                  <th style={th}>Desde</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filas.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 14, color: "#78716c" }}>
                      {vinculos.length === 0
                        ? "No hay vínculos activos. Asigna una cuadrilla a un proyecto arriba."
                        : "Ningún resultado con esos filtros."}
                    </td>
                  </tr>
                )}
                {filas.map((v) => (
                  <tr key={v.id_cuadrilla_proyecto} style={{ borderTop: "1px solid #f5f5f4" }}>
                    <td style={td}>{v.nombre_cuadrilla || `#${v.id_cuadrilla}`}</td>
                    <td style={td}>{v.nombre_proyecto || mapaProy.get(v.id_proyecto) || `#${v.id_proyecto}`}</td>
                    <td style={td}>{v.empleados_activos ?? 0}</td>
                    <td style={td}>{v.fecha_inicio}</td>
                    <td style={{ ...td }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => onDesvincular(v.id_cuadrilla, v.id_proyecto, false)}
                          style={btnGhost}
                          title="Solo desvincula (falla si hay empleados activos)"
                        >
                          Quitar del proyecto
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => onDesvincular(v.id_cuadrilla, v.id_proyecto, true)}
                          style={btnDanger}
                        >
                          Retirar todos y desvincular
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > 0 && (
            <Pagination
              pagina={pagina}
              totalPaginas={totalPaginas}
              total={total}
              etiqueta="vínculos"
              onAnterior={onAnterior}
              onSiguiente={onSiguiente}
            />
          )}
        </section>

        <section style={{ ...card, marginTop: 14 }}>
          <h3 style={h3}>Catálogo ({cuadrillas.length})</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, columns: "2 180px", gap: 4 }}>
            {cuadrillas.map((c) => (
              <li key={c.id_cuadrilla} style={{ marginBottom: 4 }}>
                <strong>{c.nombre}</strong>
                {!c.activo && <span style={{ color: "#a8a29e" }}> (inactiva)</span>}
                {c.descripcion ? ` — ${c.descripcion}` : ""}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

const card: CSSProperties = {
  background: "#fff",
  border: "1px solid #e7e5e4",
  borderRadius: 12,
  padding: 14,
};
const h3: CSSProperties = { margin: "0 0 10px", fontSize: 15 };
const label: CSSProperties = { display: "block", fontSize: 12, color: "#78716c", marginBottom: 4, marginTop: 8 };
const input: CSSProperties = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: 8,
  border: "1px solid #d6d3d1",
  fontSize: 14,
  boxSizing: "border-box",
};
const btnPrimary: CSSProperties = {
  marginTop: 12,
  background: "#ea580c",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};
const btnGhost: CSSProperties = {
  background: "#fafaf9",
  border: "1px solid #a8a29e",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
  color: "#1c1917",
  fontWeight: 600,
  whiteSpace: "nowrap",
};
const btnDanger: CSSProperties = {
  background: "#fff1f2",
  border: "1px solid #e11d48",
  color: "#9f1239",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
};
const th: CSSProperties = { padding: "8px 6px", color: "#9a3412", fontWeight: 600 };
const td: CSSProperties = { padding: "8px 6px", verticalAlign: "middle" };
