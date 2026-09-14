import type { CSSProperties } from "react";

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "6px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 36px 9px 12px",
  borderRadius: "8px",
  border: "1.5px solid #E2E8F0",
  fontSize: "13px",
  color: "#0F172A",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#fff",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1.5px solid #E2E8F0",
  fontSize: "13px",
  color: "#0F172A",
  backgroundColor: "#fff",
  appearance: "none",
  boxSizing: "border-box",
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
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
            }}
            style={inputStyle}
          />
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Cargo:</label>
        <select
          value={filtroCargo}
          onChange={(e) => setFiltroCargo(e.target.value)}
          style={selectStyle}
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
          style={selectStyle}
        >
          <option value="">Filtrar estado</option>
          {["ACTIVO", "INCAPACITADO", "RETIRADO"].map((e) => (
            <option key={e} value={e}>
              Estado {e}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Registro:</label>
        <button
          onClick={onRegistrar}
          style={{
            ...selectStyle,
            backgroundColor: "#F97316",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <i className="bi bi-person-plus-fill" /> Registrar empleado
        </button>
      </div>
    </div>
  );
}
