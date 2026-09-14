type Filtro = {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};

type Props = {
  filtros: Filtro[];
  busqueda?: string;
  onBusqueda?: (v: string) => void;
  placeholderBusqueda?: string;
  onLimpiar?: () => void;
};

export default function FiltrosBar({
  filtros,
  busqueda,
  onBusqueda,
  placeholderBusqueda = "Buscar…",
  onLimpiar,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 18,
        padding: 14,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        alignItems: "flex-end",
      }}
    >
      {onBusqueda !== undefined && (
        <div style={{ flex: "1 1 180px", minWidth: 160 }}>
          <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>
            Búsqueda
          </label>
          <input
            type="search"
            value={busqueda || ""}
            onChange={(e) => onBusqueda(e.target.value)}
            placeholder={placeholderBusqueda}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
      )}
      {filtros.map((f) => (
        <div key={f.key} style={{ flex: "0 1 160px", minWidth: 140 }}>
          <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>
            {f.label}
          </label>
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 13,
              background: "#fff",
            }}
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {onLimpiar && (
        <button
          type="button"
          onClick={onLimpiar}
          style={{
            padding: "9px 14px",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            color: "#475569",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.borderColor = "#fca5a5";
            e.currentTarget.style.color = "#b91c1c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#475569";
          }}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
