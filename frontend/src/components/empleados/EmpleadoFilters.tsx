import type { CSSProperties } from "react";

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "6px",
};



export interface EmpleadoFiltersProps {
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroCargo: string;
  setFiltroCargo: (v: string) => void;
  filtroEstado: string;
  setFiltroEstado: (v: string) => void;
  cargos: string[];
  onRegistrar: () => void;
}

export default function EmpleadoFilters({
  busqueda,
  setBusqueda,
  filtroCargo,
  setFiltroCargo,
  filtroEstado,
  setFiltroEstado,
  cargos,
  onRegistrar,
}: EmpleadoFiltersProps) {
  return (
    <div className="lista-filtros">
      <div>
        <label style={labelStyle}>Empleados:</label>
        <div className="lista-search">
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="lista-search__input"
          />
          <i className="bi bi-search lista-search__icon" aria-hidden />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Cargo:</label>
        <select
          value={filtroCargo}
          onChange={(e) => setFiltroCargo(e.target.value)}
          className="lista-filter-select"
        >
          <option value="">Filtrar cargos</option>
          {cargos.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="lista-filter-select"
        >
          <option value="">Filtrar estado</option>
          {["ACTIVO", "INCAPACITADO", "RETIRADO"].map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Registro:</label>
        <button type="button" onClick={onRegistrar} className="lista-register-btn">
          <i className="bi bi-person-plus-fill" /> Registrar empleado
        </button>
      </div>
    </div>
  );
}
