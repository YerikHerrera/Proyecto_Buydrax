/** Selector de hora práctico: hora + minutos en selects (sin reloj nativo). */

const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTOS = ["00", "15", "30", "45"];

function parseTime(value: string): { h: string; m: string } {
  if (!value || !value.includes(":")) return { h: "07", m: "00" };
  const [h, m] = value.split(":");
  const minute = MINUTOS.includes(m?.slice(0, 2) || "")
    ? m.slice(0, 2)
    : String(Math.round(Number(m || 0) / 15) * 15 % 60).padStart(2, "0");
  return {
    h: String(h || "07").padStart(2, "0"),
    m: minute === "60" ? "00" : minute,
  };
}

export default function TimeSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const { h, m } = parseTime(value);

  const setH = (nh: string) => onChange(`${nh}:${m}`);
  const setM = (nm: string) => onChange(`${h}:${nm}`);

  return (
    <div>
      <label className="agregar-label">{label}</label>
      <div className="time-select-row">
        <select
          className="agregar-input time-select-part"
          value={h}
          onChange={(e) => setH(e.target.value)}
          disabled={disabled}
          aria-label={`${label} — hora`}
        >
          {HORAS.map((x) => (
            <option key={x} value={x}>
              {x} h
            </option>
          ))}
        </select>
        <span className="time-select-sep">:</span>
        <select
          className="agregar-input time-select-part"
          value={m}
          onChange={(e) => setM(e.target.value)}
          disabled={disabled}
          aria-label={`${label} — minutos`}
        >
          {MINUTOS.map((x) => (
            <option key={x} value={x}>
              {x} min
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
