type Props = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function PerfilSearch({ value, loading, onChange, onSearch }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
      <input
        className="agregar-input"
        style={{ flex: 1, minWidth: 220 }}
        placeholder="Nombre o documento"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button className="agregar-btn-primario" type="button" onClick={onSearch} disabled={loading}>
        {loading ? "Buscando…" : "Buscar ficha"}
      </button>
    </div>
  );
}
