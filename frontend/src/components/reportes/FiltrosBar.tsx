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

const CTRL_H = 40;

export default function FiltrosBar({
  filtros,
  busqueda,
  onBusqueda,
  placeholderBusqueda = "Buscar…",
  onLimpiar,
}: Props) {
  return (
    <div className="filtros-bar">
      {onBusqueda !== undefined && (
        <div className="filtros-bar__col filtros-bar__col--search">
          <label className="filtros-bar__label">Búsqueda</label>
          <input
            type="text"
            inputMode="search"
            value={busqueda || ""}
            onChange={(e) => onBusqueda(e.target.value)}
            placeholder={placeholderBusqueda}
            className="filtros-bar__ctrl filtros-bar__input"
            autoComplete="off"
            style={{ height: CTRL_H }}
          />
        </div>
      )}
      {filtros.map((f) => (
        <div key={f.key} className="filtros-bar__col">
          <label className="filtros-bar__label">{f.label}</label>
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="filtros-bar__ctrl filtros-bar__select"
            style={{ height: CTRL_H }}
          >
            {f.options.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {onLimpiar && (
        <div className="filtros-bar__col filtros-bar__col--btn">
          <span className="filtros-bar__label filtros-bar__label--ghost" aria-hidden>
            &nbsp;
          </span>
          <button
            type="button"
            className="filtros-bar__ctrl filtros-bar__limpiar"
            onClick={onLimpiar}
            style={{ height: CTRL_H }}
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
