import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, retirarEmpleado, exportarEmpleadosExcel, type Empleado } from "../services/empleadosService";
import { mapaUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import "../styles/ListaEmpleados.css";

const POR_PAGINA = 5;

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(" ");
  if (partes.length === 1) return (partes[0][0] || "?").toUpperCase();
  return ((partes[0][0] || "") + (partes[1][0] || "")).toUpperCase();
}

// ── Estilos inline que no necesitan responsive ──
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "6px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 36px 9px 12px", borderRadius: "8px",
  border: "1.5px solid #E2E8F0", fontSize: "13px", color: "#0F172A",
  outline: "none", boxSizing: "border-box", backgroundColor: "#fff",
};
const selectStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "8px",
  border: "1.5px solid #E2E8F0", fontSize: "13px", color: "#0F172A",
  backgroundColor: "#fff", appearance: "none", boxSizing: "border-box",
};
const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left", fontSize: "12.5px",
  fontWeight: 600, color: "#64748B", whiteSpace: "nowrap",
};
const celdaStyle: React.CSSProperties = {
  padding: "14px 16px", fontSize: "13.5px", color: "#475569",
};
const btnPagStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px",
  borderRadius: "8px", border: "1.5px solid #E2E8F0", backgroundColor: "#fff",
  color: "#1E3A8A", fontSize: "13px", fontWeight: 600,
};

export default function ListaEmpleados() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda]           = useState("");
  const [filtroCargo, setFiltroCargo]     = useState("");
  const [filtroEstado, setFiltroEstado]   = useState("");
  const [pagina, setPagina]               = useState(1);
  const [empleados, setEmpleados]         = useState<Empleado[]>([]);
  const [usuariosMap, setUsuariosMap]     = useState<Record<number, UsuarioPublic>>({});
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [data, map] = await Promise.all([
          listarEmpleados(),
          mapaUsuarios().catch(() => ({} as Record<number, UsuarioPublic>)),
        ]);
        if (alive) {
          setEmpleados(Array.isArray(data) ? data : []);
          setUsuariosMap(map);
        }
      } catch (err: unknown) {
        if (alive) setError(err instanceof Error ? err.message : "Error al cargar empleados");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const CARGOS_UNICOS = useMemo(
    () => [...new Set(empleados.map((e) => e.cargo))].sort(),
    [empleados]
  );

  const nombreDe = (e: Empleado) => {
    const u = usuariosMap[Number(e.id_usuario)];
    if (u) return nombreUsuario(u);
    // Fallback legible (nunca "Empleado #N")
    return e.cargo ? `${e.cargo} · ${e.numero_documento}` : e.numero_documento;
  };

  const filtrados = empleados.filter((e) => {
    const texto = `${nombreDe(e)} ${e.numero_documento} ${e.cargo} ${e.ciudad}`.toLowerCase();
    const matchBusqueda = texto.includes(busqueda.toLowerCase()) || e.numero_documento.includes(busqueda);
    const matchCargo    = filtroCargo  ? e.cargo === filtroCargo : true;
    const matchEstado   = filtroEstado ? e.estado_laboral === filtroEstado : true;
    return matchBusqueda && matchCargo && matchEstado;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const filas = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Empleados", to: "/empleados" }, { label: "Lista" }]} />
          <div className="lista-card">
            {loading && <p style={{ padding: 16, color: "#64748B" }}>Cargando empleados...</p>}
            {error && <p style={{ padding: 16, color: "#b00020" }}>{error}</p>}


            {/* Encabezado */}
            <div className="lista-header">
              <div className="lista-header-left">
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#FFF3E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="bi bi-people-fill" style={{ color: "#F97316", fontSize: "22px" }}></i>
                </div>
                <div style={{ minWidth: 0 }}>
                  <h1 className="lista-titulo">LISTA DE EMPLEADOS</h1>
                  <p style={{ fontSize: "13px", color: "#64748B", margin: "2px 0 0" }}>
                    Consulta y gestiona la información de los empleados de la empresa.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="lista-export-btn"
                onClick={() => {
                  const nombres: Record<number, string> = {};
                  for (const [id, u] of Object.entries(usuariosMap)) {
                    nombres[Number(id)] = nombreUsuario(u);
                  }
                  void exportarEmpleadosExcel(filtrados.length ? filtrados : empleados, nombres);
                }}
              >
                <i className="bi bi-download"></i> Exportar Excel
              </button>
            </div>

            {/* Filtros */}
            <div className="lista-filtros">
              <div>
                <label style={labelStyle}>Empleados:</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Buscar empleados..."
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                    style={inputStyle}
                  />
                  <i className="bi bi-search" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}></i>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cargo:</label>
                <select value={filtroCargo} onChange={(e) => { setFiltroCargo(e.target.value); setPagina(1); }} style={selectStyle}>
                  <option value="">Filtrar cargos</option>
                  {CARGOS_UNICOS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Estado:</label>
                <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }} style={selectStyle}>
                  <option value="">Filtrar estado</option>
                  {["ACTIVO","INCAPACITADO","RETIRADO"].map((e) => <option key={e} value={e}>Estado {e}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Registro:</label>
                <button
                  onClick={() => navigate("/empleados/agregar")}
                  style={{ ...selectStyle, backgroundColor: "#F97316", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <i className="bi bi-person-plus-fill"></i> Registrar empleado
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div className="tabla-wrapper">
              <table>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                    <th style={thStyle}>Nombre empleado</th>
                    <th style={thStyle} className="col-tipo-doc">Tipo de documento</th>
                    <th style={thStyle} className="col-num-doc">Número de documento</th>
                    <th style={thStyle}>Cargo</th>
                    <th style={thStyle} className="col-telefono">Teléfono</th>
                    <th style={thStyle}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
                        <i className="bi bi-search" style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}></i>
                        No se encontraron empleados con esos filtros.
                      </td>
                    </tr>
                  ) : filas.map((emp, idx) => (
                    <tr
                      key={emp.id_empleado}
                      style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: idx % 2 === 0 ? "#fff" : "#FAFBFC", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F7FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#fff" : "#FAFBFC")}
                    >
                      <td style={celdaStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>
                            {iniciales(nombreDe(emp))}
                          </div>
                          <span style={{ fontSize: "13.5px", fontWeight: 500, color: "#0F172A", minWidth: 0, wordBreak: "break-word" }}>
                            {nombreDe(emp)}
                          </span>
                        </div>
                      </td>
                      <td style={celdaStyle} className="col-tipo-doc">{emp.tipo_documento}</td>
                      <td style={celdaStyle} className="col-num-doc">{emp.numero_documento}</td>
                      <td style={celdaStyle}>
                        <span style={{ backgroundColor: "#F0F7FF", color: "#1E3A8A", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                          {emp.cargo}
                        </span>
                      </td>
                      <td style={celdaStyle} className="col-telefono">
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}>
                          <i className="bi bi-telephone-fill" style={{ color: "#94A3B8", fontSize: "12px" }}></i>
                          {emp.telefono}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            title="Retirar empleado"
                            disabled={emp.estado_laboral === "RETIRADO"}
                            onClick={async () => {
                              if (!window.confirm(`¿Retirar empleado #${emp.id_empleado}? Se marcará como RETIRADO en la API.`)) return;
                              try {
                                await retirarEmpleado(emp.id_empleado);
                                setEmpleados((prev) =>
                                  prev.map((x) =>
                                    x.id_empleado === emp.id_empleado
                                      ? { ...x, estado_laboral: "RETIRADO" }
                                      : x
                                  )
                                );
                              } catch (err: unknown) {
                                alert(err instanceof Error ? err.message : "No se pudo retirar");
                              }
                            }}
                            style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1.5px solid #FEE2E2", backgroundColor: "#FFF5F5", color: "#EF4444", cursor: emp.estado_laboral === "RETIRADO" ? "not-allowed" : "pointer", opacity: emp.estado_laboral === "RETIRADO" ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                          <button
                            onClick={() => navigate(`/empleados/editar/${emp.id_empleado}`)}
                            title="Editar"
                            style={{ width: "34px", height: "34px", borderRadius: "8px", border: "none", backgroundColor: "#F97316", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="lista-paginacion">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                style={{ ...btnPagStyle, opacity: paginaActual === 1 ? 0.4 : 1, cursor: paginaActual === 1 ? "not-allowed" : "pointer" }}
              >
                <i className="bi bi-arrow-left"></i> Anterior
              </button>
              <span style={{ fontSize: "13px", color: "#64748B", textAlign: "center" }}>
                Página <strong style={{ color: "#0F172A" }}>{paginaActual}</strong> de <strong style={{ color: "#0F172A" }}>{totalPaginas}</strong> · {filtrados.length} empleado{filtrados.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                style={{ ...btnPagStyle, backgroundColor: "#1E3A8A", color: "#fff", border: "none", opacity: paginaActual === totalPaginas ? 0.4 : 1, cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer" }}
              >
                Siguiente <i className="bi bi-arrow-right"></i>
              </button>
            </div>

          </div>
    </AppShell>
  );
}