import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/ListaEmpleados.css";

interface Empleado {
  id: number;
  nombre: string;
  tipoDoc: string;
  numDoc: string;
  cargo: string;
  telefono: string;
  estrato: number;
  color: string;
}

const EMPLEADOS_MOCK: Empleado[] = [
  { id: 1,  nombre: "Juanito Tela Rozo",   tipoDoc: "CC", numDoc: "1024511530", cargo: "Distribuidor",  telefono: "3013821025", estrato: 2, color: "#F97316" },
  { id: 2,  nombre: "Rosa Melano",          tipoDoc: "CC", numDoc: "1022251350", cargo: "Arquitecto",    telefono: "3203567180", estrato: 3, color: "#8B5CF6" },
  { id: 3,  nombre: "Devora Melo",          tipoDoc: "CC", numDoc: "1023374580", cargo: "Supervisor",    telefono: "3217939324", estrato: 3, color: "#6366F1" },
  { id: 4,  nombre: "Angelica Galindo",     tipoDoc: "CC", numDoc: "1025701606", cargo: "Ayudante",      telefono: "3212513535", estrato: 1, color: "#EC4899" },
  { id: 5,  nombre: "Benito Camela",        tipoDoc: "CC", numDoc: "1024671808", cargo: "Marketing",     telefono: "3015879030", estrato: 4, color: "#10B981" },
  { id: 6,  nombre: "Carlos Suárez",        tipoDoc: "CC", numDoc: "1031445512", cargo: "Ingeniero",     telefono: "3006512340", estrato: 4, color: "#1E3A8A" },
  { id: 7,  nombre: "Luisa Fernanda Díaz",  tipoDoc: "TI", numDoc: "1020034512", cargo: "Auxiliar",      telefono: "3145678912", estrato: 2, color: "#EF4444" },
  { id: 8,  nombre: "Hernán Ospina",        tipoDoc: "CC", numDoc: "1019872345", cargo: "Electricista",  telefono: "3224456789", estrato: 2, color: "#F59E0B" },
  { id: 9,  nombre: "Patricia Gómez",       tipoDoc: "CC", numDoc: "1022345671", cargo: "Supervisora",   telefono: "3187654321", estrato: 5, color: "#14B8A6" },
  { id: 10, nombre: "Miguel Ángel Torres",  tipoDoc: "CC", numDoc: "1033123456", cargo: "Obrero",        telefono: "3209871234", estrato: 1, color: "#64748B" },
];

const CARGOS_UNICOS = [...new Set(EMPLEADOS_MOCK.map((e) => e.cargo))];
const ESTRATOS_UNICOS = [...new Set(EMPLEADOS_MOCK.map((e) => e.estrato))].sort();
const POR_PAGINA = 5;

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(" ");
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
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
  const [filtroEstrato, setFiltroEstrato] = useState("");
  const [pagina, setPagina]               = useState(1);

  const filtrados = EMPLEADOS_MOCK.filter((e) => {
    const matchBusqueda = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.numDoc.includes(busqueda);
    const matchCargo    = filtroCargo   ? e.cargo === filtroCargo             : true;
    const matchEstrato  = filtroEstrato ? e.estrato === Number(filtroEstrato) : true;
    return matchBusqueda && matchCargo && matchEstrato;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const filas = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  return (
    <div className="lista-page">
      <Navbar />

      <div className="lista-body">
        <Sidebar />

        <main className="lista-main">

          {/* Breadcrumb */}
          <nav style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="bi bi-house-fill" style={{ color: "#1E3A8A" }}></i>
            <span>›</span>
            <span>Empleados</span>
            <span>›</span>
            <span style={{ color: "#1E3A8A", fontWeight: 600 }}>Lista de empleados</span>
          </nav>

          <div className="lista-card">

            {/* Encabezado */}
            <div className="lista-header">
              <div className="lista-header-left">
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#FFF3E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="bi bi-people-fill" style={{ color: "#F97316", fontSize: "22px" }}></i>
                </div>
                <div>
                  <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: 0 }}>LISTA DE EMPLEADOS</h1>
                  <p style={{ fontSize: "13px", color: "#64748B", margin: "2px 0 0" }}>
                    Consulta y gestiona la información de los empleados de la empresa.
                  </p>
                </div>
              </div>
              <button className="lista-export-btn">
                <i className="bi bi-download"></i> Exportar Excel <i className="bi bi-chevron-down"></i>
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
                <label style={labelStyle}>Estrato:</label>
                <select value={filtroEstrato} onChange={(e) => { setFiltroEstrato(e.target.value); setPagina(1); }} style={selectStyle}>
                  <option value="">Filtrar estrato</option>
                  {ESTRATOS_UNICOS.map((e) => <option key={e} value={e}>Estrato {e}</option>)}
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
                      key={emp.id}
                      style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: idx % 2 === 0 ? "#fff" : "#FAFBFC", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F7FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#fff" : "#FAFBFC")}
                    >
                      <td style={celdaStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: emp.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>
                            {iniciales(emp.nombre)}
                          </div>
                          <span style={{ fontSize: "13.5px", fontWeight: 500, color: "#0F172A" }}>{emp.nombre}</span>
                        </div>
                      </td>
                      <td style={celdaStyle} className="col-tipo-doc">{emp.tipoDoc}</td>
                      <td style={celdaStyle} className="col-num-doc">{emp.numDoc}</td>
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
                            title="Eliminar"
                            style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1.5px solid #FEE2E2", backgroundColor: "#FFF5F5", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                          <button
                            onClick={() => navigate(`/empleados/agregar?id=${emp.id}`)}
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
              <span style={{ fontSize: "13px", color: "#64748B" }}>
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
        </main>
      </div>
    </div>
  );
}