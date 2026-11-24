type Props = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function PerfilSearch({ value, loading, onChange, onSearch }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginTop: 16,
        alignItems: "flex-end",
      }}
    >
      <div style={{ flex: "1 1 220px", minWidth: 180 }}>
        <label
          className="agregar-label"
          style={{ display: "block", marginBottom: 6, fontSize: 12, color: "#64748b" }}
        >
          Nombre o documento
        </label>
        <input
          type="text"
          inputMode="search"
          className="agregar-input"
          style={{ width: "100%", height: 42, backgroundImage: "none", paddingRight: 12 }}
          placeholder="Nombre o documento"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          autoComplete="off"
        />
      </div>
      <button
        className="agregar-btn-primario"
        type="button"
        onClick={onSearch}
        disabled={loading}
        style={{ height: 42, marginBottom: 0, whiteSpace: "nowrap" }}
      >
        {loading ? "Buscando…" : "Buscar ficha"}
      </button>
    </div>
  );
}
