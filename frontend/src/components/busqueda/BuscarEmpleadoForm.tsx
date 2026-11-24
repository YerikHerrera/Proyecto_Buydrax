type Props = {
  value: string;
  loading: boolean;
  error: string;
  sinResultado: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function BuscarEmpleadoForm({ value, loading, error, sinResultado, onChange, onSearch }: Props) {
  return (
    <section className="buscar-card">
      <div className="buscar-title">
        <div className="buscar-icono"><i className="bi bi-search"></i></div>
        <div>
          <h1>Buscar empleado</h1>
          <p>Busca por nombre o número de documento (datos reales de la API).</p>
        </div>
      </div>
      <label>
        Nombre o número de documento
        <div className="buscar-input">
          <i className="bi bi-person-search"></i>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Ej. Claudia Cardenas o 1024511530"
          />
        </div>
      </label>
      {error && <div className="buscar-error"><i className="bi bi-exclamation-circle-fill"></i> {error}</div>}
      {sinResultado && <div className="buscar-error"><i className="bi bi-exclamation-circle-fill"></i> No se encontró ningún empleado con ese criterio.</div>}
      <button className="buscar-btn" onClick={onSearch} disabled={loading}>
        <i className="bi bi-search"></i> {loading ? "Buscando..." : "Buscar empleado"}
      </button>
    </section>
  );
}
