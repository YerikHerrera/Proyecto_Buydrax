type Props = {
  pagina: number;
  totalPaginas: number;
  total: number;
  etiqueta?: string;
  onAnterior: () => void;
  onSiguiente: () => void;
};

export default function Pagination({
  pagina,
  totalPaginas,
  total,
  etiqueta = "registros",
  onAnterior,
  onSiguiente,
}: Props) {
  const pages = Math.max(1, totalPaginas);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <button
        type="button"
        onClick={onAnterior}
        disabled={pagina <= 1}
        style={{
          padding: "9px 18px",
          borderRadius: 8,
          border: "1.5px solid #E2E8F0",
          background: pagina <= 1 ? "#f1f5f9" : "#fff",
          color: "#1E3A8A",
          fontWeight: 600,
          fontSize: 13,
          cursor: pagina <= 1 ? "not-allowed" : "pointer",
          opacity: pagina <= 1 ? 0.6 : 1,
        }}
      >
        ← Anterior
      </button>
      <span style={{ fontSize: 13, color: "#64748b" }}>
        Página <strong>{pagina}</strong> de <strong>{pages}</strong> · {total} {etiqueta}
      </span>
      <button
        type="button"
        onClick={onSiguiente}
        disabled={pagina >= pages}
        style={{
          padding: "9px 18px",
          borderRadius: 8,
          border: "none",
          background: pagina >= pages ? "#c7d2fe" : "#4f46e5",
          color: "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: pagina >= pages ? "not-allowed" : "pointer",
          opacity: pagina >= pages ? 0.7 : 1,
        }}
      >
        Siguiente →
      </button>
    </div>
  );
}
