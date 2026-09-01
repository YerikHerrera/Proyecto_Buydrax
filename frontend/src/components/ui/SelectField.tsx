type Option = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
};

export default function SelectField({ label, icon, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div>
      <label className="agregar-label">{label}</label>
      <div className="agregar-field-wrapper">
        <i className={`bi ${icon} agregar-icon-left`}></i>
        <select
          className={`agregar-input ${!value ? "agregar-input--placeholder" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <i className="bi bi-chevron-down agregar-icon-right"></i>
      </div>
    </div>
  );
}